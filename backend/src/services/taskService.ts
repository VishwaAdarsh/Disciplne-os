/**
 * Task Service (SPR-304 / ARCH-002)
 */

import { taskRepository, TaskRecord } from '../repositories/taskRepository';
import { ParsedPagination } from '../utils/pagination';
import { ParsedFilter } from '../utils/filtering';
import { NotFoundError } from '../errors/AppError';
import crypto from 'crypto';

export interface CreateTaskDTO {
  userId: string;
  name: string;
  type?: string;
  timeTarget?: string;
  why?: string;
  goalId?: string;
}

export class TaskService {
  async getTasksForUser(userId: string, filter: ParsedFilter) {
    return taskRepository.findMany({ ...filter, userId });
  }

  async getPaginatedTasksForUser(userId: string, pagination: ParsedPagination, filter: ParsedFilter) {
    return taskRepository.paginate(pagination, { ...filter, userId });
  }

  async getTaskById(taskId: string, userId: string): Promise<TaskRecord> {
    const task = await taskRepository.findById(taskId);
    if (!task || task.user_id !== userId) {
      throw new NotFoundError(`Task with ID ${taskId} not found`);
    }
    return task;
  }

  async createTask(dto: CreateTaskDTO): Promise<TaskRecord> {
    const newTask: Partial<TaskRecord> = {
      id: `task_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      user_id: dto.userId,
      name: dto.name,
      type: dto.type || 'nonneg',
      time_target: dto.timeTarget || null,
      why: dto.why || null,
      goal_id: dto.goalId || null,
      is_active: 1,
    };

    return taskRepository.create(newTask);
  }

  async deleteTask(taskId: string, userId: string): Promise<boolean> {
    await this.getTaskById(taskId, userId);
    return taskRepository.delete(taskId);
  }
}

export const taskService = new TaskService();
