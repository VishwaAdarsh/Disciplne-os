/**
 * Pure Performance Calculator Engine (SPR-306)
 */

import { PERFORMANCE_CONFIG } from '../../config/performanceConfig';
import { EventDTO } from '../../types/events';
import { PerformanceModuleScores, PerformanceTrend } from '../../types/performance';

export class PerformanceCalculator {
  /**
   * Calculate score (0-100) for a given module based on event history
   */
  static calculateModuleScore(events: EventDTO[], moduleName: string): number {
    const moduleEvents = events.filter((evt) => evt.module.toLowerCase() === moduleName.toLowerCase());

    if (moduleEvents.length === 0) {
      return PERFORMANCE_CONFIG.BASELINE_MODULE_SCORE;
    }

    let netImpact = 0;
    for (const evt of moduleEvents) {
      if (typeof evt.scoreImpact === 'number' && evt.scoreImpact !== 0) {
        netImpact += evt.scoreImpact;
      } else {
        netImpact += PERFORMANCE_CONFIG.EVENT_SCORE_MULTIPLIER;
      }
    }

    const rawScore = PERFORMANCE_CONFIG.BASELINE_MODULE_SCORE + netImpact;
    return this.clamp(Math.round(rawScore), 0, 100);
  }

  /**
   * Calculate overall performance score (0-1000) using configurable module weights
   */
  static calculateOverallScore(moduleScores: PerformanceModuleScores): number {
    let weightedSum = 0;
    const weights = PERFORMANCE_CONFIG.MODULE_WEIGHTS;

    for (const [moduleName, weight] of Object.entries(weights)) {
      const score = moduleScores[moduleName] ?? PERFORMANCE_CONFIG.BASELINE_MODULE_SCORE;
      weightedSum += score * weight;
    }

    // Multiply weighted average (0-100) by 10 to scale to 0-1000
    const rawOverall = weightedSum * 10;
    return this.clamp(Math.round(rawOverall), PERFORMANCE_CONFIG.MIN_SCORE, PERFORMANCE_CONFIG.MAX_SCORE);
  }

  /**
   * Calculate performance trend indicator based on current vs previous score
   */
  static calculateTrend(currentScore: number, previousScore: number): PerformanceTrend {
    if (!previousScore || previousScore <= 0) {
      return 'stable';
    }

    const percentChange = ((currentScore - previousScore) / previousScore) * 100;

    if (percentChange >= PERFORMANCE_CONFIG.TREND_THRESHOLDS.IMPROVING_PERCENT) {
      return 'improving';
    }
    if (percentChange <= PERFORMANCE_CONFIG.TREND_THRESHOLDS.DECLINING_PERCENT) {
      return 'declining';
    }
    return 'stable';
  }

  /**
   * Helper utility to clamp value between min and max boundary
   */
  static clamp(val: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, val));
  }
}
