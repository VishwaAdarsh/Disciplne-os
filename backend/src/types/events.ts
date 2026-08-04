/**
 * Event Engine Types & Data Transfer Objects (SPR-305)
 */

export const SUPPORTED_EVENT_MODULES = [
  'discipline',
  'body',
  'mind',
  'nutrition',
  'goals',
  'system',
] as const;

export type SupportedEventModule = (typeof SUPPORTED_EVENT_MODULES)[number];
export type EventModule = SupportedEventModule | (string & {});

export const STANDARD_EVENT_TYPES = {
  TASK_COMPLETED: 'TASK_COMPLETED',
  TASK_MISSED: 'TASK_MISSED',
  HABIT_CREATED: 'HABIT_CREATED',
  HABIT_DELETED: 'HABIT_DELETED',
  WORKOUT_LOGGED: 'WORKOUT_LOGGED',
  WATER_LOGGED: 'WATER_LOGGED',
  MEDITATION_LOGGED: 'MEDITATION_LOGGED',
  SLEEP_LOGGED: 'SLEEP_LOGGED',
  GOAL_CREATED: 'GOAL_CREATED',
  GOAL_COMPLETED: 'GOAL_COMPLETED',
  GOAL_FAILED: 'GOAL_FAILED',
  REFLECTION_ADDED: 'REFLECTION_ADDED',
  AI_FEEDBACK_GENERATED: 'AI_FEEDBACK_GENERATED',
} as const;

export type StandardEventType = keyof typeof STANDARD_EVENT_TYPES;
export type EventType = StandardEventType | (string & {});

export interface EventRecord {
  id: string;
  user_id: string;
  module: string;
  event_type: string;
  title: string;
  description?: string | null;
  icon?: string;
  payload_json: string;
  score_impact?: number;
  source?: string;
  status?: string;
  created_at?: string;
}

export interface CreateEventInput {
  userId: string;
  module: EventModule;
  eventType: EventType;
  title: string;
  description?: string | null;
  icon?: string;
  metadata?: Record<string, any>;
  scoreImpact?: number;
  source?: string;
  status?: string;
  timestamp?: string;
}

export interface EventDTO {
  id: string;
  userId: string;
  module: string;
  eventType: string;
  title: string;
  description?: string | null;
  icon: string;
  metadata: Record<string, any>;
  scoreImpact: number;
  source: string;
  status: string;
  createdAt: string;
}

export interface EventFilter {
  userId?: string;
  module?: string;
  eventType?: string;
  period?: 'today' | 'week' | 'month';
  startDate?: string;
  endDate?: string;
  search?: string;
}
