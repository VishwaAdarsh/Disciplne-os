export type TaskCategory = 'nonneg' | 'habit' | 'goal';
export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatusFilter = 'all' | 'completed' | 'missed' | 'skipped' | 'active';

export interface DisciplineTask {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  estimatedMinutes: number;
  timeSchedule: string; // e.g. "06:00 AM"
  goalId?: string;
  goalTitle?: string;
  icon: string;
  color: string;
  completed: boolean;
  skipped: boolean;
  skipReason?: string;
  streak: number;
  xpReward: number; // e.g. 10 (Easy), 20 (Medium), 40 (Hard)
  createdAt: string;
  completedAt?: string;
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
  completionRate: number; // 0-100
  disciplineScore: number; // 0-100
  weeklyConsistency: number; // 0-100
  totalFocusHours: number;
  currentStreak: number;
  bestStreak: number;
  missedTasksCount: number;
  heatmapData: Array<{ date: string; rate: number; count: number }>;
  weeklyFocusTrend: Array<{ day: string; hours: number }>;
}
