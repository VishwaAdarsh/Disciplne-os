/**
 * API v1 Overview Router (SPR-312)
 */

import { Router } from 'express';
import { authenticate } from '../../middleware';
import { getDailyOverview } from '../../controllers/overview/overviewController';

const router = Router();

// GET /api/v1/overview - Get aggregated daily snapshot across all modules
router.get('/', authenticate, getDailyOverview);

export default router;
