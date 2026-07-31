import { Router, Response } from 'express';
import { z } from 'zod';
import db from '../db';
import { generateId, today, prevDateStr } from '../utils';
import { authenticate, AuthRequest } from '../middleware';

const router = Router();

const TaskSchema = z.object({
  name: z.string().min(1).max(200),
  type: z.enum(['nonneg', 'habit', 'goal']),
  timeTarget: z.string().optional(),
  why: z.string().optional(),
});

router.use(authenticate);

router.get('/', (req: AuthRequest, res: Response) => {
  const tasks = db.prepare('SELECT * FROM tasks WHERE user_id = ? AND is_active = 1 ORDER BY created_at ASC').all(req.userId) as any[];
  const todayStr = today();
  const completions = db.prepare('SELECT task_id FROM task_completions WHERE user_id = ? AND date = ?').all(req.userId, todayStr) as any[];
  const doneIds = new Set(completions.map((c: any) => c.task_id));

  const streakMap = new Map<string, number>();
  const yesterdayStr = prevDateStr(todayStr);
  tasks.forEach(t => {
    const rows = db.prepare(`SELECT date FROM task_completions WHERE task_id = ? ORDER BY date DESC LIMIT 60`).all(t.id) as any[];
    let streak = 0;
    let checkDate = todayStr;
    for (const row of rows) {
      if (row.date === checkDate) {
        streak++;
        checkDate = prevDateStr(checkDate);
      } else if (streak === 0 && row.date === yesterdayStr) {
        streak++;
        checkDate = prevDateStr(yesterdayStr);
      } else {
        break;
      }
    }
    streakMap.set(t.id, streak);
  });

  res.json(tasks.map(t => ({
    id: t.id, name: t.name, type: t.type,
    timeTarget: t.time_target, why: t.why,
    done: doneIds.has(t.id),
    streak: streakMap.get(t.id) || 0,
    createdAt: t.created_at,
  })));
});

router.post('/', (req: AuthRequest, res: Response) => {
  try {
    const body = TaskSchema.parse(req.body);
    const id = generateId();
    const createdAt = new Date().toISOString();
    db.prepare('INSERT INTO tasks (id, user_id, name, type, time_target, why, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
      id, req.userId, body.name, body.type, body.timeTarget || null, body.why || null, createdAt
    );
    res.status(201).json({ id, ...body, done: false, streak: 0, createdAt });
  } catch (e: any) {
    if (e instanceof z.ZodError) { res.status(400).json({ error: e.errors[0].message }); return; }
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', (req: AuthRequest, res: Response) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(req.params.id, req.userId) as any;
  if (!task) { res.status(404).json({ error: 'Task not found' }); return; }
  try {
    const body = TaskSchema.partial().parse(req.body);
    db.prepare('UPDATE tasks SET name = COALESCE(?, name), type = COALESCE(?, type), time_target = COALESCE(?, time_target), why = COALESCE(?, why) WHERE id = ?')
      .run(body.name || null, body.type || null, body.timeTarget || null, body.why || null, req.params.id);
    res.json({ success: true });
  } catch (e: any) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

router.delete('/:id', (req: AuthRequest, res: Response) => {
  db.prepare('UPDATE tasks SET is_active = 0 WHERE id = ? AND user_id = ?').run(req.params.id, req.userId);
  res.json({ success: true });
});

router.post('/:id/complete', (req: AuthRequest, res: Response) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(req.params.id, req.userId) as any;
  if (!task) { res.status(404).json({ error: 'Task not found' }); return; }
  const todayStr = today();
  const existing = db.prepare('SELECT id FROM task_completions WHERE task_id = ? AND date = ?').get(req.params.id, todayStr);
  if (existing) {
    db.prepare('DELETE FROM task_completions WHERE task_id = ? AND date = ?').run(req.params.id, todayStr);
    res.json({ done: false });
  } else {
    db.prepare('INSERT INTO task_completions (id, task_id, user_id, date) VALUES (?, ?, ?, ?)').run(generateId(), req.params.id, req.userId, todayStr);
    res.json({ done: true });
  }
});

export default router;
