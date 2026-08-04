/**
 * Discipline Module Domain Types & DTOs (SPR-307)
 */

export const TASK_CATEGORIES = [
  'Study',
  'Work',
  'Fitness',
  'Health',
  'Personal',
  'Finance',
  'Custom',
] as const;

export type TaskCategoryType = (typeof TASK_CATEGORIES)[number] | (string & {});

export const TASK_PRIORITIES = ['low', 'medium', 'high', 'critical'] as const;
export type TaskPriorityType = (typeof TASK_PRIORITIES)[number];

export const HABIT_FREQUENCIES = ['daily', 'weekdays', 'weekly', 'monthly', 'custom'] as const;
export type HabitFrequencyType = (typeof HABIT_FREQUENCIES)[number];

export interface TaskRecord {
  id: string;
  user_id: string;
  goal_id?: string | null;
  name: string;
  description?: string | null;
  type?: string;
  category: string;
  priority: string;
  estimated_minutes: number;
  due_date?: string | null;
  time_target?: string | null;
  why?: string | null;
  status: string;
  tags?: string;
  notes?: string | null;
  is_active: number;
  is_archived: number;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface HabitRecord {
  id: string;
  user_id: string;
  habit_name: string;
  description?: string | null;
  category: string;
  frequency: string;
  target_days_per_week: number;
  streak: number;
  completion_rate: number;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface TaskHistoryRecord {
  id: string;
  user_id: string;
  task_id: string;
  action: 'created' | 'updated' | 'completed' | 'deleted' | 'archived' | 'restored';
  details_json: string;
  created_at: string;
}

export interface CreateTaskInput {
  userId: string;
  title: string;
  description?: string;
  category?: TaskCategoryType;
  priority?: TaskPriorityType;
  estimatedMinutes?: number;
  dueDate?: string;
  tags?: string[];
  notes?: string;
  goalId?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  category?: TaskCategoryType;
  priority?: TaskPriorityType;
  estimatedMinutes?: number;
  dueDate?: string;
  status?: 'pending' | 'completed' | 'archived';
  tags?: string[];
  notes?: string;
  isArchived?: boolean;
}

export interface CreateHabitInput {
  userId: string;
  habitName: string;
  description?: string;
  category?: string;
  frequency?: HabitFrequencyType;
  targetDaysPerWeek?: number;
}

export interface UpdateHabitInput {
  habitName?: string;
  description?: string;
  category?: string;
  frequency?: HabitFrequencyType;
  targetDaysPerWeek?: number;
  status?: string;
}

export interface TaskFilter {
  userId?: string;
  search?: string;
  category?: string;
  priority?: string;
  status?: string;
  isArchived?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface TaskDTO {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  category: string;
  priority: string;
  estimatedMinutes: number;
  dueDate?: string | null;
  status: string;
  tags: string[];
  notes?: string | null;
  isArchived: boolean;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HabitDTO {
  id: string;
  userId: string;
  habitName: string;
  description?: string | null;
  category: string;
  frequency: string;
  targetDaysPerWeek: number;
  streak: number;
  completionRate: number;
  status: string;
  createdAt: string;
}
