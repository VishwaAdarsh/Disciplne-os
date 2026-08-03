import { create } from 'zustand';
import type {
  MealSession,
  WaterLog,
  NutritionRuleInsight,
  NutritionActivityEvent,
  NutritionScoreBreakdown,
} from '../types/nutrition';
import { useOverviewStore } from './overviewStore';
import { useEventEngineStore } from './eventEngineStore';

interface NutritionState {
  nutritionScore: number;
  calories: {
    current: number;
    target: number;
  };
  protein: {
    current: number;
    target: number;
  };
  carbs: {
    current: number;
    target: number;
  };
  fat: {
    current: number;
    target: number;
  };
  water: {
    currentLiters: number;
    targetLiters: number;
    logs: WaterLog[];
  };
  meals: MealSession[];
  ruleInsights: NutritionRuleInsight[];
  activityFeed: NutritionActivityEvent[];
  weeklyHistory: Array<{
    day: string;
    calories: number;
    protein: number;
    water: number;
    score: number;
  }>;

  // Actions
  logMeal: (meal: Omit<MealSession, 'id' | 'timestamp'>) => void;
  toggleMealLogged: (id: string) => void;
  deleteMeal: (id: string) => void;
  addWater: (amountMl: number) => void;
  calculateScoreBreakdown: () => NutritionScoreBreakdown;
  recalculateScore: () => void;
  generateRuleInsights: () => void;
}

export const useNutritionStore = create<NutritionState>((set, get) => ({
  nutritionScore: 81,
  calories: {
    current: 1720,
    target: 2200,
  },
  protein: {
    current: 82,
    target: 120,
  },
  carbs: {
    current: 180,
    target: 250,
  },
  fat: {
    current: 48,
    target: 70,
  },
  water: {
    currentLiters: 2.2,
    targetLiters: 3.0,
    logs: [
      { id: 'w-1', amountMl: 500, timestamp: '08:00 AM' },
      { id: 'w-2', amountMl: 500, timestamp: '11:00 AM' },
      { id: 'w-3', amountMl: 700, timestamp: '02:00 PM' },
      { id: 'w-4', amountMl: 500, timestamp: '05:00 PM' },
    ],
  },
  meals: [
    {
      id: 'm-1',
      name: 'Oatmeal & Protein Shake',
      category: 'Breakfast',
      timeStr: '08:30 AM',
      calories: 420,
      proteinGrams: 28,
      carbsGrams: 45,
      fatGrams: 14,
      logged: true,
      timestamp: new Date().toISOString(),
    },
    {
      id: 'm-2',
      name: 'Grilled Chicken & Quinoa Salad',
      category: 'Lunch',
      timeStr: '01:15 PM',
      calories: 650,
      proteinGrams: 42,
      carbsGrams: 75,
      fatGrams: 20,
      logged: true,
      timestamp: new Date().toISOString(),
    },
    {
      id: 'm-3',
      name: 'Greek Yogurt & Almonds',
      category: 'Snack',
      timeStr: '05:00 PM',
      calories: 180,
      proteinGrams: 12,
      carbsGrams: 20,
      fatGrams: 6,
      logged: true,
      timestamp: new Date().toISOString(),
    },
    {
      id: 'm-4',
      name: 'Salmon, Sweet Potato & Broccoli',
      category: 'Dinner',
      timeStr: '08:00 PM',
      calories: 470,
      proteinGrams: 35,
      carbsGrams: 40,
      fatGrams: 14,
      logged: false,
      timestamp: new Date().toISOString(),
    },
  ],
  ruleInsights: [
    {
      id: 'n-ins-1',
      title: 'Protein Target Progress',
      description: 'Protein intake has improved by 18% compared to last week (82g average).',
      category: 'protein',
      icon: 'Zap',
    },
    {
      id: 'n-ins-2',
      title: 'Weekend Hydration Drop',
      description: 'Water intake averages 1.8L on weekends vs 2.5L on weekdays.',
      category: 'water',
      icon: 'Droplet',
    },
    {
      id: 'n-ins-3',
      title: 'Consistent Meal Spacing',
      description: 'You log breakfast before 9:00 AM on 5 out of 7 days.',
      category: 'consistency',
      icon: 'Utensils',
    },
  ],
  activityFeed: [
    {
      id: 'n-act-1',
      type: 'MEAL_LOGGED',
      title: 'Logged Snack',
      subtext: 'Greek Yogurt & Almonds (180 kcal · 12g P)',
      timestamp: 'Today, 5:00 PM',
      icon: 'Utensils',
    },
    {
      id: 'n-act-2',
      type: 'WATER_LOGGED',
      title: 'Added Hydration',
      subtext: '+500 ml logged (Total 2.2L / 3.0L)',
      timestamp: 'Today, 5:00 PM',
      icon: 'Droplet',
    },
    {
      id: 'n-act-3',
      type: 'MEAL_LOGGED',
      title: 'Logged Lunch',
      subtext: 'Grilled Chicken & Quinoa Salad (650 kcal · 42g P)',
      timestamp: 'Today, 1:15 PM',
      icon: 'Utensils',
    },
  ],
  weeklyHistory: [
    { day: 'Mon', calories: 2100, protein: 110, water: 2.8, score: 85 },
    { day: 'Tue', calories: 2050, protein: 115, water: 2.9, score: 88 },
    { day: 'Wed', calories: 2250, protein: 105, water: 2.6, score: 82 },
    { day: 'Thu', calories: 1980, protein: 118, water: 3.0, score: 90 },
    { day: 'Fri', calories: 2150, protein: 112, water: 2.7, score: 86 },
    { day: 'Sat', calories: 2300, protein: 95, water: 2.0, score: 78 },
    { day: 'Sun', calories: 1720, protein: 82, water: 2.2, score: 81 },
  ],

  calculateScoreBreakdown: () => {
    const { meals, calories, protein, water } = get();
    const loggedMeals = meals.filter((m) => m.logged).length;
    const mealScore = Math.round((loggedMeals / Math.max(1, meals.length)) * 100);

    const calRatio = calories.current / calories.target;
    const calorieScore = Math.min(100, Math.round((1 - Math.abs(calRatio - 0.85)) * 100));
    const proteinScore = Math.min(100, Math.round((protein.current / protein.target) * 100));
    const waterScore = Math.min(100, Math.round((water.currentLiters / water.targetLiters) * 100));
    const timingScore = 85;

    const totalScore = Math.round(
      mealScore * 0.25 +
      calorieScore * 0.25 +
      proteinScore * 0.25 +
      waterScore * 0.15 +
      timingScore * 0.10
    );

    return {
      mealScore,
      calorieScore,
      proteinScore,
      waterScore,
      timingScore,
      totalScore,
    };
  },

  recalculateScore: () => {
    const breakdown = get().calculateScoreBreakdown();
    set({ nutritionScore: breakdown.totalScore });
  },

  logMeal: (mealData) => {
    const { meals, calories, protein, carbs, fat, activityFeed } = get();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMeal: MealSession = {
      id: `m-${Date.now()}`,
      name: mealData.name,
      category: mealData.category,
      timeStr: mealData.timeStr || nowTime,
      calories: mealData.calories,
      proteinGrams: mealData.proteinGrams,
      carbsGrams: mealData.carbsGrams,
      fatGrams: mealData.fatGrams,
      notes: mealData.notes,
      logged: true,
      timestamp: new Date().toISOString(),
    };

    const updatedMeals = [newMeal, ...meals];
    const newCalories = calories.current + mealData.calories;
    const newProtein = protein.current + mealData.proteinGrams;
    const newCarbs = carbs.current + mealData.carbsGrams;
    const newFat = fat.current + mealData.fatGrams;

    const newActivity: NutritionActivityEvent = {
      id: `n-act-${Date.now()}`,
      type: 'MEAL_LOGGED',
      title: `Logged ${mealData.category}: ${mealData.name}`,
      subtext: `${mealData.calories} kcal · ${mealData.proteinGrams}g P · ${mealData.carbsGrams}g C · ${mealData.fatGrams}g F`,
      timestamp: 'Just now',
      icon: 'Utensils',
    };

    set({
      meals: updatedMeals,
      calories: { ...calories, current: newCalories },
      protein: { ...protein, current: newProtein },
      carbs: { ...carbs, current: newCarbs },
      fat: { ...fat, current: newFat },
      activityFeed: [newActivity, ...activityFeed],
    });

    get().recalculateScore();
    get().generateRuleInsights();

    useEventEngineStore.getState().emitEvent({
      module: 'nutrition',
      eventType: 'MEAL_ADDED',
      title: `Meal Added (${mealData.category}): ${mealData.name}`,
      description: `${mealData.calories} kcal · ${mealData.proteinGrams}g Protein`,
      icon: '🍳',
      payload: { name: mealData.name, category: mealData.category, calories: mealData.calories, protein: mealData.proteinGrams },
      scoreImpact: 3,
    });
  },


  toggleMealLogged: (id) => {
    const { meals } = get();
    const target = meals.find((m) => m.id === id);
    if (!target) return;

    const updated = meals.map((m) => (m.id === id ? { ...m, logged: !m.logged } : m));

    let cDiff = target.calories;
    let pDiff = target.proteinGrams;
    let carbDiff = target.carbsGrams;
    let fDiff = target.fatGrams;

    if (target.logged) {
      // Unlogging
      cDiff = -cDiff;
      pDiff = -pDiff;
      carbDiff = -carbDiff;
      fDiff = -fDiff;
    }

    set((s) => ({
      meals: updated,
      calories: { ...s.calories, current: Math.max(0, s.calories.current + cDiff) },
      protein: { ...s.protein, current: Math.max(0, s.protein.current + pDiff) },
      carbs: { ...s.carbs, current: Math.max(0, s.carbs.current + carbDiff) },
      fat: { ...s.fat, current: Math.max(0, s.fat.current + fDiff) },
    }));

    get().recalculateScore();
  },

  deleteMeal: (id) => {
    const { meals } = get();
    const target = meals.find((m) => m.id === id);
    if (!target) return;

    const updated = meals.filter((m) => m.id !== id);
    if (target.logged) {
      set((s) => ({
        meals: updated,
        calories: { ...s.calories, current: Math.max(0, s.calories.current - target.calories) },
        protein: { ...s.protein, current: Math.max(0, s.protein.current - target.proteinGrams) },
        carbs: { ...s.carbs, current: Math.max(0, s.carbs.current - target.carbsGrams) },
        fat: { ...s.fat, current: Math.max(0, s.fat.current - target.fatGrams) },
      }));
    } else {
      set({ meals: updated });
    }

    get().recalculateScore();
  },

  addWater: (amountMl) => {
    const { water, activityFeed } = get();
    const newLiters = Number((water.currentLiters + amountMl / 1000).toFixed(2));
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newLog: WaterLog = {
      id: `w-${Date.now()}`,
      amountMl,
      timestamp: nowTime,
    };

    const newActivity: NutritionActivityEvent = {
      id: `n-act-${Date.now()}`,
      type: 'WATER_LOGGED',
      title: 'Added Hydration',
      subtext: `+${amountMl} ml added (${newLiters}L / ${water.targetLiters}L)`,
      timestamp: nowTime,
      icon: 'Droplet',
    };

    set({
      water: {
        ...water,
        currentLiters: newLiters,
        logs: [newLog, ...water.logs],
      },
      activityFeed: [newActivity, ...activityFeed],
    });

    get().recalculateScore();

    useOverviewStore.getState().pushEvent({
      title: `Added +${amountMl} ml Water (${newLiters}L / ${water.targetLiters}L)`,
      category: 'nutrition',
      icon: '💧',
      type: 'WATER_LOGGED',
    });
  },

  generateRuleInsights: () => {
    const { protein, water } = get();
    const insights: NutritionRuleInsight[] = [];

    if (protein.current >= protein.target * 0.8) {
      insights.push({
        id: 'n-ins-protein-high',
        title: 'Protein Target on Track',
        description: `Achieved ${protein.current}g / ${protein.target}g protein today. Great muscle recovery support.`,
        category: 'protein',
        icon: 'Zap',
      });
    }

    if (water.currentLiters >= water.targetLiters * 0.7) {
      insights.push({
        id: 'n-ins-water-good',
        title: 'Optimal Hydration',
        description: `Hydration level at ${water.currentLiters}L (${Math.round(
          (water.currentLiters / water.targetLiters) * 100
        )}% of daily 3.0L goal).`,
        category: 'water',
        icon: 'Droplet',
      });
    }

    set({ ruleInsights: insights });
  },
}));
