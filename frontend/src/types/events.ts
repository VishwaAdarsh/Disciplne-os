export type EventModule = 'discipline' | 'body' | 'mind' | 'nutrition' | 'goals' | 'system';

export type EventType =
  // Discipline
  | 'TASK_CREATED'
  | 'TASK_UPDATED'
  | 'TASK_COMPLETED'
  | 'TASK_DELETED'
  | 'DEEP_WORK_STARTED'
  | 'DEEP_WORK_FINISHED'
  | 'HABIT_COMPLETED'
  // Body
  | 'WORKOUT_STARTED'
  | 'WORKOUT_COMPLETED'
  | 'WATER_LOGGED'
  | 'STEPS_UPDATED'
  | 'SLEEP_ADDED'
  | 'WEIGHT_UPDATED'
  // Mind
  | 'MOOD_LOGGED'
  | 'FOCUS_UPDATED'
  | 'JOURNAL_SAVED'
  | 'MEDITATION_STARTED'
  | 'MEDITATION_COMPLETED'
  // Nutrition
  | 'MEAL_ADDED'
  | 'WATER_ADDED'
  | 'NUTRITION_GOAL_COMPLETED'
  // Goals
  | 'GOAL_CREATED'
  | 'MILESTONE_COMPLETED'
  | 'GOAL_COMPLETED'
  | 'GOAL_PAUSED'
  | 'GOAL_ARCHIVED'
  // System / General
  | 'SCORE_RECALCULATED'
  | 'STREAK_PROTECTED'
  | 'LEVEL_UP';

export type EventSource = 'user' | 'system' | 'wearable' | 'automation';
export type EventStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface SystemEvent<TPayload = Record<string, any>> {
  eventId: string;
  userId: string;
  module: EventModule;
  eventType: EventType;
  timestamp: string; // ISO string
  unixTimestamp: number;
  payload: TPayload;
  source: EventSource;
  status: EventStatus;
  title: string;
  description?: string;
  icon?: string;
  scoreImpact?: number;
}

export type LiveSessionType = 'deepwork' | 'workout' | 'meditation' | 'walking' | 'running';
export type LiveSessionStatus = 'idle' | 'running' | 'paused' | 'finished' | 'saved';

export interface LiveSession {
  id: string;
  type: LiveSessionType;
  module: EventModule;
  status: LiveSessionStatus;
  sessionName: string;
  startTime: number; // Unix timestamp in ms
  pausedTime?: number; // Unix timestamp when paused
  pausedTotalMs: number; // Cumulative paused time in ms
  targetMinutes: number;
  breaksCount: number;
  payload?: Record<string, any>;
}

export interface TimelineFilterOptions {
  timeframe: 'today' | 'yesterday' | 'week' | 'month' | 'all';
  module: EventModule | 'all';
  searchQuery: string;
}

export interface EventNotification {
  id: string;
  eventId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'achievement';
  timestamp: string;
  read: boolean;
  scoreChange?: number;
}
