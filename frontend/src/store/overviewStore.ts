import { create } from 'zustand';
import { mockOverviewData, type OverviewMockData } from '../mock/dashboardData';
import { overviewApi } from '../services/overview/overviewApi';
import type { DailyOverviewDTO } from '../types/overview';
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

interface OverviewState {
  overview: DailyOverviewDTO | null;
  data: OverviewMockData;
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
  data: mockOverviewData,
  isLoading: false,
  error: null,
  activeTimeframe: '30D',
  insightIndex: 0,

  setTimeframe: (activeTimeframe) => set({ activeTimeframe }),

  nextInsight: () => {
    const { insightIndex, data } = get();
    const next = (insightIndex + 1) % data.insights.length;
    set({ insightIndex: next });
  },

  prevInsight: () => {
    const { insightIndex, data } = get();
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
      const updatedData: OverviewMockData = {
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
        nonNegotiables: pendingAsNonnegs.length > 0 ? pendingAsNonnegs : get().data.nonNegotiables,
        history30Days: res.history30Days && res.history30Days.length > 0 ? res.history30Days : get().data.history30Days,
        liveActivity: {
          ...get().data.liveActivity,
          recentActivities: recentActivities.length > 0 ? recentActivities : get().data.liveActivity.recentActivities,
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
