/**
 * Body Repository Implementation (SPR-308 / ARCH-002)
 */

import db from '../../db';
import {
  WorkoutRecord,
  SleepRecord,
  WaterRecord,
  StepRecord,
  WeightRecord,
  WorkoutDTO,
  SleepDTO,
  WaterDTO,
  StepDTO,
  WeightDTO,
} from '../../types/body';

export class BodyRepository {
  // --- WORKOUTS ---
  async findWorkoutById(id: string): Promise<WorkoutRecord | null> {
    const row = db.prepare('SELECT * FROM workouts WHERE id = ? AND deleted_at IS NULL').get(id) as WorkoutRecord | undefined;
    return row || null;
  }

  async findWorkouts(userId: string, date?: string): Promise<WorkoutRecord[]> {
    if (date) {
      return db
        .prepare('SELECT * FROM workouts WHERE user_id = ? AND log_date = ? AND deleted_at IS NULL ORDER BY created_at DESC')
        .all(userId, date) as WorkoutRecord[];
    }
    return db
      .prepare('SELECT * FROM workouts WHERE user_id = ? AND deleted_at IS NULL ORDER BY log_date DESC, created_at DESC')
      .all(userId) as WorkoutRecord[];
  }

  async createWorkout(data: Partial<WorkoutRecord>): Promise<WorkoutRecord> {
    const stmt = db.prepare(`
      INSERT INTO workouts (id, user_id, name, category, duration_minutes, calories_burned, intensity, notes, log_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      data.id,
      data.user_id,
      data.name,
      data.category || 'Strength',
      data.duration_minutes ?? 45,
      data.calories_burned ?? 300,
      data.intensity || 'medium',
      data.notes || null,
      data.log_date || new Date().toISOString().split('T')[0]
    );

    return (await this.findWorkoutById(data.id!))!;
  }

  async updateWorkout(id: string, data: Partial<WorkoutRecord>): Promise<WorkoutRecord | null> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) { updates.push('name = ?'); values.push(data.name); }
    if (data.category !== undefined) { updates.push('category = ?'); values.push(data.category); }
    if (data.duration_minutes !== undefined) { updates.push('duration_minutes = ?'); values.push(data.duration_minutes); }
    if (data.calories_burned !== undefined) { updates.push('calories_burned = ?'); values.push(data.calories_burned); }
    if (data.intensity !== undefined) { updates.push('intensity = ?'); values.push(data.intensity); }
    if (data.notes !== undefined) { updates.push('notes = ?'); values.push(data.notes); }

    if (updates.length === 0) return this.findWorkoutById(id);

    updates.push("updated_at = datetime('now')");
    values.push(id);

    const query = `UPDATE workouts SET ${updates.join(', ')} WHERE id = ? AND deleted_at IS NULL`;
    db.prepare(query).run(...values);
    return this.findWorkoutById(id);
  }

  async deleteWorkout(id: string): Promise<boolean> {
    const result = db.prepare("UPDATE workouts SET deleted_at = datetime('now') WHERE id = ?").run(id);
    return result.changes > 0;
  }

  // --- SLEEP LOGS ---
  async getSleepByDate(userId: string, date: string): Promise<SleepRecord | null> {
    const row = db
      .prepare('SELECT * FROM sleep_logs WHERE user_id = ? AND log_date = ? ORDER BY created_at DESC LIMIT 1')
      .get(userId, date) as SleepRecord | undefined;
    return row || null;
  }

  async logSleep(data: Partial<SleepRecord>): Promise<SleepRecord> {
    const existing = await this.getSleepByDate(data.user_id!, data.log_date!);
    if (existing) {
      db.prepare(`
        UPDATE sleep_logs SET sleep_start = ?, sleep_end = ?, duration_minutes = ?, quality_percent = ?, notes = ?
        WHERE id = ?
      `).run(
        data.sleep_start || existing.sleep_start,
        data.sleep_end || existing.sleep_end,
        data.duration_minutes ?? existing.duration_minutes,
        data.quality_percent ?? existing.quality_percent,
        data.notes || existing.notes,
        existing.id
      );
      return (await this.getSleepByDate(data.user_id!, data.log_date!))!;
    }

    const stmt = db.prepare(`
      INSERT INTO sleep_logs (id, user_id, sleep_start, sleep_end, duration_minutes, quality_percent, notes, log_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      data.id,
      data.user_id,
      data.sleep_start || null,
      data.sleep_end || null,
      data.duration_minutes ?? 480,
      data.quality_percent ?? 80,
      data.notes || null,
      data.log_date || new Date().toISOString().split('T')[0]
    );

    return (await this.getSleepByDate(data.user_id!, data.log_date!))!;
  }

  // --- WATER LOGS ---
  async logWater(data: Partial<WaterRecord>): Promise<WaterRecord> {
    const stmt = db.prepare(`
      INSERT INTO water_logs (id, user_id, amount_ml, logged_at)
      VALUES (?, ?, ?, COALESCE(?, datetime('now')))
    `);

    stmt.run(data.id, data.user_id, data.amount_ml, data.logged_at || null);
    const row = db.prepare('SELECT * FROM water_logs WHERE id = ?').get(data.id) as WaterRecord;
    return row;
  }

  async getTodayWaterTotal(userId: string, dateStr: string): Promise<number> {
    const row = db
      .prepare("SELECT SUM(amount_ml) as total FROM water_logs WHERE user_id = ? AND strftime('%Y-%m-%d', logged_at) = ?")
      .get(userId, dateStr) as { total: number | null } | undefined;
    return row?.total ?? 0;
  }

  // --- STEP LOGS ---
  async logSteps(data: Partial<StepRecord>): Promise<StepRecord> {
    const existing = db
      .prepare('SELECT * FROM step_logs WHERE user_id = ? AND log_date = ?')
      .get(data.user_id, data.log_date) as StepRecord | undefined;

    if (existing) {
      db.prepare('UPDATE step_logs SET steps_count = ? WHERE id = ?').run(data.steps_count, existing.id);
      return (db.prepare('SELECT * FROM step_logs WHERE id = ?').get(existing.id) as StepRecord)!;
    }

    const stmt = db.prepare('INSERT INTO step_logs (id, user_id, steps_count, log_date) VALUES (?, ?, ?, ?)');
    stmt.run(data.id, data.user_id, data.steps_count, data.log_date);
    return (db.prepare('SELECT * FROM step_logs WHERE id = ?').get(data.id) as StepRecord)!;
  }

  async getStepsByDate(userId: string, dateStr: string): Promise<number> {
    const row = db
      .prepare('SELECT steps_count FROM step_logs WHERE user_id = ? AND log_date = ?')
      .get(userId, dateStr) as { steps_count: number } | undefined;
    return row?.steps_count ?? 0;
  }

  // --- WEIGHT & BODY MEASUREMENTS ---
  async logWeight(data: Partial<WeightRecord>): Promise<WeightRecord> {
    const stmt = db.prepare(`
      INSERT INTO weight_logs (id, user_id, weight_kg, chest_cm, waist_cm, hip_cm, arm_cm, thigh_cm, notes, logged_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, datetime('now')))
    `);

    stmt.run(
      data.id,
      data.user_id,
      data.weight_kg,
      data.chest_cm || null,
      data.waist_cm || null,
      data.hip_cm || null,
      data.arm_cm || null,
      data.thigh_cm || null,
      data.notes || null,
      data.logged_at || null
    );

    return (db.prepare('SELECT * FROM weight_logs WHERE id = ?').get(data.id) as WeightRecord)!;
  }

  async getLatestWeight(userId: string): Promise<WeightRecord | null> {
    const row = db
      .prepare('SELECT * FROM weight_logs WHERE user_id = ? ORDER BY logged_at DESC LIMIT 1')
      .get(userId) as WeightRecord | undefined;
    return row || null;
  }

  // Mappers
  toWorkoutDTO(record: WorkoutRecord): WorkoutDTO {
    return {
      id: record.id,
      userId: record.user_id,
      name: record.name,
      category: record.category || 'Strength',
      durationMinutes: record.duration_minutes ?? 45,
      caloriesBurned: record.calories_burned ?? 300,
      intensity: record.intensity || 'medium',
      notes: record.notes,
      logDate: record.log_date,
      createdAt: record.created_at,
    };
  }

  toSleepDTO(record: SleepRecord): SleepDTO {
    const durationHours = Number((record.duration_minutes / 60).toFixed(1));
    return {
      id: record.id,
      userId: record.user_id,
      sleepStart: record.sleep_start,
      sleepEnd: record.sleep_end,
      durationMinutes: record.duration_minutes,
      durationHours,
      qualityPercent: record.quality_percent,
      notes: record.notes,
      logDate: record.log_date,
      createdAt: record.created_at,
    };
  }

  toWaterDTO(record: WaterRecord): WaterDTO {
    const liters = Number((record.amount_ml / 1000).toFixed(2));
    const oz = Math.round(record.amount_ml / 29.5735);
    return {
      id: record.id,
      userId: record.user_id,
      amountMl: record.amount_ml,
      amountLiters: liters,
      amountOz: oz,
      loggedAt: record.logged_at,
    };
  }

  toStepDTO(record: StepRecord): StepDTO {
    return {
      id: record.id,
      userId: record.user_id,
      stepsCount: record.steps_count,
      logDate: record.log_date,
      createdAt: record.created_at,
    };
  }

  toWeightDTO(record: WeightRecord): WeightDTO {
    const lbs = Number((record.weight_kg * 2.20462).toFixed(1));
    return {
      id: record.id,
      userId: record.user_id,
      weightKg: record.weight_kg,
      weightLbs: lbs,
      bodyMeasurements: {
        chestCm: record.chest_cm,
        waistCm: record.waist_cm,
        hipCm: record.hip_cm,
        armCm: record.arm_cm,
        thighCm: record.thigh_cm,
      },
      notes: record.notes,
      loggedAt: record.logged_at,
    };
  }
}

export const bodyRepository = new BodyRepository();
