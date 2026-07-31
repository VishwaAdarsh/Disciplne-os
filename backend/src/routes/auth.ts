import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import db from '../db';
import { generateId } from '../utils';
import { authenticate, AuthRequest } from '../middleware';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

const RegisterSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(50),
  password: z.string().min(8),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    const body = RegisterSchema.parse(req.body);
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(body.email);
    if (existing) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }
    const hashed = await bcrypt.hash(body.password, 12);
    const id = generateId();
    db.prepare('INSERT INTO users (id, email, name, password) VALUES (?, ?, ?, ?)').run(id, body.email, body.name, hashed);
    db.prepare('INSERT INTO streaks (id, user_id) VALUES (?, ?)').run(generateId(), id);
    db.prepare('INSERT INTO user_settings (id, user_id) VALUES (?, ?)').run(generateId(), id);

    // Seed starter tasks
    const starterTasks = [
      { name: 'Morning routine (30 min)', type: 'nonneg', time_target: '6:00 AM', why: 'Sets the tone for the day' },
      { name: 'Deep work block (2h)', type: 'nonneg', time_target: '9:00 AM', why: 'Most important work first' },
      { name: 'Physical exercise', type: 'habit', time_target: '7:00 AM', why: 'Body and mind are linked' },
      { name: 'Read 30 minutes', type: 'habit', time_target: '10:00 PM', why: 'Compound knowledge' },
    ];
    const insertTask = db.prepare('INSERT INTO tasks (id, user_id, name, type, time_target, why) VALUES (?, ?, ?, ?, ?, ?)');
    starterTasks.forEach(t => insertTask.run(generateId(), id, t.name, t.type, t.time_target, t.why));

    const token = jwt.sign({ userId: id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id, email: body.email, name: body.name } });
  } catch (e: any) {
    if (e instanceof z.ZodError) { res.status(400).json({ error: e.errors[0].message }); return; }
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const body = LoginSchema.parse(req.body);
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(body.email) as any;
    if (!user) { res.status(401).json({ error: 'Invalid credentials' }); return; }
    const valid = await bcrypt.compare(body.password, user.password);
    if (!valid) { res.status(401).json({ error: 'Invalid credentials' }); return; }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (e: any) {
    if (e instanceof z.ZodError) { res.status(400).json({ error: e.errors[0].message }); return; }
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/me', authenticate, (req: AuthRequest, res: Response) => {
  const user = db.prepare('SELECT id, email, name, created_at FROM users WHERE id = ?').get(req.userId) as any;
  if (!user) { res.status(404).json({ error: 'User not found' }); return; }
  res.json({ user });
});

export default router;
