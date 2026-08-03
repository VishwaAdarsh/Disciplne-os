export type WorkoutType =
  | 'Strength'
  | 'Cardio'
  | 'Walking'
  | 'Running'
  | 'Cycling'
  | 'Yoga'
  | 'Stretching'
  | 'Sports'
  | 'Custom';

export type WorkoutIntensity = 'Low' | 'Medium' | 'High' | 'Extreme';

export interface WorkoutSession {
  id: string;
  name: string;
  type: WorkoutType;
  durationMinutes: number;
  caloriesBurned?: number;
  intensity: WorkoutIntensity;
  notes?: string;
  completed: boolean;
  timestamp: string;
  dateStr: string;
}

export interface ActiveWorkoutSession {
  name: string;
  type: WorkoutType;
  status: 'idle' | 'running' | 'paused';
  elapsedSeconds: number;
  startTime: number | null;
}

export interface SleepLog {
  id: string;
  sleepStart: string;
  wakeTime: string;
  durationHours: number;
  durationMinutes: number;
  targetHours: number;
  qualityStars: number; // 1-5 stars
  date: string;
}

export interface WeightLog {
  id: string;
  date: string;
  weightKg: number;
}

export type RecoveryLevel = 'very_tired' | 'tired' | 'normal' | 'good' | 'excellent';

export interface RecoveryOption {
  level: RecoveryLevel;
  label: string;
  emoji: string;
  color: string;
  scoreBonus: number; // 20 to 100
}

export interface BodyActivityEvent {
  id: string;
  type:
    | 'WORKOUT_COMPLETED'
    | 'STEPS_LOGGED'
    | 'WATER_LOGGED'
    | 'SLEEP_LOGGED'
    | 'WEIGHT_LOGGED'
    | 'RECOVERY_LOGGED';
  title: string;
  subtext: string;
  timestamp: string;
  icon: string;
}

export interface BodyScoreBreakdown {
  workoutScore: number;
  stepScore: number;
  sleepScore: number;
  waterScore: number;
  recoveryScore: number;
  totalScore: number;
}

export interface DailyGoalStatus {
  workoutDone: boolean;
  stepsCurrent: number;
  stepsTarget: number;
  sleepHours: number;
  sleepTarget: number;
  waterLiters: number;
  waterTarget: number;
  recoveryLogged: boolean;
  recoveryLevel: RecoveryLevel | null;
}
