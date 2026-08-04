/**
 * Nutrition Routes (SPR-310 / ARCH-002)
 */

import { Router } from 'express';
import { authenticate } from '../../middleware';
import {
  getMeals,
  createMeal,
  updateMeal,
  deleteMeal,
  getGoals,
  updateGoals,
  getSummary,
  getHistory,
} from '../../controllers/nutrition/nutritionController';

const router = Router();

// Meals
router.get('/meals', authenticate, getMeals);
router.post('/meals', authenticate, createMeal);
router.patch('/meals/:id', authenticate, updateMeal);
router.delete('/meals/:id', authenticate, deleteMeal);

// Goals
router.get('/goals', authenticate, getGoals);
router.patch('/goals', authenticate, updateGoals);

// Summary
router.get('/summary', authenticate, getSummary);

// History
router.get('/history', authenticate, getHistory);

export default router;
