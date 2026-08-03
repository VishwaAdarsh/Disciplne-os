import { Router } from 'express';
import { sendSuccess, sendError } from '../../utils/response';
import { authenticate, AuthRequest } from '../../middleware';

const router = Router();

// POST /api/v1/ai/chat
router.post('/chat', authenticate, (req: AuthRequest, res) => {
  const { message } = req.body;
  if (!message) return sendError(res, 'User message is required', 400);

  const reply = `AI Coach Analysis: Based on your recent telemetry, your overall score is 782/1000. Your discipline & body consistency are high. To boost your index further, focus on logging 3.0L water daily.`;

  return sendSuccess(res, {
    response: reply,
    timestamp: new Date().toISOString(),
  }, 'AI Coach response generated');
});

// GET /api/v1/ai/briefing
router.get('/briefing', authenticate, (_req: AuthRequest, res) => {
  return sendSuccess(res, {
    greeting: 'Good Morning Adarsh 👋',
    performancePercent: 81,
    currentStreak: 12,
    todayFocus: ['Complete Deep Work', 'Workout', 'Drink 3L Water'],
    topPriority: 'Complete Python Capstone milestone',
  }, 'Daily briefing synthesized');
});

// POST /api/v1/ai/reports
router.post('/reports', authenticate, (req: AuthRequest, res) => {
  const { type } = req.body; // 'daily' | 'weekly' | 'monthly'
  const report = {
    id: `rep-${Date.now()}`,
    title: `${(type || 'weekly').toUpperCase()} AI Performance Report`,
    periodStr: new Date().toLocaleDateString(),
    summaryMarkdown: `# PERFORMANCE REPORT\n\n- Overall Index: 782/1000\n- Key Win: 12-day streak preserved\n- Focus Area: Nutrition water target`,
    createdAt: new Date().toISOString(),
  };
  return sendSuccess(res, report, 'AI report generated', 201);
});

export default router;
