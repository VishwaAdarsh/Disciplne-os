import { create } from 'zustand';
import { overviewApi } from '../services/overview/overviewApi';
import type { DailyOverviewDTO, OverviewDashboardData } from '../types/overview';
import { usePerformanceEngineStore } from './performanceEngineStore';

export type EventType =
  | 'TASK_COMPLETED'
  | 'WORKOUT_COMPLETED'
  | 'STEPS_LOGGED'
  | 'WATER_LOGGED'
  | 'MEAL_LOGGED'
  | 'MOOD_LOGGED'
  | 'JOURNAL_SAVED'
  | 'GOAL_UPDATED'
  | 'REFLECTION_SAVED'
  | 'SESSION_FINISHED';

export interface ModuleEvent {
  id: string;
  type: EventType;
  timestamp: string;
  title: string;
  category: 'discipline' | 'body' | 'mind' | 'nutrition' | 'goals';
  icon: string;
}

const initialCleanOverviewData: OverviewDashboardData = {
  greeting: 'Welcome',
  user: 'Operator',
  dateStr: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
  subtitle: 'Performance Command Center - Real-Time aggregated state',
  comparisons: {
    today: 0,
    todayTrend: '0%',
    thisWeek: 0,
    thisWeekTrend: '0%',
    thisMonth: 0,
    thisMonthTrend: '0%',
    yesterday: 0,
    lastWeek: 0,
    lastMonth: 0,
  },
  categoryScores: {
    discipline: 0,
    body: 0,
    mind: 0,
    nutrition: 0,
    goals: 0,
  },
  kpis: {
    disciplineScore: 0,
    maxDisciplineScore: 1000,
    scoreTier: 'BUILDING',
    scoreChangeThisWeek: 0,
    currentStreak: 0,
    longestStreak: 0,
    operatorLevel: 1,
    currentXp: 0,
    targetXp: 250,
    nonnegDone: 0,
    nonnegTotal: 0,
  },
  liveActivity: {
    hasActiveSession: false,
    activeTask: '',
    elapsedSeconds: 0,
    startTime: '',
    isPaused: false,
    recentActivities: [],
  },
  nonNegotiables: [],
  history30Days: [],
  insights: [],
  weeklyPreview: {
    performance: 0,
    goalCompletion: 0,
    currentStreak: 0,
    reflectionStatus: 'Pending Sunday',
  },
};

interface OverviewState {
  overview: DailyOverviewDTO | null;
  data: OverviewDashboardData;
  isLoading: boolean;
  error: string | null;
  activeTimeframe: '7D' | '30D' | '90D';
  insightIndex: number;

  // Actions
  setTimeframe: (timeframe: '7D' | '30D' | '90D') => void;
  nextInsight: () => void;
  prevInsight: () => void;
  setInsightIndex: (index: number) => void;
  pushEvent: (event: Omit<ModuleEvent, 'id' | 'timestamp'>) => void;
  refreshOverview: () => Promise<void>;
  toggleFocusSession: () => void;
}

export const useOverviewStore = create<OverviewState>((set, get) => ({
  overview: null,
  data: initialCleanOverviewData,
  isLoading: false,
  error: null,
  activeTimeframe: '30D',
  insightIndex: 0,

  setTimeframe: (activeTimeframe) => set({ activeTimeframe }),

  nextInsight: () => {
    const { insightIndex, data } = get();
    if (!data.insights || data.insights.length === 0) return;
    const next = (insightIndex + 1) % data.insights.length;
    set({ insightIndex: next });
  },

  prevInsight: () => {
    const { insightIndex, data } = get();
    if (!data.insights || data.insights.length === 0) return;
    const prev = (insightIndex - 1 + data.insights.length) % data.insights.length;
    set({ insightIndex: prev });
  },

  setInsightIndex: (insightIndex) => set({ insightIndex }),

  pushEvent: (eventData) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newActivity = {
      id: `evt-${Date.now()}`,
      time: timeStr,
      icon: eventData.icon,
      text: eventData.title,
      category: eventData.category,
    };

    set((state) => ({
      data: {
        ...state.data,
        liveActivity: {
          ...state.data.liveActivity,
          recentActivities: [newActivity, ...state.data.liveActivity.recentActivities],
        },
      },
    }));
  },

  refreshOverview: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await overviewApi.getDailyOverview();

      // Transform backend recent activities for LiveActivityCard
      const recentActivities = (res.recentActivity || []).map((a) => ({
        id: a.id,
        time: a.timeFormatted,
        icon: a.icon,
        text: a.title,
        category: (a.module as 'discipline' | 'body' | 'mind' | 'nutrition' | 'goals') || 'discipline',
      }));

      // Transform pending tasks for nonNegotiables display
      const pendingAsNonnegs = (res.discipline.pendingTasks || []).map((t) => ({
        id: t.id,
        title: t.title,
        time: `${t.estimatedMinutes}m`,
        streakDays: res.discipline.currentStreak,
        completed: false,
      }));

      // Keep legacy data object in sync with real values
      const updatedData: OverviewDashboardData = {
        ...get().data,
        user: res.user.name || 'Operator',
        greeting: res.greeting,
        dateStr: res.dateFormatted,
        subtitle: res.subtitle,
        categoryScores: {
          discipline: res.performance.moduleScores.discipline,
          body: res.performance.moduleScores.body,
          mind: res.performance.moduleScores.mind,
          nutrition: res.performance.moduleScores.nutrition,
          goals: res.performance.moduleScores.goals,
        },
        kpis: {
          ...get().data.kpis,
          disciplineScore: res.performance.score,
          currentStreak: res.discipline.currentStreak,
          longestStreak: res.discipline.longestStreak,
          scoreTier: res.performance.level.toUpperCase(),
          scoreChangeThisWeek: res.performance.dailyChange,
          nonnegDone: res.discipline.tasksCompletedToday,
          nonnegTotal: res.discipline.tasksTotalToday,
        },
        nonNegotiables: pendingAsNonnegs,
        history30Days: res.history30Days || [],
        liveActivity: {
          ...get().data.liveActivity,
          recentActivities: recentActivities,
        },
      };

      // Sync performance engine store with real values
      usePerformanceEngineStore.setState((prev) => ({
        performanceScore: res.performance.score,
        highestScore: res.performance.highestScore,
        dailyChange: res.performance.dailyChange,
        moduleScores: res.performance.moduleScores,
        levelInfo: prev.evaluateLevel(res.performance.score),
        recommendations: prev.evaluateRecommendations(res.performance.moduleScores),
        achievements: prev.evaluateAchievements(res.performance.score, res.performance.moduleScores),
      }));

      set({
        overview: res,
        data: updatedData,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      set({
        error: err.message || 'Unable to refresh dashboard. Please retry.',
        isLoading: false,
      });
    }
  },

  toggleFocusSession: () => {
    set((state) => {
      const isPaused = !state.data.liveActivity.isPaused;
      return {
        data: {
          ...state.data,
          liveActivity: {
            ...state.data.liveActivity,
            isPaused,
          },
        },
      };
    });
  },
}));
