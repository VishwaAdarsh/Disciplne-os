/**
 * Body Controller (SPR-308 / ARCH-002)
 */

import type { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types/foundation';
import { bodyService } from '../../services/body/bodyService';
import { sendSuccess } from '../../responses/apiResponse';
import {
  validateWorkoutInput,
  validateSleepInput,
  validateWaterInput,
  validateStepsInput,
  validateWeightInput,
} from '../../validators/body/bodyValidator';

// WORKOUTS
export async function getWorkouts(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const date = typeof req.query.date === 'string' ? req.query.date : undefined;
    const workouts = await bodyService.getWorkouts(userId, date);
    sendSuccess(res, workouts, 'Workouts retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

export async function createWorkout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const input = { userId, ...req.body };
    validateWorkoutInput(input);

    const workout = await bodyService.logWorkout(input);
    sendSuccess(res, workout, 'Workout recorded successfully & event published', 201);
  } catch (err) {
    next(err);
  }
}

export async function updateWorkout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const { id } = req.params;

    const workout = await bodyService.updateWorkout(id, userId, req.body);
    sendSuccess(res, workout, 'Workout updated successfully', 200);
  } catch (err) {
    next(err);
  }
}

export async function deleteWorkout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const { id } = req.params;

    await bodyService.deleteWorkout(id, userId);
    sendSuccess(res, { id, deleted: true }, 'Workout deleted successfully', 200);
  } catch (err) {
    next(err);
  }
}

// SLEEP
export async function getSleep(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const date = typeof req.query.date === 'string' ? req.query.date : undefined;
    const sleep = await bodyService.getSleep(userId, date);
    sendSuccess(res, sleep, 'Sleep log retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

export async function logSleep(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const input = { userId, ...req.body };
    validateSleepInput(input);

    const sleep = await bodyService.logSleep(input);
    sendSuccess(res, sleep, 'Sleep log recorded successfully & event published', 201);
  } catch (err) {
    next(err);
  }
}

// WATER
export async function getWater(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const date = typeof req.query.date === 'string' ? req.query.date : new Date().toISOString().split('T')[0];
    const summary = await bodyService.getDailySummary(userId, date);
    sendSuccess(res, summary.water, 'Water intake status retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

export async function logWater(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const input = { userId, ...req.body };
    validateWaterInput(input);

    const water = await bodyService.logWater(input);
    sendSuccess(res, water, 'Water intake logged successfully & event published', 201);
  } catch (err) {
    next(err);
  }
}

// STEPS
export async function getSteps(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const date = typeof req.query.date === 'string' ? req.query.date : new Date().toISOString().split('T')[0];
    const summary = await bodyService.getDailySummary(userId, date);
    sendSuccess(res, summary.steps, 'Step count retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

export async function logSteps(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const input = { userId, ...req.body };
    validateStepsInput(input);

    const step = await bodyService.logSteps(input);
    sendSuccess(res, step, 'Step count updated successfully & event published', 201);
  } catch (err) {
    next(err);
  }
}

// WEIGHT & BODY MEASUREMENTS
export async function getWeight(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const summary = await bodyService.getDailySummary(userId);
    sendSuccess(res, summary.weight, 'Weight log retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

export async function logWeight(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const input = { userId, ...req.body };
    validateWeightInput(input);

    const weight = await bodyService.logWeight(input);
    sendSuccess(res, weight, 'Weight log recorded successfully & event published', 201);
  } catch (err) {
    next(err);
  }
}

// DAILY SUMMARY
export async function getSummary(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const date = typeof req.query.date === 'string' ? req.query.date : undefined;
    const summary = await bodyService.getDailySummary(userId, date);
    sendSuccess(res, summary, 'Daily health summary retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}
