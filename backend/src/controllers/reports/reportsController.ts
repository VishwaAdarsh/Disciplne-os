/**
 * Reports & Data Export Controller (SPR-317)
 */

import type { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types/foundation';
import { reportsService } from '../../services/reports/reportsService';
import { sendSuccess } from '../../responses/apiResponse';

export async function getSummary(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId!;
    const period = typeof req.query.period === 'string' ? req.query.period : undefined;
    const startDate = typeof req.query.startDate === 'string' ? req.query.startDate : undefined;
    const endDate = typeof req.query.endDate === 'string' ? req.query.endDate : undefined;
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;

    const summary = reportsService.generateReportSummary(userId, {
      period,
      startDate,
      endDate,
      category,
    });

    sendSuccess(res, summary, 'Report summary generated successfully', 200);
  } catch (err) {
    next(err);
  }
}

export async function exportCSV(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId!;
    const dataset = typeof req.query.dataset === 'string' ? req.query.dataset : 'all';
    const startDate = typeof req.query.startDate === 'string' ? req.query.startDate : undefined;
    const endDate = typeof req.query.endDate === 'string' ? req.query.endDate : undefined;

    const { filename, csv } = reportsService.exportCSV(userId, dataset, startDate, endDate);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csv);
  } catch (err) {
    next(err);
  }
}

export async function exportJSON(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId!;
    const todayStr = new Date().toISOString().split('T')[0];

    const data = reportsService.exportJSON(userId);

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="disciplineos-export-${todayStr}.json"`);
    res.status(200).send(JSON.stringify(data, null, 2));
  } catch (err) {
    next(err);
  }
}
