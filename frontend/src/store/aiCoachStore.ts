import { create } from 'zustand';
import type {
  DailyBriefing,
  EveningReview,
  WeeklyReview,
  AIChatMessage,
  AIPattern,
  AIGoalPrediction,
  AISmartScheduleBlock,
  AIReport,
  AIMemory,
  AIConversationDTO,
} from '../types/ai';

import { usePerformanceEngineStore } from './performanceEngineStore';
import { useDisciplineStore } from './disciplineStore';
import { useBodyStore } from './bodyStore';
import { useMindStore } from './mindStore';
import { useGoalsStore } from './goalsStore';
import { aiApi } from '../services/ai/aiApi';

const STORAGE_KEYS = {
  MEMORY: 'dos_ai_memory',
};

const initialChatMessages: AIChatMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'coach',
    text: "Greetings! I'm your DisciplineOS AI Coach. I analyze your live performance across Discipline, Body, Mind, Nutrition, and Goals to help you optimize your daily execution. How can I assist you today?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

const initialMemory: AIMemory = {
  preferredWorkoutTime: '07:00 AM',
  preferredStudyTime: '09:00 AM',
  frequentlyMissedHabits: ['Water Hydration', 'Evening Reflection'],
  coachingStyle: 'encouraging',
  consentAnalytics: true,
};

function loadStoredMemory(): AIMemory {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEMORY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load AI memory', err);
  }
  return initialMemory;
}

interface AICoachState {
  chatMessages: AIChatMessage[];
  conversations: AIConversationDTO[];
  activeConversationId: string | null;
  isThinking: boolean;
  error: string | null;
  lastFailedQuery: string | null;
  memory: AIMemory;
  reports: AIReport[];

  // Actions
  sendChatMessage: (userQuery: string) => Promise<void>;
  retryLastMessage: () => Promise<void>;
  startNewConversation: () => Promise<void>;
  loadConversations: () => Promise<void>;
  selectConversation: (conversationId: string) => Promise<void>;
  clearChatHistory: () => Promise<void>;

  getDailyBriefing: () => DailyBriefing;
  getEveningReview: () => EveningReview;
  getWeeklyReview: () => WeeklyReview;

  getPatterns: () => AIPattern[];
  getGoalPredictions: () => AIGoalPrediction[];
  getSmartSchedule: () => AISmartScheduleBlock[];

  generateReport: (type: 'daily' | 'weekly' | 'monthly') => AIReport;
  updateMemory: (updates: Partial<AIMemory>) => void;
}

export const useAICoachStore = create<AICoachState>((set, get) => ({
  chatMessages: initialChatMessages,
  conversations: [],
  activeConversationId: null,
  isThinking: false,
  error: null,
  lastFailedQuery: null,
  memory: loadStoredMemory(),
  reports: [],

  sendChatMessage: async (userQuery: string) => {
    const queryTrimmed = userQuery.trim();
    if (!queryTrimmed) return;

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: AIChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: queryTrimmed,
      timestamp: nowStr,
    };

    set((state) => ({
      chatMessages: [...state.chatMessages, userMsg],
      isThinking: true,
      error: null,
      lastFailedQuery: null,
    }));

    try {
      const activeId = get().activeConversationId || undefined;
      const res = await aiApi.chat(queryTrimmed, activeId);

      const coachMsg: AIChatMessage = {
        id: res.messageId || `cch-${Date.now()}`,
        sender: 'coach',
        text: res.response,
        timestamp: new Date(res.timestamp || Date.now()).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      set((state) => ({
        chatMessages: [...state.chatMessages, coachMsg],
        activeConversationId: res.conversationId,
        isThinking: false,
      }));

      // Refresh conversations list in background
      get().loadConversations();
    } catch (err: any) {
      console.error('[AICoachStore] Error in sendChatMessage:', err);
      set({
        isThinking: false,
        error: err?.message || 'Failed to connect to AI Coach. Please try again.',
        lastFailedQuery: queryTrimmed,
      });
    }
  },

  retryLastMessage: async () => {
    const lastQuery = get().lastFailedQuery;
    if (lastQuery) {
      await get().sendChatMessage(lastQuery);
    }
  },

  startNewConversation: async () => {
    try {
      set({ isThinking: true, error: null });
      const newConv = await aiApi.createConversation('New Conversation');
      set({
        activeConversationId: newConv.id,
        chatMessages: [
          {
            id: `welcome-${Date.now()}`,
            sender: 'coach',
            text: "Started a fresh conversation. What would you like to discuss or optimize today?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
        conversations: [newConv, ...get().conversations],
        isThinking: false,
      });
    } catch (err: any) {
      console.error('[AICoachStore] Failed to create new conversation:', err);
      // Fallback local reset
      set({
        activeConversationId: null,
        chatMessages: initialChatMessages,
        isThinking: false,
      });
    }
  },

  loadConversations: async () => {
    try {
      const convs = await aiApi.getConversations();
      set({ conversations: convs });
      if (!get().activeConversationId && convs.length > 0) {
        await get().selectConversation(convs[0].id);
      }
    } catch (err) {
      console.warn('[AICoachStore] Could not load conversations from server:', err);
    }
  },

  selectConversation: async (conversationId: string) => {
    try {
      set({ isThinking: true, error: null, activeConversationId: conversationId });
      const msgs = await aiApi.getMessages(conversationId);
      const formatted: AIChatMessage[] = msgs.map((m) => ({
        id: m.id,
        sender: m.sender,
        text: m.text,
        timestamp: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));

      set({
        chatMessages: formatted.length > 0 ? formatted : initialChatMessages,
        isThinking: false,
      });
    } catch (err: any) {
      console.error('[AICoachStore] Failed to load messages:', err);
      set({ isThinking: false, error: 'Failed to load conversation history' });
    }
  },

  clearChatHistory: async () => {
    const activeId = get().activeConversationId;
    if (activeId) {
      try {
        await aiApi.deleteConversation(activeId);
      } catch (err) {
        console.warn('[AICoachStore] Failed to delete conversation on server:', err);
      }
    }
    await get().startNewConversation();
  },

  getDailyBriefing: () => {
    const perfState = usePerformanceEngineStore.getState();
    const discState = useDisciplineStore.getState();
    const goalsState = useGoalsStore.getState();
    const nonnegs = discState.tasks.filter((t) => t.category === 'nonneg');
    const priorityTask = nonnegs.find((t) => !t.completed)?.title || goalsState.goals[0]?.title || 'Complete Deep Work Session';

    return {
      date: new Date().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' }),
      greeting: 'Good Morning, Adarsh 👋',
      userName: 'Adarsh',
      performancePercent: Math.round(perfState.performanceScore / 10),
      currentStreakDays: discState.analytics.currentStreak || 12,
      todayFocus: [
        'Complete Core Deep Work Block (2 hrs)',
        'Strength Training & Mobility Workout',
        'Hydrate with 3.0L Water Target',
      ],
      topPriorityTask: priorityTask,
      estimatedActiveTime: '4h 20m',
      quoteOfTheDay: {
        quote: 'Discipline is choosing between what you want now and what you want most.',
        author: 'Abraham Lincoln',
      },
    };
  },

  getEveningReview: () => {
    const perfState = usePerformanceEngineStore.getState();
    const discState = useDisciplineStore.getState();
    const bodyState = useBodyStore.getState();
    const mindState = useMindStore.getState();
    const completedTasks = discState.tasks.filter((t) => t.completed).length;

    return {
      date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
      performanceScore: Math.round(perfState.performanceScore / 10),
      tasksCompleted: `${completedTasks}/${discState.tasks.length}`,
      workoutStatus: bodyState.workout.completed ? 'Completed ✅' : 'In Progress',
      waterIntakeStr: `${bodyState.water.currentLiters}L / ${bodyState.water.targetLiters}L`,
      moodEmoji: mindState.todayCheckIn.completed ? '🙂' : '😐',
      tomorrowSuggestion: 'Sleep 30 minutes earlier to maximize tomorrow morning focus window.',
      keyWin: 'Achieved 2h+ unbroken Deep Work block and maintained non-negotiables.',
    };
  },

  getWeeklyReview: () => {
    return {
      weekRange: 'Jul 28 - Aug 3',
      performanceScore: 82,
      scoreChangePercent: 5,
      strongestArea: 'discipline',
      needsAttentionArea: 'nutrition',
      bestDay: 'Tuesday',
      longestFocusSession: '3h 42m',
      recommendation: 'Increase water intake on workout days to sustain energy during evening hours.',
    };
  },

  getPatterns: () => [
    {
      id: 'pat-1',
      title: 'Peak Focus Window Detected',
      description: 'Your highest concentration and deepest work occurs consistently before 10:30 AM.',
      category: 'focus',
      confidencePercent: 94,
      impactScore: 12,
      icon: '🌅',
    },
    {
      id: 'pat-2',
      title: 'Workout & Mood Connection',
      description: 'Completing morning workouts boosts your recorded daily mood & energy scores by +18%.',
      category: 'habit',
      confidencePercent: 89,
      impactScore: 15,
      icon: '💪',
    },
    {
      id: 'pat-3',
      title: 'Weekend Hydration Drop',
      description: 'Water intake tends to decrease by 35% on Saturdays and Sundays.',
      category: 'nutrition',
      confidencePercent: 82,
      impactScore: -8,
      icon: '💧',
    },
  ],

  getGoalPredictions: () => {
    const goalsState = useGoalsStore.getState();

    return goalsState.goals.map((g) => ({
      goalId: g.id,
      goalTitle: g.title,
      currentProgressPercent: g.progressPercent,
      predictedCompletionDate: '28 August 2026',
      confidencePercent: 87,
      streakRisk: g.progressPercent > 50 ? 'low' : 'medium',
      keyBottleneck: g.progressPercent < 50 ? 'Milestone pacing behind schedule' : undefined,
      recommendation: 'Maintain 45m daily focus block to hit projected completion date.',
    }));
  },

  getSmartSchedule: () => [
    { id: 'sch-1', timeSlot: '07:00 AM', taskTitle: 'Morning Routine & Cold Shower', category: 'discipline', recommendedDurationMins: 30, icon: '⚡' },
    { id: 'sch-2', timeSlot: '08:00 AM', taskTitle: 'Workout (Strength Training)', category: 'body', recommendedDurationMins: 45, icon: '💪' },
    { id: 'sch-3', timeSlot: '09:30 AM', taskTitle: 'Deep Work Block 1 (Core Coding)', category: 'discipline', recommendedDurationMins: 120, icon: '💻' },
    { id: 'sch-4', timeSlot: '01:00 PM', taskTitle: 'High Protein Lunch & Hydration', category: 'nutrition', recommendedDurationMins: 45, icon: '🥗' },
    { id: 'sch-5', timeSlot: '03:00 PM', taskTitle: 'Goal Milestone Review & Study', category: 'goals', recommendedDurationMins: 60, icon: '🎯' },
    { id: 'sch-6', timeSlot: '08:00 PM', taskTitle: 'Mind Check-In & Journaling', category: 'mind', recommendedDurationMins: 15, icon: '🧘' },
  ],

  generateReport: (type) => {
    const perfState = usePerformanceEngineStore.getState();
    const dateStr = new Date().toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });

    const report: AIReport = {
      id: `rep-${type}-${Date.now()}`,
      title: `${type.toUpperCase()} Performance Intelligence Report`,
      type,
      periodStr: dateStr,
      overallScore: Math.round(perfState.performanceScore / 10),
      summaryMarkdown: `# ${type.toUpperCase()} PERFORMANCE REPORT\n\n` +
        `**Date**: ${dateStr}\n` +
        `**Overall Score Index**: ${perfState.performanceScore} / 1000 (${perfState.levelInfo.level} Level)\n\n` +
        `## 📊 Module Breakdown\n` +
        `- **Discipline**: High consistency, 12-day active streak.\n` +
        `- **Body**: Workout completed, 2.2L hydration logged.\n` +
        `- **Mind**: 88% sleep quality score, positive mood trend.\n` +
        `- **Nutrition**: Needs attention on weekend protein target.\n` +
        `- **Goals**: 75% completion on Python Capstone Milestone.\n\n` +
        `## 💡 AI Coach Key Recommendations\n` +
        `1. Lock in morning focus window before 10 AM.\n` +
        `2. Increase daily water intake to 3.0L.\n` +
        `3. Maintain unbroken streak momentum.`,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({ reports: [report, ...state.reports] }));
    return report;
  },

  updateMemory: (updates) => {
    set((state) => {
      const updated = { ...state.memory, ...updates };
      localStorage.setItem(STORAGE_KEYS.MEMORY, JSON.stringify(updated));
      return { memory: updated };
    });
  },
}));
