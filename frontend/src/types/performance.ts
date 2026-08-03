export type PerformanceLevelName =
  | 'Starter'
  | 'Explorer'
  | 'Builder'
  | 'Performer'
  | 'Elite'
  | 'Master';

export interface PerformanceLevelInfo {
  level: PerformanceLevelName;
  minScore: number;
  maxScore: number;
  color: string;
  progressPercent: number; // Progress to next level
}

export interface CategoryWeights {
  discipline: number; // Default 0.35
  goals: number; // Default 0.25
  body: number; // Default 0.15
  mind: number; // Default 0.15
  nutrition: number; // Default 0.10
}

export interface ModuleScores {
  discipline: number; // 0-100
  goals: number; // 0-100
  body: number; // 0-100
  mind: number; // 0-100
  nutrition: number; // 0-100
}

export interface PerformanceComparison {
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  currentScore: number;
  previousScore: number;
  diff: number;
  percentChange: number;
  direction: 'up' | 'down' | 'stable';
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'Discipline' | 'Body' | 'Mind' | 'Nutrition' | 'Goals';
  unlocked: boolean;
  unlockedDate?: string;
  progressPercent: number;
}

export interface PerformanceRecommendation {
  id: string;
  title: string;
  actionText: string;
  category: 'discipline' | 'body' | 'mind' | 'nutrition' | 'goals';
  icon: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface PerformanceReport {
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  totalScore: number;
  level: PerformanceLevelName;
  bestCategory: string;
  weakestCategory: string;
  recommendationsCount: number;
  summary: string;
}

export interface PerformanceSnapshot {
  timestamp: string;
  totalScore: number;
  moduleScores: ModuleScores;
}
