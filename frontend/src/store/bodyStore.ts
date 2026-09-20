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
import { useEventEngineStore } from './eventEngineStore';

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
  syncHealthConnect: () => void;
  logSleep: (start: string, wake: string, qualityStars: number) => void;
  logWeight: (weightKg: number) => void;
  logRecovery: (level: RecoveryLevel) => void;
  calculateScoreBreakdown: () => BodyScoreBreakdown;
  recalculateScore: () => void;
}

export const useBodyStore = create<BodyState>((set, get) => ({
  bodyScore: 0,
  steps: {
    current: 0,
    target: 10000,
    caloriesBurned: 0,
    distanceKm: 0,
    weeklyHistory: [],
  },
  workout: {
    todayTitle: '',
    durationMinutes: 0,
    caloriesBurned: 0,
    completed: false,
    streakDays: 0,
    weeklyCount: 0,
    weeklyTarget: 5,
    recentWorkouts: [],
  },
  sleep: {
    durationHours: 0,
    durationMinutes: 0,
    targetHours: 8,
    qualityPercent: 0,
    qualityStars: 0,
    sleepStart: '',
    wakeTime: '',
    weeklyHistory: [],
    logs: [],
  },
  water: {
    currentLiters: 0,
    targetLiters: 3.0,
    logs: [],
  },
  weight: {
    currentKg: 0,
    targetKg: 0,
    change30Days: 0,
    history30Days: [],
  },
  recovery: {
    currentLevel: null,
    loggedToday: false,
  },
  activeSession: {
    name: '',
    type: 'Strength',
    status: 'idle',
    elapsedSeconds: 0,
    startTime: null,
  },
  activityFeed: [],

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

    // Push to central Event Engine
    useEventEngineStore.getState().emitEvent({
      module: 'body',
      eventType: 'WORKOUT_COMPLETED',
      title: `Finished Workout: ${activeSession.name}`,
      description: `${durationMinutes} mins · ${estimatedCalories} kcal · ${intensity} Intensity`,
      icon: '💪',
      payload: { name: activeSession.name, durationMinutes, estimatedCalories, intensity },
      scoreImpact: 8,
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

    useEventEngineStore.getState().emitEvent({
      module: 'body',
      eventType: 'WATER_LOGGED',
      title: `Water Logged (+${amountMl} ml)`,
      description: `Current total: ${newLiters}L / ${water.targetLiters}L`,
      icon: '💧',
      payload: { amountMl, newLiters, targetLiters: water.targetLiters },
      scoreImpact: 2,
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

  syncHealthConnect: () => {
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
    // Default duration calculation
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
