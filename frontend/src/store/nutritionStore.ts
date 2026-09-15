import { create } from 'zustand';
import type {
  MealSession,
  WaterLog,
  NutritionRuleInsight,
  NutritionActivityEvent,
  NutritionScoreBreakdown,
  MealCategory,
} from '../types/nutrition';
import { nutritionApi, type MealInput, type GoalsInput } from '../services/nutrition/nutritionApi';
import { bodyApi } from '../services/body/bodyApi';
import { useOverviewStore } from './overviewStore';
import { useEventEngineStore } from './eventEngineStore';

const todayDateStr = new Date().toISOString().split('T')[0];

interface NutritionState {
  selectedDate: string;
  setSelectedDate: (date: string) => void;

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

  // Async API Actions
  fetchSummary: (date?: string) => Promise<void>;
  fetchMeals: (date?: string, category?: string) => Promise<void>;
  fetchGoals: () => Promise<void>;
  fetchHistory: (period?: string, from?: string, to?: string) => Promise<void>;
  loadAllData: (date?: string) => Promise<void>;

  logMealAsync: (mealData: MealInput) => Promise<void>;
  updateMealAsync: (id: string, updates: Partial<MealInput>) => Promise<void>;
  deleteMealAsync: (id: string) => Promise<void>;
  updateGoalsAsync: (goalsInput: GoalsInput) => Promise<void>;
  addWaterAsync: (amountMl: number) => Promise<void>;

  // Legacy/Local Actions
  logMeal: (meal: Omit<MealSession, 'id' | 'timestamp'>) => void;
  toggleMealLogged: (id: string) => void;
  deleteMeal: (id: string) => void;
  addWater: (amountMl: number) => void;
  calculateScoreBreakdown: () => NutritionScoreBreakdown;
  recalculateScore: () => void;
  generateRuleInsights: () => void;
}

export const useNutritionStore = create<NutritionState>((set, get) => ({
  selectedDate: todayDateStr,

  setSelectedDate: (date: string) => {
    set({ selectedDate: date });
    get().loadAllData(date);
  },

  nutritionScore: 85,
  calories: {
    current: 0,
    target: 2200,
  },
  protein: {
    current: 0,
    target: 120,
  },
  carbs: {
    current: 0,
    target: 250,
  },
  fat: {
    current: 0,
    target: 70,
  },
  water: {
    currentLiters: 0,
    targetLiters: 3.0,
    logs: [],
  },
  meals: [],
  ruleInsights: [],
  activityFeed: [],
  weeklyHistory: [],

  // --- API DATA FETCHING ---
  fetchSummary: async (dateStr?: string) => {
    const d = dateStr || get().selectedDate;
    try {
      const summary = await nutritionApi.getDailySummary(d);
      if (summary) {
        set({
          calories: {
            current: summary.calories?.current ?? 0,
            target: summary.calories?.target ?? 2200,
          },
          protein: {
            current: summary.protein?.current ?? 0,
            target: summary.protein?.target ?? 120,
          },
          carbs: {
            current: summary.carbs?.current ?? 0,
            target: summary.carbs?.target ?? 250,
          },
          fat: {
            current: summary.fat?.current ?? 0,
            target: summary.fat?.target ?? 70,
          },
          water: {
            currentLiters: summary.water?.currentLiters ?? 0,
            targetLiters: summary.water?.targetLiters ?? 3.0,
            logs: get().water.logs,
          },
        });
        get().recalculateScore();
      }
    } catch (err) {
      console.warn('Could not fetch daily nutrition summary from API:', err);
    }
  },

  fetchMeals: async (dateStr?: string, category?: string) => {
    const d = dateStr || get().selectedDate;
    try {
      const rawMeals = await nutritionApi.getMeals(d, category);
      if (Array.isArray(rawMeals)) {
        const mappedMeals: MealSession[] = rawMeals.map((m: any) => ({
          id: m.id,
          name: m.name,
          category: (m.category as MealCategory) || 'Lunch',
          timeStr: m.loggedAt ? new Date(m.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '12:00 PM',
          calories: m.calories ?? 0,
          proteinGrams: m.proteinG ?? 0,
          carbsGrams: m.carbsG ?? 0,
          fatGrams: m.fatG ?? 0,
          notes: m.notes || undefined,
          logged: true,
          timestamp: m.createdAt || new Date().toISOString(),
        }));
        set({ meals: mappedMeals });
      }
    } catch (err) {
      console.warn('Could not fetch meals from API:', err);
    }
  },

  fetchGoals: async () => {
    try {
      const goals = await nutritionApi.getGoals();
      if (goals) {
        set((s) => ({
          calories: { ...s.calories, target: goals.caloriesTarget ?? 2200 },
          protein: { ...s.protein, target: goals.proteinTarget ?? 120 },
          carbs: { ...s.carbs, target: goals.carbsTarget ?? 250 },
          fat: { ...s.fat, target: goals.fatTarget ?? 70 },
          water: { ...s.water, targetLiters: goals.waterTargetLiters ?? 3.0 },
        }));
      }
    } catch (err) {
      console.warn('Could not fetch nutrition goals from API:', err);
    }
  },

  fetchHistory: async (period = 'daily', from?, to?) => {
    try {
      const history = await nutritionApi.getHistory(period, from, to);
      if (Array.isArray(history)) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const formatted = history.map((h: any) => {
          const dateObj = new Date(h.date);
          const dayName = days[dateObj.getDay()] || h.date;
          return {
            day: dayName,
            calories: h.calories ?? 0,
            protein: h.protein ?? 0,
            water: h.water ?? 0,
            score: 85,
          };
        });
        set({ weeklyHistory: formatted });
      }
    } catch (err) {
      console.warn('Could not fetch nutrition history from API:', err);
    }
  },

  loadAllData: async (dateStr?: string) => {
    const d = dateStr || get().selectedDate;
    await Promise.all([
      get().fetchGoals(),
      get().fetchSummary(d),
      get().fetchMeals(d),
      get().fetchHistory('daily'),
    ]);
    get().generateRuleInsights();
  },

  // --- ASYNC MUTATIONS ---
  logMealAsync: async (mealData: MealInput) => {
    const d = mealData.logDate || get().selectedDate;
    try {
      await nutritionApi.logMeal({ ...mealData, logDate: d });
      await Promise.all([get().fetchMeals(d), get().fetchSummary(d), get().fetchHistory('daily')]);
    } catch (err) {
      console.error('Error logging meal:', err);
      // Fallback local mutation
      get().logMeal({
        name: mealData.name,
        category: (mealData.category as MealCategory) || 'Lunch',
        timeStr: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        calories: mealData.calories ?? 0,
        proteinGrams: mealData.proteinG ?? 0,
        carbsGrams: mealData.carbsG ?? 0,
        fatGrams: mealData.fatG ?? 0,
        notes: mealData.notes,
        logged: true,
      });
    }
  },

  updateMealAsync: async (id: string, updates: Partial<MealInput>) => {
    const d = get().selectedDate;
    try {
      await nutritionApi.updateMeal(id, updates);
      await Promise.all([get().fetchMeals(d), get().fetchSummary(d)]);
    } catch (err) {
      console.error('Error updating meal:', err);
    }
  },

  deleteMealAsync: async (id: string) => {
    const d = get().selectedDate;
    try {
      await nutritionApi.deleteMeal(id);
      await Promise.all([get().fetchMeals(d), get().fetchSummary(d)]);
    } catch (err) {
      console.error('Error deleting meal:', err);
      get().deleteMeal(id);
    }
  },

  updateGoalsAsync: async (goalsInput: GoalsInput) => {
    try {
      await nutritionApi.updateGoals(goalsInput);
      await get().fetchGoals();
      await get().fetchSummary(get().selectedDate);
    } catch (err) {
      console.error('Error updating nutrition goals:', err);
    }
  },

  addWaterAsync: async (amountMl: number) => {
    const d = get().selectedDate;
    try {
      // Single Source of Truth: Log water in Body Module
      await bodyApi.logWater(amountMl);
      await get().fetchSummary(d);
    } catch (err) {
      console.error('Error logging water to Body module:', err);
      get().addWater(amountMl);
    }
  },

  // --- LOCAL FALLBACK MUTATIONS ---
  calculateScoreBreakdown: () => {
    const { meals, calories, protein, water } = get();
    const loggedMeals = meals.filter((m) => m.logged).length;
    const mealScore = Math.round((loggedMeals / Math.max(1, meals.length)) * 100);

    const calRatio = calories.target > 0 ? calories.current / calories.target : 0;
    const calorieScore = Math.min(100, Math.round((1 - Math.abs(calRatio - 0.85)) * 100));
    const proteinScore = protein.target > 0 ? Math.min(100, Math.round((protein.current / protein.target) * 100)) : 0;
    const waterScore = water.targetLiters > 0 ? Math.min(100, Math.round((water.currentLiters / water.targetLiters) * 100)) : 0;
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
          (water.currentLiters / Math.max(1, water.targetLiters)) * 100
        )}% of daily ${water.targetLiters}L goal).`,
        category: 'water',
        icon: 'Droplet',
      });
    }

    set({ ruleInsights: insights });
  },
}));
