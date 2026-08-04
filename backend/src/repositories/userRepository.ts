/**
 * User Repository Implementation (SPR-304 / ARCH-002)
 */

import db from '../db';
import { BaseRepository, PaginatedResult } from './baseRepository';
import { ParsedPagination, buildPaginationMeta } from '../utils/pagination';

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  password?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export class UserRepository extends BaseRepository<UserRecord> {
  async findById(id: string): Promise<UserRecord | null> {
    const row = db.prepare('SELECT id, email, name, created_at, updated_at FROM users WHERE id = ? AND deleted_at IS NULL').get(id) as UserRecord | undefined;
    return row || null;
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const row = db.prepare('SELECT * FROM users WHERE email = ? AND deleted_at IS NULL').get(email) as UserRecord | undefined;
    return row || null;
  }

  async findMany(_filter?: Record<string, any>): Promise<UserRecord[]> {
    const rows = db.prepare('SELECT id, email, name, created_at, updated_at FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC').all() as UserRecord[];
    return rows;
  }

  async create(data: Partial<UserRecord>): Promise<UserRecord> {
    const stmt = db.prepare('INSERT INTO users (id, email, name, password) VALUES (?, ?, ?, ?)');
    stmt.run(data.id, data.email, data.name, data.password);
    const created = await this.findById(data.id!);
    return created!;
  }

  async update(id: string, data: Partial<UserRecord>): Promise<UserRecord | null> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.email !== undefined) {
      updates.push('email = ?');
      values.push(data.email);
    }
    if (data.password !== undefined) {
      updates.push('password = ?');
      values.push(data.password);
    }

    if (updates.length === 0) return this.findById(id);

    updates.push("updated_at = datetime('now')");
    values.push(id);

    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ? AND deleted_at IS NULL`;
    db.prepare(query).run(...values);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = db.prepare("UPDATE users SET deleted_at = datetime('now') WHERE id = ?").run(id);
    return result.changes > 0;
  }

  async count(_filter?: Record<string, any>): Promise<number> {
    const row = db.prepare('SELECT COUNT(*) as count FROM users WHERE deleted_at IS NULL').get() as { count: number };
    return row.count;
  }

  async paginate(pagination: ParsedPagination, _filter?: Record<string, any>): Promise<PaginatedResult<UserRecord>> {
    const total = await this.count();
    const rows = db.prepare(`SELECT id, email, name, created_at, updated_at FROM users WHERE deleted_at IS NULL ORDER BY ${pagination.sort} ${pagination.order.toUpperCase()} LIMIT ? OFFSET ?`)
      .all(pagination.limit, pagination.skip) as UserRecord[];
    return {
      items: rows,
      meta: buildPaginationMeta(pagination.page, pagination.limit, total),
    };
  }
}

export const userRepository = new UserRepository();
