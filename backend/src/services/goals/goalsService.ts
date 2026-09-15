/**
 * Goals Service Implementation (SPR-311 / ARCH-002)
 * Integrates with Event Engine and Performance Engine.
 */

import crypto from 'crypto';
import { goalsRepository } from '../../repositories/goals/goalsRepository';
import { eventDispatcher } from '../../events/eventDispatcher';
import {
  CreateGoalInput,
  UpdateGoalInput,
  GoalDTO,
  GoalMilestoneDTO,
  GoalsSummaryDTO,
  GoalStatus,
} from '../../types/goals';
import { NotFoundError } from '../../errors/AppError';

export class GoalsService {
  async getGoals(
    userId: string,
    filters?: { status?: string; category?: string; includeDeleted?: boolean }
  ): Promise<GoalDTO[]> {
    const records = await goalsRepository.findGoals(userId, filters);
    const result: GoalDTO[] = [];

    for (const record of records) {
      const milestones = await goalsRepository.findMilestonesByGoalId(record.id);
      result.push(goalsRepository.toGoalDTO(record, milestones));
    }

    return result;
  }

  async getGoalById(id: string, userId: string): Promise<GoalDTO> {
    const record = await goalsRepository.findGoalById(id, userId);
    if (!record) {
      throw new NotFoundError(`Goal with ID ${id} not found`);
    }

    const milestones = await goalsRepository.findMilestonesByGoalId(record.id);
    return goalsRepository.toGoalDTO(record, milestones);
  }

  async createGoal(input: CreateGoalInput): Promise<GoalDTO> {
    const id = `goal_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

    // Calculate initial progress percent
    let initialProgress = 0;
    if (input.targetValue && input.targetValue > 0 && input.currentValue !== undefined) {
      initialProgress = Math.min(100, Math.round((input.currentValue / input.targetValue) * 100));
    }

    const record = await goalsRepository.createGoal({
      id,
      user_id: input.userId,
      title: input.title,
      description: input.description,
      category: input.category || 'Discipline',
      goal_type: input.goalType || 'numeric',
      target_value: input.targetValue,
      current_value: input.currentValue ?? 0,
      unit: input.unit,
      color: input.color || '#6366F1',
      priority: input.priority || 'High',
      status: input.status || 'In Progress',
      progress_percent: initialProgress,
      start_date: input.startDate || new Date().toISOString().split('T')[0],
      deadline: input.deadline,
      notes: input.notes,
    });

    // Create milestones if provided
    if (input.milestones && input.milestones.length > 0) {
      for (let i = 0; i < input.milestones.length; i++) {
        const m = input.milestones[i];
        const mId = `ms_${Date.now()}_${i}_${crypto.randomBytes(2).toString('hex')}`;
        await goalsRepository.createMilestone({
          id: mId,
          goal_id: id,
          user_id: input.userId,
          title: m.title,
          due_date: m.dueDate,
          order_index: i,
        });
      }
    }

    const milestones = await goalsRepository.findMilestonesByGoalId(id);
    const dto = goalsRepository.toGoalDTO(record, milestones);

    // Event Engine Integration
    await eventDispatcher.publish({
      userId: input.userId,
      module: 'goals',
      eventType: 'GOAL_CREATED',
      title: `Created Strategic Goal: ${dto.title}`,
      description: `${dto.category} · Priority: ${dto.priority}`,
      icon: '🎯',
      metadata: { goalId: id, category: dto.category, priority: dto.priority },
      scoreImpact: 10,
    });

    return dto;
  }

  async updateGoal(id: string, userId: string, updates: UpdateGoalInput): Promise<GoalDTO> {
    const existing = await goalsRepository.findGoalById(id, userId);
    if (!existing) {
      throw new NotFoundError(`Goal with ID ${id} not found`);
    }

    // Auto-compute progress if target or current value is updated
    let newProgress = updates.progressPercent;
    const targetVal = updates.targetValue !== undefined ? updates.targetValue : existing.target_value;
    const currentVal = updates.currentValue !== undefined ? updates.currentValue : existing.current_value;

    if (newProgress === undefined && targetVal && targetVal > 0 && currentVal !== null && currentVal !== undefined) {
      newProgress = Math.min(100, Math.round((currentVal / targetVal) * 100));
    }

    const updated = await goalsRepository.updateGoal(id, userId, {
      title: updates.title,
      description: updates.description,
      category: updates.category,
      goal_type: updates.goalType,
      target_value: updates.targetValue,
      current_value: updates.currentValue,
      unit: updates.unit,
      color: updates.color,
      priority: updates.priority,
      status: updates.status,
      progress_percent: newProgress,
      start_date: updates.startDate,
      deadline: updates.deadline,
      notes: updates.notes,
    });

    const milestones = await goalsRepository.findMilestonesByGoalId(id);
    const dto = goalsRepository.toGoalDTO(updated!, milestones);

    await eventDispatcher.publish({
      userId,
      module: 'goals',
      eventType: 'GOAL_UPDATED',
      title: `Updated Goal: ${dto.title}`,
      icon: '✏️',
      metadata: { goalId: id, status: dto.status, progress: dto.progressPercent },
      scoreImpact: 0,
    });

    return dto;
  }

  async setGoalStatus(id: string, userId: string, newStatus: GoalStatus): Promise<GoalDTO> {
    const existing = await goalsRepository.findGoalById(id, userId);
    if (!existing) {
      throw new NotFoundError(`Goal with ID ${id} not found`);
    }

    const prevStatus = existing.status;
    let progressPercent = existing.progress_percent;
    let eventType = 'GOAL_UPDATED';
    let scoreImpact = 0;
    let icon = '🎯';

    if (newStatus === 'Completed') {
      progressPercent = 100;
      eventType = 'GOAL_COMPLETED';
      scoreImpact = 20;
      icon = '🏆';
    } else if (newStatus === 'Paused') {
      eventType = 'GOAL_PAUSED';
      scoreImpact = -2;
      icon = '⏸️';
    } else if ((prevStatus === 'Paused' || prevStatus === 'Not Started') && (newStatus === 'Active' || newStatus === 'In Progress')) {
      eventType = 'GOAL_RESUMED';
      scoreImpact = 5;
      icon = '▶️';
    }

    const updated = await goalsRepository.updateGoal(id, userId, {
      status: newStatus,
      progress_percent: progressPercent,
    });

    const milestones = await goalsRepository.findMilestonesByGoalId(id);
    const dto = goalsRepository.toGoalDTO(updated!, milestones);

    await eventDispatcher.publish({
      userId,
      module: 'goals',
      eventType,
      title: `${newStatus === 'Completed' ? 'Completed' : 'Updated'} Goal: ${dto.title}`,
      description: `Status changed from ${prevStatus} to ${newStatus}`,
      icon,
      metadata: { goalId: id, previousStatus: prevStatus, newStatus },
      scoreImpact,
    });

    return dto;
  }

  async updateProgress(id: string, userId: string, progressPercent: number, currentValue?: number): Promise<GoalDTO> {
    const existing = await goalsRepository.findGoalById(id, userId);
    if (!existing) {
      throw new NotFoundError(`Goal with ID ${id} not found`);
    }

    const clampedPercent = Math.max(0, Math.min(100, progressPercent));
    const isCompleted = clampedPercent === 100;
    const newStatus = isCompleted ? 'Completed' : existing.status === 'Completed' ? 'In Progress' : existing.status;

    const updated = await goalsRepository.updateGoal(id, userId, {
      progress_percent: clampedPercent,
      current_value: currentValue !== undefined ? currentValue : existing.current_value,
      status: newStatus,
    });

    const milestones = await goalsRepository.findMilestonesByGoalId(id);
    const dto = goalsRepository.toGoalDTO(updated!, milestones);

    await eventDispatcher.publish({
      userId,
      module: 'goals',
      eventType: isCompleted ? 'GOAL_COMPLETED' : 'GOAL_PROGRESS_CHANGED',
      title: `${isCompleted ? 'Completed Goal' : 'Goal Progress'}: ${dto.title} (${clampedPercent}%)`,
      icon: isCompleted ? '🏆' : '📈',
      metadata: { goalId: id, progressPercent: clampedPercent },
      scoreImpact: isCompleted ? 20 : 5,
    });

    return dto;
  }

  async deleteGoal(id: string, userId: string): Promise<boolean> {
    const existing = await goalsRepository.findGoalById(id, userId);
    if (!existing) {
      throw new NotFoundError(`Goal with ID ${id} not found`);
    }

    const deleted = await goalsRepository.deleteGoal(id, userId);

    if (deleted) {
      await eventDispatcher.publish({
        userId,
        module: 'goals',
        eventType: 'GOAL_DELETED',
        title: `Deleted Goal: ${existing.title}`,
        icon: '🗑️',
        metadata: { goalId: id, title: existing.title },
        scoreImpact: 0,
      });
    }

    return deleted;
  }

  // --- MILESTONES ---

  async addMilestone(goalId: string, userId: string, title: string, dueDate?: string): Promise<GoalMilestoneDTO> {
    const goal = await goalsRepository.findGoalById(goalId, userId);
    if (!goal) {
      throw new NotFoundError(`Goal with ID ${goalId} not found`);
    }

    const existingMilestones = await goalsRepository.findMilestonesByGoalId(goalId);
    const mId = `ms_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

    const record = await goalsRepository.createMilestone({
      id: mId,
      goal_id: goalId,
      user_id: userId,
      title,
      due_date: dueDate,
      order_index: existingMilestones.length,
    });

    // Recalculate goal progress if milestone-based
    await this.syncMilestoneProgress(goalId, userId);

    return goalsRepository.toMilestoneDTO(record);
  }

  async toggleMilestone(goalId: string, milestoneId: string, userId: string): Promise<GoalMilestoneDTO> {
    const milestone = await goalsRepository.findMilestoneById(milestoneId, userId);
    if (!milestone || milestone.goal_id !== goalId) {
      throw new NotFoundError(`Milestone with ID ${milestoneId} not found`);
    }

    const newCompleted = milestone.completed === 1 ? 0 : 1;
    const updated = await goalsRepository.updateMilestone(milestoneId, userId, {
      completed: newCompleted,
    });

    // Recalculate goal progress based on milestones
    await this.syncMilestoneProgress(goalId, userId);

    const dto = goalsRepository.toMilestoneDTO(updated!);

    if (newCompleted === 1) {
      await eventDispatcher.publish({
        userId,
        module: 'goals',
        eventType: 'GOAL_PROGRESS_CHANGED',
        title: `Completed Milestone: ${dto.title}`,
        icon: '✓',
        metadata: { goalId, milestoneId },
        scoreImpact: 5,
      });
    }

    return dto;
  }

  async deleteMilestone(goalId: string, milestoneId: string, userId: string): Promise<boolean> {
    const milestone = await goalsRepository.findMilestoneById(milestoneId, userId);
    if (!milestone || milestone.goal_id !== goalId) {
      throw new NotFoundError(`Milestone with ID ${milestoneId} not found`);
    }

    const deleted = await goalsRepository.deleteMilestone(milestoneId, userId);
    if (deleted) {
      await this.syncMilestoneProgress(goalId, userId);
    }
    return deleted;
  }

  private async syncMilestoneProgress(goalId: string, userId: string): Promise<void> {
    const milestones = await goalsRepository.findMilestonesByGoalId(goalId);
    if (milestones.length === 0) return;

    const completedCount = milestones.filter((m) => m.completed === 1).length;
    const progressPercent = Math.round((completedCount / milestones.length) * 100);
    const isCompleted = completedCount === milestones.length && milestones.length > 0;

    await goalsRepository.updateGoal(goalId, userId, {
      progress_percent: progressPercent,
      status: isCompleted ? 'Completed' : undefined,
    });
  }

  // --- SUMMARY ---

  async getGoalsSummary(userId: string): Promise<GoalsSummaryDTO> {
    return goalsRepository.getGoalsSummary(userId);
  }
}

export const goalsService = new GoalsService();
