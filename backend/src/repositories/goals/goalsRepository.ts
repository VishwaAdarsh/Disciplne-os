/**
 * Goals Repository Implementation (SPR-311 / ARCH-002)
 */

import db from '../../db';
import {
  GoalRecord,
  GoalMilestoneRecord,
  GoalDTO,
  GoalMilestoneDTO,
  GoalsSummaryDTO,
} from '../../types/goals';

export class GoalsRepository {
  // --- GOALS CRUD ---

  async findGoalById(id: string, userId?: string): Promise<GoalRecord | null> {
    let query = 'SELECT * FROM goals WHERE id = ? AND deleted_at IS NULL';
    const params: any[] = [id];

    if (userId) {
      query += ' AND user_id = ?';
      params.push(userId);
    }

    const row = db.prepare(query).get(...params) as GoalRecord | undefined;
    return row || null;
  }

  async findGoals(
    userId: string,
    filters?: { status?: string; category?: string; includeDeleted?: boolean }
  ): Promise<GoalRecord[]> {
    let query = 'SELECT * FROM goals WHERE user_id = ?';
    const params: any[] = [userId];

    if (!filters?.includeDeleted) {
      query += ' AND deleted_at IS NULL';
    }

    if (filters?.status) {
      // Support grouping: "Active" can match "Active" or "In Progress"
      if (filters.status === 'Active' || filters.status === 'In Progress') {
        query += " AND (status = 'Active' OR status = 'In Progress')";
      } else {
        query += ' AND status = ?';
        params.push(filters.status);
      }
    }

    if (filters?.category) {
      query += ' AND category = ?';
      params.push(filters.category);
    }

    query += ' ORDER BY created_at DESC';
    return db.prepare(query).all(...params) as GoalRecord[];
  }

  async createGoal(data: Partial<GoalRecord>): Promise<GoalRecord> {
    const stmt = db.prepare(`
      INSERT INTO goals (
        id, user_id, title, description, category, goal_type,
        target_value, current_value, unit, color, priority,
        status, progress_percent, start_date, deadline, notes, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, datetime('now'), datetime('now')
      )
    `);

    stmt.run(
      data.id,
      data.user_id,
      data.title,
      data.description || null,
      data.category || 'Discipline',
      data.goal_type || 'numeric',
      data.target_value ?? null,
      data.current_value ?? 0,
      data.unit || null,
      data.color || '#6366F1',
      data.priority || 'High',
      data.status || 'In Progress',
      data.progress_percent ?? 0,
      data.start_date || new Date().toISOString().split('T')[0],
      data.deadline || null,
      data.notes || null
    );

    return (await this.findGoalById(data.id!, data.user_id))!;
  }

  async updateGoal(id: string, userId: string, data: Partial<GoalRecord>): Promise<GoalRecord | null> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.title !== undefined) { updates.push('title = ?'); values.push(data.title); }
    if (data.description !== undefined) { updates.push('description = ?'); values.push(data.description); }
    if (data.category !== undefined) { updates.push('category = ?'); values.push(data.category); }
    if (data.goal_type !== undefined) { updates.push('goal_type = ?'); values.push(data.goal_type); }
    if (data.target_value !== undefined) { updates.push('target_value = ?'); values.push(data.target_value); }
    if (data.current_value !== undefined) { updates.push('current_value = ?'); values.push(data.current_value); }
    if (data.unit !== undefined) { updates.push('unit = ?'); values.push(data.unit); }
    if (data.color !== undefined) { updates.push('color = ?'); values.push(data.color); }
    if (data.priority !== undefined) { updates.push('priority = ?'); values.push(data.priority); }
    if (data.status !== undefined) { updates.push('status = ?'); values.push(data.status); }
    if (data.progress_percent !== undefined) { updates.push('progress_percent = ?'); values.push(data.progress_percent); }
    if (data.start_date !== undefined) { updates.push('start_date = ?'); values.push(data.start_date); }
    if (data.deadline !== undefined) { updates.push('deadline = ?'); values.push(data.deadline); }
    if (data.notes !== undefined) { updates.push('notes = ?'); values.push(data.notes); }

    if (updates.length === 0) return this.findGoalById(id, userId);

    updates.push("updated_at = datetime('now')");
    values.push(id, userId);

    db.prepare(`UPDATE goals SET ${updates.join(', ')} WHERE id = ? AND user_id = ? AND deleted_at IS NULL`).run(...values);
    return this.findGoalById(id, userId);
  }

  async deleteGoal(id: string, userId: string): Promise<boolean> {
    const result = db.prepare(`
      UPDATE goals SET deleted_at = datetime('now'), updated_at = datetime('now')
      WHERE id = ? AND user_id = ? AND deleted_at IS NULL
    `).run(id, userId);

    if (result.changes > 0) {
      db.prepare(`
        UPDATE goal_milestones SET deleted_at = datetime('now'), updated_at = datetime('now')
        WHERE goal_id = ? AND user_id = ? AND deleted_at IS NULL
      `).run(id, userId);
      return true;
    }
    return false;
  }

  // --- MILESTONES ---

  async findMilestonesByGoalId(goalId: string): Promise<GoalMilestoneRecord[]> {
    return db.prepare(`
      SELECT * FROM goal_milestones
      WHERE goal_id = ? AND deleted_at IS NULL
      ORDER BY order_index ASC, created_at ASC
    `).all(goalId) as GoalMilestoneRecord[];
  }

  async findMilestoneById(id: string, userId?: string): Promise<GoalMilestoneRecord | null> {
    let query = 'SELECT * FROM goal_milestones WHERE id = ? AND deleted_at IS NULL';
    const params: any[] = [id];
    if (userId) {
      query += ' AND user_id = ?';
      params.push(userId);
    }
    const row = db.prepare(query).get(...params) as GoalMilestoneRecord | undefined;
    return row || null;
  }

  async createMilestone(data: Partial<GoalMilestoneRecord>): Promise<GoalMilestoneRecord> {
    const stmt = db.prepare(`
      INSERT INTO goal_milestones (
        id, goal_id, user_id, title, completed, due_date, order_index, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);

    stmt.run(
      data.id,
      data.goal_id,
      data.user_id,
      data.title,
      data.completed ? 1 : 0,
      data.due_date || null,
      data.order_index ?? 0
    );

    return (await this.findMilestoneById(data.id!, data.user_id))!;
  }

  async updateMilestone(id: string, userId: string, data: Partial<GoalMilestoneRecord>): Promise<GoalMilestoneRecord | null> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.title !== undefined) { updates.push('title = ?'); values.push(data.title); }
    if (data.completed !== undefined) { updates.push('completed = ?'); values.push(data.completed ? 1 : 0); }
    if (data.due_date !== undefined) { updates.push('due_date = ?'); values.push(data.due_date); }
    if (data.order_index !== undefined) { updates.push('order_index = ?'); values.push(data.order_index); }

    if (updates.length === 0) return this.findMilestoneById(id, userId);

    updates.push("updated_at = datetime('now')");
    values.push(id, userId);

    db.prepare(`UPDATE goal_milestones SET ${updates.join(', ')} WHERE id = ? AND user_id = ? AND deleted_at IS NULL`).run(...values);
    return this.findMilestoneById(id, userId);
  }

  async deleteMilestone(id: string, userId: string): Promise<boolean> {
    const result = db.prepare(`
      UPDATE goal_milestones SET deleted_at = datetime('now'), updated_at = datetime('now')
      WHERE id = ? AND user_id = ? AND deleted_at IS NULL
    `).run(id, userId);
    return result.changes > 0;
  }

  // --- SUMMARY AGGREGATION ---

  async getGoalsSummary(userId: string): Promise<GoalsSummaryDTO> {
    const goals = await this.findGoals(userId);
    const todayStr = new Date().toISOString().split('T')[0];

    let activeCount = 0;
    let completedCount = 0;
    let pausedCount = 0;
    let overdueCount = 0;
    let progressSum = 0;
    const categoriesBreakdown: Record<string, number> = {};

    for (const g of goals) {
      categoriesBreakdown[g.category] = (categoriesBreakdown[g.category] || 0) + 1;
      progressSum += g.progress_percent || 0;

      const isCompleted = g.status === 'Completed';
      const isPaused = g.status === 'Paused';
      const isActive = g.status === 'Active' || g.status === 'In Progress';

      if (isCompleted) {
        completedCount++;
      } else if (isPaused) {
        pausedCount++;
      } else if (isActive) {
        activeCount++;
      }

      // Check if overdue: not completed and deadline before today
      if (!isCompleted && g.deadline && g.deadline.length >= 10 && g.deadline < todayStr) {
        overdueCount++;
      }
    }

    const totalGoals = goals.length;
    const overallProgressPercent = totalGoals > 0 ? Math.round(progressSum / totalGoals) : 0;

    return {
      totalGoals,
      activeCount,
      completedCount,
      pausedCount,
      overdueCount,
      overallProgressPercent,
      categoriesBreakdown,
    };
  }

  // --- MAPPERS ---

  toMilestoneDTO(rec: GoalMilestoneRecord): GoalMilestoneDTO {
    return {
      id: rec.id,
      goalId: rec.goal_id,
      title: rec.title,
      completed: rec.completed === 1,
      dueDate: rec.due_date || undefined,
      orderIndex: rec.order_index,
      createdAt: rec.created_at,
    };
  }

  toGoalDTO(rec: GoalRecord, milestones: GoalMilestoneRecord[] = []): GoalDTO {
    return {
      id: rec.id,
      userId: rec.user_id,
      title: rec.title,
      description: rec.description || undefined,
      category: rec.category,
      goalType: rec.goal_type,
      targetValue: rec.target_value !== null ? rec.target_value : undefined,
      currentValue: rec.current_value !== null ? rec.current_value : undefined,
      unit: rec.unit || undefined,
      color: rec.color,
      priority: rec.priority,
      status: rec.status,
      progressPercent: rec.progress_percent,
      startDate: rec.start_date || undefined,
      deadline: rec.deadline || undefined,
      notes: rec.notes || undefined,
      milestones: milestones.map((m) => this.toMilestoneDTO(m)),
      createdAt: rec.created_at,
      updatedAt: rec.updated_at,
    };
  }
}

export const goalsRepository = new GoalsRepository();
