export interface AnalyticsMockData {
  timeframe: 'Today' | 'This Week' | 'This Month' | '90 Days';
  highlights: {
    bestDay: string;
    bestDayScore: number;
    bestCategory: string;
    bestCategoryScore: number;
    needsAttention: string;
    needsAttentionScore: number;
    longestStreak: number;
  };
  comparisons: {
    todayVsYesterday: { score: number; change: string; positive: boolean };
    thisWeekVsLastWeek: { score: number; change: string; positive: boolean };
    thisMonthVsLastMonth: { score: number; change: string; positive: boolean };
  };
  overallTrend: Array<{
    date: string;
    overall: number;
    discipline: number;
    body: number;
    mind: number;
    nutrition: number;
    goals: number;
  }>;
}

export const mockAnalyticsData: AnalyticsMockData = {
  timeframe: "This Month",
  highlights: {
    bestDay: "Tuesday, Jul 22",
    bestDayScore: 92,
    bestCategory: "Discipline",
    bestCategoryScore: 86,
    needsAttention: "Nutrition",
    needsAttentionScore: 68,
    longestStreak: 21,
  },
  comparisons: {
    todayVsYesterday: { score: 82, change: "+6 points vs yesterday (76)", positive: true },
    thisWeekVsLastWeek: { score: 78, change: "+7 points vs last week (71)", positive: true },
    thisMonthVsLastMonth: { score: 74, change: "+6 points vs last month (68)", positive: true },
  },
  overallTrend: [
    { date: "Week 1", overall: 68, discipline: 72, body: 65, mind: 70, nutrition: 60, goals: 65 },
    { date: "Week 2", overall: 72, discipline: 78, body: 68, mind: 74, nutrition: 64, goals: 70 },
    { date: "Week 3", overall: 75, discipline: 82, body: 70, mind: 78, nutrition: 65, goals: 72 },
    { date: "Week 4", overall: 78, discipline: 86, body: 72, mind: 81, nutrition: 68, goals: 76 },
  ]
};
