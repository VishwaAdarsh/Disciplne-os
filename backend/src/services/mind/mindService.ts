/**
 * Mind Service (SPR-309 / ARCH-002)
 */

import crypto from 'crypto';
import { mindRepository } from '../../repositories/mind/mindRepository';
import { eventDispatcher } from '../../events/eventDispatcher';
import {
  LogMoodInput,
  LogEnergyInput,
  LogStressInput,
  LogFocusInput,
  CreateJournalInput,
  UpdateJournalInput,
  LogMeditationInput,
  MoodDTO,
  EnergyDTO,
  StressDTO,
  FocusDTO,
  JournalDTO,
  MeditationDTO,
  MindSummaryDTO,
} from '../../types/mind';
import { NotFoundError } from '../../errors/AppError';

export class MindService {
  // MOOD
  async logMood(input: LogMoodInput): Promise<MoodDTO> {
    const id = `m_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const dateStr = input.logDate || new Date().toISOString().split('T')[0];

    const record = await mindRepository.logMood({
      id,
      user_id: input.userId,
      mood: input.mood,
      icon: input.icon || '🙂',
      notes: input.notes || null,
      log_date: dateStr,
    });

    const dto = mindRepository.toMoodDTO(record);

    await eventDispatcher.publish({
      userId: input.userId,
      module: 'mind',
      eventType: 'MOOD_LOGGED',
      title: `Logged Mood: ${dto.mood}`,
      icon: dto.icon,
      metadata: { moodId: dto.id, mood: dto.mood },
      scoreImpact: 10,
    });

    return dto;
  }

  async getMood(userId: string, dateStr?: string): Promise<MoodDTO | null> {
    const date = dateStr || new Date().toISOString().split('T')[0];
    const record = await mindRepository.getMoodByDate(userId, date);
    return record ? mindRepository.toMoodDTO(record) : null;
  }

  // ENERGY
  async logEnergy(input: LogEnergyInput): Promise<EnergyDTO> {
    const id = `eng_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const dateStr = input.logDate || new Date().toISOString().split('T')[0];

    const record = await mindRepository.logEnergy({
      id,
      user_id: input.userId,
      energy_level: input.energyLevel,
      log_date: dateStr,
    });

    const dto = mindRepository.toEnergyDTO(record);

    await eventDispatcher.publish({
      userId: input.userId,
      module: 'mind',
      eventType: 'ENERGY_UPDATED',
      title: `Logged Energy Level: ${dto.energyLevel}`,
      icon: '⚡',
      metadata: { energyId: dto.id, level: dto.energyLevel },
      scoreImpact: 5,
    });

    return dto;
  }

  async getEnergy(userId: string, dateStr?: string): Promise<EnergyDTO | null> {
    const date = dateStr || new Date().toISOString().split('T')[0];
    const record = await mindRepository.getEnergyByDate(userId, date);
    return record ? mindRepository.toEnergyDTO(record) : null;
  }

  // STRESS
  async logStress(input: LogStressInput): Promise<StressDTO> {
    const id = `str_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const dateStr = input.logDate || new Date().toISOString().split('T')[0];

    const record = await mindRepository.logStress({
      id,
      user_id: input.userId,
      stress_level: input.stressLevel,
      trigger_notes: input.triggerNotes || null,
      log_date: dateStr,
    });

    const dto = mindRepository.toStressDTO(record);

    await eventDispatcher.publish({
      userId: input.userId,
      module: 'mind',
      eventType: 'STRESS_UPDATED',
      title: `Recorded Stress Level: ${dto.stressLevel}/10`,
      icon: '🛡️',
      metadata: { stressId: dto.id, level: dto.stressLevel },
      scoreImpact: dto.stressLevel <= 4 ? 10 : 5,
    });

    return dto;
  }

  async getStress(userId: string, dateStr?: string): Promise<StressDTO | null> {
    const date = dateStr || new Date().toISOString().split('T')[0];
    const record = await mindRepository.getStressByDate(userId, date);
    return record ? mindRepository.toStressDTO(record) : null;
  }

  // FOCUS
  async logFocus(input: LogFocusInput): Promise<FocusDTO> {
    const id = `foc_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const dateStr = input.logDate || new Date().toISOString().split('T')[0];

    const record = await mindRepository.logFocus({
      id,
      user_id: input.userId,
      focus_score: input.focusScore,
      notes: input.notes || null,
      log_date: dateStr,
    });

    const dto = mindRepository.toFocusDTO(record);

    await eventDispatcher.publish({
      userId: input.userId,
      module: 'mind',
      eventType: 'FOCUS_UPDATED',
      title: `Logged Focus Clarity: ${dto.focusScore}/10`,
      icon: '🎯',
      metadata: { focusId: dto.id, score: dto.focusScore },
      scoreImpact: dto.focusScore >= 7 ? 15 : 5,
    });

    return dto;
  }

  async getFocus(userId: string, dateStr?: string): Promise<FocusDTO | null> {
    const date = dateStr || new Date().toISOString().split('T')[0];
    const record = await mindRepository.getFocusByDate(userId, date);
    return record ? mindRepository.toFocusDTO(record) : null;
  }

  // JOURNAL (PRIVACY: Content is confidential and excluded from audit logs)
  async getJournals(userId: string, search?: string): Promise<JournalDTO[]> {
    const records = await mindRepository.findJournals(userId, search);
    return records.map((r) => mindRepository.toJournalDTO(r));
  }

  async getJournalById(id: string, userId: string): Promise<JournalDTO> {
    const record = await mindRepository.findJournalById(id);
    if (!record || record.user_id !== userId) {
      throw new NotFoundError(`Journal entry with ID ${id} not found`);
    }
    return mindRepository.toJournalDTO(record);
  }

  async createJournal(input: CreateJournalInput): Promise<JournalDTO> {
    const id = `j_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

    const record = await mindRepository.createJournal({
      id,
      user_id: input.userId,
      title: input.title,
      content: input.content,
      mood_tag: input.moodTag || 'neutral',
    });

    const dto = mindRepository.toJournalDTO(record);

    // Event metadata strictly excludes journal content for user privacy
    await eventDispatcher.publish({
      userId: input.userId,
      module: 'mind',
      eventType: 'JOURNAL_CREATED',
      title: `Journal Reflection Logged: "${dto.title}"`,
      icon: '📖',
      metadata: { journalId: id, title: dto.title, moodTag: dto.moodTag },
      scoreImpact: 10,
    });

    return dto;
  }

  async updateJournal(id: string, userId: string, updates: UpdateJournalInput): Promise<JournalDTO> {
    await this.getJournalById(id, userId);

    const updated = await mindRepository.updateJournal(id, {
      title: updates.title,
      content: updates.content,
      mood_tag: updates.moodTag,
    });

    return mindRepository.toJournalDTO(updated!);
  }

  async deleteJournal(id: string, userId: string): Promise<boolean> {
    await this.getJournalById(id, userId);
    return mindRepository.deleteJournal(id);
  }

  // MEDITATION
  async logMeditation(input: LogMeditationInput): Promise<MeditationDTO> {
    const id = `med_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const dateStr = input.logDate || new Date().toISOString().split('T')[0];

    const record = await mindRepository.logMeditation({
      id,
      user_id: input.userId,
      title: input.title || 'Mindfulness Meditation',
      duration_minutes: input.durationMinutes ?? 10,
      type: input.type || 'mindfulness',
      completed: 1,
      notes: input.notes || null,
      log_date: dateStr,
    });

    const dto = mindRepository.toMeditationDTO(record);

    await eventDispatcher.publish({
      userId: input.userId,
      module: 'mind',
      eventType: 'MEDITATION_COMPLETED',
      title: `Completed Meditation: ${dto.title} (${dto.durationMinutes}m)`,
      icon: '🧠',
      metadata: { meditationId: dto.id, duration: dto.durationMinutes, type: dto.type },
      scoreImpact: Math.min(20, Math.ceil(dto.durationMinutes / 2)),
    });

    return dto;
  }

  async getMeditations(userId: string, dateStr?: string): Promise<MeditationDTO[]> {
    const date = dateStr || new Date().toISOString().split('T')[0];
    const records = await mindRepository.getMeditationsByDate(userId, date);
    return records.map((r) => mindRepository.toMeditationDTO(r));
  }

  // DAILY SUMMARY
  async getDailySummary(userId: string, dateStr?: string): Promise<MindSummaryDTO> {
    const date = dateStr || new Date().toISOString().split('T')[0];

    const moodRecord = await mindRepository.getMoodByDate(userId, date);
    const energyRecord = await mindRepository.getEnergyByDate(userId, date);
    const stressRecord = await mindRepository.getStressByDate(userId, date);
    const focusRecord = await mindRepository.getFocusByDate(userId, date);
    const meditations = await mindRepository.getMeditationsByDate(userId, date);
    const journals = await mindRepository.findJournals(userId);

    const totalMeditationMins = meditations.reduce((acc, m) => acc + (m.duration_minutes || 0), 0);
    const todayJournals = journals.filter((j) => (j.created_at || '').startsWith(date));

    return {
      userId,
      date,
      mood: {
        logged: Boolean(moodRecord),
        currentMood: moodRecord ? moodRecord.mood : null,
        icon: moodRecord ? moodRecord.icon || '🙂' : null,
      },
      energy: {
        logged: Boolean(energyRecord),
        level: energyRecord ? energyRecord.energy_level : null,
      },
      stress: {
        logged: Boolean(stressRecord),
        level: stressRecord ? stressRecord.stress_level : null,
      },
      focus: {
        logged: Boolean(focusRecord),
        score: focusRecord ? focusRecord.focus_score : null,
      },
      meditation: {
        totalMinutes: totalMeditationMins,
        sessionsCount: meditations.length,
      },
      journal: {
        todayEntriesCount: todayJournals.length,
      },
    };
  }
}

export const mindService = new MindService();
