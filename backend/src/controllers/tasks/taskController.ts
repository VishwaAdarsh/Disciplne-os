/**
 * Task Controller (SPR-307 / ARCH-002)
 */

import type { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types/foundation';
import { taskService } from '../../services/tasks/taskService';
import { sendSuccess } from '../../responses/apiResponse';
import { getPaginationParams } from '../../utils/pagination';
import { getFilterParams } from '../../utils/filtering';
import { validateCreateTaskInput } from '../../validators/disciplineValidator';
import { TaskFilter } from '../../types/discipline';

export async function getTasks(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const pagination = getPaginationParams(req.query);
    const rawFilter = getFilterParams(req.query);

    const isArchived = req.query.archived === 'true' ? true : req.query.archived === 'false' ? false : undefined;

    const filter: TaskFilter = {
      search: rawFilter.search,
      category: rawFilter.category || (typeof req.query.category === 'string' ? req.query.category : undefined),
      priority: typeof req.query.priority === 'string' ? req.query.priority : undefined,
      status: rawFilter.status,
      isArchived,
      startDate: rawFilter.startDate,
      endDate: rawFilter.endDate,
    };

    const result = await taskService.getTasks(userId, pagination, filter);
    sendSuccess(res, result.items, 'Tasks retrieved successfully', 200, result.meta);
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

export async function createTask(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const { title, description, category, priority, estimatedMinutes, dueDate, tags, notes, goalId } = req.body;

    const input = {
      userId,
      title,
      description,
      category,
      priority,
      estimatedMinutes,
      dueDate,
      tags,
      notes,
      goalId,
    };

    validateCreateTaskInput(input);
    const task = await taskService.createTask(input);
    sendSuccess(res, task, 'Task created successfully', 201);
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const { id } = req.params;

    const task = await taskService.updateTask(id, userId, req.body);
    sendSuccess(res, task, 'Task updated successfully', 200);
  } catch (err) {
    next(err);
  }
}

export async function completeTask(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const { id } = req.params;

    const task = await taskService.completeTask(id, userId);
    sendSuccess(res, task, 'Task status updated & performance recalculated', 200);
  } catch (err) {
    next(err);
  }
}

export async function archiveTask(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const { id } = req.params;

    const task = await taskService.archiveTask(id, userId);
    sendSuccess(res, task, 'Task archived successfully', 200);
  } catch (err) {
    next(err);
  }
}

export async function restoreTask(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const { id } = req.params;

    const task = await taskService.restoreTask(id, userId);
    sendSuccess(res, task, 'Task restored successfully', 200);
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const { id } = req.params;

    await taskService.deleteTask(id, userId);
    sendSuccess(res, { id, deleted: true }, 'Task deleted successfully', 200);
  } catch (err) {
    next(err);
  }
}
