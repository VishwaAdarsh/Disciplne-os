/**
 * Performance Repository Implementation (SPR-306 / ARCH-002)
 */

import db from '../../db';
import { BaseRepository, PaginatedResult } from '../baseRepository';
import { ParsedPagination, buildPaginationMeta } from '../../utils/pagination';
import {
  PerformanceSnapshotRecord,
  PerformanceFilter,
  PerformanceHistoryItemDTO,
  PerformanceTrend,
} from '../../types/performance';

export class PerformanceRepository extends BaseRepository<PerformanceSnapshotRecord> {
  async findById(id: string): Promise<PerformanceSnapshotRecord | null> {
    const row = db.prepare('SELECT * FROM performance_snapshots WHERE id = ?').get(id) as PerformanceSnapshotRecord | undefined;
    return row || null;
  }

  async findMany(filter: PerformanceFilter = {}): Promise<PerformanceSnapshotRecord[]> {
    const { conditions, params } = this.buildFilterQuery(filter);
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limitClause = filter.limit ? `LIMIT ${filter.limit}` : '';
    const query = `SELECT * FROM performance_snapshots ${whereClause} ORDER BY snapshot_date DESC, created_at DESC ${limitClause}`;
    return db.prepare(query).all(...params) as PerformanceSnapshotRecord[];
  }

  async getLatestSnapshot(userId: string): Promise<PerformanceSnapshotRecord | null> {
    const row = db
      .prepare('SELECT * FROM performance_snapshots WHERE user_id = ? ORDER BY snapshot_date DESC, created_at DESC LIMIT 1')
      .get(userId) as PerformanceSnapshotRecord | undefined;
    return row || null;
  }

  async getHighestScore(userId: string): Promise<number> {
    const row = db
      .prepare('SELECT MAX(overall_score) as max_score FROM performance_snapshots WHERE user_id = ?')
      .get(userId) as { max_score: number | null } | undefined;
    return row?.max_score ?? 0;
  }

  async create(data: Partial<PerformanceSnapshotRecord>): Promise<PerformanceSnapshotRecord> {
    const stmt = db.prepare(`
      INSERT INTO performance_snapshots (
        id, user_id, overall_score, discipline_score, body_score, mind_score, nutrition_score, goals_score, period_type, trend, snapshot_date, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, datetime('now')))
    `);

    stmt.run(
      data.id,
      data.user_id,
      data.overall_score ?? 0,
      data.discipline_score ?? 0,
      data.body_score ?? 0,
      data.mind_score ?? 0,
      data.nutrition_score ?? 0,
      data.goals_score ?? 0,
      data.period_type || 'daily',
      data.trend || 'stable',
      data.snapshot_date || new Date().toISOString().split('T')[0],
      data.created_at || null
    );

    return (await this.findById(data.id!))!;
  }

  async update(id: string, data: Partial<PerformanceSnapshotRecord>): Promise<PerformanceSnapshotRecord | null> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.overall_score !== undefined) {
      updates.push('overall_score = ?');
      values.push(data.overall_score);
    }
    if (data.trend !== undefined) {
      updates.push('trend = ?');
      values.push(data.trend);
    }

    if (updates.length === 0) return this.findById(id);

    values.push(id);
    const query = `UPDATE performance_snapshots SET ${updates.join(', ')} WHERE id = ?`;
    db.prepare(query).run(...values);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = db.prepare('DELETE FROM performance_snapshots WHERE id = ?').run(id);
    return result.changes > 0;
  }

  async count(filter: PerformanceFilter = {}): Promise<number> {
    const { conditions, params } = this.buildFilterQuery(filter);
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `SELECT COUNT(*) as count FROM performance_snapshots ${whereClause}`;
    const row = db.prepare(query).get(...params) as { count: number };
    return row.count;
  }

  async paginate(
    pagination: ParsedPagination,
    filter: PerformanceFilter = {}
  ): Promise<PaginatedResult<PerformanceSnapshotRecord>> {
    const total = await this.count(filter);
    const { conditions, params } = this.buildFilterQuery(filter);
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const queryParams = [...params, pagination.limit, pagination.skip];
    const sortField = pagination.sort === 'createdAt' || pagination.sort === 'created_at' ? 'created_at' : 'snapshot_date';

    const query = `
      SELECT * FROM performance_snapshots
      ${whereClause}
      ORDER BY ${sortField} ${pagination.order.toUpperCase()}
      LIMIT ? OFFSET ?
    `;

    const rows = db.prepare(query).all(...queryParams) as PerformanceSnapshotRecord[];

    return {
      items: rows,
      meta: buildPaginationMeta(pagination.page, pagination.limit, total),
    };
  }

  toDTO(record: PerformanceSnapshotRecord): PerformanceHistoryItemDTO {
    return {
      id: record.id,
      snapshotDate: record.snapshot_date,
      overallScore: record.overall_score,
      moduleScores: {
        discipline: record.discipline_score,
        body: record.body_score,
        mind: record.mind_score,
        nutrition: record.nutrition_score,
        goals: record.goals_score,
      },
      periodType: record.period_type,
      trend: (record.trend as PerformanceTrend) || 'stable',
      createdAt: record.created_at || new Date().toISOString(),
    };
  }

  private buildFilterQuery(filter: PerformanceFilter): { conditions: string[]; params: any[] } {
    const conditions: string[] = [];
    const params: any[] = [];

    if (filter.userId) {
      conditions.push('user_id = ?');
      params.push(filter.userId);
    }
    if (filter.period) {
      conditions.push('period_type = ?');
      params.push(filter.period);
    }
    if (filter.startDate) {
      conditions.push('snapshot_date >= ?');
      params.push(filter.startDate);
    }
    if (filter.endDate) {
      conditions.push('snapshot_date <= ?');
      params.push(filter.endDate);
    }

    return { conditions, params };
  }
}

export const performanceRepository = new PerformanceRepository();
