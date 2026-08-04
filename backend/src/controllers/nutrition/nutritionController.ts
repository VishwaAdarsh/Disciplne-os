/**
 * Nutrition Controller (SPR-310 / ARCH-002)
 */

import type { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types/foundation';
import { nutritionService } from '../../services/nutrition/nutritionService';
import { sendSuccess } from '../../responses/apiResponse';
import { validateMealInput, validateGoalsInput } from '../../validators/nutrition/nutritionValidator';

// MEALS
export async function getMeals(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const date = typeof req.query.date === 'string' ? req.query.date : undefined;
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const meals = await nutritionService.getMeals(userId, date, category);
    sendSuccess(res, meals, 'Meals retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

export async function createMeal(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const input = { userId, ...req.body };
    validateMealInput(input);

    const meal = await nutritionService.logMeal(input);
    sendSuccess(res, meal, 'Meal logged successfully & event published', 201);
  } catch (err) {
    next(err);
  }
}

export async function updateMeal(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const { id } = req.params;

    const meal = await nutritionService.updateMeal(id, userId, req.body);
    sendSuccess(res, meal, 'Meal updated successfully', 200);
  } catch (err) {
    next(err);
  }
}

export async function deleteMeal(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const { id } = req.params;

    await nutritionService.deleteMeal(id, userId);
    sendSuccess(res, { id, deleted: true }, 'Meal deleted successfully', 200);
  } catch (err) {
    next(err);
  }
}

// GOALS
export async function getGoals(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const goals = await nutritionService.getGoals(userId);
    sendSuccess(res, goals, 'Nutrition goals retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

export async function updateGoals(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    validateGoalsInput(req.body);

    const goals = await nutritionService.updateGoals(userId, req.body);
    sendSuccess(res, goals, 'Nutrition goals updated successfully', 200);
  } catch (err) {
    next(err);
  }
}

// SUMMARY
export async function getSummary(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const date = typeof req.query.date === 'string' ? req.query.date : undefined;
    const summary = await nutritionService.getDailySummary(userId, date);
    sendSuccess(res, summary, 'Daily nutrition summary retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

// HISTORY
export async function getHistory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const period = (typeof req.query.period === 'string' ? req.query.period : 'daily') as 'daily' | 'weekly' | 'monthly';
    const dateFrom = typeof req.query.from === 'string' ? req.query.from : undefined;
    const dateTo = typeof req.query.to === 'string' ? req.query.to : undefined;
    const history = await nutritionService.getHistory(userId, period, dateFrom, dateTo);
    sendSuccess(res, history, 'Nutrition history retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}
