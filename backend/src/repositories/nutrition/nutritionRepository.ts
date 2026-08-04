/**
 * Nutrition Repository Implementation (SPR-310 / ARCH-002)
 * Water data is read from Body Module's water_logs (single source of truth).
 */

import db from '../../db';
import {
  MealRecord,
  NutritionGoalsRecord,
  MealDTO,
  NutritionGoalsDTO,
} from '../../types/nutrition';

export class NutritionRepository {
  // --- MEALS ---
  async findMealById(id: string): Promise<MealRecord | null> {
    const row = db.prepare('SELECT * FROM meals WHERE id = ? AND deleted_at IS NULL').get(id) as MealRecord | undefined;
    return row || null;
  }

  async findMeals(userId: string, date?: string, category?: string): Promise<MealRecord[]> {
    let query = 'SELECT * FROM meals WHERE user_id = ? AND deleted_at IS NULL';
    const params: any[] = [userId];

    if (date) { query += ' AND log_date = ?'; params.push(date); }
    if (category) { query += ' AND category = ?'; params.push(category); }

    query += ' ORDER BY logged_at ASC';
    return db.prepare(query).all(...params) as MealRecord[];
  }

  async createMeal(data: Partial<MealRecord>): Promise<MealRecord> {
    const stmt = db.prepare(`
      INSERT INTO meals (id, user_id, name, category, calories, protein_g, carbs_g, fat_g, fiber_g, notes, log_date, logged_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, datetime('now')))
    `);

    stmt.run(
      data.id,
      data.user_id,
      data.name,
      data.category || 'Lunch',
      data.calories ?? 0,
      data.protein_g ?? 0,
      data.carbs_g ?? 0,
      data.fat_g ?? 0,
      data.fiber_g ?? 0,
      data.notes || null,
      data.log_date || new Date().toISOString().split('T')[0],
      data.logged_at || null
    );

    return (await this.findMealById(data.id!))!;
  }

  async updateMeal(id: string, data: Partial<MealRecord>): Promise<MealRecord | null> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) { updates.push('name = ?'); values.push(data.name); }
    if (data.category !== undefined) { updates.push('category = ?'); values.push(data.category); }
    if (data.calories !== undefined) { updates.push('calories = ?'); values.push(data.calories); }
    if (data.protein_g !== undefined) { updates.push('protein_g = ?'); values.push(data.protein_g); }
    if (data.carbs_g !== undefined) { updates.push('carbs_g = ?'); values.push(data.carbs_g); }
    if (data.fat_g !== undefined) { updates.push('fat_g = ?'); values.push(data.fat_g); }
    if (data.fiber_g !== undefined) { updates.push('fiber_g = ?'); values.push(data.fiber_g); }
    if (data.notes !== undefined) { updates.push('notes = ?'); values.push(data.notes); }

    if (updates.length === 0) return this.findMealById(id);

    updates.push("updated_at = datetime('now')");
    values.push(id);

    db.prepare(`UPDATE meals SET ${updates.join(', ')} WHERE id = ? AND deleted_at IS NULL`).run(...values);
    return this.findMealById(id);
  }

  async deleteMeal(id: string): Promise<boolean> {
    const result = db.prepare("UPDATE meals SET deleted_at = datetime('now') WHERE id = ?").run(id);
    return result.changes > 0;
  }

  // --- NUTRITION GOALS ---
  async getGoals(userId: string): Promise<NutritionGoalsRecord | null> {
    const row = db.prepare('SELECT * FROM nutrition_goals WHERE user_id = ?').get(userId) as NutritionGoalsRecord | undefined;
    return row || null;
  }

  async upsertGoals(userId: string, goalId: string, data: Partial<NutritionGoalsRecord>): Promise<NutritionGoalsRecord> {
    const existing = await this.getGoals(userId);
    if (existing) {
      const updates: string[] = [];
      const values: any[] = [];

      if (data.calories_target !== undefined) { updates.push('calories_target = ?'); values.push(data.calories_target); }
      if (data.protein_target !== undefined) { updates.push('protein_target = ?'); values.push(data.protein_target); }
      if (data.carbs_target !== undefined) { updates.push('carbs_target = ?'); values.push(data.carbs_target); }
      if (data.fat_target !== undefined) { updates.push('fat_target = ?'); values.push(data.fat_target); }
      if (data.water_target_ml !== undefined) { updates.push('water_target_ml = ?'); values.push(data.water_target_ml); }

      if (updates.length > 0) {
        updates.push("updated_at = datetime('now')");
        values.push(existing.id);
        db.prepare(`UPDATE nutrition_goals SET ${updates.join(', ')} WHERE id = ?`).run(...values);
      }

      return (await this.getGoals(userId))!;
    }

    db.prepare(`
      INSERT INTO nutrition_goals (id, user_id, calories_target, protein_target, carbs_target, fat_target, water_target_ml)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      goalId,
      userId,
      data.calories_target ?? 2200,
      data.protein_target ?? 120,
      data.carbs_target ?? 250,
      data.fat_target ?? 70,
      data.water_target_ml ?? 3000
    );

    return (await this.getGoals(userId))!;
  }

  // --- DAILY AGGREGATION ---
  async getDailyTotals(userId: string, date: string): Promise<{ calories: number; protein: number; carbs: number; fat: number; fiber: number; mealsCount: number; mealsByCategory: Record<string, number> }> {
    const meals = await this.findMeals(userId, date);

    const mealsByCategory: Record<string, number> = {};
    let calories = 0, protein = 0, carbs = 0, fat = 0, fiber = 0;

    for (const meal of meals) {
      calories += meal.calories || 0;
      protein += meal.protein_g || 0;
      carbs += meal.carbs_g || 0;
      fat += meal.fat_g || 0;
      fiber += meal.fiber_g || 0;
      mealsByCategory[meal.category] = (mealsByCategory[meal.category] || 0) + 1;
    }

    return { calories, protein: Math.round(protein * 10) / 10, carbs: Math.round(carbs * 10) / 10, fat: Math.round(fat * 10) / 10, fiber: Math.round(fiber * 10) / 10, mealsCount: meals.length, mealsByCategory };
  }

  // --- WATER (reads from Body Module's water_logs) ---
  async getTodayWaterMl(userId: string, dateStr: string): Promise<number> {
    const row = db
      .prepare("SELECT SUM(amount_ml) as total FROM water_logs WHERE user_id = ? AND strftime('%Y-%m-%d', logged_at) = ?")
      .get(userId, dateStr) as { total: number | null } | undefined;
    return row?.total ?? 0;
  }

  // Mappers
  toMealDTO(record: MealRecord): MealDTO {
    return {
      id: record.id,
      userId: record.user_id,
      name: record.name,
      category: record.category || 'Lunch',
      calories: record.calories ?? 0,
      proteinG: record.protein_g ?? 0,
      carbsG: record.carbs_g ?? 0,
      fatG: record.fat_g ?? 0,
      fiberG: record.fiber_g ?? 0,
      notes: record.notes,
      logDate: record.log_date,
      loggedAt: record.logged_at,
      createdAt: record.created_at,
    };
  }

  toGoalsDTO(record: NutritionGoalsRecord): NutritionGoalsDTO {
    return {
      userId: record.user_id,
      caloriesTarget: record.calories_target,
      proteinTarget: record.protein_target,
      carbsTarget: record.carbs_target,
      fatTarget: record.fat_target,
      waterTargetMl: record.water_target_ml,
      waterTargetLiters: Number((record.water_target_ml / 1000).toFixed(1)),
    };
  }
}

export const nutritionRepository = new NutritionRepository();
