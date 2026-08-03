import type { EventModule } from './events';

export interface DailyBriefing {
  date: string;
  greeting: string;
  userName: string;
  performancePercent: number;
  currentStreakDays: number;
  todayFocus: string[];
  topPriorityTask: string;
  estimatedActiveTime: string;
  quoteOfTheDay: {
    quote: string;
    author: string;
  };
}

export interface EveningReview {
  date: string;
  performanceScore: number;
  tasksCompleted: string; // e.g. "7/8"
  workoutStatus: string;
  waterIntakeStr: string;
  moodEmoji: string;
  tomorrowSuggestion: string;
  keyWin: string;
}

export interface WeeklyReview {
  weekRange: string;
  performanceScore: number;
  scoreChangePercent: number;
  strongestArea: EventModule;
  needsAttentionArea: EventModule;
  bestDay: string;
  longestFocusSession: string;
  recommendation: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
  contextReferenced?: {
    module?: EventModule;
    score?: number;
    goalTitle?: string;
  };
  suggestedActions?: Array<{
    label: string;
    actionType: string;
    payload?: Record<string, any>;
  }>;
}

export interface AIPattern {
  id: string;
  title: string;
  description: string;
  category: 'focus' | 'habit' | 'mood' | 'nutrition' | 'recovery';
  confidencePercent: number;
  impactScore: number; // e.g. +12 or -8
  icon: string;
}

export interface AIGoalPrediction {
  goalId: string;
  goalTitle: string;
  currentProgressPercent: number;
  predictedCompletionDate: string;
  confidencePercent: number;
  streakRisk: 'low' | 'medium' | 'high';
  keyBottleneck?: string;
  recommendation: string;
}

export interface AISmartScheduleBlock {
  id: string;
  timeSlot: string;
  taskTitle: string;
  category: EventModule;
  recommendedDurationMins: number;
  icon: string;
}

export interface AIReport {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  periodStr: string;
  overallScore: number;
  summaryMarkdown: string;
  createdAt: string;
}

export interface AIMemory {
  preferredWorkoutTime: string;
  preferredStudyTime: string;
  frequentlyMissedHabits: string[];
  coachingStyle: 'encouraging' | 'strict' | 'analytical' | 'direct';
  consentAnalytics: boolean;
}
