export type MealCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Custom';

export interface MealSession {
  id: string;
  name: string;
  category: MealCategory;
  timeStr: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  notes?: string;
  photoUrl?: string;
  logged: boolean;
  timestamp: string;
}

export interface WaterLog {
  id: string;
  amountMl: number;
  timestamp: string;
}

export interface NutritionRuleInsight {
  id: string;
  title: string;
  description: string;
  category: 'calories' | 'protein' | 'water' | 'consistency';
  icon: string;
}

export interface NutritionActivityEvent {
  id: string;
  type: 'MEAL_LOGGED' | 'WATER_LOGGED' | 'PROTEIN_GOAL_ACHIEVED' | 'NUTRITION_GOAL_COMPLETED';
  title: string;
  subtext: string;
  timestamp: string;
  icon: string;
}

export interface NutritionScoreBreakdown {
  mealScore: number;
  calorieScore: number;
  proteinScore: number;
  waterScore: number;
  timingScore: number;
  totalScore: number;
}
