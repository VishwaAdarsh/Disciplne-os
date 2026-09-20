import { create } from 'zustand';
import type {
  DisciplineTask,
  LevelInfo,
  DeepWorkSessionState,
  DisciplineAnalyticsData,
  TaskCategory,
} from '../types/discipline';
import { useOverviewStore } from './overviewStore';
import { useEventEngineStore } from './eventEngineStore';

const LEVEL_THRESHOLDS = [
  { level: 1, title: 'Explorer', maxXp: 250 },
  { level: 2, title: 'Operator', maxXp: 600 },
  { level: 3, title: 'Builder', maxXp: 1000 },
  { level: 4, title: 'Performer', maxXp: 1500 },
  { level: 5, title: 'Elite', maxXp: 2500 },
] as const;

function calculateLevel(currentXp: number): LevelInfo {
  let level = 1;
  let rankTitle: LevelInfo['rankTitle'] = 'Explorer';
  let targetXp = 250;
  let prevLevelXp = 0;

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    const t = LEVEL_THRESHOLDS[i];
    if (currentXp >= t.maxXp) {
      if (i < LEVEL_THRESHOLDS.length - 1) {
        level = LEVEL_THRESHOLDS[i + 1].level;
        rankTitle = LEVEL_THRESHOLDS[i + 1].title;
        prevLevelXp = t.maxXp;
        targetXp = LEVEL_THRESHOLDS[i + 1].maxXp;
      } else {
        level = 5;
        rankTitle = 'Elite';
        prevLevelXp = 1500;
        targetXp = 2500;
      }
    } else {
      level = t.level;
      rankTitle = t.title;
      targetXp = t.maxXp;
      break;
    }
  }

  return { level, rankTitle, currentXp, targetXp, prevLevelXp };
}

interface DisciplineStoreState {
  tasks: DisciplineTask[];
  levelInfo: LevelInfo;
  deepWorkSession: DeepWorkSessionState;
  analytics: DisciplineAnalyticsData;
  activeFilter: TaskCategory | 'all';
  activeTab: 'overview' | 'nonneg' | 'habits' | 'deepwork' | 'analytics' | 'history';
  notificationToast: string | null;

  // Actions
  setActiveFilter: (filter: TaskCategory | 'all') => void;
  setActiveTab: (tab: 'overview' | 'nonneg' | 'habits' | 'deepwork' | 'analytics' | 'history') => void;
  toggleTask: (id: string) => void;
  skipTask: (id: string, reason?: string) => void;
  addTask: (task: Omit<DisciplineTask, 'id' | 'completed' | 'skipped' | 'streak' | 'createdAt'>) => void;
  editTask: (id: string, updates: Partial<DisciplineTask>) => void;
  deleteTask: (id: string) => void;
  duplicateTask: (id: string) => void;

  // Deep Work Timer Actions
  startFocusSession: (sessionName?: string, durationMins?: number) => void;
  pauseFocusSession: () => void;
  resumeFocusSession: () => void;
  resetFocusSession: () => void;
  finishFocusSession: () => void;
  tickFocusTimer: () => void;

  dismissNotification: () => void;
}

export const useDisciplineStore = create<DisciplineStoreState>((set, get) => ({
  tasks: [],
  levelInfo: calculateLevel(0),
  deepWorkSession: {
    status: 'idle',
    elapsedSeconds: 0,
    targetMinutes: 60,
    sessionName: 'Deep Work Session',
    breaksCount: 0,
    dailyTotalSeconds: 0,
  },
  analytics: {
    completionRate: 0,
    disciplineScore: 0,
    weeklyConsistency: 0,
    totalFocusHours: 0,
    currentStreak: 0,
    bestStreak: 0,
    missedTasksCount: 0,
    heatmapData: [],
    weeklyFocusTrend: [],
  },
  activeFilter: 'all',
  activeTab: 'overview',
  notificationToast: null,

  setActiveFilter: (activeFilter) => set({ activeFilter }),
  setActiveTab: (activeTab) => set({ activeTab }),

  toggleTask: (id: string) => {
    const { tasks, levelInfo } = get();
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const newCompleted = !task.completed;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updatedTasks = tasks.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          completed: newCompleted,
          skipped: false,
          streak: newCompleted ? t.streak + 1 : Math.max(0, t.streak - 1),
          completedAt: newCompleted ? nowTime : undefined,
        };
      }
      return t;
    });

    // Check non-negotiable perfect day
    const nonnegs = updatedTasks.filter((t) => t.category === 'nonneg');
    const allNonnegDone = nonnegs.length > 0 && nonnegs.every((t) => t.completed);

    let xpGained = newCompleted ? task.xpReward : -task.xpReward;
    if (newCompleted && allNonnegDone) {
      xpGained += 50; // Perfect Day Bonus (+50 XP)
    }

    const newXp = Math.max(0, levelInfo.currentXp + xpGained);
    const newLevelInfo = calculateLevel(newXp);

    let toastMsg: string | null = null;
    if (newCompleted) {
      toastMsg = `Completed: "${task.title}" (+${task.xpReward} XP)`;
      if (allNonnegDone) {
        toastMsg = `🔥 Perfect Day Achieved! All Non-Negotiables Completed (+50 XP Bonus!)`;
      }
    }

    set({
      tasks: updatedTasks,
      levelInfo: newLevelInfo,
      notificationToast: toastMsg,
    });

    // Push event to Event & Real-Time Engine
    if (newCompleted) {
      useEventEngineStore.getState().emitEvent({
        module: 'discipline',
        eventType: 'TASK_COMPLETED',
        title: `Completed: ${task.title}`,
        description: `Earned +${task.xpReward} XP for task completion`,
        icon: task.icon || '✓',
        payload: { taskId: task.id, xpReward: task.xpReward, streak: task.streak + 1 },
        scoreImpact: Math.min(10, Math.ceil(task.xpReward / 5)),
      });

      if (allNonnegDone) {
        useEventEngineStore.getState().emitEvent({
          module: 'discipline',
          eventType: 'HABIT_COMPLETED',
          title: `Perfect Day Achieved! 🏆`,
          description: `All non-negotiable tasks completed today!`,
          icon: '🔥',
          payload: { bonusXp: 50 },
          scoreImpact: 15,
        });
      }
    }
  },

  skipTask: (id: string, reason?: string) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, completed: false, skipped: true, skipReason: reason } : t
      ),
      notificationToast: `Task marked as skipped.`,
    }));
  },

  addTask: (taskData) => {
    const newTask: DisciplineTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      completed: false,
      skipped: false,
      streak: 0,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      tasks: [newTask, ...state.tasks],
      notificationToast: `Created Non-Negotiable task "${newTask.title}"`,
    }));

    useOverviewStore.getState().pushEvent({
      type: 'TASK_COMPLETED',
      title: `Created task: ${newTask.title}`,
      category: 'discipline',
      icon: newTask.icon,
    });
  },

  editTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      notificationToast: `Task updated successfully.`,
    }));
  },

  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
      notificationToast: `Task deleted.`,
    }));
  },

  duplicateTask: (id) => {
    const { tasks } = get();
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const dupTask: DisciplineTask = {
      ...task,
      id: `task-${Date.now()}`,
      title: `${task.title} (Copy)`,
      completed: false,
      skipped: false,
      streak: 0,
      createdAt: new Date().toISOString(),
    };

    set({ tasks: [dupTask, ...tasks], notificationToast: `Task duplicated.` });
  },

  startFocusSession: (sessionName = 'Deep Work Block', durationMins = 45) => {
    set((state) => ({
      deepWorkSession: {
        ...state.deepWorkSession,
        status: 'running',
        sessionName,
        targetMinutes: durationMins,
      },
      notificationToast: `Deep Work Session Started: ${sessionName}`,
    }));

    useOverviewStore.getState().pushEvent({
      type: 'SESSION_FINISHED',
      title: `Deep Work Started: ${sessionName}`,
      category: 'discipline',
      icon: '🧠',
    });
  },

  pauseFocusSession: () => {
    set((state) => ({
      deepWorkSession: {
        ...state.deepWorkSession,
        status: 'paused',
        breaksCount: state.deepWorkSession.breaksCount + 1,
      },
    }));
  },

  resumeFocusSession: () => {
    set((state) => ({
      deepWorkSession: {
        ...state.deepWorkSession,
        status: 'running',
      },
    }));
  },

  resetFocusSession: () => {
    set((state) => ({
      deepWorkSession: {
        ...state.deepWorkSession,
        status: 'idle',
        elapsedSeconds: 0,
      },
    }));
  },

  finishFocusSession: () => {
    const { deepWorkSession, levelInfo } = get();
    const sessionSecs = deepWorkSession.elapsedSeconds;
    const sessionMins = Math.round(sessionSecs / 60);

    const newXp = levelInfo.currentXp + 40; // +40 XP for Deep Work
    const newLevelInfo = calculateLevel(newXp);

    set({
      deepWorkSession: {
        ...deepWorkSession,
        status: 'completed',
        dailyTotalSeconds: deepWorkSession.dailyTotalSeconds + sessionSecs,
      },
      levelInfo: newLevelInfo,
      notificationToast: `Focus Session Logged! (${sessionMins}m, +40 XP)`,
    });

    useOverviewStore.getState().pushEvent({
      type: 'SESSION_FINISHED',
      title: `Deep Work Completed (${sessionMins}m)`,
      category: 'discipline',
      icon: '⚡',
    });
  },

  tickFocusTimer: () => {
    const { deepWorkSession } = get();
    if (deepWorkSession.status === 'running') {
      set({
        deepWorkSession: {
          ...deepWorkSession,
          elapsedSeconds: deepWorkSession.elapsedSeconds + 1,
        },
      });
    }
  },

  dismissNotification: () => set({ notificationToast: null }),
}));
