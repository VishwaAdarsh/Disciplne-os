/**
 * Goals Module Domain Types & DTOs (SPR-311 / ARCH-002)
 */

export const GOAL_CATEGORIES = [
  'Discipline',
  'Body',
  'Nutrition',
  'Mind',
  'General',
  'Career',
  'Study',
  'Fitness',
  'Finance',
  'Personal',
  'Learning',
  'Custom',
] as const;
export type GoalCategory = (typeof GOAL_CATEGORIES)[number];

export const GOAL_STATUSES = [
  'Not Started',
  'In Progress',
  'Completed',
  'Paused',
  'Cancelled',
  'Active',
  'Planning',
  'Archived',
] as const;
export type GoalStatus = (typeof GOAL_STATUSES)[number];

export const GOAL_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'] as const;
export type GoalPriority = (typeof GOAL_PRIORITIES)[number];

export const GOAL_TYPES = ['numeric', 'percentage', 'task_based', 'manual'] as const;
export type GoalType = (typeof GOAL_TYPES)[number];

export interface GoalRecord {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  category: string;
  goal_type: string;
  target_value?: number | null;
  current_value?: number | null;
  unit?: string | null;
  color: string;
  priority: string;
  status: string;
  progress_percent: number;
  start_date?: string | null;
  deadline?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface GoalMilestoneRecord {
  id: string;
  goal_id: string;
  user_id: string;
  title: string;
  completed: number; // 0 or 1 in sqlite
  due_date?: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface CreateGoalInput {
  userId: string;
  title: string;
  description?: string;
  category?: GoalCategory;
  goalType?: GoalType;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  color?: string;
  priority?: GoalPriority;
  status?: GoalStatus;
  startDate?: string;
  deadline?: string;
  notes?: string;
  milestones?: Array<{ title: string; dueDate?: string }>;
}

export interface UpdateGoalInput {
  title?: string;
  description?: string;
  category?: GoalCategory;
  goalType?: GoalType;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  color?: string;
  priority?: GoalPriority;
  status?: GoalStatus;
  progressPercent?: number;
  startDate?: string;
  deadline?: string;
  notes?: string;
}

export interface GoalMilestoneDTO {
  id: string;
  goalId: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  orderIndex: number;
  createdAt: string;
}

export interface GoalDTO {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: string;
  goalType: string;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  color: string;
  priority: string;
  status: string;
  progressPercent: number;
  startDate?: string;
  deadline?: string;
  notes?: string;
  milestones: GoalMilestoneDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface GoalsSummaryDTO {
  totalGoals: number;
  activeCount: number;
  completedCount: number;
  pausedCount: number;
  overdueCount: number;
  overallProgressPercent: number;
  categoriesBreakdown: Record<string, number>;
}
