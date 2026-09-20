/**
 * Overview Domain Types & DTOs (SPR-312 / ARCH-002)
 */

export interface PerformanceOverviewSummary {
  score: number;
  highestScore: number;
  dailyChange: number;
  trend: 'improving' | 'declining' | 'stable';
  level: string;
  levelColor: string;
  moduleScores: {
    discipline: number;
    body: number;
    mind: number;
    nutrition: number;
    goals: number;
  };
}

export interface DisciplineOverviewSummary {
  tasksCompletedToday: number;
  tasksRemainingToday: number;
  tasksTotalToday: number;
  taskCompletionRate: number;
  habitsTotal: number;
  habitsCompletedToday: number;
  habitCompletionRate: number;
  currentStreak: number;
  longestStreak: number;
  pendingTasks: Array<{
    id: string;
    title: string;
    category: string;
    priority: string;
    estimatedMinutes: number;
  }>;
}

export interface BodyOverviewSummary {
  sleep: {
    logged: boolean;
    durationHours: number;
    qualityPercent: number;
  };
  water: {
    totalMl: number;
    currentLiters: number;
    targetLiters: number;
    progressPercent: number;
  };
  steps: {
    current: number;
    target: number;
    progressPercent: number;
  };
  workouts: {
    completedCount: number;
    totalMinutes: number;
    caloriesBurned: number;
    latestWorkoutName?: string;
  };
  weight: {
    latestKg: number | null;
    targetKg: number | null;
  };
}

export interface MindOverviewSummary {
  mood: {
    logged: boolean;
    currentMood: string | null;
    icon: string | null;
  };
  energy: {
    logged: boolean;
    level: string | null;
  };
  stress: {
    logged: boolean;
    level: number | null;
  };
  focus: {
    logged: boolean;
    score: number | null;
  };
  meditation: {
    totalMinutes: number;
    sessionsCount: number;
  };
  journal: {
    todayEntriesCount: number;
  };
}

export interface NutritionOverviewSummary {
  calories: {
    current: number;
    target: number;
    remaining: number;
    progressPercent: number;
  };
  protein: {
    current: number;
    target: number;
    remaining: number;
    progressPercent: number;
  };
  carbs: {
    current: number;
    target: number;
    remaining: number;
    progressPercent: number;
  };
  fat: {
    current: number;
    target: number;
    remaining: number;
    progressPercent: number;
  };
  mealsLogged: number;
  waterLiters: number;
}

export interface GoalsOverviewSummary {
  totalGoals: number;
  activeCount: number;
  completedCount: number;
  pausedCount: number;
  overdueCount: number;
  overallProgressPercent: number;
  approachingDeadline: Array<{
    id: string;
    title: string;
    category: string;
    deadline: string;
    daysRemaining: number;
    progressPercent: number;
  }>;
  recentlyCompleted: Array<{
    id: string;
    title: string;
    category: string;
    progressPercent: number;
  }>;
}

export interface DailyCompletionPillar {
  key: string;
  label: string;
  completed: boolean;
  detail: string;
  percentage: number;
}

export interface DailyCompletionSummary {
  overallPercentage: number;
  completedCount: number;
  totalCount: number;
  pillars: DailyCompletionPillar[];
}

export interface OverviewActivityItem {
  id: string;
  module: string;
  eventType: string;
  title: string;
  description: string;
  icon: string;
  timestamp: string;
  timeFormatted: string;
  scoreImpact: number;
}

export interface OverviewHistoryPoint {
  day: string;
  date: string;
  score: number;
  isToday?: boolean;
}

export interface DailyOverviewDTO {
  user: {
    id: string;
    name: string;
    email: string;
  };
  date: string;
  dateFormatted: string;
  greeting: string;
  subtitle: string;

  performance: PerformanceOverviewSummary;
  discipline: DisciplineOverviewSummary;
  body: BodyOverviewSummary;
  mind: MindOverviewSummary;
  nutrition: NutritionOverviewSummary;
  goals: GoalsOverviewSummary;
  dailyCompletion: DailyCompletionSummary;
  recentActivity: OverviewActivityItem[];
  history30Days: OverviewHistoryPoint[];
}

export interface ComparisonMetric {
  label: string;
  value: number;
  trend?: string;
  isUp?: boolean;
}

export interface OverviewDashboardData {
  greeting: string;
  user: string;
  dateStr: string;
  subtitle: string;
  comparisons: {
    today: number;
    todayTrend: string;
    thisWeek: number;
    thisWeekTrend: string;
    thisMonth: number;
    thisMonthTrend: string;
    yesterday: number;
    lastWeek: number;
    lastMonth: number;
  };
  categoryScores: {
    discipline: number;
    body: number;
    mind: number;
    nutrition: number;
    goals: number;
  };
  kpis: {
    disciplineScore: number;
    maxDisciplineScore: number;
    scoreTier: string;
    scoreChangeThisWeek: number;
    currentStreak: number;
    longestStreak: number;
    operatorLevel: number;
    currentXp: number;
    targetXp: number;
    nonnegDone: number;
    nonnegTotal: number;
  };
  liveActivity: {
    hasActiveSession: boolean;
    activeTask: string;
    elapsedSeconds: number;
    startTime: string;
    isPaused: boolean;
    recentActivities: Array<{
      id: string;
      time: string;
      icon: string;
      text: string;
      category: 'discipline' | 'body' | 'mind' | 'nutrition' | 'goals';
    }>;
  };
  nonNegotiables: Array<{
    id: string;
    title: string;
    time: string;
    streakDays: number;
    completed: boolean;
  }>;
  history30Days: Array<{
    day: string;
    date: string;
    score: number;
    isToday?: boolean;
  }>;
  insights: Array<{
    id: string;
    category: 'Tips' | 'Insights' | 'Suggestions';
    title: string;
    description: string;
    impact: string;
  }>;
  weeklyPreview: {
    performance: number;
    goalCompletion: number;
    currentStreak: number;
    reflectionStatus: 'Pending Sunday' | 'Completed';
  };
}

