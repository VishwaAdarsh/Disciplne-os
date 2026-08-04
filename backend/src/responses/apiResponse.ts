/**
 * Standard API Response Builders (SPR-304 / ARCH-002)
 */

import type { Response } from 'express';

export interface SuccessResponseEnvelope<T = any> {
  success: true;
  message: string;
  data: T;
  meta?: Record<string, any>;
}

export interface ErrorResponseEnvelope {
  success: false;
  message: string;
  errors: Array<{ field?: string; message: string }>;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Operation completed successfully',
  statusCode = 200,
  meta?: Record<string, any>
): Response {
  const payload: SuccessResponseEnvelope<T> = {
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  };
  return res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  message = 'An error occurred',
  statusCode = 500,
  errors: Array<{ field?: string; message: string }> = []
): Response {
  const payload: ErrorResponseEnvelope = {
    success: false,
    message,
    errors,
  };
  return res.status(statusCode).json(payload);
}
