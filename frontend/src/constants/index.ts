/**
 * Centralized Application Constants (SPR-301)
 */

export const ROUTES = {
  HOME: '/',
  DISCIPLINE: '/discipline',
  BODY: '/body',
  MIND: '/mind',
  NUTRITION: '/nutrition',
  GOALS: '/goals',
  PERFORMANCE: '/performance',
  EVENTS: '/events',
  AI: '/ai',
  SETTINGS: '/settings',
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'dos_token',
  THEME: 'dos_theme',
  ACTIVE_SESSION: 'dos_active_session',
  OFFLINE_QUEUE: 'dos_offline_queue',
  USER_PREFERENCES: 'dos_user_prefs',
} as const;

export const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

export const TASK_CATEGORIES = {
  NONNEG: 'nonneg',
  HABIT: 'habit',
  GOAL: 'goal',
} as const;

export const PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export const EVENT_NAMES = {
  TASK_COMPLETED: 'TASK_COMPLETED',
  TASK_SKIPPED: 'TASK_SKIPPED',
  WORKOUT_COMPLETED: 'WORKOUT_COMPLETED',
  WATER_LOGGED: 'WATER_LOGGED',
  MOOD_LOGGED: 'MOOD_LOGGED',
  MEAL_LOGGED: 'MEAL_LOGGED',
  GOAL_COMPLETED: 'GOAL_COMPLETED',
  PERFORMANCE_UPDATED: 'PERFORMANCE_UPDATED',
  LEVEL_UP: 'LEVEL_UP',
  ACHIEVEMENT_UNLOCKED: 'ACHIEVEMENT_UNLOCKED',
} as const;
