import { Router, Response } from 'express';
import { z } from 'zod';
import db from '../db';
import { authenticate, AuthRequest } from '../middleware';

const router = Router();
router.use(authenticate);

const SettingsSchema = z.object({
  resetTime: z.string().optional(),
  reflectionDay: z.string().optional(),
  streakAlerts: z.boolean().optional(),
  publicScore: z.boolean().optional(),
  reflectReminder: z.boolean().optional(),
  comebackMode: z.boolean().optional(),
});

router.get('/', (req: AuthRequest, res: Response) => {
  const s = db.prepare('SELECT * FROM user_settings WHERE user_id = ?').get(req.userId) as any;
  if (!s) { res.status(404).json({ error: 'Settings not found' }); return; }
  res.json({
    resetTime: s.reset_time,
    reflectionDay: s.reflection_day,
    streakAlerts: !!s.streak_alerts,
    publicScore: !!s.public_score,
    reflectReminder: !!s.reflect_reminder,
    comebackMode: !!s.comeback_mode,
  });
});

router.put('/', (req: AuthRequest, res: Response) => {
  try {
    const body = SettingsSchema.parse(req.body);
    db.prepare(`UPDATE user_settings SET
      reset_time = COALESCE(?, reset_time),
      reflection_day = COALESCE(?, reflection_day),
      streak_alerts = COALESCE(?, streak_alerts),
      public_score = COALESCE(?, public_score),
      reflect_reminder = COALESCE(?, reflect_reminder),
      comeback_mode = COALESCE(?, comeback_mode)
      WHERE user_id = ?`).run(
      body.resetTime ?? null,
      body.reflectionDay ?? null,
      body.streakAlerts !== undefined ? (body.streakAlerts ? 1 : 0) : null,
      body.publicScore !== undefined ? (body.publicScore ? 1 : 0) : null,
      body.reflectReminder !== undefined ? (body.reflectReminder ? 1 : 0) : null,
      body.comebackMode !== undefined ? (body.comebackMode ? 1 : 0) : null,
      req.userId
    );
    res.json({ success: true });
  } catch (e: any) {
    res.status(400).json({ error: 'Invalid settings' });
  }
});

export default router;
