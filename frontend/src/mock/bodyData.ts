export interface BodyMockData {
  steps: {
    current: number;
    target: number;
    caloriesBurned: number;
    distanceKm: number;
  };
  workout: {
    todayTitle: string;
    durationMinutes: number;
    caloriesBurned: number;
    completed: boolean;
    recentWorkouts: Array<{
      id: string;
      name: string;
      date: string;
      duration: string;
      type: string;
    }>;
  };
  sleep: {
    durationHours: number;
    durationMinutes: number;
    targetHours: number;
    qualityPercent: number;
    deepSleepPercent: number;
    weeklyHistory: Array<{
      day: string;
      hours: number;
    }>;
  };
  weight: {
    currentKg: number;
    targetKg: number;
    change30Days: number;
    history30Days: Array<{
      date: string;
      weight: number;
    }>;
  };
  water: {
    currentLiters: number;
    targetLiters: number;
  };
}

export const mockBodyData: BodyMockData = {
  steps: {
    current: 7842,
    target: 10000,
    caloriesBurned: 340,
    distanceKm: 5.6,
  },
  workout: {
    todayTitle: "Strength Training",
    durationMinutes: 45,
    caloriesBurned: 420,
    completed: true,
    recentWorkouts: [
      { id: "w1", name: "Push Day - Upper Body Focus", date: "Today, 7:20 AM", duration: "45 min", type: "Strength" },
      { id: "w2", name: "Pull Day - Back & Biceps", date: "Yesterday", duration: "50 min", type: "Strength" },
      { id: "w3", name: "Zone 2 Cardio Run", date: "Jul 29", duration: "35 min", type: "Cardio" },
      { id: "w4", name: "Leg Day & Core", date: "Jul 28", duration: "55 min", type: "Strength" },
    ]
  },
  sleep: {
    durationHours: 7,
    durationMinutes: 24,
    targetHours: 8,
    qualityPercent: 88,
    deepSleepPercent: 24,
    weeklyHistory: [
      { day: "Mon", hours: 7.1 },
      { day: "Tue", hours: 7.8 },
      { day: "Wed", hours: 6.9 },
      { day: "Thu", hours: 7.4 },
      { day: "Fri", hours: 8.0 },
      { day: "Sat", hours: 8.2 },
      { day: "Sun", hours: 7.5 },
    ]
  },
  weight: {
    currentKg: 68.4,
    targetKg: 70.0,
    change30Days: -0.8,
    history30Days: [
      { date: "Jul 1", weight: 69.2 },
      { date: "Jul 7", weight: 69.0 },
      { date: "Jul 14", weight: 68.7 },
      { date: "Jul 21", weight: 68.5 },
      { date: "Jul 28", weight: 68.4 },
      { date: "Jul 31", weight: 68.4 },
    ]
  },
  water: {
    currentLiters: 2.1,
    targetLiters: 3.0,
  }
};
