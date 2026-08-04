/**
 * Performance Routes (SPR-306 / ARCH-002)
 */

import { Router } from 'express';
import { authenticate } from '../../middleware';
import {
  getPerformance,
  getPerformanceHistory,
  getModuleScores,
  getPerformanceTrends,
} from '../../controllers/performance/performanceController';

const router = Router();

// GET /api/v1/performance - Get current performance overview
router.get('/', authenticate, getPerformance);

// GET /api/v1/performance/current - Alias for current performance overview
router.get('/current', authenticate, getPerformance);

// GET /api/v1/performance/history - Get historical snapshots timeline
router.get('/history', authenticate, getPerformanceHistory);

// GET /api/v1/performance/modules - Get module breakdown & scores
router.get('/modules', authenticate, getModuleScores);

// GET /api/v1/performance/trends - Get trend indicators & changes
router.get('/trends', authenticate, getPerformanceTrends);

export default router;
