import { Router } from 'express';
import { sendSuccess, sendError } from '../../utils/response';
import { authenticate, AuthRequest } from '../../middleware';

const router = Router();

// GET /api/v1/body/summary
router.get('/summary', authenticate, (_req: AuthRequest, res) => {
  return sendSuccess(res, {
    bodyScore: 78,
    steps: { current: 8432, target: 10000 },
    workout: { completed: true, title: 'Hyper-trophy Strength', durationMinutes: 45 },
    water: { currentLiters: 2.2, targetLiters: 3.0 },
    sleep: { durationHours: 7, durationMinutes: 26, qualityPercent: 88 },
    weight: { currentKg: 68.4, targetKg: 70.0 },
  }, 'Body metrics retrieved');
});

// POST /api/v1/body/water
router.post('/water', authenticate, (req: AuthRequest, res) => {
  const { amountMl } = req.body;
  if (!amountMl) return sendError(res, 'amountMl is required', 400);

  return sendSuccess(res, { amountMl, currentTotalLiters: 2.7, targetLiters: 3.0 }, 'Water logged successfully');
});

// POST /api/v1/body/workouts
router.post('/workouts', authenticate, (req: AuthRequest, res) => {
  const { name, durationMinutes, caloriesBurned } = req.body;
  const workout = {
    id: `w-${Date.now()}`,
    name: name || 'Workout',
    durationMinutes: durationMinutes || 45,
    caloriesBurned: caloriesBurned || 350,
    timestamp: new Date().toISOString(),
  };
  return sendSuccess(res, workout, 'Workout recorded successfully', 201);
});

export default router;
