/**
 * Frontend Discipline Domain Types (SPR-307)
 */

export type TaskCategory =
  | 'Study'
  | 'Work'
  | 'Fitness'
  | 'Health'
  | 'Personal'
  | 'Finance'
  | 'Custom'
  | 'nonneg'
  | 'habit'
  | 'goal';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatusFilter = 'all' | 'pending' | 'completed' | 'overdue' | 'upcoming' | 'archived';

export interface DisciplineTask {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  estimatedMinutes: number;
  timeSchedule?: string; // e.g. "06:00 AM" or ISO string
  dueDate?: string;
  goalId?: string;
  goalTitle?: string;
  icon?: string;
  color?: string;
  completed: boolean;
  skipped?: boolean;
  skipReason?: string;
  isArchived?: boolean;
  streak: number;
  xpReward: number;
  createdAt: string;
  completedAt?: string;
  tags?: string[];
  notes?: string;
}

export interface DisciplineHabit {
  id: string;
  habitName: string;
  description?: string;
  category: string;
  frequency: 'daily' | 'weekdays' | 'weekly' | 'monthly' | 'custom';
  targetDaysPerWeek: number;
  streak: number;
  completionRate: number;
  status: 'active' | 'paused' | 'archived';
  createdAt: string;
}

export interface LevelInfo {
  level: number;
  rankTitle: 'Explorer' | 'Operator' | 'Builder' | 'Performer' | 'Elite';
  currentXp: number;
  targetXp: number;
  prevLevelXp: number;
}

export interface DeepWorkSessionState {
  status: 'idle' | 'running' | 'paused' | 'completed';
  elapsedSeconds: number;
  targetMinutes: number;
  sessionName: string;
  breaksCount: number;
  dailyTotalSeconds: number;
}

export interface DisciplineAnalyticsData {
  completionRate: number;
  disciplineScore: number;
  weeklyConsistency: number;
  totalFocusHours: number;
  currentStreak: number;
  bestStreak: number;
  missedTasksCount: number;
  heatmapData: Array<{ date: string; rate: number; count: number }>;
  weeklyFocusTrend: Array<{ day: string; hours: number }>;
}
