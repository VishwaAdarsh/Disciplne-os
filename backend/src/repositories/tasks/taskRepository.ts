/**
 * Task Repository Implementation (SPR-307 / ARCH-002)
 */

import crypto from 'crypto';
import db from '../../db';
import { BaseRepository, PaginatedResult } from '../baseRepository';
import { ParsedPagination, buildPaginationMeta } from '../../utils/pagination';
import { TaskRecord, TaskFilter, TaskDTO, TaskHistoryRecord } from '../../types/discipline';

export class TaskRepository extends BaseRepository<TaskRecord> {
  async findById(id: string): Promise<TaskRecord | null> {
    const row = db.prepare('SELECT * FROM tasks WHERE id = ? AND deleted_at IS NULL').get(id) as TaskRecord | undefined;
    return row || null;
  }

  async findMany(filter: TaskFilter = {}): Promise<TaskRecord[]> {
    const { conditions, params } = this.buildFilterQuery(filter);
    const query = `SELECT * FROM tasks WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC`;
    return db.prepare(query).all(...params) as TaskRecord[];
  }

  async create(data: Partial<TaskRecord>): Promise<TaskRecord> {
    const stmt = db.prepare(`
      INSERT INTO tasks (
        id, user_id, goal_id, name, description, type, category, priority, estimated_minutes, due_date, time_target, why, status, tags, notes, is_active, is_archived, completed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      data.id,
      data.user_id,
      data.goal_id || null,
      data.name,
      data.description || null,
      data.type || 'Work',
      data.category || 'Work',
      data.priority || 'medium',
      data.estimated_minutes ?? 30,
      data.due_date || null,
      data.time_target || null,
      data.why || null,
      data.status || 'pending',
      data.tags || '[]',
      data.notes || null,
      data.is_active ?? 1,
      data.is_archived ?? 0,
      data.completed_at || null
    );

    return (await this.findById(data.id!))!;
  }

  async update(id: string, data: Partial<TaskRecord>): Promise<TaskRecord | null> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.description !== undefined) {
      updates.push('description = ?');
      values.push(data.description);
    }
    if (data.category !== undefined) {
      updates.push('category = ?');
      values.push(data.category);
    }
    if (data.priority !== undefined) {
      updates.push('priority = ?');
      values.push(data.priority);
    }
    if (data.estimated_minutes !== undefined) {
      updates.push('estimated_minutes = ?');
      values.push(data.estimated_minutes);
    }
    if (data.due_date !== undefined) {
      updates.push('due_date = ?');
      values.push(data.due_date);
    }
    if (data.status !== undefined) {
      updates.push('status = ?');
      values.push(data.status);
    }
    if (data.tags !== undefined) {
      updates.push('tags = ?');
      values.push(data.tags);
    }
    if (data.notes !== undefined) {
      updates.push('notes = ?');
      values.push(data.notes);
    }
    if (data.is_archived !== undefined) {
      updates.push('is_archived = ?');
      values.push(data.is_archived);
    }
    if (data.completed_at !== undefined) {
      updates.push('completed_at = ?');
      values.push(data.completed_at);
    }

    if (updates.length === 0) return this.findById(id);

    updates.push("updated_at = datetime('now')");
    values.push(id);

    const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ? AND deleted_at IS NULL`;
    db.prepare(query).run(...values);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = db.prepare("UPDATE tasks SET deleted_at = datetime('now') WHERE id = ?").run(id);
    return result.changes > 0;
  }

  async count(filter: TaskFilter = {}): Promise<number> {
    const { conditions, params } = this.buildFilterQuery(filter);
    const query = `SELECT COUNT(*) as count FROM tasks WHERE ${conditions.join(' AND ')}`;
    const row = db.prepare(query).get(...params) as { count: number };
    return row.count;
  }

  async paginate(
    pagination: ParsedPagination,
    filter: TaskFilter = {}
  ): Promise<PaginatedResult<TaskRecord>> {
    const total = await this.count(filter);
    const { conditions, params } = this.buildFilterQuery(filter);

    const sortField = pagination.sort === 'createdAt' || pagination.sort === 'created_at' ? 'created_at' : pagination.sort;
    const queryParams = [...params, pagination.limit, pagination.skip];

    const query = `
      SELECT * FROM tasks
      WHERE ${conditions.join(' AND ')}
      ORDER BY ${sortField} ${pagination.order.toUpperCase()}
      LIMIT ? OFFSET ?
    `;

    const rows = db.prepare(query).all(...queryParams) as TaskRecord[];

    return {
      items: rows,
      meta: buildPaginationMeta(pagination.page, pagination.limit, total),
    };
  }

  async recordHistory(
    userId: string,
    taskId: string,
    action: TaskHistoryRecord['action'],
    details: Record<string, any> = {}
  ): Promise<void> {
    const id = `th_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    db.prepare(`
      INSERT INTO task_history (id, user_id, task_id, action, details_json)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, userId, taskId, action, JSON.stringify(details));
  }

  async getHistory(userId: string, taskId?: string): Promise<TaskHistoryRecord[]> {
    if (taskId) {
      return db
        .prepare('SELECT * FROM task_history WHERE user_id = ? AND task_id = ? ORDER BY created_at DESC')
        .all(userId, taskId) as TaskHistoryRecord[];
    }
    return db
      .prepare('SELECT * FROM task_history WHERE user_id = ? ORDER BY created_at DESC')
      .all(userId) as TaskHistoryRecord[];
  }

  toDTO(record: TaskRecord): TaskDTO {
    let parsedTags: string[] = [];
    try {
      parsedTags = JSON.parse(record.tags || '[]');
    } catch {
      parsedTags = [];
    }

    return {
      id: record.id,
      userId: record.user_id,
      title: record.name,
      description: record.description,
      category: record.category || 'Work',
      priority: record.priority || 'medium',
      estimatedMinutes: record.estimated_minutes ?? 30,
      dueDate: record.due_date,
      status: record.status || 'pending',
      tags: parsedTags,
      notes: record.notes,
      isArchived: Boolean(record.is_archived),
      completedAt: record.completed_at,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    };
  }

  private buildFilterQuery(filter: TaskFilter): { conditions: string[]; params: any[] } {
    const conditions: string[] = ['deleted_at IS NULL'];
    const params: any[] = [];

    if (filter.userId) {
      conditions.push('user_id = ?');
      params.push(filter.userId);
    }
    if (filter.category) {
      conditions.push('category = ?');
      params.push(filter.category);
    }
    if (filter.priority) {
      conditions.push('priority = ?');
      params.push(filter.priority);
    }
    if (filter.status) {
      conditions.push('status = ?');
      params.push(filter.status);
    }
    if (filter.isArchived !== undefined) {
      conditions.push('is_archived = ?');
      params.push(filter.isArchived ? 1 : 0);
    }
    if (filter.search) {
      conditions.push('(name LIKE ? OR description LIKE ? OR tags LIKE ?)');
      params.push(`%${filter.search}%`, `%${filter.search}%`, `%${filter.search}%`);
    }
    if (filter.startDate) {
      conditions.push('created_at >= ?');
      params.push(filter.startDate);
    }
    if (filter.endDate) {
      conditions.push('created_at <= ?');
      params.push(filter.endDate);
    }

    return { conditions, params };
  }
}

export const taskRepository = new TaskRepository();
