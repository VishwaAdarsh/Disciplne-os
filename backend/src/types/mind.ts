/**
 * Mind Module Domain Types & DTOs (SPR-309)
 */

export const ENERGY_LEVELS = ['Very Low', 'Low', 'Normal', 'High', 'Excellent'] as const;
export type EnergyLevelType = (typeof ENERGY_LEVELS)[number];

export interface MoodRecord {
  id: string;
  user_id: string;
  mood: string;
  icon?: string | null;
  notes?: string | null;
  log_date: string;
  created_at: string;
  updated_at: string;
}

export interface EnergyRecord {
  id: string;
  user_id: string;
  energy_level: string;
  log_date: string;
  created_at: string;
  updated_at: string;
}

export interface StressRecord {
  id: string;
  user_id: string;
  stress_level: number;
  trigger_notes?: string | null;
  log_date: string;
  created_at: string;
}

export interface FocusRecord {
  id: string;
  user_id: string;
  focus_score: number;
  notes?: string | null;
  log_date: string;
  created_at: string;
}

export interface JournalRecord {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood_tag: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface MeditationRecord {
  id: string;
  user_id: string;
  title: string;
  duration_minutes: number;
  type: string;
  completed: number;
  notes?: string | null;
  log_date: string;
  created_at: string;
}

export interface LogMoodInput {
  userId: string;
  mood: string;
  icon?: string;
  notes?: string;
  logDate?: string;
}

export interface LogEnergyInput {
  userId: string;
  energyLevel: EnergyLevelType;
  logDate?: string;
}

export interface LogStressInput {
  userId: string;
  stressLevel: number;
  triggerNotes?: string;
  logDate?: string;
}

export interface LogFocusInput {
  userId: string;
  focusScore: number;
  notes?: string;
  logDate?: string;
}

export interface CreateJournalInput {
  userId: string;
  title: string;
  content: string;
  moodTag?: string;
}

export interface UpdateJournalInput {
  title?: string;
  content?: string;
  moodTag?: string;
}

export interface LogMeditationInput {
  userId: string;
  title?: string;
  durationMinutes?: number;
  type?: 'mindfulness' | 'guided' | 'breathing' | 'un-guided';
  notes?: string;
  logDate?: string;
}

export interface MoodDTO {
  id: string;
  userId: string;
  mood: string;
  icon: string;
  notes?: string | null;
  logDate: string;
  createdAt: string;
}

export interface EnergyDTO {
  id: string;
  userId: string;
  energyLevel: string;
  logDate: string;
  createdAt: string;
}

export interface StressDTO {
  id: string;
  userId: string;
  stressLevel: number;
  triggerNotes?: string | null;
  logDate: string;
  createdAt: string;
}

export interface FocusDTO {
  id: string;
  userId: string;
  focusScore: number;
  notes?: string | null;
  logDate: string;
  createdAt: string;
}

export interface JournalDTO {
  id: string;
  userId: string;
  title: string;
  content: string;
  moodTag: string;
  createdAt: string;
  updatedAt: string;
}

export interface MeditationDTO {
  id: string;
  userId: string;
  title: string;
  durationMinutes: number;
  type: string;
  completed: boolean;
  notes?: string | null;
  logDate: string;
  createdAt: string;
}

export interface MindSummaryDTO {
  userId: string;
  date: string;
  mood: {
    logged: boolean;
    currentMood: string | null;
    icon: string | null;
  };
  energy: {
    logged: boolean;
    level: string | null;
  };
  stress: {
    logged: boolean;
    level: number | null;
  };
  focus: {
    logged: boolean;
    score: number | null;
  };
  meditation: {
    totalMinutes: number;
    sessionsCount: number;
  };
  journal: {
    todayEntriesCount: number;
  };
}
