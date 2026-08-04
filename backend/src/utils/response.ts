import type { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, any>;
  error?: {
    code: string;
    message: string;
    details?: any[];
    timestamp?: string;
    requestId?: string;
  };
  errors?: any[];
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Request successful',
  statusCode = 200,
  meta?: Record<string, any>
): Response {
  const payload: ApiResponse<T> = {
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  };
  return res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  message = 'Internal server error',
  statusCode = 500,
  errors?: any[]
): Response {
  const payload: ApiResponse = {
    success: false,
    message,
    error: {
      code: statusCode === 409 ? 'CONFLICT' : statusCode === 401 ? 'UNAUTHORIZED' : statusCode === 400 ? 'BAD_REQUEST' : 'SERVER_ERROR',
      message,
      details: errors,
      timestamp: new Date().toISOString(),
    },
    ...(errors ? { errors } : {}),
  };
  return res.status(statusCode).json(payload);
}
