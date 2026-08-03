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
