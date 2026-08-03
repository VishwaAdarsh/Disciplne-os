import { create } from 'zustand';
import type {
  WorkoutType,
  WorkoutIntensity,
  WorkoutSession,
  ActiveWorkoutSession,
  SleepLog,
  WeightLog,
  RecoveryLevel,
  BodyActivityEvent,
  BodyScoreBreakdown,
} from '../types/body';
import { useOverviewStore } from './overviewStore';

interface BodyState {
  bodyScore: number;
  steps: {
    current: number;
    target: number;
    caloriesBurned: number;
    distanceKm: number;
    weeklyHistory: Array<{ day: string; count: number }>;
  };
  workout: {
    todayTitle: string;
    durationMinutes: number;
    caloriesBurned: number;
    completed: boolean;
    streakDays: number;
    weeklyCount: number;
    weeklyTarget: number;
    recentWorkouts: WorkoutSession[];
  };
  sleep: {
    durationHours: number;
    durationMinutes: number;
    targetHours: number;
    qualityPercent: number;
    qualityStars: number;
    sleepStart: string;
    wakeTime: string;
    weeklyHistory: Array<{ day: string; hours: number }>;
    logs: SleepLog[];
  };
  water: {
    currentLiters: number;
    targetLiters: number;
    logs: Array<{ amountMl: number; timestamp: string }>;
  };
  weight: {
    currentKg: number;
    targetKg: number;
    change30Days: number;
    history30Days: WeightLog[];
  };
  recovery: {
    currentLevel: RecoveryLevel | null;
    loggedToday: boolean;
  };
  activeSession: ActiveWorkoutSession;
  activityFeed: BodyActivityEvent[];

  // Actions
  startWorkout: (name: string, type: WorkoutType) => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  tickWorkoutTimer: () => void;
  finishWorkout: (notes?: string, calories?: number, intensity?: WorkoutIntensity) => void;
  cancelWorkout: () => void;
  logCustomWorkout: (session: {
    name: string;
    type: WorkoutType;
    durationMinutes: number;
    caloriesBurned?: number;
    intensity: WorkoutIntensity;
    notes?: string;
  }) => void;
  addWater: (amountMl: number) => void;
  updateSteps: (steps: number) => void;
  mockSyncHealthConnect: () => void;
  logSleep: (start: string, wake: string, qualityStars: number) => void;
  logWeight: (weightKg: number) => void;
  logRecovery: (level: RecoveryLevel) => void;
  calculateScoreBreakdown: () => BodyScoreBreakdown;
  recalculateScore: () => void;
}

export const useBodyStore = create<BodyState>((set, get) => ({
  bodyScore: 78,
  steps: {
    current: 8432,
    target: 10000,
    caloriesBurned: 360,
    distanceKm: 6.1,
    weeklyHistory: [
      { day: 'Mon', count: 7200 },
      { day: 'Tue', count: 9100 },
      { day: 'Wed', count: 10400 },
      { day: 'Thu', count: 8500 },
      { day: 'Fri', count: 9800 },
      { day: 'Sat', count: 11200 },
      { day: 'Sun', count: 8432 },
    ],
  },
  workout: {
    todayTitle: 'Strength Training',
    durationMinutes: 45,
    caloriesBurned: 420,
    completed: true,
    streakDays: 6,
    weeklyCount: 4,
    weeklyTarget: 5,
    recentWorkouts: [
      {
        id: 'w1',
        name: 'Push Day - Upper Body Focus',
        type: 'Strength',
        durationMinutes: 45,
        caloriesBurned: 420,
        intensity: 'High',
        completed: true,
        timestamp: new Date().toISOString(),
        dateStr: 'Today, 7:20 AM',
      },
      {
        id: 'w2',
        name: 'Pull Day - Back & Biceps',
        type: 'Strength',
        durationMinutes: 50,
        caloriesBurned: 460,
        intensity: 'High',
        completed: true,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        dateStr: 'Yesterday',
      },
      {
        id: 'w3',
        name: 'Zone 2 Cardio Run',
        type: 'Running',
        durationMinutes: 35,
        caloriesBurned: 310,
        intensity: 'Medium',
        completed: true,
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        dateStr: '2 days ago',
      },
    ],
  },
  sleep: {
    durationHours: 7,
    durationMinutes: 26,
    targetHours: 8,
    qualityPercent: 88,
    qualityStars: 4,
    sleepStart: '11:10 PM',
    wakeTime: '6:36 AM',
    weeklyHistory: [
      { day: 'Mon', hours: 7.1 },
      { day: 'Tue', hours: 7.8 },
      { day: 'Wed', hours: 6.9 },
      { day: 'Thu', hours: 7.4 },
      { day: 'Fri', hours: 8.0 },
      { day: 'Sat', hours: 8.2 },
      { day: 'Sun', hours: 7.43 },
    ],
    logs: [
      {
        id: 'sl-1',
        sleepStart: '11:10 PM',
        wakeTime: '6:36 AM',
        durationHours: 7,
        durationMinutes: 26,
        targetHours: 8,
        qualityStars: 4,
        date: 'Today',
      },
    ],
  },
  water: {
    currentLiters: 2.2,
    targetLiters: 3.0,
    logs: [
      { amountMl: 500, timestamp: '8:00 AM' },
      { amountMl: 500, timestamp: '10:30 AM' },
      { amountMl: 700, timestamp: '1:15 PM' },
      { amountMl: 500, timestamp: '4:00 PM' },
    ],
  },
  weight: {
    currentKg: 68.4,
    targetKg: 70.0,
    change30Days: -0.8,
    history30Days: [
      { id: 'wt-1', date: 'Jul 1', weightKg: 69.2 },
      { id: 'wt-2', date: 'Jul 7', weightKg: 69.0 },
      { id: 'wt-3', date: 'Jul 14', weightKg: 68.7 },
      { id: 'wt-4', date: 'Jul 21', weightKg: 68.5 },
      { id: 'wt-5', date: 'Jul 28', weightKg: 68.4 },
      { id: 'wt-6', date: 'Aug 3', weightKg: 68.4 },
    ],
  },
  recovery: {
    currentLevel: 'good',
    loggedToday: true,
  },
  activeSession: {
    name: '',
    type: 'Strength',
    status: 'idle',
    elapsedSeconds: 0,
    startTime: null,
  },
  activityFeed: [
    {
      id: 'act-1',
      type: 'WORKOUT_COMPLETED',
      title: 'Completed Workout',
      subtext: 'Push Day - Upper Body Focus (45 min)',
      timestamp: 'Today, 7:20 AM',
      icon: 'Dumbbell',
    },
    {
      id: 'act-2',
      type: 'WATER_LOGGED',
      title: 'Logged Water',
      subtext: '+500 ml added (Total 2.2L / 3.0L)',
      timestamp: 'Today, 4:00 PM',
      icon: 'Droplet',
    },
    {
      id: 'act-3',
      type: 'SLEEP_LOGGED',
      title: 'Logged Sleep',
      subtext: '7h 26m recorded (Quality ★★★★☆)',
      timestamp: 'Today, 6:40 AM',
      icon: 'Moon',
    },
  ],

  calculateScoreBreakdown: () => {
    const { workout, steps, sleep, water, recovery } = get();
    const workoutScore = workout.completed ? 100 : Math.min(100, Math.round((workout.durationMinutes / 45) * 100));
    const stepScore = Math.min(100, Math.round((steps.current / steps.target) * 100));
    const totalSleepHours = sleep.durationHours + sleep.durationMinutes / 60;
    const sleepRatioScore = Math.min(100, Math.round((totalSleepHours / sleep.targetHours) * 100));
    const sleepQualityBonus = (sleep.qualityStars / 5) * 100;
    const sleepScore = Math.round(sleepRatioScore * 0.65 + sleepQualityBonus * 0.35);
    const waterScore = Math.min(100, Math.round((water.currentLiters / water.targetLiters) * 100));

    const recoveryMap: Record<RecoveryLevel, number> = {
      very_tired: 30,
      tired: 50,
      normal: 70,
      good: 88,
      excellent: 100,
    };
    const recoveryScore = recovery.currentLevel ? recoveryMap[recovery.currentLevel] : 70;

    const totalScore = Math.round(
      workoutScore * 0.25 +
      stepScore * 0.25 +
      sleepScore * 0.20 +
      waterScore * 0.15 +
      recoveryScore * 0.15
    );

    return {
      workoutScore,
      stepScore,
      sleepScore,
      waterScore,
      recoveryScore,
      totalScore,
    };
  },

  recalculateScore: () => {
    const breakdown = get().calculateScoreBreakdown();
    set({ bodyScore: breakdown.totalScore });
  },

  startWorkout: (name, type) => {
    set({
      activeSession: {
        name: name || `${type} Session`,
        type,
        status: 'running',
        elapsedSeconds: 0,
        startTime: Date.now(),
      },
    });
  },

  pauseWorkout: () => {
    set((s) => ({
      activeSession: { ...s.activeSession, status: 'paused' },
    }));
  },

  resumeWorkout: () => {
    set((s) => ({
      activeSession: { ...s.activeSession, status: 'running' },
    }));
  },

  tickWorkoutTimer: () => {
    const { activeSession } = get();
    if (activeSession.status === 'running') {
      set({
        activeSession: {
          ...activeSession,
          elapsedSeconds: activeSession.elapsedSeconds + 1,
        },
      });
    }
  },

  finishWorkout: (notes = '', calories, intensity = 'Medium') => {
    const { activeSession, workout, activityFeed } = get();
    const durationMinutes = Math.max(1, Math.round(activeSession.elapsedSeconds / 60));
    const estimatedCalories = calories || durationMinutes * 8;

    const newSession: WorkoutSession = {
      id: `w-${Date.now()}`,
      name: activeSession.name,
      type: activeSession.type,
      durationMinutes,
      caloriesBurned: estimatedCalories,
      intensity,
      notes,
      completed: true,
      timestamp: new Date().toISOString(),
      dateStr: 'Just now',
    };

    const newActivity: BodyActivityEvent = {
      id: `act-${Date.now()}`,
      type: 'WORKOUT_COMPLETED',
      title: `Completed ${activeSession.name}`,
      subtext: `${durationMinutes} min · ${estimatedCalories} kcal · ${intensity} Intensity`,
      timestamp: 'Just now',
      icon: 'Dumbbell',
    };

    set({
      activeSession: {
        name: '',
        type: 'Strength',
        status: 'idle',
        elapsedSeconds: 0,
        startTime: null,
      },
      workout: {
        ...workout,
        todayTitle: activeSession.name,
        durationMinutes,
        caloriesBurned: estimatedCalories,
        completed: true,
        weeklyCount: workout.weeklyCount + 1,
        recentWorkouts: [newSession, ...workout.recentWorkouts],
      },
      activityFeed: [newActivity, ...activityFeed],
    });

    get().recalculateScore();

    // Push to central Overview store
    useOverviewStore.getState().pushEvent({
      title: `Finished Workout: ${activeSession.name} (${durationMinutes}m)`,
      category: 'body',
      icon: '⚡',
      type: 'WORKOUT_COMPLETED',
    });
  },

  cancelWorkout: () => {
    set({
      activeSession: {
        name: '',
        type: 'Strength',
        status: 'idle',
        elapsedSeconds: 0,
        startTime: null,
      },
    });
  },

  logCustomWorkout: (session) => {
    const { workout, activityFeed } = get();
    const newSession: WorkoutSession = {
      id: `w-${Date.now()}`,
      name: session.name,
      type: session.type,
      durationMinutes: session.durationMinutes,
      caloriesBurned: session.caloriesBurned || session.durationMinutes * 7,
      intensity: session.intensity,
      notes: session.notes,
      completed: true,
      timestamp: new Date().toISOString(),
      dateStr: 'Today',
    };

    const newActivity: BodyActivityEvent = {
      id: `act-${Date.now()}`,
      type: 'WORKOUT_COMPLETED',
      title: `Logged Workout: ${session.name}`,
      subtext: `${session.durationMinutes} min · ${newSession.caloriesBurned} kcal`,
      timestamp: 'Just now',
      icon: 'Dumbbell',
    };

    set({
      workout: {
        ...workout,
        todayTitle: session.name,
        durationMinutes: session.durationMinutes,
        caloriesBurned: newSession.caloriesBurned || 0,
        completed: true,
        recentWorkouts: [newSession, ...workout.recentWorkouts],
      },
      activityFeed: [newActivity, ...activityFeed],
    });

    get().recalculateScore();

    useOverviewStore.getState().pushEvent({
      title: `Logged ${session.name} (${session.durationMinutes} min)`,
      category: 'body',
      icon: '💪',
      type: 'WORKOUT_COMPLETED',
    });
  },

  addWater: (amountMl) => {
    const { water, activityFeed } = get();
    const newLiters = Number((water.currentLiters + amountMl / 1000).toFixed(2));
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newActivity: BodyActivityEvent = {
      id: `act-${Date.now()}`,
      type: 'WATER_LOGGED',
      title: 'Added Hydration',
      subtext: `+${amountMl} ml logged (${newLiters}L / ${water.targetLiters}L)`,
      timestamp: nowTime,
      icon: 'Droplet',
    };

    set({
      water: {
        ...water,
        currentLiters: newLiters,
        logs: [{ amountMl, timestamp: nowTime }, ...water.logs],
      },
      activityFeed: [newActivity, ...activityFeed],
    });

    get().recalculateScore();

    useOverviewStore.getState().pushEvent({
      title: `Added +${amountMl} ml Water (${newLiters}L / ${water.targetLiters}L)`,
      category: 'body',
      icon: '💧',
      type: 'WATER_LOGGED',
    });
  },

  updateSteps: (newSteps) => {
    const { steps, activityFeed } = get();
    const distanceKm = Number((newSteps * 0.00075).toFixed(1));
    const caloriesBurned = Math.round(newSteps * 0.04);

    const newActivity: BodyActivityEvent = {
      id: `act-${Date.now()}`,
      type: 'STEPS_LOGGED',
      title: 'Steps Updated',
      subtext: `${newSteps.toLocaleString()} / ${steps.target.toLocaleString()} steps (${distanceKm} km)`,
      timestamp: 'Just now',
      icon: 'Activity',
    };

    set({
      steps: {
        ...steps,
        current: newSteps,
        distanceKm,
        caloriesBurned,
      },
      activityFeed: [newActivity, ...activityFeed],
    });

    get().recalculateScore();
  },

  mockSyncHealthConnect: () => {
    const { steps } = get();
    const syncedSteps = Math.min(steps.target, steps.current + 1500);
    get().updateSteps(syncedSteps);
    useOverviewStore.getState().pushEvent({
      title: `Synced with Google Health Connect (+1,500 steps)`,
      category: 'body',
      icon: '📲',
      type: 'STEPS_LOGGED',
    });
  },

  logSleep: (start, wake, qualityStars) => {
    const { sleep, activityFeed } = get();
    // Simple duration parsing for demo
    const durationHours = 7;
    const durationMinutes = 30;

    const newLog: SleepLog = {
      id: `sl-${Date.now()}`,
      sleepStart: start,
      wakeTime: wake,
      durationHours,
      durationMinutes,
      targetHours: sleep.targetHours,
      qualityStars,
      date: 'Today',
    };

    const newActivity: BodyActivityEvent = {
      id: `act-${Date.now()}`,
      type: 'SLEEP_LOGGED',
      title: 'Recorded Sleep',
      subtext: `${start} → ${wake} (${durationHours}h ${durationMinutes}m) · Star Rating ${qualityStars}/5`,
      timestamp: 'Just now',
      icon: 'Moon',
    };

    set({
      sleep: {
        ...sleep,
        sleepStart: start,
        wakeTime: wake,
        qualityStars,
        qualityPercent: qualityStars * 20,
        logs: [newLog, ...sleep.logs],
      },
      activityFeed: [newActivity, ...activityFeed],
    });

    get().recalculateScore();

    useOverviewStore.getState().pushEvent({
      title: `Logged Sleep: ${durationHours}h ${durationMinutes}m (${qualityStars} Stars)`,
      category: 'body',
      icon: '😴',
      type: 'MOOD_LOGGED',
    });
  },

  logWeight: (weightKg) => {
    const { weight, activityFeed } = get();
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const newLog: WeightLog = {
      id: `wt-${Date.now()}`,
      date: dateStr,
      weightKg,
    };

    const diff = Number((weightKg - weight.history30Days[0].weightKg).toFixed(1));

    const newActivity: BodyActivityEvent = {
      id: `act-${Date.now()}`,
      type: 'WEIGHT_LOGGED',
      title: 'Weight Logged',
      subtext: `${weightKg} kg (30-day change: ${diff > 0 ? '+' : ''}${diff} kg)`,
      timestamp: 'Just now',
      icon: 'Scale',
    };

    set({
      weight: {
        ...weight,
        currentKg: weightKg,
        change30Days: diff,
        history30Days: [...weight.history30Days, newLog],
      },
      activityFeed: [newActivity, ...activityFeed],
    });

    useOverviewStore.getState().pushEvent({
      title: `Updated Weight: ${weightKg} kg`,
      category: 'body',
      icon: '⚖️',
      type: 'GOAL_UPDATED',
    });
  },

  logRecovery: (level) => {
    const { recovery, activityFeed } = get();
    const labels: Record<RecoveryLevel, string> = {
      very_tired: 'Very Tired (😫)',
      tired: 'Tired (😕)',
      normal: 'Normal (😐)',
      good: 'Good (🙂)',
      excellent: 'Excellent (💪)',
    };

    const newActivity: BodyActivityEvent = {
      id: `act-${Date.now()}`,
      type: 'RECOVERY_LOGGED',
      title: 'Logged Recovery State',
      subtext: `Body Readiness: ${labels[level]}`,
      timestamp: 'Just now',
      icon: 'Zap',
    };

    set({
      recovery: {
        currentLevel: level,
        loggedToday: true,
      },
      activityFeed: [newActivity, ...activityFeed],
    });

    get().recalculateScore();

    useOverviewStore.getState().pushEvent({
      title: `Physical Recovery Set: ${labels[level]}`,
      category: 'body',
      icon: '🔋',
      type: 'MOOD_LOGGED',
    });
  },
}));
