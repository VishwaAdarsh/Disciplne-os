/**
 * Performance Controller (SPR-306 / ARCH-002)
 */

import type { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types/foundation';
import { performanceService } from '../../services/performance/performanceService';
import { sendSuccess } from '../../responses/apiResponse';
import { getPaginationParams } from '../../utils/pagination';
import { getFilterParams } from '../../utils/filtering';
import { PerformanceFilter } from '../../types/performance';

export async function getPerformance(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const performance = await performanceService.getLatestPerformance(userId);
    sendSuccess(res, performance, 'Current performance overview retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

export async function getPerformanceHistory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const pagination = getPaginationParams(req.query);
    const rawFilter = getFilterParams(req.query);

    const period = typeof req.query.period === 'string' && ['daily', 'weekly', 'monthly'].includes(req.query.period.trim())
      ? (req.query.period.trim() as 'daily' | 'weekly' | 'monthly')
      : undefined;

    const filter: PerformanceFilter = {
      period,
      startDate: rawFilter.startDate,
      endDate: rawFilter.endDate,
    };

    const result = await performanceService.getPerformanceHistory(userId, pagination, filter);
    sendSuccess(res, result.items, 'Performance history retrieved successfully', 200, result.meta);
  } catch (err) {
    next(err);
  }
}

export async function getModuleScores(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const breakdown = await performanceService.getModuleBreakdown(userId);
    sendSuccess(res, breakdown, 'Module performance breakdown retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

export async function getPerformanceTrends(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const trends = await performanceService.getPerformanceTrends(userId);
    sendSuccess(res, trends, 'Performance trends retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}
