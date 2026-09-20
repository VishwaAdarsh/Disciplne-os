import { create } from 'zustand';
import type {
  MoodLevel,
  MeditationType,
  MeditationSession,
  ActiveMeditationSession,
  JournalEntry,
  MindCheckIn,
  MindRuleInsight,
  MindActivityEvent,
  MindScoreBreakdown,
} from '../types/mind';
import { useOverviewStore } from './overviewStore';
import { useEventEngineStore } from './eventEngineStore';

interface MindState {
  mindScore: number;
  todayCheckIn: MindCheckIn;
  meditation: {
    todayMinutes: number;
    targetMinutes: number;
    streakDays: number;
    weeklyTotalMin: number;
    sessions: MeditationSession[];
  };
  activeMeditation: ActiveMeditationSession;
  journal: {
    completedToday: boolean;
    entries: JournalEntry[];
  };
  ruleInsights: MindRuleInsight[];
  activityFeed: MindActivityEvent[];
  mindTrends30Days: Array<{
    date: string;
    mood: number;
    focus: number;
    energy: number;
    stress: number;
    score: number;
  }>;

  // Actions
  submitDailyCheckIn: (data: {
    mood: MoodLevel;
    moodNote?: string;
    focus: number;
    energy: number;
    stress: number;
  }) => void;
  startMeditation: (title: string, type: MeditationType, targetMinutes?: number) => void;
  pauseMeditation: () => void;
  resumeMeditation: () => void;
  tickMeditationTimer: () => void;
  finishMeditation: () => void;
  cancelMeditation: () => void;
  logCompletedMeditation: (title: string, type: MeditationType, durationMinutes: number) => void;
  saveJournalEntry: (entry: {
    title: string;
    reflection: string;
    wentWell?: string;
    challenged?: string;
    improveTomorrow?: string;
    moodTag?: string;
    emoji?: string;
  }) => void;
  deleteJournalEntry: (id: string) => void;
  calculateScoreBreakdown: () => MindScoreBreakdown;
  recalculateScore: () => void;
  generateRuleInsights: () => void;
}

const moodLabels: Record<MoodLevel, string> = {
  1: 'Very Bad',
  2: 'Bad',
  3: 'Neutral',
  4: 'Good',
  5: 'Excellent',
};

export const useMindStore = create<MindState>((set, get) => ({
  mindScore: 0,
  todayCheckIn: {
    mood: 3,
    moodLabel: 'Neutral',
    moodNote: '',
    focus: 0,
    energy: 0,
    stress: 0,
    timestamp: '',
    completed: false,
  },
  meditation: {
    todayMinutes: 0,
    targetMinutes: 15,
    streakDays: 0,
    weeklyTotalMin: 0,
    sessions: [],
  },
  activeMeditation: {
    title: '',
    type: 'guided',
    status: 'idle',
    elapsedSeconds: 0,
    targetMinutes: 10,
    startTime: null,
  },
  journal: {
    completedToday: false,
    entries: [],
  },
  ruleInsights: [],
  activityFeed: [],
  mindTrends30Days: [],

  calculateScoreBreakdown: () => {
    const { todayCheckIn, meditation, journal } = get();
    const moodScore = Math.round((todayCheckIn.mood / 5) * 100);
    const focusScore = Math.round((todayCheckIn.focus / 10) * 100);
    const energyScore = Math.round((todayCheckIn.energy / 10) * 100);
    const stressScore = Math.round(((10 - todayCheckIn.stress) / 10) * 100);
    const meditationScore = Math.min(100, Math.round((meditation.todayMinutes / meditation.targetMinutes) * 100));
    const journalScore = journal.completedToday ? 100 : 0;

    const totalScore = Math.round(
      moodScore * 0.20 +
      focusScore * 0.20 +
      energyScore * 0.15 +
      stressScore * 0.15 +
      meditationScore * 0.15 +
      journalScore * 0.15
    );

    return {
      moodScore,
      focusScore,
      energyScore,
      stressScore,
      meditationScore,
      journalScore,
      totalScore,
    };
  },

  recalculateScore: () => {
    const breakdown = get().calculateScoreBreakdown();
    set({ mindScore: breakdown.totalScore });
  },

  submitDailyCheckIn: (data) => {
    const { activityFeed } = get();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const label = moodLabels[data.mood];

    const newCheckIn: MindCheckIn = {
      mood: data.mood,
      moodLabel: label,
      moodNote: data.moodNote,
      focus: data.focus,
      energy: data.energy,
      stress: data.stress,
      timestamp: `Today, ${nowTime}`,
      completed: true,
    };

    const newActivity: MindActivityEvent = {
      id: `m-act-${Date.now()}`,
      type: 'MIND_CHECKIN_COMPLETED',
      title: 'Completed Daily Mind Check-In',
      subtext: `Mood: ${label} · Focus: ${data.focus}/10 · Energy: ${data.energy}/10 · Stress: ${data.stress}/10`,
      timestamp: 'Just now',
      icon: 'Smile',
    };

    set({
      todayCheckIn: newCheckIn,
      activityFeed: [newActivity, ...activityFeed],
    });

    get().recalculateScore();
    get().generateRuleInsights();

    useEventEngineStore.getState().emitEvent({
      module: 'mind',
      eventType: 'MOOD_LOGGED',
      title: `Daily Mind Check-In (${label})`,
      description: `Focus: ${data.focus}/10 · Energy: ${data.energy}/10 · Stress: ${data.stress}/10`,
      icon: '🧘',
      payload: { mood: label, focus: data.focus, energy: data.energy, stress: data.stress },
      scoreImpact: 3,
    });
  },


  startMeditation: (title, type, targetMinutes = 10) => {
    set({
      activeMeditation: {
        title: title || `${type.toUpperCase()} Meditation`,
        type,
        status: 'running',
        elapsedSeconds: 0,
        targetMinutes,
        startTime: Date.now(),
      },
    });
  },

  pauseMeditation: () => {
    set((s) => ({
      activeMeditation: { ...s.activeMeditation, status: 'paused' },
    }));
  },

  resumeMeditation: () => {
    set((s) => ({
      activeMeditation: { ...s.activeMeditation, status: 'running' },
    }));
  },

  tickMeditationTimer: () => {
    const { activeMeditation } = get();
    if (activeMeditation.status === 'running') {
      set({
        activeMeditation: {
          ...activeMeditation,
          elapsedSeconds: activeMeditation.elapsedSeconds + 1,
        },
      });
    }
  },

  finishMeditation: () => {
    const { activeMeditation, meditation, activityFeed } = get();
    const durationMinutes = Math.max(1, Math.round(activeMeditation.elapsedSeconds / 60));

    const newSession: MeditationSession = {
      id: `med-${Date.now()}`,
      title: activeMeditation.title,
      type: activeMeditation.type,
      durationMinutes,
      dateStr: 'Just now',
      timestamp: new Date().toISOString(),
    };

    const newActivity: MindActivityEvent = {
      id: `m-act-${Date.now()}`,
      type: 'MEDITATION_COMPLETED',
      title: `Finished Meditation: ${activeMeditation.title}`,
      subtext: `${durationMinutes} min ${activeMeditation.type} session completed`,
      timestamp: 'Just now',
      icon: 'Brain',
    };

    set({
      activeMeditation: {
        title: '',
        type: 'guided',
        status: 'idle',
        elapsedSeconds: 0,
        targetMinutes: 10,
        startTime: null,
      },
      meditation: {
        ...meditation,
        todayMinutes: meditation.todayMinutes + durationMinutes,
        weeklyTotalMin: meditation.weeklyTotalMin + durationMinutes,
        sessions: [newSession, ...meditation.sessions],
      },
      activityFeed: [newActivity, ...activityFeed],
    });

    get().recalculateScore();
    get().generateRuleInsights();

    useEventEngineStore.getState().emitEvent({
      module: 'mind',
      eventType: 'MEDITATION_COMPLETED',
      title: `Meditation Completed: ${activeMeditation.title}`,
      description: `${durationMinutes} min ${activeMeditation.type} session`,
      icon: '🧘',
      payload: { durationMinutes, type: activeMeditation.type },
      scoreImpact: 6,
    });
  },


  cancelMeditation: () => {
    set({
      activeMeditation: {
        title: '',
        type: 'guided',
        status: 'idle',
        elapsedSeconds: 0,
        targetMinutes: 10,
        startTime: null,
      },
    });
  },

  logCompletedMeditation: (title, type, durationMinutes) => {
    const { meditation, activityFeed } = get();
    const newSession: MeditationSession = {
      id: `med-${Date.now()}`,
      title,
      type,
      durationMinutes,
      dateStr: 'Today',
      timestamp: new Date().toISOString(),
    };

    const newActivity: MindActivityEvent = {
      id: `m-act-${Date.now()}`,
      type: 'MEDITATION_COMPLETED',
      title: `Logged Meditation: ${title}`,
      subtext: `${durationMinutes} min session`,
      timestamp: 'Just now',
      icon: 'Brain',
    };

    set({
      meditation: {
        ...meditation,
        todayMinutes: meditation.todayMinutes + durationMinutes,
        weeklyTotalMin: meditation.weeklyTotalMin + durationMinutes,
        sessions: [newSession, ...meditation.sessions],
      },
      activityFeed: [newActivity, ...activityFeed],
    });

    get().recalculateScore();

    useOverviewStore.getState().pushEvent({
      title: `Logged ${durationMinutes} min ${title}`,
      category: 'mind',
      icon: '🧘',
      type: 'SESSION_FINISHED',
    });
  },

  saveJournalEntry: (entry) => {
    const { journal, activityFeed } = get();
    const newEntry: JournalEntry = {
      id: `j-${Date.now()}`,
      title: entry.title || 'Daily Reflection',
      reflection: entry.reflection,
      wentWell: entry.wentWell,
      challenged: entry.challenged,
      improveTomorrow: entry.improveTomorrow,
      moodTag: entry.moodTag || 'Good',
      emoji: entry.emoji || '🙂',
      dateStr: 'Just now',
      timestamp: new Date().toISOString(),
    };

    const newActivity: MindActivityEvent = {
      id: `m-act-${Date.now()}`,
      type: 'JOURNAL_WRITTEN',
      title: `Saved Reflection: ${newEntry.title}`,
      subtext: `Tagged as ${newEntry.moodTag} ${newEntry.emoji}`,
      timestamp: 'Just now',
      icon: 'BookOpen',
    };

    set({
      journal: {
        completedToday: true,
        entries: [newEntry, ...journal.entries],
      },
      activityFeed: [newActivity, ...activityFeed],
    });

    get().recalculateScore();
    get().generateRuleInsights();

    useOverviewStore.getState().pushEvent({
      title: `Journal Reflection Saved: ${newEntry.title}`,
      category: 'mind',
      icon: '📝',
      type: 'JOURNAL_SAVED',
    });
  },

  deleteJournalEntry: (id) => {
    const { journal } = get();
    set({
      journal: {
        ...journal,
        entries: journal.entries.filter((e) => e.id !== id),
      },
    });
  },

  generateRuleInsights: () => {
    const { todayCheckIn, meditation } = get();
    const insights: MindRuleInsight[] = [];

    if (todayCheckIn.focus >= 8) {
      insights.push({
        id: 'ins-focus-high',
        title: 'High Cognitive Clarity',
        description: `Your focus score of ${todayCheckIn.focus}/10 indicates an optimal deep work window today.`,
        category: 'focus',
        icon: 'Target',
      });
    }

    if (todayCheckIn.stress <= 4) {
      insights.push({
        id: 'ins-stress-low',
        title: 'Low Psychological Strain',
        description: `Perceived stress is at ${todayCheckIn.stress}/10. Great environment for creative output.`,
        category: 'stress',
        icon: 'Smile',
      });
    }

    if (meditation.todayMinutes >= 15) {
      insights.push({
        id: 'ins-med-target',
        title: 'Mindfulness Goal Met',
        description: `Achieved ${meditation.todayMinutes} min meditation today. Daily mindfulness streak: ${meditation.streakDays} days!`,
        category: 'meditation',
        icon: 'Brain',
      });
    }

    set({ ruleInsights: insights });
  },
}));
