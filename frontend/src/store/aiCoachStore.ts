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
} from '../types/ai';

import { usePerformanceEngineStore } from './performanceEngineStore';
import { useDisciplineStore } from './disciplineStore';
import { useBodyStore } from './bodyStore';
import { useMindStore } from './mindStore';
import { useNutritionStore } from './nutritionStore';
import { useGoalsStore } from './goalsStore';
import { useEventEngineStore } from './eventEngineStore';

const STORAGE_KEYS = {
  CHAT: 'dos_ai_chat_history',
  MEMORY: 'dos_ai_memory',
};

const initialChatMessages: AIChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'coach',
    text: "Greetings Adarsh! I'm your DisciplineOS AI Coach. I analyze your real-time performance across Discipline, Body, Mind, Nutrition, and Goals to help you optimize your daily routine. How can I assist your execution today?",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

const initialMemory: AIMemory = {
  preferredWorkoutTime: '07:00 AM',
  preferredStudyTime: '09:00 AM',
  frequentlyMissedHabits: ['Water Hydration', 'Evening Reflection'],
  coachingStyle: 'encouraging',
  consentAnalytics: true,
};

function loadStoredChat(): AIChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHAT);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load chat history', err);
  }
  return initialChatMessages;
}

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
  memory: AIMemory;
  isThinking: boolean;
  reports: AIReport[];

  // Actions
  sendChatMessage: (userQuery: string) => Promise<void>;
  clearChatHistory: () => void;

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
  chatMessages: loadStoredChat(),
  memory: loadStoredMemory(),
  isThinking: false,
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

    set((state) => {
      const updated = [...state.chatMessages, userMsg];
      localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(updated));
      return { chatMessages: updated, isThinking: true };
    });

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Gather full context
    const perfState = usePerformanceEngineStore.getState();
    const discState = useDisciplineStore.getState();
    const bodyState = useBodyStore.getState();
    const mindState = useMindStore.getState();
    const nutrState = useNutritionStore.getState();
    const goalsState = useGoalsStore.getState();

    const qLower = queryTrimmed.toLowerCase();
    let replyText = '';
    let suggestedActions: AIChatMessage['suggestedActions'] = undefined;

    if (qLower.includes('score') || qLower.includes('drop') || qLower.includes('why')) {
      replyText = `Your overall Performance Score is currently **${perfState.performanceScore}/1000** (${perfState.levelInfo.title} Level). Breakdown:\n\n` +
        `• **Discipline**: ${discState.analytics?.disciplineScore || 82}/100\n` +
        `• **Body**: ${bodyState.bodyScore}/100\n` +
        `• **Mind**: ${mindState.mindScore}/100\n` +
        `• **Nutrition**: ${nutrState.nutritionScore}/100\n` +
        `• **Goals**: ${goalsState.goalScore}/100\n\n` +
        `💡 *Coach Insight*: ${nutrState.nutritionScore < 70 ? 'Your Nutrition score is dragging down your index. Log your meals & hit 3L water target.' : 'Your Discipline & Body consistency are high. Keep momentum going!'}`;
      
      suggestedActions = [
        { label: 'Log Water (+500ml)', actionType: 'LOG_WATER' },
        { label: 'View Performance Report', actionType: 'VIEW_REPORT' },
      ];
    } else if (qLower.includes('python') || qLower.includes('goal') || qLower.includes('plan')) {
      const topGoal = goalsState.goals[0];
      replyText = `Based on your Goal Engine context:\n\n` +
        `🎯 **Active Goal**: ${topGoal ? topGoal.title : 'Learn Python & Data Science'}\n` +
        `📈 **Current Progress**: ${topGoal ? topGoal.progressPercent : 75}%\n` +
        `📅 **Forecasted Completion**: August 28 (87% confidence)\n\n` +
        `Recommended daily action: Spend **45 mins** on Deep Work coding before 11:00 AM to stay ahead of deadline.`;
      
      suggestedActions = [
        { label: 'Start 45m Deep Work', actionType: 'START_DEEP_WORK' },
      ];
    } else if (qLower.includes('workout') || qLower.includes('body') || qLower.includes('sleep')) {
      replyText = `Here is your physical telemetry:\n\n` +
        `💪 **Workout**: ${bodyState.workout.completed ? 'Completed Today ✅' : 'Pending ⏳'}\n` +
        `😴 **Sleep Quality**: ${bodyState.sleep.durationHours}h ${bodyState.sleep.durationMinutes}m (${bodyState.sleep.qualityPercent}% quality)\n` +
        `💧 **Hydration**: ${bodyState.water.currentLiters}L / ${bodyState.water.targetLiters}L\n\n` +
        `💡 *Recommendation*: ${bodyState.water.currentLiters < bodyState.water.targetLiters ? 'Drink 1 more bottle of water before 6 PM to enhance mental clarity.' : 'Great hydration levels today!'}`;
    } else if (qLower.includes('analytics') || qLower.includes('pattern') || qLower.includes('habit')) {
      replyText = `🔍 **AI Pattern Detection Analysis**:\n\n` +
        `1. **Peak Focus Window**: Your best focus occurs between **08:00 AM – 11:00 AM**.\n` +
        `2. **Workout & Mood Correlation**: Workout completion increases daily mood scores by **+18%**.\n` +
        `3. **Streak Safety**: Current streak is **🔥 ${discState.analytics.currentStreak} Days**. Risk level is **LOW**.`;
    } else {
      replyText = `I have analyzed your live system state:\n\n` +
        `• Total Performance Index: **${perfState.performanceScore} / 1000**\n` +
        `• Active Streak: **${discState.analytics.currentStreak} Days**\n` +
        `• Tasks Completed Today: **${discState.tasks.filter((t) => t.completed).length} / ${discState.tasks.length}**\n\n` +
        `How can I help you optimize your schedule or achieve your next milestone?`;
    }

    const coachMsg: AIChatMessage = {
      id: `cch-${Date.now()}`,
      sender: 'coach',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions,
    };

    set((state) => {
      const updated = [...state.chatMessages, coachMsg];
      localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(updated));
      return { chatMessages: updated, isThinking: false };
    });
  },

  clearChatHistory: () => {
    set({ chatMessages: initialChatMessages });
    localStorage.removeItem(STORAGE_KEYS.CHAT);
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
        `**Overall Score Index**: ${perfState.performanceScore} / 1000 (${perfState.levelInfo.title} Level)\n\n` +
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
