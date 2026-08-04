/**
 * Body Validator (SPR-308)
 */

import { ValidationError, FieldError } from '../../errors/AppError';
import {
  CreateWorkoutInput,
  LogSleepInput,
  LogWaterInput,
  LogStepsInput,
  LogWeightInput,
} from '../../types/body';

export function validateWorkoutInput(input: CreateWorkoutInput): void {
  const errors: FieldError[] = [];

  if (!input.name || typeof input.name !== 'string' || !input.name.trim()) {
    errors.push({ field: 'name', message: 'Workout name is required' });
  }

  if (input.durationMinutes !== undefined && (typeof input.durationMinutes !== 'number' || input.durationMinutes <= 0)) {
    errors.push({ field: 'durationMinutes', message: 'Duration must be a positive number of minutes' });
  }

  if (errors.length > 0) {
    throw new ValidationError('Workout validation failed', errors);
  }
}

export function validateSleepInput(input: LogSleepInput): void {
  const errors: FieldError[] = [];

  if (input.qualityPercent !== undefined && (input.qualityPercent < 0 || input.qualityPercent > 100)) {
    errors.push({ field: 'qualityPercent', message: 'Sleep quality must be between 0% and 100%' });
  }

  if (errors.length > 0) {
    throw new ValidationError('Sleep validation failed', errors);
  }
}

export function validateWaterInput(input: LogWaterInput): void {
  const errors: FieldError[] = [];

  if (!input.amountMl || typeof input.amountMl !== 'number' || input.amountMl <= 0) {
    errors.push({ field: 'amountMl', message: 'amountMl must be a positive number in milliliters' });
  }

  if (errors.length > 0) {
    throw new ValidationError('Water validation failed', errors);
  }
}

export function validateStepsInput(input: LogStepsInput): void {
  const errors: FieldError[] = [];

  if (input.stepsCount === undefined || typeof input.stepsCount !== 'number' || input.stepsCount < 0) {
    errors.push({ field: 'stepsCount', message: 'stepsCount must be a non-negative integer' });
  }

  if (errors.length > 0) {
    throw new ValidationError('Step validation failed', errors);
  }
}

export function validateWeightInput(input: LogWeightInput): void {
  const errors: FieldError[] = [];

  if (!input.weightKg || typeof input.weightKg !== 'number' || input.weightKg <= 0) {
    errors.push({ field: 'weightKg', message: 'weightKg must be a positive number in kilograms' });
  }

  if (errors.length > 0) {
    throw new ValidationError('Weight validation failed', errors);
  }
}
