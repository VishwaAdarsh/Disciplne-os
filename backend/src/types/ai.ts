/**
 * AI Coach Domain Types & DTOs (SPR-314 / ARCH-006)
 */

export interface AIContextTelemetry {
  user: {
    id: string;
    name: string;
    email: string;
  };
  performance: {
    score: number;
    level: string;
    trend: 'improving' | 'declining' | 'stable';
    changePercent: number;
    moduleScores: {
      discipline: number;
      body: number;
      mind: number;
      nutrition: number;
      goals: number;
    };
  };
  discipline: {
    tasksCompletedToday: number;
    tasksTotalToday: number;
    taskCompletionRate: number;
    activeHabitsCount: number;
    currentStreak: number;
    longestStreak: number;
    pendingTasksSummary: string[];
  };
  body: {
    workoutsCompletedToday: number;
    workoutsSummary: string[];
    sleepDurationHours: number;
    sleepQualityPercent: number;
    waterLiters: number;
    waterTargetLiters: number;
  };
  nutrition: {
    caloriesCurrent: number;
    caloriesTarget: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    mealsLoggedToday: number;
  };
  mind: {
    currentMood: string;
    currentEnergy: string;
    averageStress: number | null;
    averageFocus: number | null;
    meditationMinutesToday: number;
    reflectionsLoggedCount: number; // Strictly count only, no text
  };
  goals: Array<{
    id: string;
    title: string;
    category: string;
    progressPercent: number;
    deadline: string | null;
    priority: string;
  }>;
  recentEvents: Array<{
    module: string;
    eventType: string;
    title: string;
    timeFormatted: string;
  }>;
}

export interface AIMessageDTO {
  id: string;
  conversationId: string;
  sender: 'user' | 'coach';
  text: string;
  contextSummary?: string | null;
  createdAt: string;
}

export interface AIConversationDTO {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastMessage?: string;
  messageCount?: number;
}

export interface AIChatRequestDTO {
  message: string;
  conversationId?: string;
}

export interface AIChatResponseDTO {
  response: string;
  conversationId: string;
  messageId: string;
  timestamp: string;
  contextSnapshot?: {
    score: number;
    level: string;
    streak: number;
    tasks: string;
    workouts: number;
    water: string;
    calories: string;
  };
}
