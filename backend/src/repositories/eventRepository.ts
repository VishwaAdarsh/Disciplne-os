/**
 * Event Repository Implementation (SPR-305 / ARCH-002)
 */

import db from '../db';
import { BaseRepository, PaginatedResult } from './baseRepository';
import { ParsedPagination, buildPaginationMeta } from '../utils/pagination';
import { EventRecord, EventFilter, EventDTO } from '../types/events';

export class EventRepository extends BaseRepository<EventRecord> {
  async findById(id: string): Promise<EventRecord | null> {
    const row = db.prepare('SELECT * FROM events WHERE id = ?').get(id) as EventRecord | undefined;
    return row || null;
  }

  async findMany(filter: EventFilter = {}): Promise<EventRecord[]> {
    const { conditions, params } = this.buildFilterQuery(filter);
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `SELECT * FROM events ${whereClause} ORDER BY created_at DESC`;
    return db.prepare(query).all(...params) as EventRecord[];
  }

  async create(data: Partial<EventRecord>): Promise<EventRecord> {
    const stmt = db.prepare(`
      INSERT INTO events (id, user_id, module, event_type, title, description, icon, payload_json, score_impact, source, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, datetime('now')))
    `);

    stmt.run(
      data.id,
      data.user_id,
      data.module,
      data.event_type,
      data.title,
      data.description || null,
      data.icon || '⚡',
      data.payload_json || '{}',
      data.score_impact ?? 0,
      data.source || 'user',
      data.status || 'completed',
      data.created_at || null
    );

    return (await this.findById(data.id!))!;
  }

  async update(id: string, data: Partial<EventRecord>): Promise<EventRecord | null> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.title !== undefined) {
      updates.push('title = ?');
      values.push(data.title);
    }
    if (data.description !== undefined) {
      updates.push('description = ?');
      values.push(data.description);
    }
    if (data.status !== undefined) {
      updates.push('status = ?');
      values.push(data.status);
    }
    if (data.payload_json !== undefined) {
      updates.push('payload_json = ?');
      values.push(data.payload_json);
    }

    if (updates.length === 0) return this.findById(id);

    values.push(id);
    const query = `UPDATE events SET ${updates.join(', ')} WHERE id = ?`;
    db.prepare(query).run(...values);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = db.prepare('DELETE FROM events WHERE id = ?').run(id);
    return result.changes > 0;
  }

  async count(filter: EventFilter = {}): Promise<number> {
    const { conditions, params } = this.buildFilterQuery(filter);
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `SELECT COUNT(*) as count FROM events ${whereClause}`;
    const row = db.prepare(query).get(...params) as { count: number };
    return row.count;
  }

  async paginate(
    pagination: ParsedPagination,
    filter: EventFilter = {}
  ): Promise<PaginatedResult<EventRecord>> {
    const total = await this.count(filter);
    const { conditions, params } = this.buildFilterQuery(filter);
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const queryParams = [...params, pagination.limit, pagination.skip];
    const sortField = pagination.sort === 'createdAt' || pagination.sort === 'created_at' ? 'created_at' : pagination.sort;

    const query = `
      SELECT * FROM events
      ${whereClause}
      ORDER BY ${sortField} ${pagination.order.toUpperCase()}
      LIMIT ? OFFSET ?
    `;

    const rows = db.prepare(query).all(...queryParams) as EventRecord[];

    return {
      items: rows,
      meta: buildPaginationMeta(pagination.page, pagination.limit, total),
    };
  }

  toDTO(record: EventRecord): EventDTO {
    let metadata = {};
    try {
      metadata = JSON.parse(record.payload_json || '{}');
    } catch {
      metadata = {};
    }

    return {
      id: record.id,
      userId: record.user_id,
      module: record.module,
      eventType: record.event_type,
      title: record.title,
      description: record.description,
      icon: record.icon || '⚡',
      metadata,
      scoreImpact: record.score_impact ?? 0,
      source: record.source || 'user',
      status: record.status || 'completed',
      createdAt: record.created_at || new Date().toISOString(),
    };
  }

  private buildFilterQuery(filter: EventFilter): { conditions: string[]; params: any[] } {
    const conditions: string[] = [];
    const params: any[] = [];

    if (filter.userId) {
      conditions.push('user_id = ?');
      params.push(filter.userId);
    }
    if (filter.module) {
      conditions.push('module = ?');
      params.push(filter.module);
    }
    if (filter.eventType) {
      conditions.push('event_type = ?');
      params.push(filter.eventType);
    }

    if (filter.period) {
      const now = new Date();
      if (filter.period === 'today') {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        conditions.push('created_at >= ?');
        params.push(startOfDay);
      } else if (filter.period === 'week') {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - 7);
        conditions.push('created_at >= ?');
        params.push(startOfWeek.toISOString());
      } else if (filter.period === 'month') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).toISOString();
        conditions.push('created_at >= ?');
        params.push(startOfMonth);
      }
    }

    if (filter.startDate) {
      conditions.push('created_at >= ?');
      params.push(filter.startDate);
    }
    if (filter.endDate) {
      conditions.push('created_at <= ?');
      params.push(filter.endDate);
    }

    if (filter.search) {
      conditions.push('(title LIKE ? OR description LIKE ? OR event_type LIKE ?)');
      params.push(`%${filter.search}%`, `%${filter.search}%`, `%${filter.search}%`);
    }

    return { conditions, params };
  }
}

export const eventRepository = new EventRepository();
