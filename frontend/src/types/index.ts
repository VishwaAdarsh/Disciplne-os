export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Task {
  id: string;
  name: string;
  type: 'nonneg' | 'habit' | 'goal';
  timeTarget?: string;
  why?: string;
  done: boolean;
  streak: number;
  createdAt: string;
}

export interface DashboardData {
  score: number;
  tier: string;
  streak: { current: number; best: number };
  today: { done: number; total: number; rate: number };
  motivation: { message: string; type: string };
  history: { date: string; rate: number }[];
  reflectionCount: number;
}

export interface Reflection {
  id: string;
  weekStart: string;
  overallScore: number;
  nonnegScore: number;
  clarityScore: number;
  progressScore: number;
  avgScore: string;
  wentWell: string;
  brokeDown: string;
  commitment: string;
  createdAt: string;
}

export interface Settings {
  resetTime: string;
  reflectionDay: string;
  streakAlerts: boolean;
  publicScore: boolean;
  reflectReminder: boolean;
  comebackMode: boolean;
}

export * from './body';
export * from './mind';
export * from './nutrition';
export * from './goals';
export * from './performance';
export * from './events';





