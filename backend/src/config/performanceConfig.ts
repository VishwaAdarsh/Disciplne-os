/**
 * Performance Engine Configuration (SPR-306)
 */

export const PERFORMANCE_CONFIG = {
  MIN_SCORE: 0,
  MAX_SCORE: 1000,

  // Baseline score out of 100 when user has minimal event activity
  BASELINE_MODULE_SCORE: 50,

  // Configurable module weights (must sum to 1.0)
  MODULE_WEIGHTS: {
    discipline: 0.3,
    body: 0.2,
    mind: 0.15,
    nutrition: 0.15,
    goals: 0.2,
  } as Record<string, number>,

  // Score impact multiplier per event for calculating module activity score
  EVENT_SCORE_MULTIPLIER: 5,

  // Trend detection threshold percentages
  TREND_THRESHOLDS: {
    IMPROVING_PERCENT: 2.0, // >= +2% change
    DECLINING_PERCENT: -2.0, // <= -2% change
  },

  // Snapshot granularity options
  PERIOD_TYPES: ['daily', 'weekly', 'monthly'] as const,
};
