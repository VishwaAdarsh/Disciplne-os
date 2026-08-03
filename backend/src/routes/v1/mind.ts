import { Router } from 'express';
import { sendSuccess, sendError } from '../../utils/response';
import { authenticate, AuthRequest } from '../../middleware';

const router = Router();

// GET /api/v1/mind/summary
router.get('/summary', authenticate, (_req: AuthRequest, res) => {
  return sendSuccess(res, {
    mindScore: 82,
    todayCheckIn: { mood: 'Energetic', focus: 8, energy: 8, stress: 3 },
    meditation: { todayMinutes: 15, targetMinutes: 20 },
  }, 'Mind module summary retrieved');
});

// POST /api/v1/mind/checkin
router.post('/checkin', authenticate, (req: AuthRequest, res) => {
  const { mood, focus, energy, stress } = req.body;
  if (!mood) return sendError(res, 'Mood rating required', 400);

  const log = {
    id: `m-${Date.now()}`,
    mood,
    focus: focus || 5,
    energy: energy || 5,
    stress: stress || 5,
    timestamp: new Date().toISOString(),
  };
  return sendSuccess(res, log, 'Mind check-in saved', 201);
});

// POST /api/v1/mind/meditation/finish
router.post('/meditation/finish', authenticate, (req: AuthRequest, res) => {
  const { title, durationMinutes, type } = req.body;
  const session = {
    id: `med-${Date.now()}`,
    title: title || 'Guided Focus',
    durationMinutes: durationMinutes || 10,
    type: type || 'guided',
    timestamp: new Date().toISOString(),
  };
  return sendSuccess(res, session, 'Meditation recorded');
});

export default router;
