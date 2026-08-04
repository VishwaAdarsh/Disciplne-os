/**
 * API v1 Habits Router (SPR-307)
 */

import { Router } from 'express';
import { authenticate } from '../../middleware';
import {
  getHabits,
  createHabit,
  updateHabit,
  completeHabit,
  deleteHabit,
} from '../../controllers/habits/habitController';

const router = Router();

// GET /api/v1/habits - List user habits
router.get('/', authenticate, getHabits);

// POST /api/v1/habits - Create habit
router.post('/', authenticate, createHabit);

// PATCH /api/v1/habits/:id - Update habit details
router.patch('/:id', authenticate, updateHabit);

// PATCH /api/v1/habits/:id/complete - Complete habit & increment streak
router.patch('/:id/complete', authenticate, completeHabit);

// DELETE /api/v1/habits/:id - Delete habit
router.delete('/:id', authenticate, deleteHabit);

export default router;
