/**
 * Standardized Backend Error Handling Middleware (SPR-301 / ARCH-002)
 */

import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { HTTP_STATUS, ERROR_CODES } from '../constants';
import type { ApiErrorEnvelope } from '../types/foundation';

export function standardizedErrorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.status || err.statusCode || HTTP_STATUS.SERVER_ERROR;
  const errorCode = err.code || ERROR_CODES.INTERNAL_ERROR;
  const requestId = (req.headers['x-request-id'] as string) || `req_${Date.now()}`;

  logger.error(`API Error: ${req.method} ${req.originalUrl} [${statusCode}]`, err, {
    requestId,
    code: errorCode,
  });

  const responseEnvelope: ApiErrorEnvelope = {
    success: false,
    error: {
      code: errorCode,
      message: err.message || 'An internal server error occurred.',
      details: err.details || undefined,
      timestamp: new Date().toISOString(),
      requestId,
    },
  };

  res.status(statusCode).json(responseEnvelope);
}

export default standardizedErrorHandler;
