export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export interface MoodOption {
  level: MoodLevel;
  label: string;
  emoji: string;
  color: string;
}

export type MeditationType = 'guided' | 'silent' | 'breathing';

export interface MeditationSession {
  id: string;
  title: string;
  type: MeditationType;
  durationMinutes: number;
  dateStr: string;
  timestamp: string;
}

export interface ActiveMeditationSession {
  title: string;
  type: MeditationType;
  status: 'idle' | 'running' | 'paused';
  elapsedSeconds: number;
  targetMinutes: number;
  startTime: number | null;
}

export interface JournalEntry {
  id: string;
  title: string;
  reflection: string;
  wentWell?: string;
  challenged?: string;
  improveTomorrow?: string;
  moodTag?: string;
  emoji?: string;
  dateStr: string;
  timestamp: string;
}

export interface MindCheckIn {
  mood: MoodLevel;
  moodLabel: string;
  moodNote?: string;
  focus: number; // 1-10
  energy: number; // 1-10
  stress: number; // 1-10
  timestamp: string;
  completed: boolean;
}

export interface MindRuleInsight {
  id: string;
  title: string;
  description: string;
  category: 'focus' | 'mood' | 'stress' | 'meditation' | 'journal';
  icon: string;
}

export interface MindActivityEvent {
  id: string;
  type:
    | 'MOOD_LOGGED'
    | 'FOCUS_UPDATED'
    | 'STRESS_UPDATED'
    | 'MEDITATION_COMPLETED'
    | 'JOURNAL_WRITTEN'
    | 'MIND_CHECKIN_COMPLETED';
  title: string;
  subtext: string;
  timestamp: string;
  icon: string;
}

export interface MindScoreBreakdown {
  moodScore: number;
  focusScore: number;
  energyScore: number;
  stressScore: number;
  meditationScore: number;
  journalScore: number;
  totalScore: number;
}

// ── API DTOs (used by mindApi service) ──────────────────────────────

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
