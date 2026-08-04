/**
 * Body Routes (SPR-308 / ARCH-002)
 */

import { Router } from 'express';
import { authenticate } from '../../middleware';
import {
  getWorkouts,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getSleep,
  logSleep,
  getWater,
  logWater,
  getSteps,
  logSteps,
  getWeight,
  logWeight,
  getSummary,
} from '../../controllers/body/bodyController';

const router = Router();

// Workouts
router.get('/workouts', authenticate, getWorkouts);
router.post('/workouts', authenticate, createWorkout);
router.patch('/workouts/:id', authenticate, updateWorkout);
router.delete('/workouts/:id', authenticate, deleteWorkout);

// Sleep
router.get('/sleep', authenticate, getSleep);
router.post('/sleep', authenticate, logSleep);

// Water
router.get('/water', authenticate, getWater);
router.post('/water', authenticate, logWater);

// Steps
router.get('/steps', authenticate, getSteps);
router.post('/steps', authenticate, logSteps);

// Weight & Measurements
router.get('/weight', authenticate, getWeight);
router.post('/weight', authenticate, logWeight);

// Daily Summary
router.get('/summary', authenticate, getSummary);

export default router;
