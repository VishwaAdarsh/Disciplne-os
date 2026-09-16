/**
 * Analytics Controller (SPR-313 / ARCH-002)
 */

import type { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types/foundation';
import { analyticsService } from '../../services/analytics/analyticsService';
import { sendSuccess } from '../../responses/apiResponse';

export async function getAnalytics(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const range = typeof req.query.range === 'string' ? req.query.range : undefined;

    const analytics = await analyticsService.getAnalytics(userId, range);
    sendSuccess(res, analytics, 'Analytics data retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}
