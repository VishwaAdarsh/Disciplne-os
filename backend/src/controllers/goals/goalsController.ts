/**
 * Goals Controller (SPR-311 / ARCH-002)
 */

import type { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types/foundation';
import { goalsService } from '../../services/goals/goalsService';
import { sendSuccess } from '../../responses/apiResponse';
import {
  validateCreateGoalInput,
  validateUpdateGoalInput,
  validateMilestoneInput,
} from '../../validators/goals/goalsValidator';

export async function getGoals(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId!;
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;

    const goals = await goalsService.getGoals(userId, { status, category });
    sendSuccess(res, goals, 'Goals retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

export async function getGoalsSummary(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId!;
    const summary = await goalsService.getGoalsSummary(userId);
    sendSuccess(res, summary, 'Goals summary retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

export async function getGoalById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const goal = await goalsService.getGoalById(id, userId);
    sendSuccess(res, goal, 'Goal retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

export async function createGoal(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId!;
    const input = { userId, ...req.body };
    validateCreateGoalInput(input);

    const goal = await goalsService.createGoal(input);
    sendSuccess(res, goal, 'Goal created successfully & event published', 201);
  } catch (err) {
    next(err);
  }
}

export async function updateGoal(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    validateUpdateGoalInput(req.body);

    const goal = await goalsService.updateGoal(id, userId, req.body);
    sendSuccess(res, goal, 'Goal updated successfully', 200);
  } catch (err) {
    next(err);
  }
}

export async function setGoalStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { status } = req.body;

    const goal = await goalsService.setGoalStatus(id, userId, status);
    sendSuccess(res, goal, `Goal status updated to ${status}`, 200);
  } catch (err) {
    next(err);
  }
}

export async function updateGoalProgress(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { progressPercent, currentValue } = req.body;

    const goal = await goalsService.updateProgress(id, userId, progressPercent, currentValue);
    sendSuccess(res, goal, 'Goal progress updated', 200);
  } catch (err) {
    next(err);
  }
}

export async function deleteGoal(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    await goalsService.deleteGoal(id, userId);
    sendSuccess(res, { id, deleted: true }, 'Goal deleted successfully', 200);
  } catch (err) {
    next(err);
  }
}

// --- MILESTONES ---

export async function addMilestone(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId!;
    const { id: goalId } = req.params;
    const { title, dueDate } = req.body;
    validateMilestoneInput(title);

    const milestone = await goalsService.addMilestone(goalId, userId, title, dueDate);
    sendSuccess(res, milestone, 'Milestone added successfully', 201);
  } catch (err) {
    next(err);
  }
}

export async function toggleMilestone(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId!;
    const { id: goalId, mId: milestoneId } = req.params;

    const milestone = await goalsService.toggleMilestone(goalId, milestoneId, userId);
    sendSuccess(res, milestone, 'Milestone toggled successfully', 200);
  } catch (err) {
    next(err);
  }
}

export async function deleteMilestone(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId!;
    const { id: goalId, mId: milestoneId } = req.params;

    await goalsService.deleteMilestone(goalId, milestoneId, userId);
    sendSuccess(res, { milestoneId, deleted: true }, 'Milestone deleted successfully', 200);
  } catch (err) {
    next(err);
  }
}
