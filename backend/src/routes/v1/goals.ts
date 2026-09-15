/**
 * Goals Routes (SPR-311 / ARCH-002)
 */

import { Router } from 'express';
import { authenticate } from '../../middleware';
import {
  getGoals,
  getGoalsSummary,
  getGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
  setGoalStatus,
  updateGoalProgress,
  addMilestone,
  toggleMilestone,
  deleteMilestone,
} from '../../controllers/goals/goalsController';

const router = Router();

// Summary
router.get('/summary', authenticate, getGoalsSummary);

// Goals CRUD
router.get('/', authenticate, getGoals);
router.get('/:id', authenticate, getGoalById);
router.post('/', authenticate, createGoal);
router.patch('/:id', authenticate, updateGoal);
router.delete('/:id', authenticate, deleteGoal);

// Status and Progress
router.patch('/:id/status', authenticate, setGoalStatus);
router.patch('/:id/progress', authenticate, updateGoalProgress);

// Milestones
router.post('/:id/milestones', authenticate, addMilestone);
router.patch('/:id/milestones/:mId/toggle', authenticate, toggleMilestone);
router.delete('/:id/milestones/:mId', authenticate, deleteMilestone);

export default router;
