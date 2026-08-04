/**
 * Habit Repository Implementation (SPR-307 / ARCH-002)
 */

import db from '../../db';
import { BaseRepository, PaginatedResult } from '../baseRepository';
import { ParsedPagination, buildPaginationMeta } from '../../utils/pagination';
import { HabitRecord, HabitDTO } from '../../types/discipline';

export class HabitRepository extends BaseRepository<HabitRecord> {
  async findById(id: string): Promise<HabitRecord | null> {
    const row = db.prepare('SELECT * FROM habits WHERE id = ? AND deleted_at IS NULL').get(id) as HabitRecord | undefined;
    return row || null;
  }

  async findMany(filter: { userId?: string; category?: string } = {}): Promise<HabitRecord[]> {
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

    const query = `SELECT * FROM habits WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC`;
    return db.prepare(query).all(...params) as HabitRecord[];
  }

  async create(data: Partial<HabitRecord>): Promise<HabitRecord> {
    const stmt = db.prepare(`
      INSERT INTO habits (
        id, user_id, habit_name, description, category, frequency, target_days_per_week, streak, completion_rate, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      data.id,
      data.user_id,
      data.habit_name,
      data.description || null,
      data.category || 'Health',
      data.frequency || 'daily',
      data.target_days_per_week ?? 7,
      data.streak ?? 0,
      data.completion_rate ?? 0.0,
      data.status || 'active'
    );

    return (await this.findById(data.id!))!;
  }

  async update(id: string, data: Partial<HabitRecord>): Promise<HabitRecord | null> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.habit_name !== undefined) {
      updates.push('habit_name = ?');
      values.push(data.habit_name);
    }
    if (data.description !== undefined) {
      updates.push('description = ?');
      values.push(data.description);
    }
    if (data.category !== undefined) {
      updates.push('category = ?');
      values.push(data.category);
    }
    if (data.frequency !== undefined) {
      updates.push('frequency = ?');
      values.push(data.frequency);
    }
    if (data.target_days_per_week !== undefined) {
      updates.push('target_days_per_week = ?');
      values.push(data.target_days_per_week);
    }
    if (data.streak !== undefined) {
      updates.push('streak = ?');
      values.push(data.streak);
    }
    if (data.completion_rate !== undefined) {
      updates.push('completion_rate = ?');
      values.push(data.completion_rate);
    }
    if (data.status !== undefined) {
      updates.push('status = ?');
      values.push(data.status);
    }

    if (updates.length === 0) return this.findById(id);

    updates.push("updated_at = datetime('now')");
    values.push(id);

    const query = `UPDATE habits SET ${updates.join(', ')} WHERE id = ? AND deleted_at IS NULL`;
    db.prepare(query).run(...values);
    return this.findById(id);
  }

  async incrementStreak(id: string): Promise<HabitRecord | null> {
    db.prepare("UPDATE habits SET streak = streak + 1, updated_at = datetime('now') WHERE id = ?").run(id);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = db.prepare("UPDATE habits SET deleted_at = datetime('now') WHERE id = ?").run(id);
    return result.changes > 0;
  }

  async count(filter: { userId?: string } = {}): Promise<number> {
    const conditions: string[] = ['deleted_at IS NULL'];
    const params: any[] = [];
    if (filter.userId) {
      conditions.push('user_id = ?');
      params.push(filter.userId);
    }
    const query = `SELECT COUNT(*) as count FROM habits WHERE ${conditions.join(' AND ')}`;
    const row = db.prepare(query).get(...params) as { count: number };
    return row.count;
  }

  async paginate(
    pagination: ParsedPagination,
    filter: { userId?: string } = {}
  ): Promise<PaginatedResult<HabitRecord>> {
    const total = await this.count(filter);
    const conditions: string[] = ['deleted_at IS NULL'];
    const params: any[] = [];

    if (filter.userId) {
      conditions.push('user_id = ?');
      params.push(filter.userId);
    }

    params.push(pagination.limit, pagination.skip);

    const query = `
      SELECT * FROM habits
      WHERE ${conditions.join(' AND ')}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    const rows = db.prepare(query).all(...params) as HabitRecord[];

    return {
      items: rows,
      meta: buildPaginationMeta(pagination.page, pagination.limit, total),
    };
  }

  toDTO(record: HabitRecord): HabitDTO {
    return {
      id: record.id,
      userId: record.user_id,
      habitName: record.habit_name,
      description: record.description,
      category: record.category || 'Health',
      frequency: record.frequency || 'daily',
      targetDaysPerWeek: record.target_days_per_week ?? 7,
      streak: record.streak ?? 0,
      completionRate: record.completion_rate ?? 0.0,
      status: record.status || 'active',
      createdAt: record.created_at,
    };
  }
}

export const habitRepository = new HabitRepository();
