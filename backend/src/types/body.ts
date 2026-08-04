/**
 * Body Module Domain Types & DTOs (SPR-308)
 */

export interface WorkoutRecord {
  id: string;
  user_id: string;
  name: string;
  category: string;
  duration_minutes: number;
  calories_burned: number;
  intensity: string;
  notes?: string | null;
  log_date: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface SleepRecord {
  id: string;
  user_id: string;
  sleep_start?: string | null;
  sleep_end?: string | null;
  duration_minutes: number;
  quality_percent: number;
  notes?: string | null;
  log_date: string;
  created_at: string;
}

export interface WaterRecord {
  id: string;
  user_id: string;
  amount_ml: number;
  logged_at: string;
  created_at: string;
}

export interface StepRecord {
  id: string;
  user_id: string;
  steps_count: number;
  log_date: string;
  created_at: string;
}

export interface WeightRecord {
  id: string;
  user_id: string;
  weight_kg: number;
  chest_cm?: number | null;
  waist_cm?: number | null;
  hip_cm?: number | null;
  arm_cm?: number | null;
  thigh_cm?: number | null;
  notes?: string | null;
  logged_at: string;
  created_at: string;
}

export interface CreateWorkoutInput {
  userId: string;
  name: string;
  category?: string;
  durationMinutes?: number;
  caloriesBurned?: number;
  intensity?: 'low' | 'medium' | 'high' | 'extreme';
  notes?: string;
  logDate?: string;
}

export interface UpdateWorkoutInput {
  name?: string;
  category?: string;
  durationMinutes?: number;
  caloriesBurned?: number;
  intensity?: 'low' | 'medium' | 'high' | 'extreme';
  notes?: string;
}

export interface LogSleepInput {
  userId: string;
  sleepStart?: string;
  sleepEnd?: string;
  durationMinutes?: number;
  qualityPercent?: number;
  notes?: string;
  logDate?: string;
}

export interface LogWaterInput {
  userId: string;
  amountMl: number;
  loggedAt?: string;
}

export interface LogStepsInput {
  userId: string;
  stepsCount: number;
  logDate?: string;
}

export interface LogWeightInput {
  userId: string;
  weightKg: number;
  chestCm?: number;
  waistCm?: number;
  hipCm?: number;
  armCm?: number;
  thighCm?: number;
  notes?: string;
  loggedAt?: string;
}

export interface WorkoutDTO {
  id: string;
  userId: string;
  name: string;
  category: string;
  durationMinutes: number;
  caloriesBurned: number;
  intensity: string;
  notes?: string | null;
  logDate: string;
  createdAt: string;
}

export interface SleepDTO {
  id: string;
  userId: string;
  sleepStart?: string | null;
  sleepEnd?: string | null;
  durationMinutes: number;
  durationHours: number;
  qualityPercent: number;
  notes?: string | null;
  logDate: string;
  createdAt: string;
}

export interface WaterDTO {
  id: string;
  userId: string;
  amountMl: number;
  amountLiters: number;
  amountOz: number;
  loggedAt: string;
}

export interface StepDTO {
  id: string;
  userId: string;
  stepsCount: number;
  logDate: string;
  createdAt: string;
}

export interface WeightDTO {
  id: string;
  userId: string;
  weightKg: number;
  weightLbs: number;
  bodyMeasurements?: {
    chestCm?: number | null;
    waistCm?: number | null;
    hipCm?: number | null;
    armCm?: number | null;
    thighCm?: number | null;
  };
  notes?: string | null;
  loggedAt: string;
}

export interface BodySummaryDTO {
  userId: string;
  date: string;
  workouts: {
    completedCount: number;
    totalMinutes: number;
    caloriesBurned: number;
  };
  water: {
    totalMl: number;
    totalLiters: number;
    targetLiters: number;
    progressPercent: number;
  };
  sleep: {
    logged: boolean;
    durationHours: number;
    qualityPercent: number;
  };
  steps: {
    current: number;
    target: number;
    progressPercent: number;
  };
  weight: {
    latestKg: number | null;
    targetKg: number;
  };
}
