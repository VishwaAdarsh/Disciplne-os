import { create } from 'zustand';
import { mockOverviewData, type OverviewMockData } from '../mock/dashboardData';

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
      // Simulate network request < 1s
      await new Promise((resolve) => setTimeout(resolve, 400));
      set({ data: { ...mockOverviewData }, isLoading: false });
    } catch {
      set({ error: 'Unable to refresh dashboard. Please retry.', isLoading: false });
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
