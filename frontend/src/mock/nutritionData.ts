export interface MealEntry {
  id: string;
  name: string;
  time: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  logged: boolean;
}

export interface NutritionMockData {
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
  };
  meals: MealEntry[];
}

export const mockNutritionData: NutritionMockData = {
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
    currentLiters: 2.1,
    targetLiters: 3.0,
  },
  meals: [
    {
      id: "m-1",
      name: "Breakfast",
      time: "08:30 AM",
      calories: 420,
      proteinGrams: 28,
      carbsGrams: 45,
      fatGrams: 14,
      logged: true,
    },
    {
      id: "m-2",
      name: "Lunch",
      time: "01:15 PM",
      calories: 650,
      proteinGrams: 42,
      carbsGrams: 75,
      fatGrams: 20,
      logged: true,
    },
    {
      id: "m-3",
      name: "Snack",
      time: "05:00 PM",
      calories: 180,
      proteinGrams: 12,
      carbsGrams: 20,
      fatGrams: 6,
      logged: true,
    },
    {
      id: "m-4",
      name: "Dinner",
      time: "08:00 PM",
      calories: 470,
      proteinGrams: 35,
      carbsGrams: 40,
      fatGrams: 14,
      logged: false,
    },
  ]
};
