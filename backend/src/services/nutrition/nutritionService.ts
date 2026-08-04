/**
 * Nutrition Service (SPR-310 / ARCH-002)
 * Water data shared from Body Module's water_logs (single source of truth).
 */

import crypto from 'crypto';
import { nutritionRepository } from '../../repositories/nutrition/nutritionRepository';
import { eventDispatcher } from '../../events/eventDispatcher';
import {
  CreateMealInput,
  UpdateMealInput,
  UpdateGoalsInput,
  MealDTO,
  NutritionGoalsDTO,
  NutritionSummaryDTO,
  NutritionHistoryItemDTO,
} from '../../types/nutrition';
import { NotFoundError } from '../../errors/AppError';

const DEFAULT_GOALS = {
  caloriesTarget: 2200,
  proteinTarget: 120,
  carbsTarget: 250,
  fatTarget: 70,
  waterTargetMl: 3000,
};

export class NutritionService {
  // MEALS
  async getMeals(userId: string, date?: string, category?: string): Promise<MealDTO[]> {
    const records = await nutritionRepository.findMeals(userId, date, category);
    return records.map((r) => nutritionRepository.toMealDTO(r));
  }

  async logMeal(input: CreateMealInput): Promise<MealDTO> {
    const id = `meal_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const dateStr = input.logDate || new Date().toISOString().split('T')[0];

    const record = await nutritionRepository.createMeal({
      id,
      user_id: input.userId,
      name: input.name,
      category: input.category || 'Lunch',
      calories: input.calories ?? 0,
      protein_g: input.proteinG ?? 0,
      carbs_g: input.carbsG ?? 0,
      fat_g: input.fatG ?? 0,
      fiber_g: input.fiberG ?? 0,
      notes: input.notes || null,
      log_date: dateStr,
    });

    const dto = nutritionRepository.toMealDTO(record);

    await eventDispatcher.publish({
      userId: input.userId,
      module: 'nutrition',
      eventType: 'MEAL_ADDED',
      title: `Logged ${dto.category}: ${dto.name}`,
      description: `${dto.calories} kcal · ${dto.proteinG}g P · ${dto.carbsG}g C · ${dto.fatG}g F`,
      icon: '🍽️',
      metadata: { mealId: id, name: dto.name, category: dto.category, calories: dto.calories },
      scoreImpact: 10,
    });

    // Check if daily calorie goal is achieved
    const goals = await this.getGoals(input.userId);
    const dailyTotals = await nutritionRepository.getDailyTotals(input.userId, dateStr);
    if (dailyTotals.calories >= goals.caloriesTarget * 0.8 && dailyTotals.calories <= goals.caloriesTarget * 1.1) {
      await eventDispatcher.publish({
        userId: input.userId,
        module: 'nutrition',
        eventType: 'DAILY_GOAL_ACHIEVED',
        title: `Nutrition Goal on Track: ${dailyTotals.calories} / ${goals.caloriesTarget} kcal`,
        icon: '🏆',
        metadata: { calories: dailyTotals.calories, target: goals.caloriesTarget },
        scoreImpact: 15,
      });
    }

    return dto;
  }

  async updateMeal(id: string, userId: string, updates: UpdateMealInput): Promise<MealDTO> {
    const existing = await nutritionRepository.findMealById(id);
    if (!existing || existing.user_id !== userId) {
      throw new NotFoundError(`Meal with ID ${id} not found`);
    }

    const updated = await nutritionRepository.updateMeal(id, {
      name: updates.name,
      category: updates.category,
      calories: updates.calories,
      protein_g: updates.proteinG,
      carbs_g: updates.carbsG,
      fat_g: updates.fatG,
      fiber_g: updates.fiberG,
      notes: updates.notes,
    });

    const dto = nutritionRepository.toMealDTO(updated!);

    await eventDispatcher.publish({
      userId,
      module: 'nutrition',
      eventType: 'MEAL_UPDATED',
      title: `Updated Meal: ${dto.name}`,
      icon: '✏️',
      metadata: { mealId: id, name: dto.name },
      scoreImpact: 0,
    });

    return dto;
  }

  async deleteMeal(id: string, userId: string): Promise<boolean> {
    const existing = await nutritionRepository.findMealById(id);
    if (!existing || existing.user_id !== userId) {
      throw new NotFoundError(`Meal with ID ${id} not found`);
    }

    const deleted = await nutritionRepository.deleteMeal(id);

    await eventDispatcher.publish({
      userId,
      module: 'nutrition',
      eventType: 'MEAL_DELETED',
      title: `Removed Meal: ${existing.name}`,
      icon: '🗑️',
      metadata: { mealId: id, name: existing.name },
      scoreImpact: 0,
    });

    return deleted;
  }

  // GOALS
  async getGoals(userId: string): Promise<NutritionGoalsDTO> {
    const record = await nutritionRepository.getGoals(userId);
    if (record) {
      return nutritionRepository.toGoalsDTO(record);
    }
    return {
      userId,
      ...DEFAULT_GOALS,
      waterTargetLiters: DEFAULT_GOALS.waterTargetMl / 1000,
    };
  }

  async updateGoals(userId: string, updates: UpdateGoalsInput): Promise<NutritionGoalsDTO> {
    const goalId = `ng_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

    const record = await nutritionRepository.upsertGoals(userId, goalId, {
      calories_target: updates.caloriesTarget,
      protein_target: updates.proteinTarget,
      carbs_target: updates.carbsTarget,
      fat_target: updates.fatTarget,
      water_target_ml: updates.waterTargetMl,
    });

    return nutritionRepository.toGoalsDTO(record);
  }

  // DAILY SUMMARY
  async getDailySummary(userId: string, dateStr?: string): Promise<NutritionSummaryDTO> {
    const date = dateStr || new Date().toISOString().split('T')[0];
    const goals = await this.getGoals(userId);
    const totals = await nutritionRepository.getDailyTotals(userId, date);
    const waterMl = await nutritionRepository.getTodayWaterMl(userId, date);
    const waterLiters = Number((waterMl / 1000).toFixed(2));

    const pct = (current: number, target: number) => Math.min(100, Math.round((current / Math.max(target, 1)) * 100));

    return {
      userId,
      date,
      calories: {
        current: totals.calories,
        target: goals.caloriesTarget,
        remaining: Math.max(0, goals.caloriesTarget - totals.calories),
        progressPercent: pct(totals.calories, goals.caloriesTarget),
      },
      protein: {
        current: totals.protein,
        target: goals.proteinTarget,
        remaining: Math.max(0, goals.proteinTarget - totals.protein),
        progressPercent: pct(totals.protein, goals.proteinTarget),
      },
      carbs: {
        current: totals.carbs,
        target: goals.carbsTarget,
        remaining: Math.max(0, goals.carbsTarget - totals.carbs),
        progressPercent: pct(totals.carbs, goals.carbsTarget),
      },
      fat: {
        current: totals.fat,
        target: goals.fatTarget,
        remaining: Math.max(0, goals.fatTarget - totals.fat),
        progressPercent: pct(totals.fat, goals.fatTarget),
      },
      fiber: { current: totals.fiber },
      water: {
        currentMl: waterMl,
        currentLiters: waterLiters,
        targetMl: goals.waterTargetMl,
        targetLiters: goals.waterTargetLiters,
        progressPercent: pct(waterMl, goals.waterTargetMl),
      },
      mealsLogged: totals.mealsCount,
      mealsByCategory: totals.mealsByCategory,
    };
  }

  // HISTORY
  async getHistory(userId: string, period: 'daily' | 'weekly' | 'monthly' = 'daily', dateFrom?: string, dateTo?: string): Promise<NutritionHistoryItemDTO[]> {
    const today = new Date();
    const to = dateTo || today.toISOString().split('T')[0];
    let from = dateFrom;

    if (!from) {
      const d = new Date(today);
      if (period === 'daily') d.setDate(d.getDate() - 7);
      else if (period === 'weekly') d.setDate(d.getDate() - 28);
      else d.setDate(d.getDate() - 90);
      from = d.toISOString().split('T')[0];
    }

    const results: NutritionHistoryItemDTO[] = [];
    const current = new Date(from);
    const end = new Date(to);

    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];
      const totals = await nutritionRepository.getDailyTotals(userId, dateStr);
      const waterMl = await nutritionRepository.getTodayWaterMl(userId, dateStr);

      results.push({
        date: dateStr,
        calories: totals.calories,
        protein: totals.protein,
        carbs: totals.carbs,
        fat: totals.fat,
        water: Number((waterMl / 1000).toFixed(2)),
        mealsCount: totals.mealsCount,
      });

      current.setDate(current.getDate() + 1);
    }

    return results;
  }
}

export const nutritionService = new NutritionService();
