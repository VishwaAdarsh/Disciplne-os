import { Router, Response } from 'express';
import { z } from 'zod';
import db from '../db';
import { generateId, getWeekStart } from '../utils';
import { authenticate, AuthRequest } from '../middleware';

const router = Router();
router.use(authenticate);

const ReflectionSchema = z.object({
  overallScore: z.number().min(1).max(5),
  nonnegScore: z.number().min(1).max(5),
  clarityScore: z.number().min(1).max(5),
  progressScore: z.number().min(1).max(5),
  wentWell: z.string().min(10).max(1000),
  brokeDown: z.string().min(10).max(1000),
  commitment: z.string().min(5).max(500),
});

router.get('/', (req: AuthRequest, res: Response) => {
  const reflections = db.prepare('SELECT * FROM reflections WHERE user_id = ? ORDER BY created_at DESC LIMIT 12').all(req.userId) as any[];
  res.json(reflections.map(r => ({
    id: r.id,
    weekStart: r.week_start,
    overallScore: r.overall_score,
    nonnegScore: r.nonneg_score,
    clarityScore: r.clarity_score,
    progressScore: r.progress_score,
    avgScore: ((r.overall_score + r.nonneg_score + r.clarity_score + r.progress_score) / 4).toFixed(1),
    wentWell: r.went_well,
    brokeDown: r.broke_down,
    commitment: r.commitment,
    createdAt: r.created_at,
  })));
});

router.post('/', (req: AuthRequest, res: Response) => {
  try {
    const body = ReflectionSchema.parse(req.body);
    const weekStart = getWeekStart();
    const existing = db.prepare('SELECT id FROM reflections WHERE user_id = ? AND week_start = ?').get(req.userId, weekStart);
    if (existing) {
      db.prepare(`UPDATE reflections SET overall_score=?, nonneg_score=?, clarity_score=?, progress_score=?, went_well=?, broke_down=?, commitment=? WHERE user_id=? AND week_start=?`)
        .run(body.overallScore, body.nonnegScore, body.clarityScore, body.progressScore, body.wentWell, body.brokeDown, body.commitment, req.userId, weekStart);
      res.json({ updated: true });
    } else {
      const id = generateId();
      db.prepare(`INSERT INTO reflections (id, user_id, week_start, overall_score, nonneg_score, clarity_score, progress_score, went_well, broke_down, commitment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(id, req.userId, weekStart, body.overallScore, body.nonnegScore, body.clarityScore, body.progressScore, body.wentWell, body.brokeDown, body.commitment);
      res.status(201).json({ id, weekStart });
    }
  } catch (e: any) {
    if (e instanceof z.ZodError) { res.status(400).json({ error: e.errors[0].message }); return; }
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
