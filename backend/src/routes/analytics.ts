import { Router, Response } from 'express';
import db from '../db';
import { authenticate, AuthRequest } from '../middleware';
import { calculateDisciplineScore, getScoreTier, getSmartMotivation, prevDateStr, today } from '../utils';

const router = Router();
router.use(authenticate);

router.get('/dashboard', (req: AuthRequest, res: Response) => {
  const todayStr = today();
  const tasks = db.prepare('SELECT * FROM tasks WHERE user_id = ? AND is_active = 1').all(req.userId) as any[];
  const completionsToday = db.prepare('SELECT task_id FROM task_completions WHERE user_id = ? AND date = ?').all(req.userId, todayStr) as any[];
  const doneToday = new Set(completionsToday.map((c: any) => c.task_id));
  const nonGoalTasks = tasks.filter(t => t.type !== 'goal');
  const doneTodayCount = nonGoalTasks.filter(t => doneToday.has(t.id)).length;
  const completionRate = nonGoalTasks.length ? doneTodayCount / nonGoalTasks.length : 0;

  const streak = db.prepare('SELECT * FROM streaks WHERE user_id = ?').get(req.userId) as any || { current: 0, best: 0 };

  const reflections = db.prepare('SELECT overall_score, nonneg_score, clarity_score, progress_score FROM reflections WHERE user_id = ? ORDER BY created_at DESC LIMIT 4').all(req.userId) as any[];
  const reflectionAvg = reflections.length
    ? reflections.reduce((s: number, r: any) => s + (r.overall_score + r.nonneg_score + r.clarity_score + r.progress_score) / 4, 0) / reflections.length
    : 0;

  const score = calculateDisciplineScore({ completionRate, streakDays: streak.current, reflectionAvg, reflectionCount: reflections.length });

  const last30: string[] = [];
  let currDate = todayStr;
  for (let i = 0; i < 30; i++) {
    last30.unshift(currDate);
    currDate = prevDateStr(currDate);
  }

  const history = last30.map(date => {
    const comps = db.prepare('SELECT COUNT(*) as cnt FROM task_completions WHERE user_id = ? AND date = ?').get(req.userId, date) as any;
    const total = nonGoalTasks.length || 1;
    return { date, rate: Math.round((comps.cnt / total) * 100) };
  });

  res.json({
    score,
    tier: getScoreTier(score),
    streak: { current: streak.current, best: streak.best },
    today: { done: doneTodayCount, total: nonGoalTasks.length, rate: Math.round(completionRate * 100) },
    motivation: getSmartMotivation({ score, streak: streak.current, completionRate }),
    history,
    reflectionCount: reflections.length,
  });
});

router.get('/weekly', (req: AuthRequest, res: Response) => {
  const todayStr = today();
  const days: string[] = [];
  let currDate = todayStr;
  for (let i = 0; i < 7; i++) {
    days.unshift(currDate);
    currDate = prevDateStr(currDate);
  }

  const tasks = db.prepare('SELECT id FROM tasks WHERE user_id = ? AND is_active = 1 AND type != ?').all(req.userId, 'goal') as any[];
  const total = tasks.length || 1;
  const weekly = days.map(date => {
    const comps = db.prepare('SELECT COUNT(*) as cnt FROM task_completions WHERE user_id = ? AND date = ?').get(req.userId, date) as any;
    return { date, rate: Math.round((comps.cnt / total) * 100) };
  });
  res.json({ weekly });
});

router.put('/streak', (req: AuthRequest, res: Response) => {
  const todayStr = today();
  const tasks = db.prepare('SELECT id FROM tasks WHERE user_id = ? AND is_active = 1 AND type = ?').all(req.userId, 'nonneg') as any[];
  const done = db.prepare('SELECT COUNT(*) as cnt FROM task_completions WHERE user_id = ? AND date = ?').get(req.userId, todayStr) as any;
  const allNonnegDone = tasks.length > 0 && done.cnt >= tasks.length;

  const streak = db.prepare('SELECT * FROM streaks WHERE user_id = ?').get(req.userId) as any;
  if (!streak) { res.json({ current: 0, best: 0 }); return; }

  let current = streak.current;
  let best = streak.best;

  if (allNonnegDone && streak.last_date !== todayStr) {
    const yesterdayStr = prevDateStr(todayStr);
    if (streak.last_date === yesterdayStr) {
      current = streak.current + 1;
    } else {
      current = 1;
    }
    best = Math.max(best, current);
    db.prepare('UPDATE streaks SET current = ?, best = ?, last_date = ?, updated_at = datetime("now") WHERE user_id = ?').run(current, best, todayStr, req.userId);
  }

  res.json({ current, best });
});

export default router;
