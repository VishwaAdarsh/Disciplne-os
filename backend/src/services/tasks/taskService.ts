/**
 * Task Service (SPR-307 / ARCH-002)
 */

import crypto from 'crypto';
import { taskRepository } from '../../repositories/tasks/taskRepository';
import { eventDispatcher } from '../../events/eventDispatcher';
import { performanceService } from '../performance/performanceService';
import { CreateTaskInput, UpdateTaskInput, TaskDTO, TaskFilter } from '../../types/discipline';
import { ParsedPagination } from '../../utils/pagination';
import { NotFoundError } from '../../errors/AppError';

export class TaskService {
  async getTasks(userId: string, pagination: ParsedPagination, filter: TaskFilter) {
    const combinedFilter: TaskFilter = { ...filter, userId };
    const paginated = await taskRepository.paginate(pagination, combinedFilter);

    const items = paginated.items.map((r) => taskRepository.toDTO(r));
    return { items, meta: paginated.meta };
  }

  async getTaskById(taskId: string, userId: string): Promise<TaskDTO> {
    const record = await taskRepository.findById(taskId);
    if (!record || record.user_id !== userId) {
      throw new NotFoundError(`Task with ID ${taskId} not found`);
    }
    return taskRepository.toDTO(record);
  }

  async createTask(input: CreateTaskInput): Promise<TaskDTO> {
    const id = `task_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const tagsJson = JSON.stringify(input.tags || []);

    const record = await taskRepository.create({
      id,
      user_id: input.userId,
      goal_id: input.goalId || null,
      name: input.title,
      description: input.description || null,
      category: input.category || 'Work',
      priority: input.priority || 'medium',
      estimated_minutes: input.estimatedMinutes ?? 30,
      due_date: input.dueDate || null,
      status: 'pending',
      tags: tagsJson,
      notes: input.notes || null,
      is_active: 1,
      is_archived: 0,
    });

    await taskRepository.recordHistory(input.userId, id, 'created', { title: input.title });

    return taskRepository.toDTO(record);
  }

  async updateTask(taskId: string, userId: string, updates: UpdateTaskInput): Promise<TaskDTO> {
    const existing = await this.getTaskById(taskId, userId);

    const updatePayload: any = {};
    if (updates.title !== undefined) updatePayload.name = updates.title;
    if (updates.description !== undefined) updatePayload.description = updates.description;
    if (updates.category !== undefined) updatePayload.category = updates.category;
    if (updates.priority !== undefined) updatePayload.priority = updates.priority;
    if (updates.estimatedMinutes !== undefined) updatePayload.estimated_minutes = updates.estimatedMinutes;
    if (updates.dueDate !== undefined) updatePayload.due_date = updates.dueDate;
    if (updates.notes !== undefined) updatePayload.notes = updates.notes;
    if (updates.tags !== undefined) updatePayload.tags = JSON.stringify(updates.tags);
    if (updates.isArchived !== undefined) updatePayload.is_archived = updates.isArchived ? 1 : 0;
    if (updates.status !== undefined) updatePayload.status = updates.status;

    const updatedRecord = await taskRepository.update(taskId, updatePayload);
    await taskRepository.recordHistory(userId, taskId, 'updated', updates);

    return taskRepository.toDTO(updatedRecord!);
  }

  async completeTask(taskId: string, userId: string): Promise<TaskDTO> {
    const task = await this.getTaskById(taskId, userId);
    const isNowCompleted = task.status !== 'completed';
    const nowStatus = isNowCompleted ? 'completed' : 'pending';
    const completedAt = isNowCompleted ? new Date().toISOString() : null;

    const updatedRecord = await taskRepository.update(taskId, {
      status: nowStatus,
      completed_at: completedAt,
    });

    const dto = taskRepository.toDTO(updatedRecord!);

    if (isNowCompleted) {
      // 1. Record History
      await taskRepository.recordHistory(userId, taskId, 'completed', { title: task.title });

      // 2. Publish Event to Event Engine
      await eventDispatcher.publish({
        userId,
        module: 'discipline',
        eventType: 'TASK_COMPLETED',
        title: `Completed Task: ${task.title}`,
        description: task.description || undefined,
        icon: '⚡',
        metadata: { taskId, title: task.title, category: task.category, priority: task.priority },
        scoreImpact: task.priority === 'critical' ? 15 : task.priority === 'high' ? 10 : 5,
      });

      // 3. Trigger recalculation in Performance Engine
      await performanceService.computeAndSaveSnapshot(userId, 'daily');
    }

    return dto;
  }

  async archiveTask(taskId: string, userId: string): Promise<TaskDTO> {
    await this.getTaskById(taskId, userId);
    const updatedRecord = await taskRepository.update(taskId, {
      is_archived: 1,
      status: 'archived',
    });
    await taskRepository.recordHistory(userId, taskId, 'archived');
    return taskRepository.toDTO(updatedRecord!);
  }

  async restoreTask(taskId: string, userId: string): Promise<TaskDTO> {
    await this.getTaskById(taskId, userId);
    const updatedRecord = await taskRepository.update(taskId, {
      is_archived: 0,
      status: 'pending',
    });
    await taskRepository.recordHistory(userId, taskId, 'restored');
    return taskRepository.toDTO(updatedRecord!);
  }

  async deleteTask(taskId: string, userId: string): Promise<boolean> {
    await this.getTaskById(taskId, userId);
    await taskRepository.recordHistory(userId, taskId, 'deleted');
    return taskRepository.delete(taskId);
  }

  async getTaskHistory(userId: string, taskId?: string) {
    return taskRepository.getHistory(userId, taskId);
  }
}

export const taskService = new TaskService();
