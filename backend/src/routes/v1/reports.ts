/**
 * API v1 Reports & Data Export Router (SPR-317)
 */

import { Router } from 'express';
import { authenticate } from '../../middleware';
import { getSummary, exportCSV, exportJSON } from '../../controllers/reports/reportsController';

const router = Router();

// GET /api/v1/reports/summary?period=today|7d|30d|90d|custom&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&category=overall|...
router.get('/summary', authenticate, getSummary);

// GET /api/v1/reports/export/csv?dataset=discipline|body|mind|nutrition|goals|performance|all
router.get('/export/csv', authenticate, exportCSV);

// GET /api/v1/reports/export/json
router.get('/export/json', authenticate, exportJSON);

export default router;
