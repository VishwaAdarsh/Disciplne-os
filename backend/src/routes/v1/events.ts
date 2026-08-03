import { Router } from 'express';
import { sendSuccess, sendError } from '../../utils/response';
import { authenticate, AuthRequest } from '../../middleware';

const router = Router();

// GET /api/v1/events
router.get('/', authenticate, (_req: AuthRequest, res) => {
  const events = [
    {
      eventId: 'evt-101',
      module: 'body',
      eventType: 'WORKOUT_COMPLETED',
      title: 'Workout Completed',
      scoreImpact: 5,
      createdAt: new Date().toISOString(),
    },
    {
      eventId: 'evt-102',
      module: 'nutrition',
      eventType: 'WATER_LOGGED',
      title: 'Water Logged (+500ml)',
      scoreImpact: 2,
      createdAt: new Date().toISOString(),
    },
  ];
  return sendSuccess(res, events, 'Events feed retrieved');
});

// POST /api/v1/events
router.post('/', authenticate, (req: AuthRequest, res) => {
  const { module, eventType, title, description, payload, scoreImpact } = req.body;
  if (!module || !eventType || !title) {
    return sendError(res, 'module, eventType, and title are required', 400);
  }

  const event = {
    eventId: `evt-${Date.now()}`,
    userId: req.userId,
    module,
    eventType,
    title,
    description,
    payload: payload || {},
    scoreImpact: scoreImpact || 0,
    status: 'completed',
    createdAt: new Date().toISOString(),
  };

  return sendSuccess(res, event, 'Event recorded into system ledger', 201);
});

export default router;
