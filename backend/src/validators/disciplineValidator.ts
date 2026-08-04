/**
 * Discipline Validator (SPR-307)
 */

import { ValidationError, FieldError } from '../errors/AppError';
import { CreateTaskInput, CreateHabitInput, TASK_PRIORITIES, HABIT_FREQUENCIES } from '../types/discipline';

export function validateCreateTaskInput(input: CreateTaskInput): void {
  const errors: FieldError[] = [];

  if (!input.title || typeof input.title !== 'string' || !input.title.trim()) {
    errors.push({ field: 'title', message: 'Task title is required' });
  }

  if (input.priority && !TASK_PRIORITIES.includes(input.priority as any)) {
    errors.push({ field: 'priority', message: `Priority must be one of: ${TASK_PRIORITIES.join(', ')}` });
  }

  if (input.estimatedMinutes !== undefined && (typeof input.estimatedMinutes !== 'number' || input.estimatedMinutes < 1)) {
    errors.push({ field: 'estimatedMinutes', message: 'Estimated minutes must be a positive number' });
  }

  if (errors.length > 0) {
    throw new ValidationError('Task validation failed', errors);
  }
}

export function validateCreateHabitInput(input: CreateHabitInput): void {
  const errors: FieldError[] = [];

  if (!input.habitName || typeof input.habitName !== 'string' || !input.habitName.trim()) {
    errors.push({ field: 'habitName', message: 'Habit name is required' });
  }

  if (input.frequency && !HABIT_FREQUENCIES.includes(input.frequency as any)) {
    errors.push({ field: 'frequency', message: `Frequency must be one of: ${HABIT_FREQUENCIES.join(', ')}` });
  }

  if (errors.length > 0) {
    throw new ValidationError('Habit validation failed', errors);
  }
}
