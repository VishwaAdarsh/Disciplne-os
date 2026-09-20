/**
 * Frontend Reports & Data Export Types (SPR-317)
 */

export type ReportPeriod = 'today' | '7d' | '30d' | '90d' | 'custom';
export type ReportCategory = 'overall' | 'discipline' | 'body' | 'mind' | 'nutrition' | 'goals';
export type CSVDataset = 'all' | 'discipline' | 'body' | 'mind' | 'nutrition' | 'goals' | 'performance';

export interface ReportHighlight {
  title: string;
  desc: string;
  type: 'success' | 'warning' | 'info';
}

export interface ReportUserDTO {
  id: string;
  name: string;
  email: string;
}

export interface ReportPerformanceDTO {
  score: number;
  level: number;
  status: string;
  trend: string;
  scoreHistory: Array<{ date: string; score: number }>;
}

export interface ReportDisciplineDTO {
  tasksCreated: number;
  tasksCompleted: number;
  completionRate: number;
  activeHabits: number;
  habitConsistencyRate: number;
  currentStreak: number;
  longestStreak: number;
}

export interface ReportBodyDTO {
  workoutsCount: number;
  workoutMinutes: number;
  caloriesBurned: number;
  avgSleepHours: number;
  avgSleepQuality: number;
  avgWaterLiters: number;
  avgSteps: number;
  latestWeightKg: number | null;
  weightChangeKg: number | null;
}

export interface ReportMindDTO {
  dominantMood: string;
  moodCount: number;
  avgStress: number | null;
  avgFocus: number | null;
  meditationSessions: number;
  meditationMinutes: number;
  journalEntriesCount: number;
}

export interface ReportNutritionDTO {
  avgCalories: number;
  targetCalories: number;
  avgProtein: number;
  avgCarbs: number;
  avgFat: number;
  adherenceRate: number;
  mealsLogged: number;
}

export interface ReportGoalsDTO {
  goalsCreated: number;
  goalsCompleted: number;
  activeGoals: number;
  overdueGoals: number;
  avgProgressPercent: number;
  milestonesCount: number;
}

export interface ReportSummaryDTO {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  daysCount: number;
  category: ReportCategory;
  generatedAt: string;
  user: ReportUserDTO;
  performance: ReportPerformanceDTO;
  discipline: ReportDisciplineDTO;
  body: ReportBodyDTO;
  mind: ReportMindDTO;
  nutrition: ReportNutritionDTO;
  goals: ReportGoalsDTO;
  highlights: ReportHighlight[];
}
