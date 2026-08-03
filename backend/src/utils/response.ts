import type { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, any>;
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
    ...(errors ? { errors } : {}),
  };
  return res.status(statusCode).json(payload);
}
