/**
 * Real-Time Routes (SPR-316 / ARCH-003)
 */

import { Router } from 'express';
import { realtimeController } from '../../controllers/realtime/realtimeController';
import { authenticate } from '../../middleware';

const router = Router();

// GET /api/v1/realtime/stream - SSE connection (authenticates via header or ?token= query)
router.get('/stream', (req, res) => realtimeController.handleStream(req, res));

// GET /api/v1/realtime/stats - Telemetry stats (authenticated)
router.get('/stats', authenticate, (req, res) => realtimeController.getStats(req, res));

export default router;
