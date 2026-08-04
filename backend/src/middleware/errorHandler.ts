/**
 * Standardized Backend Error Handling Middleware (SPR-304 / ARCH-002)
 */

import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { AppError } from '../errors/AppError';
import { sendError } from '../responses/apiResponse';
import { HTTP_STATUS } from '../constants';

export function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const requestId = (req.headers['x-request-id'] as string) || (req as any).requestId || `req_${Date.now()}`;

  let statusCode: number = HTTP_STATUS.SERVER_ERROR;
  let message = 'An unexpected error occurred';
  let errors: Array<{ field?: string; message: string }> = [];

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err?.name === 'ZodError') {
    statusCode = HTTP_STATUS.VALIDATION_ERROR;
    message = 'Validation failed';
    errors = err.issues.map((issue: any) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
  } else if (err instanceof Error) {
    message = err.message;
  }

  logger.error(`API Error: ${req.method} ${req.originalUrl} [${statusCode}] - ${message}`, err, {
    requestId,
    statusCode,
    errors,
  });

  sendError(res, message, statusCode, errors);
}

export default globalErrorHandler;
