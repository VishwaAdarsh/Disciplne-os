/**
 * Mind Controller (SPR-309 / ARCH-002)
 */

import type { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types/foundation';
import { mindService } from '../../services/mind/mindService';
import { sendSuccess } from '../../responses/apiResponse';
import {
  validateMoodInput,
  validateEnergyInput,
  validateStressInput,
  validateFocusInput,
  validateJournalInput,
  validateMeditationInput,
} from '../../validators/mind/mindValidator';

// MOOD
export async function getMood(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const date = typeof req.query.date === 'string' ? req.query.date : undefined;
    const mood = await mindService.getMood(userId, date);
    sendSuccess(res, mood, 'Mood log retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

export async function logMood(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const input = { userId, ...req.body };
    validateMoodInput(input);

    const mood = await mindService.logMood(input);
    sendSuccess(res, mood, 'Mood check-in saved & event published', 201);
  } catch (err) {
    next(err);
  }
}

// ENERGY
export async function getEnergy(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const date = typeof req.query.date === 'string' ? req.query.date : undefined;
    const energy = await mindService.getEnergy(userId, date);
    sendSuccess(res, energy, 'Energy log retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

export async function logEnergy(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const input = { userId, ...req.body };
    validateEnergyInput(input);

    const energy = await mindService.logEnergy(input);
    sendSuccess(res, energy, 'Energy level updated & event published', 201);
  } catch (err) {
    next(err);
  }
}

// STRESS
export async function getStress(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const date = typeof req.query.date === 'string' ? req.query.date : undefined;
    const stress = await mindService.getStress(userId, date);
    sendSuccess(res, stress, 'Stress log retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

export async function logStress(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const input = { userId, ...req.body };
    validateStressInput(input);

    const stress = await mindService.logStress(input);
    sendSuccess(res, stress, 'Stress score logged & event published', 201);
  } catch (err) {
    next(err);
  }
}

// FOCUS
export async function getFocus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const date = typeof req.query.date === 'string' ? req.query.date : undefined;
    const focus = await mindService.getFocus(userId, date);
    sendSuccess(res, focus, 'Focus log retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

export async function logFocus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const input = { userId, ...req.body };
    validateFocusInput(input);

    const focus = await mindService.logFocus(input);
    sendSuccess(res, focus, 'Focus clarity score recorded & event published', 201);
  } catch (err) {
    next(err);
  }
}

// JOURNAL (PRIVACY ENFORCED)
export async function getJournals(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const journals = await mindService.getJournals(userId, search);
    sendSuccess(res, journals, 'Journal entries retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

export async function createJournal(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const input = { userId, ...req.body };
    validateJournalInput(input);

    const journal = await mindService.createJournal(input);
    sendSuccess(res, journal, 'Journal entry created & event published', 201);
  } catch (err) {
    next(err);
  }
}

export async function updateJournal(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const { id } = req.params;

    const journal = await mindService.updateJournal(id, userId, req.body);
    sendSuccess(res, journal, 'Journal entry updated successfully', 200);
  } catch (err) {
    next(err);
  }
}

export async function deleteJournal(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const { id } = req.params;

    await mindService.deleteJournal(id, userId);
    sendSuccess(res, { id, deleted: true }, 'Journal entry deleted successfully', 200);
  } catch (err) {
    next(err);
  }
}

// MEDITATION
export async function getMeditation(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const date = typeof req.query.date === 'string' ? req.query.date : undefined;
    const sessions = await mindService.getMeditations(userId, date);
    sendSuccess(res, sessions, 'Meditation sessions retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

export async function logMeditation(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const input = { userId, ...req.body };
    validateMeditationInput(input);

    const meditation = await mindService.logMeditation(input);
    sendSuccess(res, meditation, 'Meditation session recorded & event published', 201);
  } catch (err) {
    next(err);
  }
}

// DAILY SUMMARY
export async function getSummary(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const date = typeof req.query.date === 'string' ? req.query.date : undefined;
    const summary = await mindService.getDailySummary(userId, date);
    sendSuccess(res, summary, 'Daily mental summary retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}
