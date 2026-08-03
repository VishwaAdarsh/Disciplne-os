import { Router } from 'express';
import { sendSuccess, sendError } from '../../utils/response';
import { authenticate, AuthRequest } from '../../middleware';

const router = Router();

// GET /api/v1/goals
router.get('/', authenticate, (_req: AuthRequest, res) => {
  const goals = [
    {
      id: 'g1',
      title: 'LEARN PYTHON & DATA SCIENCE',
      category: 'Career',
      progressPercent: 75,
      deadline: 'Aug 31',
      status: 'Active',
    },
  ];
  return sendSuccess(res, goals, 'Goals retrieved');
});

// POST /api/v1/goals
router.post('/', authenticate, (req: AuthRequest, res) => {
  const { title, category, deadline } = req.body;
  if (!title) return sendError(res, 'Goal title is required', 400);

  const newGoal = {
    id: `g-${Date.now()}`,
    title,
    category: category || 'Career',
    progressPercent: 0,
    deadline: deadline || 'Dec 31',
    status: 'Active',
    createdAt: new Date().toISOString(),
  };

  return sendSuccess(res, newGoal, 'Goal created', 201);
});

export default router;
