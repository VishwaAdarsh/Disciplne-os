/**
 * Performance Engine Types & DTOs (SPR-306)
 */

export interface PerformanceSnapshotRecord {
  id: string;
  user_id: string;
  overall_score: number;
  discipline_score: number;
  body_score: number;
  mind_score: number;
  nutrition_score: number;
  goals_score: number;
  period_type: string;
  trend: string;
  snapshot_date: string;
  created_at: string;
}

export interface PerformanceModuleScores {
  discipline: number;
  body: number;
  mind: number;
  nutrition: number;
  goals: number;
  [key: string]: number;
}

export type PerformanceTrend = 'improving' | 'stable' | 'declining';

export interface PerformanceOverviewDTO {
  overallScore: number;
  previousScore: number;
  highestScore: number;
  trend: PerformanceTrend;
  percentageChange: number;
  moduleScores: PerformanceModuleScores;
  periodType: string;
  snapshotDate: string;
  updatedAt: string;
}

export interface PerformanceHistoryItemDTO {
  id: string;
  snapshotDate: string;
  overallScore: number;
  moduleScores: PerformanceModuleScores;
  periodType: string;
  trend: PerformanceTrend;
  createdAt: string;
}

export interface PerformanceTrendDTO {
  trend: PerformanceTrend;
  currentScore: number;
  previousScore: number;
  absoluteChange: number;
  percentageChange: number;
  evaluationPeriod: string;
}

export interface PerformanceFilter {
  userId?: string;
  period?: 'daily' | 'weekly' | 'monthly';
  startDate?: string;
  endDate?: string;
  limit?: number;
}
