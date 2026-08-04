/**
 * Task Controller (SPR-304 / ARCH-002)
 */

import type { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/foundation';
import { taskService } from '../services/taskService';
import { sendSuccess } from '../responses/apiResponse';
import { getPaginationParams } from '../utils/pagination';
import { getFilterParams } from '../utils/filtering';

export async function getTasks(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const pagination = getPaginationParams(req.query);
    const filter = getFilterParams(req.query);

    const result = await taskService.getPaginatedTasksForUser(userId, pagination, filter);
    sendSuccess(res, result.items, 'Tasks retrieved successfully', 200, result.meta);
  } catch (err) {
    next(err);
  }
}

export async function createTask(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const { name, type, timeTarget, why, goalId } = req.body;

    const task = await taskService.createTask({
      userId,
      name,
      type,
      timeTarget,
      why,
      goalId,
    });

    sendSuccess(res, task, 'Task created successfully', 201);
  } catch (err) {
    next(err);
  }
}

export async function getTaskById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const { id } = req.params;

    const task = await taskService.getTaskById(id, userId);
    sendSuccess(res, task, 'Task retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}
