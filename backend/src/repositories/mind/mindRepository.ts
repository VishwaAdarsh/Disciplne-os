/**
 * Mind Repository Implementation (SPR-309 / ARCH-002)
 */

import db from '../../db';
import {
  MoodRecord,
  EnergyRecord,
  StressRecord,
  FocusRecord,
  JournalRecord,
  MeditationRecord,
  MoodDTO,
  EnergyDTO,
  StressDTO,
  FocusDTO,
  JournalDTO,
  MeditationDTO,
} from '../../types/mind';

export class MindRepository {
  // --- MOOD LOGS ---
  async getMoodByDate(userId: string, date: string): Promise<MoodRecord | null> {
    const row = db
      .prepare('SELECT * FROM mood_logs WHERE user_id = ? AND log_date = ? ORDER BY updated_at DESC LIMIT 1')
      .get(userId, date) as MoodRecord | undefined;
    return row || null;
  }

  async logMood(data: Partial<MoodRecord>): Promise<MoodRecord> {
    const existing = await this.getMoodByDate(data.user_id!, data.log_date!);
    if (existing) {
      db.prepare(`
        UPDATE mood_logs SET mood = ?, icon = ?, notes = ?, updated_at = datetime('now')
        WHERE id = ?
      `).run(data.mood, data.icon || existing.icon, data.notes || existing.notes, existing.id);
      return (await this.getMoodByDate(data.user_id!, data.log_date!))!;
    }

    const stmt = db.prepare(`
      INSERT INTO mood_logs (id, user_id, mood, icon, notes, log_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(data.id, data.user_id, data.mood, data.icon || '🙂', data.notes || null, data.log_date);
    return (await this.getMoodByDate(data.user_id!, data.log_date!))!;
  }

  // --- ENERGY LOGS ---
  async getEnergyByDate(userId: string, date: string): Promise<EnergyRecord | null> {
    const row = db
      .prepare('SELECT * FROM energy_logs WHERE user_id = ? AND log_date = ? ORDER BY updated_at DESC LIMIT 1')
      .get(userId, date) as EnergyRecord | undefined;
    return row || null;
  }

  async logEnergy(data: Partial<EnergyRecord>): Promise<EnergyRecord> {
    const existing = await this.getEnergyByDate(data.user_id!, data.log_date!);
    if (existing) {
      db.prepare("UPDATE energy_logs SET energy_level = ?, updated_at = datetime('now') WHERE id = ?")
        .run(data.energy_level, existing.id);
      return (await this.getEnergyByDate(data.user_id!, data.log_date!))!;
    }

    const stmt = db.prepare('INSERT INTO energy_logs (id, user_id, energy_level, log_date) VALUES (?, ?, ?, ?)');
    stmt.run(data.id, data.user_id, data.energy_level, data.log_date);
    return (await this.getEnergyByDate(data.user_id!, data.log_date!))!;
  }

  // --- STRESS LOGS ---
  async getStressByDate(userId: string, date: string): Promise<StressRecord | null> {
    const row = db
      .prepare('SELECT * FROM stress_logs WHERE user_id = ? AND log_date = ? ORDER BY created_at DESC LIMIT 1')
      .get(userId, date) as StressRecord | undefined;
    return row || null;
  }

  async logStress(data: Partial<StressRecord>): Promise<StressRecord> {
    const stmt = db.prepare(`
      INSERT INTO stress_logs (id, user_id, stress_level, trigger_notes, log_date)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(data.id, data.user_id, data.stress_level, data.trigger_notes || null, data.log_date);
    return (await this.getStressByDate(data.user_id!, data.log_date!))!;
  }

  // --- FOCUS LOGS ---
  async getFocusByDate(userId: string, date: string): Promise<FocusRecord | null> {
    const row = db
      .prepare('SELECT * FROM focus_logs WHERE user_id = ? AND log_date = ? ORDER BY created_at DESC LIMIT 1')
      .get(userId, date) as FocusRecord | undefined;
    return row || null;
  }

  async logFocus(data: Partial<FocusRecord>): Promise<FocusRecord> {
    const stmt = db.prepare(`
      INSERT INTO focus_logs (id, user_id, focus_score, notes, log_date)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(data.id, data.user_id, data.focus_score, data.notes || null, data.log_date);
    return (await this.getFocusByDate(data.user_id!, data.log_date!))!;
  }

  // --- JOURNALS ---
  async findJournalById(id: string): Promise<JournalRecord | null> {
    const row = db.prepare('SELECT * FROM journals WHERE id = ? AND deleted_at IS NULL').get(id) as JournalRecord | undefined;
    return row || null;
  }

  async findJournals(userId: string, search?: string): Promise<JournalRecord[]> {
    if (search) {
      return db
        .prepare('SELECT * FROM journals WHERE user_id = ? AND deleted_at IS NULL AND (title LIKE ? OR content LIKE ?) ORDER BY created_at DESC')
        .all(userId, `%${search}%`, `%${search}%`) as JournalRecord[];
    }
    return db
      .prepare('SELECT * FROM journals WHERE user_id = ? AND deleted_at IS NULL ORDER BY created_at DESC')
      .all(userId) as JournalRecord[];
  }

  async createJournal(data: Partial<JournalRecord>): Promise<JournalRecord> {
    const stmt = db.prepare(`
      INSERT INTO journals (id, user_id, title, content, mood_tag)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(data.id, data.user_id, data.title, data.content, data.mood_tag || 'neutral');
    return (await this.findJournalById(data.id!))!;
  }

  async updateJournal(id: string, data: Partial<JournalRecord>): Promise<JournalRecord | null> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.title !== undefined) { updates.push('title = ?'); values.push(data.title); }
    if (data.content !== undefined) { updates.push('content = ?'); values.push(data.content); }
    if (data.mood_tag !== undefined) { updates.push('mood_tag = ?'); values.push(data.mood_tag); }

    if (updates.length === 0) return this.findJournalById(id);

    updates.push("updated_at = datetime('now')");
    values.push(id);

    const query = `UPDATE journals SET ${updates.join(', ')} WHERE id = ? AND deleted_at IS NULL`;
    db.prepare(query).run(...values);
    return this.findJournalById(id);
  }

  async deleteJournal(id: string): Promise<boolean> {
    const result = db.prepare("UPDATE journals SET deleted_at = datetime('now') WHERE id = ?").run(id);
    return result.changes > 0;
  }

  // --- MEDITATION SESSIONS ---
  async getMeditationsByDate(userId: string, date: string): Promise<MeditationRecord[]> {
    return db
      .prepare('SELECT * FROM meditation_sessions WHERE user_id = ? AND log_date = ? ORDER BY created_at DESC')
      .all(userId, date) as MeditationRecord[];
  }

  async logMeditation(data: Partial<MeditationRecord>): Promise<MeditationRecord> {
    const stmt = db.prepare(`
      INSERT INTO meditation_sessions (id, user_id, title, duration_minutes, type, completed, notes, log_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      data.id,
      data.user_id,
      data.title || 'Mindfulness Meditation',
      data.duration_minutes ?? 10,
      data.type || 'mindfulness',
      data.completed ?? 1,
      data.notes || null,
      data.log_date || new Date().toISOString().split('T')[0]
    );

    const row = db.prepare('SELECT * FROM meditation_sessions WHERE id = ?').get(data.id) as MeditationRecord;
    return row;
  }

  // Mappers
  toMoodDTO(record: MoodRecord): MoodDTO {
    return {
      id: record.id,
      userId: record.user_id,
      mood: record.mood,
      icon: record.icon || '🙂',
      notes: record.notes,
      logDate: record.log_date,
      createdAt: record.created_at,
    };
  }

  toEnergyDTO(record: EnergyRecord): EnergyDTO {
    return {
      id: record.id,
      userId: record.user_id,
      energyLevel: record.energy_level,
      logDate: record.log_date,
      createdAt: record.created_at,
    };
  }

  toStressDTO(record: StressRecord): StressDTO {
    return {
      id: record.id,
      userId: record.user_id,
      stressLevel: record.stress_level,
      triggerNotes: record.trigger_notes,
      logDate: record.log_date,
      createdAt: record.created_at,
    };
  }

  toFocusDTO(record: FocusRecord): FocusDTO {
    return {
      id: record.id,
      userId: record.user_id,
      focusScore: record.focus_score,
      notes: record.notes,
      logDate: record.log_date,
      createdAt: record.created_at,
    };
  }

  toJournalDTO(record: JournalRecord): JournalDTO {
    return {
      id: record.id,
      userId: record.user_id,
      title: record.title,
      content: record.content,
      moodTag: record.mood_tag || 'neutral',
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    };
  }

  toMeditationDTO(record: MeditationRecord): MeditationDTO {
    return {
      id: record.id,
      userId: record.user_id,
      title: record.title || 'Mindfulness Meditation',
      durationMinutes: record.duration_minutes ?? 10,
      type: record.type || 'mindfulness',
      completed: Boolean(record.completed),
      notes: record.notes,
      logDate: record.log_date,
      createdAt: record.created_at,
    };
  }
}

export const mindRepository = new MindRepository();
