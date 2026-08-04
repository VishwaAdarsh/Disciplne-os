/**
 * Nutrition Module Domain Types & DTOs (SPR-310)
 */

export const MEAL_CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Custom'] as const;
export type MealCategory = (typeof MEAL_CATEGORIES)[number];

export interface MealRecord {
  id: string;
  user_id: string;
  name: string;
  category: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  notes?: string | null;
  log_date: string;
  logged_at: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface NutritionGoalsRecord {
  id: string;
  user_id: string;
  calories_target: number;
  protein_target: number;
  carbs_target: number;
  fat_target: number;
  water_target_ml: number;
  created_at: string;
  updated_at: string;
}

export interface CreateMealInput {
  userId: string;
  name: string;
  category?: MealCategory;
  calories?: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
  fiberG?: number;
  notes?: string;
  logDate?: string;
}

export interface UpdateMealInput {
  name?: string;
  category?: MealCategory;
  calories?: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
  fiberG?: number;
  notes?: string;
}

export interface UpdateGoalsInput {
  caloriesTarget?: number;
  proteinTarget?: number;
  carbsTarget?: number;
  fatTarget?: number;
  waterTargetMl?: number;
}

export interface MealDTO {
  id: string;
  userId: string;
  name: string;
  category: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  notes?: string | null;
  logDate: string;
  loggedAt: string;
  createdAt: string;
}

export interface NutritionGoalsDTO {
  userId: string;
  caloriesTarget: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  waterTargetMl: number;
  waterTargetLiters: number;
}

export interface NutritionSummaryDTO {
  userId: string;
  date: string;
  calories: { current: number; target: number; remaining: number; progressPercent: number };
  protein: { current: number; target: number; remaining: number; progressPercent: number };
  carbs: { current: number; target: number; remaining: number; progressPercent: number };
  fat: { current: number; target: number; remaining: number; progressPercent: number };
  fiber: { current: number };
  water: { currentMl: number; currentLiters: number; targetMl: number; targetLiters: number; progressPercent: number };
  mealsLogged: number;
  mealsByCategory: Record<string, number>;
}

export interface NutritionHistoryItemDTO {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
  mealsCount: number;
}
