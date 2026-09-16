/**
 * Analytics Domain Types & DTOs (SPR-313 / ARCH-002)
 */

export type AnalyticsTimeRange = '7d' | '30d' | '90d';

export interface PerformanceTrendPoint {
  date: string;
  dayName: string;
  overall: number;
  discipline: number;
  body: number;
  mind: number;
  nutrition: number;
  goals: number;
}

export interface PeriodComparisonMetric {
  current: number;
  previous: number;
  diff: number;
  percentChange: number;
  direction: 'up' | 'down' | 'neutral';
  available: boolean;
  label: string;
  unit: string;
}

export interface DisciplineAnalyticsDTO {
  tasksCreated: number;
  tasksCompleted: number;
  completionRate: number;
  activeHabits: number;
  habitConsistencyRate: number;
  longestStreak: number;
  currentStreak: number;
  dailyTaskCompletions: Array<{ date: string; count: number }>;
}

export interface BodyAnalyticsDTO {
  totalWorkouts: number;
  totalWorkoutMinutes: number;
  totalCaloriesBurned: number;
  avgSleepHours: number;
  avgSleepQuality: number;
  avgDailyWaterLiters: number;
  avgDailySteps: number;
  latestWeightKg: number | null;
  weightChangeKg: number | null;
  dailyWorkouts: Array<{ date: string; count: number; calories: number }>;
}

export interface MindAnalyticsDTO {
  moodDistribution: Array<{ mood: string; icon: string; count: number; percentage: number }>;
  avgStress: number | null;
  avgFocus: number | null;
  meditationSessions: number;
  meditationMinutes: number;
  journalEntriesCount: number;
}

export interface NutritionAnalyticsDTO {
  avgCalories: number;
  targetCalories: number;
  avgProtein: number;
  avgCarbs: number;
  avgFat: number;
  totalMealsLogged: number;
  targetAdherenceRate: number;
  dailyCalories: Array<{ date: string; calories: number; target: number }>;
}

export interface GoalsAnalyticsDTO {
  goalsCreated: number;
  goalsCompleted: number;
  activeGoals: number;
  overdueGoals: number;
  avgProgressPercent: number;
  categoryBreakdown: Array<{ category: string; count: number; avgProgress: number }>;
}

export interface ActivityVolumePoint {
  date: string;
  name: string;
  value: number;
}

export interface ModuleDistributionPoint {
  name: string;
  value: number;
  count: number;
  color: string;
}

export interface AnalyticsHighlightsDTO {
  bestDay: string;
  bestDayScore: number;
  bestCategory: string;
  bestCategoryScore: number;
  needsAttention: string;
  needsAttentionScore: number;
  longestStreak: number;
}

export interface AnalyticsDTO {
  range: AnalyticsTimeRange;
  startDate: string;
  endDate: string;
  daysInRange: number;

  highlights: AnalyticsHighlightsDTO;

  comparisons: {
    hasPreviousPeriodData: boolean;
    performance: PeriodComparisonMetric;
    discipline: PeriodComparisonMetric;
    workouts: PeriodComparisonMetric;
    water: PeriodComparisonMetric;
  };

  overallTrend: PerformanceTrendPoint[];
  discipline: DisciplineAnalyticsDTO;
  body: BodyAnalyticsDTO;
  mind: MindAnalyticsDTO;
  nutrition: NutritionAnalyticsDTO;
  goals: GoalsAnalyticsDTO;

  activityVolume: ActivityVolumePoint[];
  activityDistribution: ModuleDistributionPoint[];
}
