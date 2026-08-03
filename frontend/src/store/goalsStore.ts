import { create } from 'zustand';
import type {
  GoalItem,
  GoalCategory,
  GoalStatus,
  GoalPriority,
  GoalRuleInsight,
  GoalActivityEvent,
  GoalScoreBreakdown,
} from '../types/goals';
import { useOverviewStore } from './overviewStore';

interface GoalsState {
  goalScore: number;
  goals: GoalItem[];
  ruleInsights: GoalRuleInsight[];
  activityFeed: GoalActivityEvent[];
  weeklyProgressHistory: Array<{
    week: string;
    progressAvg: number;
    completedCount: number;
  }>;

  // Actions
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
  goalScore: 84,
  goals: [
    {
      id: 'g1',
      title: 'LEARN PYTHON & DATA SCIENCE',
      description: 'Master Python fundamentals, pandas data wrangling, and machine learning models.',
      category: 'Career',
      color: '#6366F1',
      startDate: '2026-07-01',
      deadline: 'Aug 31',
      priority: 'High',
      status: 'Active',
      progressPercent: 75,
      targetValue: '16 Modules',
      milestones: [
        { id: 'm1-1', title: 'Python Syntax & Variables', completed: true },
        { id: 'm1-2', title: 'Control Flow & Functions', completed: true },
        { id: 'm1-3', title: 'Object Oriented Programming', completed: true },
        { id: 'm1-4', title: 'Pandas & Data Wrangling', completed: false, dueDate: 'Aug 15' },
        { id: 'm1-5', title: 'Matplotlib & Seaborn Visualization', completed: false, dueDate: 'Aug 25' },
        { id: 'm1-6', title: 'Build Capstone Analytics Dashboard', completed: false, dueDate: 'Aug 31' },
      ],
      linkedTasks: [
        { id: 't-1', name: 'Study Python 45m Daily', engineSource: 'discipline' },
      ],
      notes: 'Focus on hands-on pandas code projects.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'g2',
      title: 'BUILD PORTFOLIO SHOWCASE',
      description: 'Design and deploy a full-stack personal portfolio showcasing top 3 projects.',
      category: 'Career',
      color: '#10B981',
      startDate: '2026-07-15',
      deadline: 'Aug 30',
      priority: 'Critical',
      status: 'Active',
      progressPercent: 50,
      targetValue: '3 Apps Deployed',
      milestones: [
        { id: 'm2-1', title: 'Wireframe Layout & Color Tokens', completed: true },
        { id: 'm2-2', title: 'Implement React Frontend Components', completed: true },
        { id: 'm2-3', title: 'Connect REST API Backend', completed: false, dueDate: 'Aug 20' },
        { id: 'm2-4', title: 'Deploy to Production Vercel', completed: false, dueDate: 'Aug 30' },
      ],
      linkedTasks: [
        { id: 't-2', name: 'Code Frontend Components', engineSource: 'discipline' },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'g3',
      title: 'FITNESS CONSISTENCY',
      description: 'Maintain 5 workouts per week and reach target strength metrics.',
      category: 'Fitness',
      color: '#0EA5E9',
      startDate: '2026-06-01',
      deadline: 'Ongoing',
      priority: 'Medium',
      status: 'Active',
      progressPercent: 65,
      targetValue: '5 workouts/wk',
      milestones: [
        { id: 'm3-1', title: 'Hit 4 consecutive weeks of 5x workouts', completed: true },
        { id: 'm3-2', title: 'Reach 70kg Body Weight Goal', completed: false, dueDate: 'Sep 15' },
        { id: 'm3-3', title: 'Complete 10k Run under 50 minutes', completed: false, dueDate: 'Oct 01' },
      ],
      linkedTasks: [
        { id: 't-3', name: 'Morning Strength Workout', engineSource: 'body' },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'g4',
      title: 'DAILY MINDFULNESS HABIT',
      description: 'Practice meditation and daily journaling for emotional clarity.',
      category: 'Personal',
      color: '#8B5CF6',
      startDate: '2026-07-01',
      deadline: 'Aug 20',
      priority: 'Low',
      status: 'Active',
      progressPercent: 80,
      targetValue: '30 Days',
      milestones: [
        { id: 'm4-1', title: 'Complete 14 consecutive meditation days', completed: true },
        { id: 'm4-2', title: 'Log 20 daily journal reflections', completed: true },
        { id: 'm4-3', title: 'Maintain 30-day streak', completed: false, dueDate: 'Aug 20' },
      ],
      linkedTasks: [
        { id: 't-4', name: '10m Guided Meditation', engineSource: 'mind' },
      ],
      createdAt: new Date().toISOString(),
    },
  ],
  ruleInsights: [
    {
      id: 'g-ins-1',
      title: 'Fast Progression Rate',
      description: 'Python & Data Science Goal is progressing 15% faster than initial timeline forecast.',
      category: 'speed',
      icon: 'Zap',
    },
    {
      id: 'g-ins-2',
      title: 'Approaching Milestone Deadline',
      description: 'Portfolio Showcase milestone "Connect REST API Backend" is due in 16 days.',
      category: 'deadline',
      icon: 'Calendar',
    },
    {
      id: 'g-ins-3',
      title: 'High Goal Consistency',
      description: 'Daily discipline tasks are linked to 100% of your active strategic goals.',
      category: 'milestone',
      icon: 'Target',
    },
  ],
  activityFeed: [
    {
      id: 'g-act-1',
      type: 'MILESTONE_COMPLETED',
      title: 'Milestone Completed',
      subtext: 'Completed "Object Oriented Programming" in Learn Python Goal',
      timestamp: 'Today, 9:30 AM',
      icon: 'CheckCircle2',
    },
    {
      id: 'g-act-2',
      type: 'MILESTONE_COMPLETED',
      title: 'Milestone Completed',
      subtext: 'Completed "Implement React Frontend Components" in Build Portfolio Goal',
      timestamp: 'Yesterday',
      icon: 'CheckCircle2',
    },
    {
      id: 'g-act-3',
      type: 'GOAL_CREATED',
      title: 'Created New Goal',
      subtext: 'LEARN PYTHON & DATA SCIENCE (Deadline: Aug 31)',
      timestamp: 'Jul 1',
      icon: 'Target',
    },
  ],
  weeklyProgressHistory: [
    { week: 'Week 1', progressAvg: 45, completedCount: 1 },
    { week: 'Week 2', progressAvg: 55, completedCount: 3 },
    { week: 'Week 3', progressAvg: 64, completedCount: 5 },
    { week: 'Week 4', progressAvg: 72, completedCount: 7 },
  ],

  calculateScoreBreakdown: () => {
    const { goals } = get();
    const active = goals.filter((g) => g.status === 'Active');
    if (active.length === 0) {
      return { progressAvgScore: 100, milestoneVelocityScore: 100, deadlineHealthScore: 100, consistencyScore: 100, totalScore: 100 };
    }

    const progressAvgScore = Math.round(
      active.reduce((acc, g) => acc + g.progressPercent, 0) / active.length
    );

    let totalM = 0;
    let doneM = 0;
    active.forEach((g) => {
      totalM += g.milestones.length;
      doneM += g.milestones.filter((m) => m.completed).length;
    });

    const milestoneVelocityScore = totalM > 0 ? Math.round((doneM / totalM) * 100) : 80;
    const deadlineHealthScore = 88;
    const consistencyScore = 85;

    const totalScore = Math.round(
      progressAvgScore * 0.4 +
      milestoneVelocityScore * 0.3 +
      deadlineHealthScore * 0.2 +
      consistencyScore * 0.1
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
      subtext: `Category: ${goalData.category} · Priority: ${goalData.priority} · Deadline: ${goalData.deadline}`,
      timestamp: 'Just now',
      icon: 'Target',
    };

    set({
      goals: [newGoal, ...goals],
      activityFeed: [newActivity, ...activityFeed],
    });

    get().recalculateScore();
    get().generateRuleInsights();

    // Push event to Overview store
    useOverviewStore.getState().pushEvent({
      title: `Created Goal: ${goalData.title}`,
      category: 'goals',
      icon: '🎯',
      type: 'GOAL_UPDATED',
    });
  },

  updateGoal: (id, updates) => {
    const { goals } = get();
    const updated = goals.map((g) => (g.id === id ? { ...g, ...updates } : g));
    set({ goals: updated });
    get().recalculateScore();
  },

  setGoalStatus: (id, status) => {
    const { goals, activityFeed } = get();
    const target = goals.find((g) => g.id === id);
    if (!target) return;

    let eventType: GoalActivityEvent['type'] = 'GOAL_PAUSED';
    if (status === 'Active') eventType = 'GOAL_RESUMED';
    if (status === 'Completed') eventType = 'GOAL_COMPLETED';
    if (status === 'Archived') eventType = 'GOAL_ARCHIVED';

    const newActivity: GoalActivityEvent = {
      id: `g-act-${Date.now()}`,
      type: eventType,
      title: `Goal ${status}: ${target.title}`,
      subtext: `Status updated to ${status}`,
      timestamp: 'Just now',
      icon: 'Target',
    };

    const updated = goals.map((g) => {
      if (g.id === id) {
        const newProgress = status === 'Completed' ? 100 : g.progressPercent;
        return { ...g, status, progressPercent: newProgress };
      }
      return g;
    });

    set({
      goals: updated,
      activityFeed: [newActivity, ...activityFeed],
    });

    get().recalculateScore();
    get().generateRuleInsights();

    useOverviewStore.getState().pushEvent({
      title: `Goal ${status}: ${target.title}`,
      category: 'goals',
      icon: status === 'Completed' ? '🏆' : '🎯',
      type: 'GOAL_UPDATED',
    });
  },

  toggleMilestone: (goalId, milestoneId) => {
    const { goals, activityFeed } = get();
    const targetGoal = goals.find((g) => g.id === goalId);
    if (!targetGoal) return;

    let toggledTitle = '';
    let nowDone = false;

    const updatedMilestones = targetGoal.milestones.map((m) => {
      if (m.id === milestoneId) {
        nowDone = !m.completed;
        toggledTitle = m.title;
        return { ...m, completed: nowDone };
      }
      return m;
    });

    const totalM = updatedMilestones.length;
    const doneM = updatedMilestones.filter((m) => m.completed).length;
    const newProgress = totalM > 0 ? Math.round((doneM / totalM) * 100) : targetGoal.progressPercent;
    const newStatus = newProgress === 100 ? 'Completed' : targetGoal.status;

    const updatedGoals = goals.map((g) =>
      g.id === goalId
        ? { ...g, milestones: updatedMilestones, progressPercent: newProgress, status: newStatus }
        : g
    );

    const activities = [...activityFeed];
    if (nowDone) {
      activities.unshift({
        id: `g-act-${Date.now()}`,
        type: 'MILESTONE_COMPLETED',
        title: `Milestone Completed: ${toggledTitle}`,
        subtext: `Goal: ${targetGoal.title} (${newProgress}% completed)`,
        timestamp: 'Just now',
        icon: 'CheckCircle2',
      });
    }

    set({
      goals: updatedGoals,
      activityFeed: activities,
    });

    get().recalculateScore();
    get().generateRuleInsights();

    if (nowDone) {
      useOverviewStore.getState().pushEvent({
        title: `Completed Milestone: ${toggledTitle} (+${Math.round(100 / totalM)}%)`,
        category: 'goals',
        icon: '✅',
        type: 'GOAL_UPDATED',
      });
    }
  },

  addMilestone: (goalId, title, dueDate) => {
    const { goals } = get();
    const newMilestone = {
      id: `m-${Date.now()}`,
      title,
      completed: false,
      dueDate,
    };

    const updated = goals.map((g) => {
      if (g.id === goalId) {
        const ms = [...g.milestones, newMilestone];
        const done = ms.filter((m) => m.completed).length;
        const progress = Math.round((done / ms.length) * 100);
        return { ...g, milestones: ms, progressPercent: progress };
      }
      return g;
    });

    set({ goals: updated });
    get().recalculateScore();
  },

  deleteMilestone: (goalId, milestoneId) => {
    const { goals } = get();
    const updated = goals.map((g) => {
      if (g.id === goalId) {
        const ms = g.milestones.filter((m) => m.id !== milestoneId);
        const done = ms.filter((m) => m.completed).length;
        const progress = ms.length > 0 ? Math.round((done / ms.length) * 100) : 0;
        return { ...g, milestones: ms, progressPercent: progress };
      }
      return g;
    });

    set({ goals: updated });
    get().recalculateScore();
  },

  deleteGoal: (id) => {
    const { goals } = get();
    set({ goals: goals.filter((g) => g.id !== id) });
    get().recalculateScore();
  },

  aiSuggestMilestones: (title, category) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('python') || titleLower.includes('data')) {
      return [
        'Python Syntax, Variables & Control Flow',
        'Functions, Modules & Object Oriented Programming',
        'Data Analysis with Pandas & NumPy',
        'Data Visualization with Matplotlib & Seaborn',
        'Machine Learning Models & Scikit-Learn',
        'Deploy Analytics Dashboard Project',
      ];
    }
    if (titleLower.includes('react') || titleLower.includes('portfolio') || titleLower.includes('web')) {
      return [
        'Design UI Wireframes & Layout System',
        'HTML5 & CSS Responsive Grid Setup',
        'JavaScript ES6+ Core & Async Concepts',
        'React Components, Props & Hooks State',
        'Backend REST API Integration',
        'Deployment to Production Vercel/Netlify',
      ];
    }
    if (category === 'Fitness' || titleLower.includes('fitness') || titleLower.includes('run')) {
      return [
        'Establish 3x/week workout baseline',
        'Progress to 5x/week workout consistency',
        'Achieve target body weight & nutrition macros',
        'Complete 10k endurance run milestone',
      ];
    }

    // Default template
    return [
      `Phase 1: Foundation & Planning for ${title}`,
      `Phase 2: Core Implementation & Practice`,
      `Phase 3: Testing, Refinement & Review`,
      `Phase 4: Final Launch & Completion`,
    ];
  },

  generateRuleInsights: () => {
    const { goals } = get();
    const insights: GoalRuleInsight[] = [];
    const activeGoals = goals.filter((g) => g.status === 'Active');

    const highProgress = activeGoals.find((g) => g.progressPercent >= 70);
    if (highProgress) {
      insights.push({
        id: 'g-ins-fast',
        title: 'High Progression Rate',
        description: `"${highProgress.title}" has reached ${highProgress.progressPercent}% completion!`,
        category: 'speed',
        icon: 'Zap',
      });
    }

    const nearDeadline = activeGoals.find((g) => g.deadline && g.deadline !== 'Ongoing');
    if (nearDeadline) {
      insights.push({
        id: 'g-ins-deadline',
        title: 'Upcoming Goal Deadline',
        description: `"${nearDeadline.title}" target deadline is approaching (${nearDeadline.deadline}).`,
        category: 'deadline',
        icon: 'Calendar',
      });
    }

    set({ ruleInsights: insights });
  },
}));
