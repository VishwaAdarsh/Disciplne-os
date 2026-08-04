/**
 * Health Controller (SPR-304 / ARCH-002)
 */

import type { Request, Response, NextFunction } from 'express';
import { healthService } from '../services/healthService';
import { sendSuccess } from '../responses/apiResponse';

export async function getHealth(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const health = await healthService.getSystemHealth();
    sendSuccess(res, health, 'System is operational', 200);
  } catch (err) {
    next(err);
  }
}
