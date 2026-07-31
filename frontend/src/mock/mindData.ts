export interface MindMockData {
  topMetrics: {
    moodScore: number; // 1-5
    moodLabel: string;
    focusScore: number; // 1-10
    energyScore: number; // 1-10
    stressScore: number; // 1-10
    meditationMinutes: number;
  };
  todayCheckIn: {
    selectedMood: number;
    energy: number;
    focus: number;
    stress: number;
    notes: string;
    completed: boolean;
  };
  meditation: {
    sessionTodayMin: number;
    weeklyTotalMin: number;
    streakDays: number;
    recommendedSessions: Array<{
      id: string;
      title: string;
      duration: string;
      category: string;
    }>;
  };
  journal: {
    todayReflection: string;
    lastLogged: string;
  };
  mindTrends30Days: Array<{
    date: string;
    mood: number; // scaled to 10 for charting
    focus: number;
    energy: number;
    stress: number;
  }>;
}

export const mockMindData: MindMockData = {
  topMetrics: {
    moodScore: 4,
    moodLabel: "Good",
    focusScore: 8,
    energyScore: 7,
    stressScore: 4,
    meditationMinutes: 15,
  },
  todayCheckIn: {
    selectedMood: 4,
    energy: 7,
    focus: 8,
    stress: 4,
    notes: "Feeling mentally clear and focused after morning deep work session.",
    completed: true,
  },
  meditation: {
    sessionTodayMin: 15,
    weeklyTotalMin: 75,
    streakDays: 6,
    recommendedSessions: [
      { id: "m1", title: "Morning Clarity & Breathing", duration: "10 min", category: "Focus" },
      { id: "m2", title: "Mid-Day Reset", duration: "5 min", category: "De-stress" },
      { id: "m3", title: "Evening Wind Down", duration: "15 min", category: "Sleep" },
    ]
  },
  journal: {
    todayReflection: "Extremely productive session during the 10:00 AM block. Maintained focus uninterrupted.",
    lastLogged: "07:54 AM",
  },
  mindTrends30Days: [
    { date: "Jul 1", mood: 6, focus: 7, energy: 6, stress: 6 },
    { date: "Jul 7", mood: 7, focus: 8, energy: 7, stress: 5 },
    { date: "Jul 14", mood: 6, focus: 6, energy: 5, stress: 7 },
    { date: "Jul 21", mood: 8, focus: 8, energy: 8, stress: 4 },
    { date: "Jul 28", mood: 8, focus: 9, energy: 7, stress: 3 },
    { date: "Jul 31", mood: 8, focus: 8, energy: 7, stress: 4 },
  ]
};
