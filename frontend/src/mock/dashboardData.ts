export interface ComparisonMetric {
  label: string;
  value: number;
  trend?: string;
  isUp?: boolean;
}

export interface OverviewMockData {
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

export const mockOverviewData: OverviewMockData = {
  greeting: "Good Morning",
  user: "Adarsh",
  dateStr: "Monday, 4 August",
  subtitle: "Performance Command Center - Real-Time aggregated state",
  comparisons: {
    today: 82,
    todayTrend: "↑ 6%",
    thisWeek: 78,
    thisWeekTrend: "↑ 4%",
    thisMonth: 74,
    thisMonthTrend: "↑ 9%",
    yesterday: 76,
    lastWeek: 71,
    lastMonth: 68,
  },
  categoryScores: {
    discipline: 86,
    body: 72,
    mind: 81,
    nutrition: 68,
    goals: 76,
  },
  kpis: {
    disciplineScore: 742,
    maxDisciplineScore: 1000,
    scoreTier: "BUILDING",
    scoreChangeThisWeek: 18,
    currentStreak: 12,
    longestStreak: 21,
    operatorLevel: 4,
    currentXp: 780,
    targetXp: 1000,
    nonnegDone: 3,
    nonnegTotal: 4,
  },
  liveActivity: {
    hasActiveSession: true,
    activeTask: "Deep Work",
    elapsedSeconds: 5058, // 01:24:18
    startTime: "10:02 AM",
    isPaused: false,
    recentActivities: [
      { id: "1", time: "11:32 AM", icon: "💪", text: "Workout Completed", category: "body" },
      { id: "2", time: "11:05 AM", icon: "💧", text: "Water +250ml", category: "nutrition" },
      { id: "3", time: "10:55 AM", icon: "📖", text: "Study Session Finished", category: "discipline" },
      { id: "4", time: "10:10 AM", icon: "🧠", text: "Mood Logged", category: "mind" },
      { id: "5", time: "09:40 AM", icon: "🥗", text: "Breakfast Logged", category: "nutrition" },
    ]
  },
  nonNegotiables: [
    { id: "nn-1", title: "Morning Routine", time: "6:00 AM", streakDays: 14, completed: true },
    { id: "nn-2", title: "Deep Work", time: "2 hours", streakDays: 8, completed: true },
    { id: "nn-3", title: "Workout", time: "45 mins", streakDays: 5, completed: false },
    { id: "nn-4", title: "Read", time: "30 mins", streakDays: 11, completed: false },
  ],
  history30Days: Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const baseScore = 65 + Math.floor(Math.sin(i * 0.4) * 12) + Math.floor(i * 0.6);
    return {
      day: dayName,
      date: dateStr,
      score: Math.min(95, Math.max(50, baseScore)),
      isToday: i === 29,
    };
  }),
  insights: [
    {
      id: "ins-1",
      category: "Insights",
      title: "Workout Consistency",
      description: "Workout consistency improved 18% over the past two weeks.",
      impact: "↑18% Improvement"
    },
    {
      id: "ins-2",
      category: "Insights",
      title: "Peak Focus Window",
      description: "Your focus is highest before 10 AM with 94% task completion rate.",
      impact: "Morning Peak"
    },
    {
      id: "ins-3",
      category: "Suggestions",
      title: "Nutrition Habit Alert",
      description: "You skip breakfast 3x/week. Regular morning meals stabilize focus.",
      impact: "Nutrition Gap"
    },
    {
      id: "ins-4",
      category: "Tips",
      title: "Sleep & Productivity",
      description: "Sleep above 7h improves daily discipline score by an average of 14 pts.",
      impact: "+14 Score Boost"
    },
    {
      id: "ins-5",
      category: "Insights",
      title: "Streak Milestone",
      description: "Deep Work streak reached 12 consecutive days!",
      impact: "🔥 12 Days"
    }
  ],
  weeklyPreview: {
    performance: 78,
    goalCompletion: 72,
    currentStreak: 12,
    reflectionStatus: 'Pending Sunday'
  }
};
