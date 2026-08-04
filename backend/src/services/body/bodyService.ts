/**
 * Body Service (SPR-308 / ARCH-002)
 */

import crypto from 'crypto';
import { bodyRepository } from '../../repositories/body/bodyRepository';
import { eventDispatcher } from '../../events/eventDispatcher';
import {
  CreateWorkoutInput,
  UpdateWorkoutInput,
  LogSleepInput,
  LogWaterInput,
  LogStepsInput,
  LogWeightInput,
  WorkoutDTO,
  SleepDTO,
  WaterDTO,
  StepDTO,
  WeightDTO,
  BodySummaryDTO,
} from '../../types/body';
import { NotFoundError } from '../../errors/AppError';

export class BodyService {
  // WORKOUTS
  async getWorkouts(userId: string, date?: string): Promise<WorkoutDTO[]> {
    const records = await bodyRepository.findWorkouts(userId, date);
    return records.map((r) => bodyRepository.toWorkoutDTO(r));
  }

  async logWorkout(input: CreateWorkoutInput): Promise<WorkoutDTO> {
    const id = `w_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const dateStr = input.logDate || new Date().toISOString().split('T')[0];

    const record = await bodyRepository.createWorkout({
      id,
      user_id: input.userId,
      name: input.name,
      category: input.category || 'Strength',
      duration_minutes: input.durationMinutes ?? 45,
      calories_burned: input.caloriesBurned ?? 300,
      intensity: input.intensity || 'medium',
      notes: input.notes || null,
      log_date: dateStr,
    });

    const dto = bodyRepository.toWorkoutDTO(record);

    // Event Publishing
    await eventDispatcher.publish({
      userId: input.userId,
      module: 'body',
      eventType: 'WORKOUT_LOGGED',
      title: `Logged Workout: ${dto.name}`,
      description: `${dto.durationMinutes}m · ${dto.caloriesBurned} kcal · ${dto.intensity}`,
      icon: '💪',
      metadata: { workoutId: id, name: dto.name, duration: dto.durationMinutes, calories: dto.caloriesBurned },
      scoreImpact: Math.min(20, Math.ceil(dto.durationMinutes / 3)),
    });

    return dto;
  }

  async updateWorkout(id: string, userId: string, updates: UpdateWorkoutInput): Promise<WorkoutDTO> {
    const existing = await bodyRepository.findWorkoutById(id);
    if (!existing || existing.user_id !== userId) {
      throw new NotFoundError(`Workout with ID ${id} not found`);
    }

    const updated = await bodyRepository.updateWorkout(id, {
      name: updates.name,
      category: updates.category,
      duration_minutes: updates.durationMinutes,
      calories_burned: updates.caloriesBurned,
      intensity: updates.intensity,
      notes: updates.notes,
    });

    return bodyRepository.toWorkoutDTO(updated!);
  }

  async deleteWorkout(id: string, userId: string): Promise<boolean> {
    const existing = await bodyRepository.findWorkoutById(id);
    if (!existing || existing.user_id !== userId) {
      throw new NotFoundError(`Workout with ID ${id} not found`);
    }
    return bodyRepository.deleteWorkout(id);
  }

  // SLEEP
  async logSleep(input: LogSleepInput): Promise<SleepDTO> {
    const id = `sl_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const dateStr = input.logDate || new Date().toISOString().split('T')[0];

    const record = await bodyRepository.logSleep({
      id,
      user_id: input.userId,
      sleep_start: input.sleepStart || null,
      sleep_end: input.sleepEnd || null,
      duration_minutes: input.durationMinutes ?? 480,
      quality_percent: input.qualityPercent ?? 80,
      notes: input.notes || null,
      log_date: dateStr,
    });

    const dto = bodyRepository.toSleepDTO(record);

    await eventDispatcher.publish({
      userId: input.userId,
      module: 'body',
      eventType: 'SLEEP_LOGGED',
      title: `Logged Sleep: ${dto.durationHours} hours (${dto.qualityPercent}% quality)`,
      icon: '🌙',
      metadata: { sleepId: dto.id, durationHours: dto.durationHours, quality: dto.qualityPercent },
      scoreImpact: dto.durationHours >= 7 ? 15 : 5,
    });

    return dto;
  }

  async getSleep(userId: string, dateStr?: string): Promise<SleepDTO | null> {
    const targetDate = dateStr || new Date().toISOString().split('T')[0];
    const record = await bodyRepository.getSleepByDate(userId, targetDate);
    return record ? bodyRepository.toSleepDTO(record) : null;
  }

  // WATER
  async logWater(input: LogWaterInput): Promise<WaterDTO> {
    const id = `wt_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

    const record = await bodyRepository.logWater({
      id,
      user_id: input.userId,
      amount_ml: input.amountMl,
      logged_at: input.loggedAt || new Date().toISOString(),
    });

    const dto = bodyRepository.toWaterDTO(record);

    await eventDispatcher.publish({
      userId: input.userId,
      module: 'body',
      eventType: 'WATER_LOGGED',
      title: `Logged Hydration: +${dto.amountMl}ml (${dto.amountLiters}L)`,
      icon: '💧',
      metadata: { waterId: dto.id, amountMl: dto.amountMl, amountLiters: dto.amountLiters },
      scoreImpact: 5,
    });

    return dto;
  }

  // STEPS
  async logSteps(input: LogStepsInput): Promise<StepDTO> {
    const id = `st_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const dateStr = input.logDate || new Date().toISOString().split('T')[0];

    const record = await bodyRepository.logSteps({
      id,
      user_id: input.userId,
      steps_count: input.stepsCount,
      log_date: dateStr,
    });

    const dto = bodyRepository.toStepDTO(record);

    await eventDispatcher.publish({
      userId: input.userId,
      module: 'body',
      eventType: 'STEPS_LOGGED',
      title: `Updated Daily Steps: ${dto.stepsCount.toLocaleString()} steps`,
      icon: '👟',
      metadata: { steps: dto.stepsCount },
      scoreImpact: dto.stepsCount >= 10000 ? 15 : 5,
    });

    return dto;
  }

  // WEIGHT
  async logWeight(input: LogWeightInput): Promise<WeightDTO> {
    const id = `wg_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

    const record = await bodyRepository.logWeight({
      id,
      user_id: input.userId,
      weight_kg: input.weightKg,
      chest_cm: input.chestCm || null,
      waist_cm: input.waistCm || null,
      hip_cm: input.hipCm || null,
      arm_cm: input.armCm || null,
      thigh_cm: input.thighCm || null,
      notes: input.notes || null,
      logged_at: input.loggedAt || new Date().toISOString(),
    });

    const dto = bodyRepository.toWeightDTO(record);

    await eventDispatcher.publish({
      userId: input.userId,
      module: 'body',
      eventType: 'WEIGHT_LOGGED',
      title: `Recorded Weight: ${dto.weightKg} kg (${dto.weightLbs} lbs)`,
      icon: '⚖️',
      metadata: { weightKg: dto.weightKg, weightLbs: dto.weightLbs },
      scoreImpact: 10,
    });

    return dto;
  }

  // DAILY HEALTH SUMMARY
  async getDailySummary(userId: string, dateStr?: string): Promise<BodySummaryDTO> {
    const date = dateStr || new Date().toISOString().split('T')[0];

    const workouts = await bodyRepository.findWorkouts(userId, date);
    const totalWorkoutMinutes = workouts.reduce((acc, w) => acc + (w.duration_minutes || 0), 0);
    const totalCaloriesBurned = workouts.reduce((acc, w) => acc + (w.calories_burned || 0), 0);

    const totalWaterMl = await bodyRepository.getTodayWaterTotal(userId, date);
    const waterLiters = Number((totalWaterMl / 1000).toFixed(2));
    const targetWaterLiters = 3.0;

    const sleepRecord = await bodyRepository.getSleepByDate(userId, date);
    const sleepHours = sleepRecord ? Number((sleepRecord.duration_minutes / 60).toFixed(1)) : 0;
    const sleepQuality = sleepRecord ? sleepRecord.quality_percent : 0;

    const currentSteps = await bodyRepository.getStepsByDate(userId, date);
    const targetSteps = 10000;

    const latestWeightRecord = await bodyRepository.getLatestWeight(userId);
    const latestWeight = latestWeightRecord ? latestWeightRecord.weight_kg : null;

    return {
      userId,
      date,
      workouts: {
        completedCount: workouts.length,
        totalMinutes: totalWorkoutMinutes,
        caloriesBurned: totalCaloriesBurned,
      },
      water: {
        totalMl: totalWaterMl,
        totalLiters: waterLiters,
        targetLiters: targetWaterLiters,
        progressPercent: Math.min(100, Math.round((waterLiters / targetWaterLiters) * 100)),
      },
      sleep: {
        logged: Boolean(sleepRecord),
        durationHours: sleepHours,
        qualityPercent: sleepQuality,
      },
      steps: {
        current: currentSteps,
        target: targetSteps,
        progressPercent: Math.min(100, Math.round((currentSteps / targetSteps) * 100)),
      },
      weight: {
        latestKg: latestWeight,
        targetKg: 70.0,
      },
    };
  }
}

export const bodyService = new BodyService();
