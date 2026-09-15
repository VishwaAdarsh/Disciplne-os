/**
 * Goals Validator (SPR-311)
 */

import { ValidationError, FieldError } from '../../errors/AppError';
import {
  CreateGoalInput,
  UpdateGoalInput,
  GOAL_CATEGORIES,
  GOAL_STATUSES,
  GOAL_PRIORITIES,
  GOAL_TYPES,
} from '../../types/goals';

export function validateCreateGoalInput(input: CreateGoalInput): void {
  const errors: FieldError[] = [];

  if (!input.title || typeof input.title !== 'string' || !input.title.trim()) {
    errors.push({ field: 'title', message: 'Goal title is required' });
  }

  if (input.category && !GOAL_CATEGORIES.includes(input.category as any)) {
    errors.push({
      field: 'category',
      message: `Category must be one of: ${GOAL_CATEGORIES.join(', ')}`,
    });
  }

  if (input.goalType && !GOAL_TYPES.includes(input.goalType as any)) {
    errors.push({
      field: 'goalType',
      message: `Goal type must be one of: ${GOAL_TYPES.join(', ')}`,
    });
  }

  if (input.priority && !GOAL_PRIORITIES.includes(input.priority as any)) {
    errors.push({
      field: 'priority',
      message: `Priority must be one of: ${GOAL_PRIORITIES.join(', ')}`,
    });
  }

  if (input.status && !GOAL_STATUSES.includes(input.status as any)) {
    errors.push({
      field: 'status',
      message: `Status must be one of: ${GOAL_STATUSES.join(', ')}`,
    });
  }

  if (input.targetValue !== undefined && (typeof input.targetValue !== 'number' || input.targetValue < 0)) {
    errors.push({ field: 'targetValue', message: 'Target value must be a non-negative number' });
  }

  if (input.currentValue !== undefined && (typeof input.currentValue !== 'number' || input.currentValue < 0)) {
    errors.push({ field: 'currentValue', message: 'Current value must be a non-negative number' });
  }

  if (input.startDate && input.deadline && input.startDate.length >= 10 && input.deadline.length >= 10) {
    if (input.startDate > input.deadline) {
      errors.push({ field: 'deadline', message: 'Deadline cannot precede start date' });
    }
  }

  if (errors.length > 0) {
    throw new ValidationError('Goal validation failed', errors);
  }
}

export function validateUpdateGoalInput(input: UpdateGoalInput): void {
  const errors: FieldError[] = [];

  if (input.title !== undefined && (!input.title || typeof input.title !== 'string' || !input.title.trim())) {
    errors.push({ field: 'title', message: 'Goal title cannot be empty' });
  }

  if (input.category && !GOAL_CATEGORIES.includes(input.category as any)) {
    errors.push({
      field: 'category',
      message: `Category must be one of: ${GOAL_CATEGORIES.join(', ')}`,
    });
  }

  if (input.priority && !GOAL_PRIORITIES.includes(input.priority as any)) {
    errors.push({
      field: 'priority',
      message: `Priority must be one of: ${GOAL_PRIORITIES.join(', ')}`,
    });
  }

  if (input.status && !GOAL_STATUSES.includes(input.status as any)) {
    errors.push({
      field: 'status',
      message: `Status must be one of: ${GOAL_STATUSES.join(', ')}`,
    });
  }

  if (input.targetValue !== undefined && (typeof input.targetValue !== 'number' || input.targetValue < 0)) {
    errors.push({ field: 'targetValue', message: 'Target value must be a non-negative number' });
  }

  if (input.currentValue !== undefined && (typeof input.currentValue !== 'number' || input.currentValue < 0)) {
    errors.push({ field: 'currentValue', message: 'Current value must be a non-negative number' });
  }

  if (input.progressPercent !== undefined && (typeof input.progressPercent !== 'number' || input.progressPercent < 0 || input.progressPercent > 100)) {
    errors.push({ field: 'progressPercent', message: 'Progress percentage must be between 0 and 100' });
  }

  if (input.startDate && input.deadline && input.startDate.length >= 10 && input.deadline.length >= 10) {
    if (input.startDate > input.deadline) {
      errors.push({ field: 'deadline', message: 'Deadline cannot precede start date' });
    }
  }

  if (errors.length > 0) {
    throw new ValidationError('Goal update validation failed', errors);
  }
}

export function validateMilestoneInput(title: string): void {
  if (!title || typeof title !== 'string' || !title.trim()) {
    throw new ValidationError('Milestone validation failed', [
      { field: 'title', message: 'Milestone title is required' },
    ]);
  }
}
