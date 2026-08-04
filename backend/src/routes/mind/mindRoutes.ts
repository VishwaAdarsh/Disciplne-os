/**
 * Mind Routes (SPR-309 / ARCH-002)
 */

import { Router } from 'express';
import { authenticate } from '../../middleware';
import {
  getMood,
  logMood,
  getEnergy,
  logEnergy,
  getStress,
  logStress,
  getFocus,
  logFocus,
  getJournals,
  createJournal,
  updateJournal,
  deleteJournal,
  getMeditation,
  logMeditation,
  getSummary,
} from '../../controllers/mind/mindController';

const router = Router();

// Mood
router.get('/mood', authenticate, getMood);
router.post('/mood', authenticate, logMood);

// Energy
router.get('/energy', authenticate, getEnergy);
router.post('/energy', authenticate, logEnergy);

// Stress
router.get('/stress', authenticate, getStress);
router.post('/stress', authenticate, logStress);

// Focus
router.get('/focus', authenticate, getFocus);
router.post('/focus', authenticate, logFocus);

// Journal (Private)
router.get('/journal', authenticate, getJournals);
router.post('/journal', authenticate, createJournal);
router.patch('/journal/:id', authenticate, updateJournal);
router.delete('/journal/:id', authenticate, deleteJournal);

// Meditation
router.get('/meditation', authenticate, getMeditation);
router.post('/meditation', authenticate, logMeditation);

// Summary
router.get('/summary', authenticate, getSummary);

export default router;
