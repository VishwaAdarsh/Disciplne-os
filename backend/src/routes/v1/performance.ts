import { Router } from 'express';
import { sendSuccess } from '../../utils/response';
import { authenticate, AuthRequest } from '../../middleware';

const router = Router();

// GET /api/v1/performance/current
router.get('/current', authenticate, (_req: AuthRequest, res) => {
  return sendSuccess(res, {
    performanceScore: 782,
    previousScore: 701,
    highestScore: 840,
    dailyChange: 12,
    weeklyChange: 45,
    levelInfo: {
      level: 'Performer',
      rankTitle: 'Performer',
      color: '#6366f1',
      progressPercent: 78,
    },
    moduleScores: {
      discipline: 86,
      body: 78,
      mind: 82,
      nutrition: 81,
      goals: 84,
    },
  }, 'Current performance KPI retrieved');
});

// GET /api/v1/performance/history
router.get('/history', authenticate, (_req: AuthRequest, res) => {
  const history = Array.from({ length: 30 }, (_, i) => ({
    date: `2026-07-${String(i + 1).padStart(2, '0')}`,
    score: Math.min(1000, Math.max(400, 650 + Math.floor(Math.sin(i * 0.4) * 150))),
  }));
  return sendSuccess(res, history, 'Historical performance snapshots retrieved');
});

export default router;
