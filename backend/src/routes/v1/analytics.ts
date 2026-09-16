/**
 * API v1 Analytics Router (SPR-313)
 */

import { Router } from 'express';
import { authenticate } from '../../middleware';
import { getAnalytics } from '../../controllers/analytics/analyticsController';

const router = Router();

// GET /api/v1/analytics?range=7d|30d|90d
router.get('/', authenticate, getAnalytics);

export default router;
