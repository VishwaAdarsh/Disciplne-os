/**
 * Habit Controller (SPR-307 / ARCH-002)
 */

import type { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types/foundation';
import { habitService } from '../../services/habits/habitService';
import { sendSuccess } from '../../responses/apiResponse';
import { validateCreateHabitInput } from '../../validators/disciplineValidator';

export async function getHabits(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const habits = await habitService.getHabits(userId);
    sendSuccess(res, habits, 'Habits retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

export async function createHabit(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const { habitName, description, category, frequency, targetDaysPerWeek } = req.body;

    const input = {
      userId,
      habitName,
      description,
      category,
      frequency,
      targetDaysPerWeek,
    };

    validateCreateHabitInput(input);
    const habit = await habitService.createHabit(input);
    sendSuccess(res, habit, 'Habit created successfully', 201);
  } catch (err) {
    next(err);
  }
}

export async function updateHabit(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const { id } = req.params;

    const habit = await habitService.updateHabit(id, userId, req.body);
    sendSuccess(res, habit, 'Habit updated successfully', 200);
  } catch (err) {
    next(err);
  }
}

export async function completeHabit(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const { id } = req.params;

    const habit = await habitService.completeHabit(id, userId);
    sendSuccess(res, habit, 'Habit streak updated & event published', 200);
  } catch (err) {
    next(err);
  }
}

export async function deleteHabit(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const { id } = req.params;

    await habitService.deleteHabit(id, userId);
    sendSuccess(res, { id, deleted: true }, 'Habit deleted successfully', 200);
  } catch (err) {
    next(err);
  }
}
