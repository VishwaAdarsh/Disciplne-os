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
}

export const mockOverviewData: OverviewMockData = {
  greeting: "Good Morning",
  user: "Adarsh",
  dateStr: "Thursday, July 31",
  subtitle: "Here's how your performance is shaping up today.",
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
    activeTask: "Deep Work",
    elapsedSeconds: 5058, // 01:24:18
    startTime: "10:02 AM",
    isPaused: false,
    recentActivities: [
      { id: "1", time: "10:31 AM", icon: "💧", text: "+250 ml water", category: "nutrition" },
      { id: "2", time: "09:15 AM", icon: "✓", text: "Morning Routine completed", category: "discipline" },
      { id: "3", time: "08:42 AM", icon: "🥗", text: "Breakfast logged (420 kcal)", category: "nutrition" },
      { id: "4", time: "07:54 AM", icon: "🧠", text: "Mood check-in: Good", category: "mind" },
      { id: "5", time: "07:20 AM", icon: "💪", text: "Workout completed (45m)", category: "body" },
    ]
  },
  nonNegotiables: [
    { id: "nn-1", title: "Morning Routine", time: "6:00 AM", streakDays: 14, completed: true },
    { id: "nn-2", title: "Deep Work", time: "2 hours", streakDays: 8, completed: true },
    { id: "nn-3", title: "Study", time: "2 hours", streakDays: 11, completed: true },
    { id: "nn-4", title: "Workout", time: "30 minutes (7:00 PM)", streakDays: 5, completed: false },
  ],
  history30Days: Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    // Realistic curve climbing from ~60 to ~85 with occasional fluctuations
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
      title: "Sleep & Productivity Correlation",
      description: "Your productivity is 18% higher on days you sleep at least 7 hours.",
      impact: "+18% Output"
    },
    {
      id: "ins-2",
      category: "Insights",
      title: "Strongest Habit Anchor",
      description: "Morning routines are your strongest habit with 93% consistency over 30 days.",
      impact: "93% Consistency"
    },
    {
      id: "ins-3",
      category: "Suggestions",
      title: "Workout Frequency Drop",
      description: "Workout consistency dropped 12% this week. Aim for an earlier evening slot.",
      impact: "-12% Drop"
    },
    {
      id: "ins-4",
      category: "Tips",
      title: "Peak Performance Day",
      description: "Your highest-performing day of the week is Tuesday with an average score of 89.",
      impact: "Tuesday Peak"
    }
  ]
};
