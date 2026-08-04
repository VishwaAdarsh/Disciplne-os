/**
 * Performance Service (SPR-306 / ARCH-002)
 */

import crypto from 'crypto';
import { PerformanceCalculator } from './performanceCalculator';
import { performanceRepository } from '../../repositories/performance/performanceRepository';
import { eventRepository } from '../../repositories/eventRepository';
import { logPerformanceCalculation } from '../../utils/performanceLogger';
import { PERFORMANCE_CONFIG } from '../../config/performanceConfig';
import {
  PerformanceModuleScores,
  PerformanceOverviewDTO,
  PerformanceTrendDTO,
  PerformanceFilter,
} from '../../types/performance';
import { ParsedPagination } from '../../utils/pagination';
import { eventDispatcher } from '../../events/eventDispatcher';

export class PerformanceService {
  /**
   * Compute live performance and store historical snapshot
   */
  async computeAndSaveSnapshot(userId: string, periodType: 'daily' | 'weekly' | 'monthly' = 'daily') {
    const startTime = Date.now();
    try {
      // 1. Fetch user events
      const rawEvents = await eventRepository.findMany({ userId });
      const events = rawEvents.map((r) => eventRepository.toDTO(r));

      // 2. Compute individual module scores
      const moduleScores: PerformanceModuleScores = {
        discipline: PerformanceCalculator.calculateModuleScore(events, 'discipline'),
        body: PerformanceCalculator.calculateModuleScore(events, 'body'),
        mind: PerformanceCalculator.calculateModuleScore(events, 'mind'),
        nutrition: PerformanceCalculator.calculateModuleScore(events, 'nutrition'),
        goals: PerformanceCalculator.calculateModuleScore(events, 'goals'),
      };

      // 3. Compute overall 0-1000 performance score
      const overallScore = PerformanceCalculator.calculateOverallScore(moduleScores);

      // 4. Retrieve previous snapshot for trend evaluation
      const previousSnapshot = await performanceRepository.getLatestSnapshot(userId);
      const previousScore = previousSnapshot ? previousSnapshot.overall_score : overallScore;
      const trend = PerformanceCalculator.calculateTrend(overallScore, previousScore);

      const todayStr = new Date().toISOString().split('T')[0];
      const snapshotId = `snap_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

      // 5. Persist snapshot
      const record = await performanceRepository.create({
        id: snapshotId,
        user_id: userId,
        overall_score: overallScore,
        discipline_score: moduleScores.discipline,
        body_score: moduleScores.body,
        mind_score: moduleScores.mind,
        nutrition_score: moduleScores.nutrition,
        goals_score: moduleScores.goals,
        period_type: periodType,
        trend,
        snapshot_date: todayStr,
      });

      const durationMs = Date.now() - startTime;
      logPerformanceCalculation({
        userId,
        durationMs,
        overallScore,
        snapshotCreated: true,
        snapshotId: record.id,
      });

      return record;
    } catch (err: any) {
      const durationMs = Date.now() - startTime;
      logPerformanceCalculation({
        userId,
        durationMs,
        overallScore: 0,
        snapshotCreated: false,
        error: err?.message || 'Calculation failure',
      });
      throw err;
    }
  }

  /**
   * Get current performance KPI overview
   */
  async getLatestPerformance(userId: string): Promise<PerformanceOverviewDTO> {
    let latest = await performanceRepository.getLatestSnapshot(userId);

    if (!latest) {
      latest = await this.computeAndSaveSnapshot(userId, 'daily');
    }

    const highestScore = Math.max(latest.overall_score, await performanceRepository.getHighestScore(userId));

    // Previous snapshot before current latest
    const history = await performanceRepository.findMany({ userId, limit: 2 });
    const previousScore = history.length > 1 ? history[1].overall_score : latest.overall_score;

    const percentageChange = previousScore > 0
      ? Number((((latest.overall_score - previousScore) / previousScore) * 100).toFixed(1))
      : 0;

    return {
      overallScore: latest.overall_score,
      previousScore,
      highestScore,
      trend: (latest.trend as any) || 'stable',
      percentageChange,
      moduleScores: {
        discipline: latest.discipline_score,
        body: latest.body_score,
        mind: latest.mind_score,
        nutrition: latest.nutrition_score,
        goals: latest.goals_score,
      },
      periodType: latest.period_type,
      snapshotDate: latest.snapshot_date,
      updatedAt: latest.created_at || new Date().toISOString(),
    };
  }

  /**
   * Get historical performance timeline
   */
  async getPerformanceHistory(userId: string, pagination: ParsedPagination, filter: PerformanceFilter) {
    const combinedFilter: PerformanceFilter = { ...filter, userId };
    const paginated = await performanceRepository.paginate(pagination, combinedFilter);

    const dtoItems = paginated.items.map((rec) => performanceRepository.toDTO(rec));

    return {
      items: dtoItems,
      meta: paginated.meta,
    };
  }

  /**
   * Get individual module score breakdown
   */
  async getModuleBreakdown(userId: string) {
    const overview = await this.getLatestPerformance(userId);
    const weights = PERFORMANCE_CONFIG.MODULE_WEIGHTS;

    const breakdown = Object.keys(weights).map((mod) => {
      const score = overview.moduleScores[mod] ?? PERFORMANCE_CONFIG.BASELINE_MODULE_SCORE;
      const weight = weights[mod];
      const contribution = Math.round(score * weight * 10);

      return {
        module: mod,
        score,
        weight,
        contributionPoints: contribution,
      };
    });

    return {
      overallScore: overview.overallScore,
      modules: breakdown,
    };
  }

  /**
   * Get trend evaluation metrics
   */
  async getPerformanceTrends(userId: string): Promise<PerformanceTrendDTO> {
    const overview = await this.getLatestPerformance(userId);
    return {
      trend: overview.trend,
      currentScore: overview.overallScore,
      previousScore: overview.previousScore,
      absoluteChange,
      percentageChange: overview.percentageChange,
      evaluationPeriod: overview.periodType,
    };
  }
}

export const performanceService = new PerformanceService();

// Subscribe Performance Engine to central Event Dispatcher
eventDispatcher.subscribeAll((event) => {
  performanceService.computeAndSaveSnapshot(event.userId, 'daily').catch((err) => {
    console.error(`[PERFORMANCE ENGINE] Auto-snapshot failure for user ${event.userId}:`, err);
  });
});
