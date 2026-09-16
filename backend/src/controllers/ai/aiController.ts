/**
 * AI Controller (SPR-314 / ARCH-006)
 * Handles incoming AI chat requests, conversation management, and telemetry briefing.
 */

import { Response } from 'express';
import type { AuthRequest } from '../../types/foundation';
import { sendSuccess, sendError } from '../../utils/response';
import { aiService } from '../../services/ai/aiService';
import { contextBuilder } from '../../services/ai/contextBuilder';

export class AIController {
  /**
   * POST /api/v1/ai/chat
   */
  async chat(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) return sendError(res, 'Unauthorized', 401);

      const { message, conversationId } = req.body;
      if (!message || typeof message !== 'string' || !message.trim()) {
        return sendError(res, 'User message is required', 400);
      }

      const chatResult = await aiService.chat(userId, message.trim(), conversationId);
      return sendSuccess(res, chatResult, 'AI response generated');
    } catch (err: any) {
      console.error('[AIController.chat] Error:', err);
      return sendError(res, err.message || 'Failed to process AI chat request', 500);
    }
  }

  /**
   * GET /api/v1/ai/conversations
   */
  async getConversations(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) return sendError(res, 'Unauthorized', 401);

      const conversations = await aiService.getConversations(userId);
      return sendSuccess(res, conversations, 'Conversations retrieved');
    } catch (err: any) {
      console.error('[AIController.getConversations] Error:', err);
      return sendError(res, 'Failed to fetch conversations', 500);
    }
  }

  /**
   * POST /api/v1/ai/conversations
   */
  async createConversation(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) return sendError(res, 'Unauthorized', 401);

      const { title } = req.body;
      const conversation = await aiService.createConversation(userId, title || 'New Conversation');
      return sendSuccess(res, conversation, 'New conversation started', 201);
    } catch (err: any) {
      console.error('[AIController.createConversation] Error:', err);
      return sendError(res, 'Failed to create conversation', 500);
    }
  }

  /**
   * GET /api/v1/ai/conversations/:id/messages
   */
  async getMessages(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) return sendError(res, 'Unauthorized', 401);

      const { id } = req.params;
      const messages = await aiService.getMessages(id, userId);
      return sendSuccess(res, messages, 'Messages retrieved');
    } catch (err: any) {
      console.error('[AIController.getMessages] Error:', err);
      return sendError(res, err.message || 'Failed to fetch messages', 404);
    }
  }

  /**
   * DELETE /api/v1/ai/conversations/:id
   */
  async deleteConversation(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) return sendError(res, 'Unauthorized', 401);

      const { id } = req.params;
      const deleted = await aiService.deleteConversation(id, userId);
      if (!deleted) return sendError(res, 'Conversation not found', 404);

      return sendSuccess(res, { success: true }, 'Conversation deleted');
    } catch (err: any) {
      console.error('[AIController.deleteConversation] Error:', err);
      return sendError(res, 'Failed to delete conversation', 500);
    }
  }

  /**
   * GET /api/v1/ai/briefing
   */
  async getBriefing(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) return sendError(res, 'Unauthorized', 401);

      const context = await contextBuilder.buildContext(userId);
      const topPriority =
        context.discipline.pendingTasksSummary[0] ||
        context.goals[0]?.title ||
        'Maintain daily focus consistency';

      return sendSuccess(
        res,
        {
          greeting: `Good day, ${context.user.name} 👋`,
          userName: context.user.name,
          performanceScore: context.performance.score,
          performanceLevel: context.performance.level,
          currentStreak: context.discipline.currentStreak,
          todayFocus: [
            context.discipline.pendingTasksSummary[0] || 'Complete scheduled discipline tasks',
            context.body.workoutsCompletedToday > 0 ? 'Workout completed ✅' : 'Log physical workout',
            `Hydrate (${context.body.waterLiters}L / ${context.body.waterTargetLiters}L)`,
          ],
          topPriority,
        },
        'Daily briefing synthesized'
      );
    } catch (err: any) {
      console.error('[AIController.getBriefing] Error:', err);
      return sendError(res, 'Failed to synthesize daily briefing', 500);
    }
  }

  /**
   * POST /api/v1/ai/reports
   */
  async generateReport(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) return sendError(res, 'Unauthorized', 401);

      const { type } = req.body;
      const context = await contextBuilder.buildContext(userId);
      const periodType = type || 'weekly';

      const report = {
        id: `rep_${Date.now()}`,
        title: `${periodType.toUpperCase()} Performance Intelligence Report`,
        periodStr: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        overallScore: context.performance.score,
        level: context.performance.level,
        summaryMarkdown: `# ${periodType.toUpperCase()} PERFORMANCE REPORT\n\n` +
          `**Overall Index**: ${context.performance.score} / 1000 (${context.performance.level} Level)\n` +
          `**Streak Momentum**: 🔥 ${context.discipline.currentStreak} Days\n\n` +
          `## 📊 Module Telemetry\n` +
          `- **Discipline**: ${context.discipline.tasksCompletedToday}/${context.discipline.tasksTotalToday} tasks completed (${context.discipline.taskCompletionRate}%)\n` +
          `- **Body**: ${context.body.workoutsCompletedToday} workouts logged, ${context.body.waterLiters}L hydration\n` +
          `- **Mind**: ${context.mind.currentMood} mood, ${context.mind.meditationMinutesToday}m meditation\n` +
          `- **Nutrition**: ${context.nutrition.caloriesCurrent}/${context.nutrition.caloriesTarget} kcal\n` +
          `- **Goals**: ${context.goals.length} active strategic goals\n`,
        createdAt: new Date().toISOString(),
      };

      return sendSuccess(res, report, 'AI report generated', 201);
    } catch (err: any) {
      console.error('[AIController.generateReport] Error:', err);
      return sendError(res, 'Failed to generate AI report', 500);
    }
  }
}

export const aiController = new AIController();
