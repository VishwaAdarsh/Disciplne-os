/**
 * Nutrition Validator (SPR-310)
 */

import { ValidationError, FieldError } from '../../errors/AppError';
import { CreateMealInput, UpdateGoalsInput, MEAL_CATEGORIES } from '../../types/nutrition';

export function validateMealInput(input: CreateMealInput): void {
  const errors: FieldError[] = [];

  if (!input.name || typeof input.name !== 'string' || !input.name.trim()) {
    errors.push({ field: 'name', message: 'Meal name is required' });
  }

  if (input.category && !MEAL_CATEGORIES.includes(input.category as any)) {
    errors.push({ field: 'category', message: `Category must be one of: ${MEAL_CATEGORIES.join(', ')}` });
  }

  if (input.calories !== undefined) {
    if (typeof input.calories !== 'number' || input.calories < 0) {
      errors.push({ field: 'calories', message: 'Calories must be a non-negative number' });
    }
    if (input.calories > 10000) {
      errors.push({ field: 'calories', message: 'Calories per meal cannot exceed 10,000 kcal' });
    }
  }

  if (input.proteinG !== undefined && (typeof input.proteinG !== 'number' || input.proteinG < 0)) {
    errors.push({ field: 'proteinG', message: 'Protein must be a non-negative number in grams' });
  }

  if (input.carbsG !== undefined && (typeof input.carbsG !== 'number' || input.carbsG < 0)) {
    errors.push({ field: 'carbsG', message: 'Carbohydrates must be a non-negative number in grams' });
  }

  if (input.fatG !== undefined && (typeof input.fatG !== 'number' || input.fatG < 0)) {
    errors.push({ field: 'fatG', message: 'Fat must be a non-negative number in grams' });
  }

  if (input.fiberG !== undefined && (typeof input.fiberG !== 'number' || input.fiberG < 0)) {
    errors.push({ field: 'fiberG', message: 'Fiber must be a non-negative number in grams' });
  }

  if (errors.length > 0) {
    throw new ValidationError('Meal validation failed', errors);
  }
}

export function validateGoalsInput(input: UpdateGoalsInput): void {
  const errors: FieldError[] = [];

  if (input.caloriesTarget !== undefined && (typeof input.caloriesTarget !== 'number' || input.caloriesTarget < 500 || input.caloriesTarget > 10000)) {
    errors.push({ field: 'caloriesTarget', message: 'Calorie target must be between 500 and 10,000 kcal' });
  }

  if (input.proteinTarget !== undefined && (typeof input.proteinTarget !== 'number' || input.proteinTarget < 0)) {
    errors.push({ field: 'proteinTarget', message: 'Protein target must be a non-negative number' });
  }

  if (input.carbsTarget !== undefined && (typeof input.carbsTarget !== 'number' || input.carbsTarget < 0)) {
    errors.push({ field: 'carbsTarget', message: 'Carbs target must be a non-negative number' });
  }

  if (input.fatTarget !== undefined && (typeof input.fatTarget !== 'number' || input.fatTarget < 0)) {
    errors.push({ field: 'fatTarget', message: 'Fat target must be a non-negative number' });
  }

  if (errors.length > 0) {
    throw new ValidationError('Nutrition goals validation failed', errors);
  }
}
