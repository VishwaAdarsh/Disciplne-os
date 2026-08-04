/**
 * Task Repository Implementation (SPR-304 / ARCH-002)
 */

import db from '../db';
import { BaseRepository, PaginatedResult } from './baseRepository';
import { ParsedPagination, buildPaginationMeta } from '../utils/pagination';
import { ParsedFilter } from '../utils/filtering';

export interface TaskRecord {
  id: string;
  user_id: string;
  goal_id?: string | null;
  name: string;
  type: string;
  time_target?: string | null;
  why?: string | null;
  is_active: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export class TaskRepository extends BaseRepository<TaskRecord> {
  async findById(id: string): Promise<TaskRecord | null> {
    const row = db.prepare('SELECT * FROM tasks WHERE id = ? AND deleted_at IS NULL').get(id) as TaskRecord | undefined;
    return row || null;
  }

  async findMany(filter: ParsedFilter & { userId?: string } = {}): Promise<TaskRecord[]> {
    const conditions = ['deleted_at IS NULL'];
    const params: any[] = [];

    if (filter.userId) {
      conditions.push('user_id = ?');
      params.push(filter.userId);
    }
    if (filter.category) {
      conditions.push('type = ?');
      params.push(filter.category);
    }
    if (filter.search) {
      conditions.push('name LIKE ?');
      params.push(`%${filter.search}%`);
    }

    const query = `SELECT * FROM tasks WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC`;
    return db.prepare(query).all(...params) as TaskRecord[];
  }

  async create(data: Partial<TaskRecord>): Promise<TaskRecord> {
    const stmt = db.prepare(`
      INSERT INTO tasks (id, user_id, goal_id, name, type, time_target, why, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      data.id,
      data.user_id,
      data.goal_id || null,
      data.name,
      data.type,
      data.time_target || null,
      data.why || null,
      data.is_active ?? 1
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
    if (data.type !== undefined) {
      updates.push('type = ?');
      values.push(data.type);
    }
    if (data.is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(data.is_active);
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

  async count(filter: ParsedFilter & { userId?: string } = {}): Promise<number> {
    const conditions = ['deleted_at IS NULL'];
    const params: any[] = [];

    if (filter.userId) {
      conditions.push('user_id = ?');
      params.push(filter.userId);
    }
    if (filter.category) {
      conditions.push('type = ?');
      params.push(filter.category);
    }

    const query = `SELECT COUNT(*) as count FROM tasks WHERE ${conditions.join(' AND ')}`;
    const row = db.prepare(query).get(...params) as { count: number };
    return row.count;
  }

  async paginate(
    pagination: ParsedPagination,
    filter: ParsedFilter & { userId?: string } = {}
  ): Promise<PaginatedResult<TaskRecord>> {
    const total = await this.count(filter);
    const conditions = ['deleted_at IS NULL'];
    const params: any[] = [];

    if (filter.userId) {
      conditions.push('user_id = ?');
      params.push(filter.userId);
    }

    params.push(pagination.limit, pagination.skip);

    const query = `
      SELECT * FROM tasks
      WHERE ${conditions.join(' AND ')}
      ORDER BY ${pagination.sort} ${pagination.order.toUpperCase()}
      LIMIT ? OFFSET ?
    `;

    const rows = db.prepare(query).all(...params) as TaskRecord[];

    return {
      items: rows,
      meta: buildPaginationMeta(pagination.page, pagination.limit, total),
    };
  }
}

export const taskRepository = new TaskRepository();
