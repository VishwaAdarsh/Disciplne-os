/**
 * Habit Service (SPR-307 / ARCH-002)
 */

import crypto from 'crypto';
import { habitRepository } from '../../repositories/habits/habitRepository';
import { eventDispatcher } from '../../events/eventDispatcher';
import { performanceService } from '../performance/performanceService';
import { CreateHabitInput, UpdateHabitInput, HabitDTO } from '../../types/discipline';
import { NotFoundError } from '../../errors/AppError';

export class HabitService {
  async getHabits(userId: string): Promise<HabitDTO[]> {
    const records = await habitRepository.findMany({ userId });
    return records.map((r) => habitRepository.toDTO(r));
  }

  async getHabitById(habitId: string, userId: string): Promise<HabitDTO> {
    const record = await habitRepository.findById(habitId);
    if (!record || record.user_id !== userId) {
      throw new NotFoundError(`Habit with ID ${habitId} not found`);
    }
    return habitRepository.toDTO(record);
  }

  async createHabit(input: CreateHabitInput): Promise<HabitDTO> {
    const id = `habit_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

    const record = await habitRepository.create({
      id,
      user_id: input.userId,
      habit_name: input.habitName,
      description: input.description || null,
      category: input.category || 'Health',
      frequency: input.frequency || 'daily',
      target_days_per_week: input.targetDaysPerWeek ?? 7,
      streak: 0,
      completion_rate: 0.0,
      status: 'active',
    });

    await eventDispatcher.publish({
      userId: input.userId,
      module: 'discipline',
      eventType: 'HABIT_CREATED',
      title: `Created Habit: ${input.habitName}`,
      icon: '🔥',
      metadata: { habitId: id, name: input.habitName, category: input.category },
      scoreImpact: 5,
    });

    return habitRepository.toDTO(record);
  }

  async updateHabit(habitId: string, userId: string, updates: UpdateHabitInput): Promise<HabitDTO> {
    await this.getHabitById(habitId, userId);

    const updatePayload: any = {};
    if (updates.habitName !== undefined) updatePayload.habit_name = updates.habitName;
    if (updates.description !== undefined) updatePayload.description = updates.description;
    if (updates.category !== undefined) updatePayload.category = updates.category;
    if (updates.frequency !== undefined) updatePayload.frequency = updates.frequency;
    if (updates.targetDaysPerWeek !== undefined) updatePayload.target_days_per_week = updates.targetDaysPerWeek;
    if (updates.status !== undefined) updatePayload.status = updates.status;

    const updatedRecord = await habitRepository.update(habitId, updatePayload);
    return habitRepository.toDTO(updatedRecord!);
  }

  async completeHabit(habitId: string, userId: string): Promise<HabitDTO> {
    const habit = await this.getHabitById(habitId, userId);
    const updatedRecord = await habitRepository.incrementStreak(habitId);
    const dto = habitRepository.toDTO(updatedRecord!);

    // Publish event
    await eventDispatcher.publish({
      userId,
      module: 'discipline',
      eventType: 'HABIT_COMPLETED',
      title: `Completed Habit: ${habit.habitName}`,
      icon: '🔥',
      metadata: { habitId, name: habit.habitName, newStreak: dto.streak },
      scoreImpact: 10,
    });

    // Trigger performance engine recalculation
    await performanceService.computeAndSaveSnapshot(userId, 'daily');

    return dto;
  }

  async deleteHabit(habitId: string, userId: string): Promise<boolean> {
    const habit = await this.getHabitById(habitId, userId);
    await eventDispatcher.publish({
      userId,
      module: 'discipline',
      eventType: 'HABIT_DELETED',
      title: `Deleted Habit: ${habit.habitName}`,
      icon: '🗑️',
      metadata: { habitId },
      scoreImpact: -5,
    });
    return habitRepository.delete(habitId);
  }
}

export const habitService = new HabitService();
