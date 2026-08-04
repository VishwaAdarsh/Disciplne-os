/**
 * API v1 Discipline Router (SPR-307)
 */

import { Router } from 'express';
import { authenticate } from '../../middleware';
import { getTasks, createTask, completeTask } from '../../controllers/tasks/taskController';
import { getHabits, createHabit, completeHabit } from '../../controllers/habits/habitController';

const router = Router();

// GET /api/v1/discipline/tasks
router.get('/tasks', authenticate, getTasks);

// POST /api/v1/discipline/tasks
router.post('/tasks', authenticate, createTask);

// PATCH /api/v1/discipline/tasks/:id/complete
router.patch('/tasks/:id/complete', authenticate, completeTask);

// GET /api/v1/discipline/habits
router.get('/habits', authenticate, getHabits);

// POST /api/v1/discipline/habits
router.post('/habits', authenticate, createHabit);

// PATCH /api/v1/discipline/habits/:id/complete
router.patch('/habits/:id/complete', authenticate, completeHabit);

export default router;
