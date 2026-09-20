/**
 * Overview Controller (SPR-312 / ARCH-002)
 */

import type { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types/foundation';
import { overviewService } from '../../services/overview/overviewService';
import { sendSuccess } from '../../responses/apiResponse';

export async function getDailyOverview(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId!;
    const date = typeof req.query.date === 'string' ? req.query.date : undefined;

    const overview = await overviewService.getDailyOverview(userId, date);
    sendSuccess(res, overview, 'Daily overview retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}
