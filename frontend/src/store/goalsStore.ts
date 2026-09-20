import { create } from 'zustand';
import type {
  GoalItem,
  GoalCategory,
  GoalStatus,
  GoalPriority,
  GoalMilestone,
  GoalRuleInsight,
  GoalActivityEvent,
  GoalScoreBreakdown,
} from '../types/goals';
import { goalsApi, type GoalPayload } from '../services/goals/goalsApi';
import { useEventEngineStore } from './eventEngineStore';

interface GoalsSummary {
  totalGoals: number;
  activeCount: number;
  completedCount: number;
  pausedCount: number;
  overdueCount: number;
  overallProgressPercent: number;
}

interface GoalsState {
  goalScore: number;
  goals: GoalItem[];
  summary: GoalsSummary;
  ruleInsights: GoalRuleInsight[];
  activityFeed: GoalActivityEvent[];
  weeklyProgressHistory: Array<{
    week: string;
    progressAvg: number;
    completedCount: number;
  }>;

  // Async API Actions
  loadAllGoals: () => Promise<void>;
  createGoalAsync: (goal: GoalPayload) => Promise<void>;
  updateGoalAsync: (id: string, updates: Partial<GoalPayload>) => Promise<void>;
  deleteGoalAsync: (id: string) => Promise<void>;
  setGoalStatusAsync: (id: string, status: GoalStatus) => Promise<void>;
  updateProgressAsync: (id: string, progressPercent: number, currentValue?: number) => Promise<void>;
  addMilestoneAsync: (goalId: string, title: string, dueDate?: string) => Promise<void>;
  toggleMilestoneAsync: (goalId: string, milestoneId: string) => Promise<void>;
  deleteMilestoneAsync: (goalId: string, milestoneId: string) => Promise<void>;

  // Sync / Fallback Actions
  createGoal: (goal: Omit<GoalItem, 'id' | 'createdAt' | 'progressPercent'>) => void;
  updateGoal: (id: string, updates: Partial<GoalItem>) => void;
  setGoalStatus: (id: string, status: GoalStatus) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  addMilestone: (goalId: string, title: string, dueDate?: string) => void;
  deleteMilestone: (goalId: string, milestoneId: string) => void;
  deleteGoal: (id: string) => void;
  aiSuggestMilestones: (title: string, category: GoalCategory) => string[];
  calculateScoreBreakdown: () => GoalScoreBreakdown;
  recalculateScore: () => void;
  generateRuleInsights: () => void;
}

export const useGoalsStore = create<GoalsState>((set, get) => ({
  goalScore: 0,
  goals: [],
  summary: {
    totalGoals: 0,
    activeCount: 0,
    completedCount: 0,
    pausedCount: 0,
    overdueCount: 0,
    overallProgressPercent: 0,
  },
  ruleInsights: [],
  activityFeed: [],
  weeklyProgressHistory: [],

  loadAllGoals: async () => {
    try {
      const [rawGoals, summaryData] = await Promise.all([
        goalsApi.getGoals(),
        goalsApi.getGoalsSummary().catch(() => null),
      ]);

      if (Array.isArray(rawGoals)) {
        const mappedGoals: GoalItem[] = rawGoals.map((g: any) => ({
          id: g.id,
          title: g.title,
          description: g.description,
          category: (g.category as GoalCategory) || 'Discipline',
          customCategoryName: g.category === 'Custom' ? g.notes : undefined,
          color: g.color || '#6366F1',
          startDate: g.startDate || '',
          deadline: g.deadline || 'Ongoing',
          priority: (g.priority as GoalPriority) || 'High',
          status: (g.status as GoalStatus) || 'In Progress',
          progressPercent: g.progressPercent ?? 0,
          targetValue: g.targetValue !== undefined ? `${g.targetValue} ${g.unit || ''}`.trim() : undefined,
          milestones: (g.milestones || []).map((m: any) => ({
            id: m.id,
            title: m.title,
            completed: Boolean(m.completed),
            dueDate: m.dueDate,
          })),
          linkedTasks: [],
          notes: g.notes,
          createdAt: g.createdAt || new Date().toISOString(),
        }));

        set({ goals: mappedGoals });
      }

      if (summaryData) {
        set({
          summary: {
            totalGoals: summaryData.totalGoals ?? 0,
            activeCount: summaryData.activeCount ?? 0,
            completedCount: summaryData.completedCount ?? 0,
            pausedCount: summaryData.pausedCount ?? 0,
            overdueCount: summaryData.overdueCount ?? 0,
            overallProgressPercent: summaryData.overallProgressPercent ?? 0,
          },
        });
      }

      get().recalculateScore();
      get().generateRuleInsights();
    } catch (err) {
      console.warn('Could not load goals from API:', err);
    }
  },

  createGoalAsync: async (goalData: GoalPayload) => {
    try {
      await goalsApi.createGoal(goalData);
      await get().loadAllGoals();
    } catch (err) {
      console.error('Error creating goal via API:', err);
      // Fallback local
      get().createGoal({
        title: goalData.title,
        description: goalData.description,
        category: (goalData.category as GoalCategory) || 'Discipline',
        color: goalData.color || '#6366F1',
        startDate: goalData.startDate || new Date().toISOString().split('T')[0],
        deadline: goalData.deadline || 'Ongoing',
        priority: (goalData.priority as GoalPriority) || 'High',
        status: (goalData.status as GoalStatus) || 'In Progress',
        targetValue: goalData.targetValue ? String(goalData.targetValue) : undefined,
        milestones: (goalData.milestones || []).map((m, idx) => ({
          id: `m-${Date.now()}-${idx}`,
          title: m.title,
          completed: false,
          dueDate: m.dueDate,
        })),
        linkedTasks: [],
        notes: goalData.notes,
      });
    }
  },

  updateGoalAsync: async (id: string, updates: Partial<GoalPayload>) => {
    try {
      await goalsApi.updateGoal(id, updates);
      await get().loadAllGoals();
    } catch (err) {
      console.error('Error updating goal via API:', err);
      get().updateGoal(id, updates as any);
    }
  },

  deleteGoalAsync: async (id: string) => {
    try {
      await goalsApi.deleteGoal(id);
      await get().loadAllGoals();
    } catch (err) {
      console.error('Error deleting goal via API:', err);
      get().deleteGoal(id);
    }
  },

  setGoalStatusAsync: async (id: string, status: GoalStatus) => {
    try {
      await goalsApi.setGoalStatus(id, status);
      await get().loadAllGoals();
    } catch (err) {
      console.error('Error setting goal status via API:', err);
      get().setGoalStatus(id, status);
    }
  },

  updateProgressAsync: async (id: string, progressPercent: number, currentValue?: number) => {
    try {
      await goalsApi.updateProgress(id, progressPercent, currentValue);
      await get().loadAllGoals();
    } catch (err) {
      console.error('Error updating goal progress via API:', err);
    }
  },

  addMilestoneAsync: async (goalId: string, title: string, dueDate?: string) => {
    try {
      await goalsApi.addMilestone(goalId, title, dueDate);
      await get().loadAllGoals();
    } catch (err) {
      console.error('Error adding milestone via API:', err);
      get().addMilestone(goalId, title, dueDate);
    }
  },

  toggleMilestoneAsync: async (goalId: string, milestoneId: string) => {
    try {
      await goalsApi.toggleMilestone(goalId, milestoneId);
      await get().loadAllGoals();
    } catch (err) {
      console.error('Error toggling milestone via API:', err);
      get().toggleMilestone(goalId, milestoneId);
    }
  },

  deleteMilestoneAsync: async (goalId: string, milestoneId: string) => {
    try {
      await goalsApi.deleteMilestone(goalId, milestoneId);
      await get().loadAllGoals();
    } catch (err) {
      console.error('Error deleting milestone via API:', err);
      get().deleteMilestone(goalId, milestoneId);
    }
  },

  // --- LOCAL MUTATIONS ---
  createGoal: (goalData) => {
    const { goals, activityFeed } = get();
    const newGoal: GoalItem = {
      ...goalData,
      id: `g-${Date.now()}`,
      progressPercent: 0,
      createdAt: new Date().toISOString(),
    };

    const newActivity: GoalActivityEvent = {
      id: `g-act-${Date.now()}`,
      type: 'GOAL_CREATED',
      title: `Created Goal: ${goalData.title}`,
      subtext: `${goalData.category} · Priority: ${goalData.priority}`,
      timestamp: 'Just now',
      icon: 'Target',
    };

    set({
      goals: [newGoal, ...goals],
      activityFeed: [newActivity, ...activityFeed],
    });

    get().recalculateScore();
    get().generateRuleInsights();

    useEventEngineStore.getState().emitEvent({
      module: 'goals',
      eventType: 'GOAL_CREATED',
      title: `New Goal: ${goalData.title}`,
      description: `${goalData.category} · Target: ${goalData.deadline}`,
      icon: '🎯',
      payload: { title: goalData.title, category: goalData.category, priority: goalData.priority },
      scoreImpact: 5,
    });
  },

  updateGoal: (id, updates) => {
    const { goals } = get();
    set({
      goals: goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    });
    get().recalculateScore();
  },

  setGoalStatus: (id, status) => {
    const { goals, activityFeed } = get();
    const target = goals.find((g) => g.id === id);
    if (!target) return;

    const isCompleted = status === 'Completed';
    const updatedGoals = goals.map((g) =>
      g.id === id
        ? {
            ...g,
            status,
            progressPercent: isCompleted ? 100 : g.progressPercent,
          }
        : g
    );

    const eventType: GoalActivityEvent['type'] =
      status === 'Completed'
        ? 'GOAL_COMPLETED'
        : status === 'Paused'
        ? 'GOAL_PAUSED'
        : 'GOAL_RESUMED';

    const newActivity: GoalActivityEvent = {
      id: `g-act-${Date.now()}`,
      type: eventType,
      title: `${status} Goal: ${target.title}`,
      subtext: `Status updated to ${status}`,
      timestamp: 'Just now',
      icon: isCompleted ? 'CheckCircle2' : status === 'Paused' ? 'Pause' : 'Play',
    };

    set({
      goals: updatedGoals,
      activityFeed: [newActivity, ...activityFeed],
    });

    get().recalculateScore();
    get().generateRuleInsights();
  },

  toggleMilestone: (goalId, milestoneId) => {
    const { goals, activityFeed } = get();
    let milestoneTitle = '';
    let isNowCompleted = false;

    const updatedGoals = goals.map((g) => {
      if (g.id !== goalId) return g;

      const updatedMilestones = g.milestones.map((m) => {
        if (m.id === milestoneId) {
          milestoneTitle = m.title;
          isNowCompleted = !m.completed;
          return { ...m, completed: !m.completed };
        }
        return m;
      });

      const completedCount = updatedMilestones.filter((m) => m.completed).length;
      const progressPercent =
        updatedMilestones.length > 0
          ? Math.round((completedCount / updatedMilestones.length) * 100)
          : g.progressPercent;

      const autoCompleted = progressPercent === 100 && updatedMilestones.length > 0;

      return {
        ...g,
        milestones: updatedMilestones,
        progressPercent,
        status: autoCompleted ? ('Completed' as GoalStatus) : g.status,
      };
    });

    const newActivity: GoalActivityEvent = {
      id: `g-act-${Date.now()}`,
      type: isNowCompleted ? 'MILESTONE_COMPLETED' : 'GOAL_CREATED',
      title: `${isNowCompleted ? 'Completed' : 'Reopened'} Milestone: ${milestoneTitle}`,
      subtext: `Milestone updated for goal`,
      timestamp: 'Just now',
      icon: 'CheckCircle2',
    };

    set({
      goals: updatedGoals,
      activityFeed: [newActivity, ...activityFeed],
    });

    get().recalculateScore();
    get().generateRuleInsights();
  },

  addMilestone: (goalId, title, dueDate) => {
    const { goals } = get();
    const newMilestone: GoalMilestone = {
      id: `m-${Date.now()}`,
      title,
      completed: false,
      dueDate,
    };

    const updatedGoals = goals.map((g) => {
      if (g.id !== goalId) return g;
      const updatedM = [...g.milestones, newMilestone];
      const completedCount = updatedM.filter((m) => m.completed).length;
      const progressPercent = Math.round((completedCount / updatedM.length) * 100);
      return {
        ...g,
        milestones: updatedM,
        progressPercent,
      };
    });

    set({ goals: updatedGoals });
    get().recalculateScore();
  },

  deleteMilestone: (goalId, milestoneId) => {
    const { goals } = get();
    const updatedGoals = goals.map((g) => {
      if (g.id !== goalId) return g;
      const updatedM = g.milestones.filter((m) => m.id !== milestoneId);
      const completedCount = updatedM.filter((m) => m.completed).length;
      const progressPercent =
        updatedM.length > 0 ? Math.round((completedCount / updatedM.length) * 100) : 0;
      return {
        ...g,
        milestones: updatedM,
        progressPercent,
      };
    });

    set({ goals: updatedGoals });
    get().recalculateScore();
  },

  deleteGoal: (id) => {
    const { goals } = get();
    set({ goals: goals.filter((g) => g.id !== id) });
    get().recalculateScore();
  },

  aiSuggestMilestones: (_title, category) => {
    if (category === 'Discipline') {
      return [
        'Establish morning routine non-negotiables',
        'Maintain 14-day zero distraction streak',
        'Review weekly performance scores every Sunday',
      ];
    }
    if (category === 'Fitness' || category === 'Body') {
      return [
        'Complete baseline fitness assessment',
        'Log 5 workouts per week consistently',
        'Achieve target strength / endurance benchmark',
      ];
    }
    if (category === 'Nutrition') {
      return [
        'Track daily meals and macro ratios',
        'Reach daily hydration targets (3.0L water)',
        'Maintain consistent calorie deficit/surplus for 30 days',
      ];
    }
    if (category === 'Mind') {
      return [
        'Complete daily 10-minute mindfulness check-in',
        'Establish consistent sleep schedule (7.5+ hrs)',
        'Review monthly mental clarity and stress patterns',
      ];
    }
    return [
      'Phase 1: Research & Strategy Definition',
      'Phase 2: Core Execution & Implementation',
      'Phase 3: Review, Optimization & Delivery',
    ];
  },

  calculateScoreBreakdown: () => {
    const { goals } = get();
    if (goals.length === 0) {
      return {
        progressAvgScore: 80,
        milestoneVelocityScore: 80,
        deadlineHealthScore: 85,
        consistencyScore: 85,
        totalScore: 82,
      };
    }

    const progressSum = goals.reduce((acc, g) => acc + g.progressPercent, 0);
    const progressAvgScore = Math.round(progressSum / goals.length);

    let allMilestonesCount = 0;
    let completedMilestonesCount = 0;
    for (const g of goals) {
      allMilestonesCount += g.milestones.length;
      completedMilestonesCount += g.milestones.filter((m) => m.completed).length;
    }

    const milestoneVelocityScore =
      allMilestonesCount > 0 ? Math.round((completedMilestonesCount / allMilestonesCount) * 100) : 80;

    const completedCount = goals.filter((g) => g.status === 'Completed').length;
    const consistencyScore = Math.min(100, Math.round((completedCount / Math.max(1, goals.length)) * 100) + 50);
    const deadlineHealthScore = 88;

    const totalScore = Math.round(
      progressAvgScore * 0.35 +
      milestoneVelocityScore * 0.25 +
      deadlineHealthScore * 0.20 +
      consistencyScore * 0.20
    );

    return {
      progressAvgScore,
      milestoneVelocityScore,
      deadlineHealthScore,
      consistencyScore,
      totalScore,
    };
  },

  recalculateScore: () => {
    const breakdown = get().calculateScoreBreakdown();
    set({ goalScore: breakdown.totalScore });
  },

  generateRuleInsights: () => {
    const { goals } = get();
    const insights: GoalRuleInsight[] = [];

    const activeGoals = goals.filter((g) => g.status === 'Active' || g.status === 'In Progress');
    const highProgressGoals = activeGoals.filter((g) => g.progressPercent >= 70);

    if (highProgressGoals.length > 0) {
      insights.push({
        id: 'g-ins-speed',
        title: 'High Execution Velocity',
        description: `${highProgressGoals.length} goal(s) have passed 70% completion. You are in the final push phase!`,
        category: 'speed',
        icon: 'Zap',
      });
    }

    const totalMilestones = goals.reduce((acc, g) => acc + g.milestones.length, 0);
    const completedM = goals.reduce(
      (acc, g) => acc + g.milestones.filter((m) => m.completed).length,
      0
    );

    if (totalMilestones > 0) {
      insights.push({
        id: 'g-ins-milestones',
        title: 'Milestone Momentum',
        description: `${completedM} out of ${totalMilestones} total project milestones completed across all strategic goals.`,
        category: 'milestone',
        icon: 'CheckCircle2',
      });
    }

    set({ ruleInsights: insights });
  },
}));
