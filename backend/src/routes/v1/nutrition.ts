import { Router } from 'express';
import { sendSuccess, sendError } from '../../utils/response';
import { authenticate, AuthRequest } from '../../middleware';

const router = Router();

// GET /api/v1/nutrition/summary
router.get('/summary', authenticate, (_req: AuthRequest, res) => {
  return sendSuccess(res, {
    nutritionScore: 81,
    calories: { current: 1850, target: 2400 },
    protein: { current: 145, target: 160 },
    carbs: { current: 180, target: 220 },
    fat: { current: 55, target: 70 },
  }, 'Nutrition metrics retrieved');
});

// POST /api/v1/nutrition/meals
router.post('/meals', authenticate, (req: AuthRequest, res) => {
  const { name, category, calories, proteinGrams } = req.body;
  if (!name) return sendError(res, 'Meal name is required', 400);

  const meal = {
    id: `n-${Date.now()}`,
    name,
    category: category || 'Lunch',
    calories: calories || 450,
    proteinGrams: proteinGrams || 30,
    timestamp: new Date().toISOString(),
  };

  return sendSuccess(res, meal, 'Meal logged successfully', 201);
});

export default router;
