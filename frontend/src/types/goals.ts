export type GoalCategory =
  | 'Study'
  | 'Career'
  | 'Fitness'
  | 'Finance'
  | 'Personal'
  | 'Learning'
  | 'Custom';

export type GoalStatus = 'Planning' | 'Active' | 'Paused' | 'Completed' | 'Archived';

export type GoalPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface GoalMilestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  notes?: string;
}

export interface LinkedTask {
  id: string;
  name: string;
  engineSource: 'discipline' | 'body' | 'mind' | 'nutrition';
}

export interface GoalItem {
  id: string;
  title: string;
  description?: string;
  category: GoalCategory;
  customCategoryName?: string;
  icon?: string;
  color?: string;
  startDate: string;
  deadline: string;
  priority: GoalPriority;
  status: GoalStatus;
  progressPercent: number;
  targetValue?: string;
  milestones: GoalMilestone[];
  linkedTasks: LinkedTask[];
  notes?: string;
  createdAt: string;
}

export interface GoalRuleInsight {
  id: string;
  title: string;
  description: string;
  category: 'speed' | 'risk' | 'milestone' | 'deadline';
  icon: string;
}

export interface GoalActivityEvent {
  id: string;
  type:
    | 'GOAL_CREATED'
    | 'MILESTONE_COMPLETED'
    | 'GOAL_COMPLETED'
    | 'GOAL_PAUSED'
    | 'GOAL_RESUMED'
    | 'GOAL_ARCHIVED';
  title: string;
  subtext: string;
  timestamp: string;
  icon: string;
}

export interface GoalScoreBreakdown {
  progressAvgScore: number;
  milestoneVelocityScore: number;
  deadlineHealthScore: number;
  consistencyScore: number;
  totalScore: number;
}
