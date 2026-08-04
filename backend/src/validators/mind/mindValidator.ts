/**
 * Mind Validator (SPR-309)
 */

import { ValidationError, FieldError } from '../../errors/AppError';
import {
  LogMoodInput,
  LogEnergyInput,
  LogStressInput,
  LogFocusInput,
  CreateJournalInput,
  LogMeditationInput,
  ENERGY_LEVELS,
} from '../../types/mind';

export function validateMoodInput(input: LogMoodInput): void {
  const errors: FieldError[] = [];

  if (!input.mood || typeof input.mood !== 'string' || !input.mood.trim()) {
    errors.push({ field: 'mood', message: 'Mood level rating is required' });
  }

  if (errors.length > 0) {
    throw new ValidationError('Mood validation failed', errors);
  }
}

export function validateEnergyInput(input: LogEnergyInput): void {
  const errors: FieldError[] = [];

  if (!input.energyLevel || !ENERGY_LEVELS.includes(input.energyLevel as any)) {
    errors.push({
      field: 'energyLevel',
      message: `Energy level must be one of: ${ENERGY_LEVELS.join(', ')}`,
    });
  }

  if (errors.length > 0) {
    throw new ValidationError('Energy validation failed', errors);
  }
}

export function validateStressInput(input: LogStressInput): void {
  const errors: FieldError[] = [];

  if (
    input.stressLevel === undefined ||
    typeof input.stressLevel !== 'number' ||
    input.stressLevel < 1 ||
    input.stressLevel > 10
  ) {
    errors.push({ field: 'stressLevel', message: 'Stress level must be an integer between 1 and 10' });
  }

  if (errors.length > 0) {
    throw new ValidationError('Stress validation failed', errors);
  }
}

export function validateFocusInput(input: LogFocusInput): void {
  const errors: FieldError[] = [];

  if (
    input.focusScore === undefined ||
    typeof input.focusScore !== 'number' ||
    input.focusScore < 1 ||
    input.focusScore > 10
  ) {
    errors.push({ field: 'focusScore', message: 'Focus score must be an integer between 1 and 10' });
  }

  if (errors.length > 0) {
    throw new ValidationError('Focus validation failed', errors);
  }
}

export function validateJournalInput(input: CreateJournalInput): void {
  const errors: FieldError[] = [];

  if (!input.title || typeof input.title !== 'string' || !input.title.trim()) {
    errors.push({ field: 'title', message: 'Journal title is required' });
  }

  if (!input.content || typeof input.content !== 'string' || !input.content.trim()) {
    errors.push({ field: 'content', message: 'Journal content is required' });
  }

  if (errors.length > 0) {
    throw new ValidationError('Journal validation failed', errors);
  }
}

export function validateMeditationInput(input: LogMeditationInput): void {
  const errors: FieldError[] = [];

  if (input.durationMinutes !== undefined && (typeof input.durationMinutes !== 'number' || input.durationMinutes <= 0)) {
    errors.push({ field: 'durationMinutes', message: 'Duration must be a positive number of minutes' });
  }

  if (errors.length > 0) {
    throw new ValidationError('Meditation validation failed', errors);
  }
}
