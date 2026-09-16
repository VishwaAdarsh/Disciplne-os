/**
 * AI Service (SPR-314 / ARCH-006)
 * Manages AI Coach conversations, message persistence in SQLite, context synthesis, and response delivery.
 */

import db from '../../db';
import { contextBuilder } from './contextBuilder';
import { aiProvider } from './aiProvider';
import type {
  AIConversationDTO,
  AIMessageDTO,
  AIChatResponseDTO,
} from '../../types/ai';

export class AIService {
  /**
   * List all conversations for the authenticated user
   */
  async getConversations(userId: string): Promise<AIConversationDTO[]> {
    const rows = db
      .prepare(`
        SELECT c.id, c.user_id, c.title, c.created_at, c.updated_at,
               (SELECT text FROM ai_messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_message,
               (SELECT COUNT(*) FROM ai_messages m WHERE m.conversation_id = c.id) as message_count
        FROM ai_conversations c
        WHERE c.user_id = ? AND c.deleted_at IS NULL
        ORDER BY c.updated_at DESC
      `)
      .all(userId) as Array<{
        id: string;
        user_id: string;
        title: string;
        created_at: string;
        updated_at: string;
        last_message: string | null;
        message_count: number;
      }>;

    return rows.map((r) => ({
      id: r.id,
      userId: r.user_id,
      title: r.title,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      lastMessage: r.last_message || undefined,
      messageCount: r.message_count || 0,
    }));
  }

  /**
   * Create a new conversation thread
   */
  async createConversation(userId: string, title = 'New Conversation'): Promise<AIConversationDTO> {
    const id = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO ai_conversations (id, user_id, title, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, userId, title, now, now);

    return {
      id,
      userId,
      title,
      createdAt: now,
      updatedAt: now,
      messageCount: 0,
    };
  }

  /**
   * Get message history for a conversation with user isolation
   */
  async getMessages(conversationId: string, userId: string): Promise<AIMessageDTO[]> {
    // Verify conversation ownership
    const conv = db
      .prepare('SELECT id FROM ai_conversations WHERE id = ? AND user_id = ? AND deleted_at IS NULL')
      .get(conversationId, userId);

    if (!conv) {
      throw new Error('Conversation not found or access denied');
    }

    const rows = db
      .prepare(`
        SELECT id, conversation_id, sender, text, context_summary, created_at
        FROM ai_messages
        WHERE conversation_id = ? AND user_id = ?
        ORDER BY created_at ASC
      `)
      .all(conversationId, userId) as Array<{
        id: string;
        conversation_id: string;
        sender: 'user' | 'coach';
        text: string;
        context_summary: string | null;
        created_at: string;
      }>;

    return rows.map((r) => ({
      id: r.id,
      conversationId: r.conversation_id,
      sender: r.sender,
      text: r.text,
      contextSummary: r.context_summary,
      createdAt: r.created_at,
    }));
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId: string, userId: string): Promise<boolean> {
    const info = db
      .prepare('DELETE FROM ai_conversations WHERE id = ? AND user_id = ?')
      .run(conversationId, userId);
    return info.changes > 0;
  }

  /**
   * Execute chat turn: builds context, calls AI provider, persists messages, and updates thread
   */
  async chat(userId: string, userMessage: string, conversationId?: string): Promise<AIChatResponseDTO> {
    let targetConvId = conversationId;

    // 1. Resolve or create active conversation
    if (targetConvId) {
      const existing = db
        .prepare('SELECT id FROM ai_conversations WHERE id = ? AND user_id = ? AND deleted_at IS NULL')
        .get(targetConvId, userId);
      if (!existing) {
        targetConvId = undefined;
      }
    }

    if (!targetConvId) {
      // Find most recent conversation or create a new one
      const latestConv = db
        .prepare('SELECT id FROM ai_conversations WHERE user_id = ? AND deleted_at IS NULL ORDER BY updated_at DESC LIMIT 1')
        .get(userId) as { id: string } | undefined;

      if (latestConv) {
        targetConvId = latestConv.id;
      } else {
        const newConv = await this.createConversation(userId, 'Performance Discussion');
        targetConvId = newConv.id;
      }
    }

    // 2. Fetch conversation history
    const historyRows = db
      .prepare(`
        SELECT sender, text FROM ai_messages
        WHERE conversation_id = ? AND user_id = ?
        ORDER BY created_at ASC LIMIT 10
      `)
      .all(targetConvId, userId) as Array<{ sender: 'user' | 'coach'; text: string }>;

    // 3. Build live context packet from DisciplineOS engines
    const context = await contextBuilder.buildContext(userId, userMessage);
    const contextPromptText = contextBuilder.formatContextPrompt(context);

    // 4. Generate AI Coach response
    const coachResponseText = await aiProvider.generateResponse(
      contextPromptText,
      context,
      userMessage,
      historyRows
    );

    const now = new Date().toISOString();
    const userMsgId = `msg_${Date.now()}_usr`;
    const coachMsgId = `msg_${Date.now() + 1}_cch`;

    const contextSummaryStr = JSON.stringify({
      score: context.performance.score,
      level: context.performance.level,
      streak: context.discipline.currentStreak,
    });

    // 5. Persist user message and coach message in SQLite
    const insertMsg = db.prepare(`
      INSERT INTO ai_messages (id, conversation_id, user_id, sender, text, context_summary, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    db.transaction(() => {
      insertMsg.run(userMsgId, targetConvId, userId, 'user', userMessage, null, now);
      insertMsg.run(coachMsgId, targetConvId, userId, 'coach', coachResponseText, contextSummaryStr, now);

      // Update conversation title if default and update timestamp
      const titleUpdate =
        userMessage.length > 30 ? `${userMessage.substring(0, 27)}...` : userMessage;

      db.prepare(`
        UPDATE ai_conversations
        SET updated_at = ?,
            title = CASE WHEN title = 'New Conversation' OR title = 'Performance Discussion' THEN ? ELSE title END
        WHERE id = ? AND user_id = ?
      `).run(now, titleUpdate, targetConvId, userId);
    })();

    return {
      response: coachResponseText,
      conversationId: targetConvId,
      messageId: coachMsgId,
      timestamp: now,
      contextSnapshot: {
        score: context.performance.score,
        level: context.performance.level,
        streak: context.discipline.currentStreak,
        tasks: `${context.discipline.tasksCompletedToday}/${context.discipline.tasksTotalToday}`,
        workouts: context.body.workoutsCompletedToday,
        water: `${context.body.waterLiters}L/${context.body.waterTargetLiters}L`,
        calories: `${context.nutrition.caloriesCurrent}/${context.nutrition.caloriesTarget} kcal`,
      },
    };
  }
}

export const aiService = new AIService();
