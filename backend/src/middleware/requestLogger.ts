/**
 * HTTP Request Logging Middleware (SPR-304 / ARCH-010)
 */

import type { Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import type { AuthRequest } from '../types/foundation';
import crypto from 'crypto';

function sanitizePayload(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  const sanitized = Array.isArray(obj) ? [...obj] : { ...obj };
  const sensitiveKeys = ['password', 'token', 'secret', 'authorization', 'access_token', 'refreshToken'];

  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.includes(key.toLowerCase())) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object') {
      sanitized[key] = sanitizePayload(sanitized[key]);
    }
  }
  return sanitized;
}

export function requestLogger(req: AuthRequest, res: Response, next: NextFunction): void {
  const startTime = Date.now();
  const requestId = (req.headers['x-request-id'] as string) || `req_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);

  res.on('finish', () => {
    const durationMs = Date.now() - startTime;
    const { method, originalUrl, ip } = req;
    const statusCode = res.statusCode;

    logger.info(`HTTP ${method} ${originalUrl} ${statusCode} - ${durationMs}ms`, {
      requestId,
      method,
      endpoint: originalUrl,
      statusCode,
      durationMs,
      ip,
      userId: req.userId || undefined,
      body: req.body ? sanitizePayload(req.body) : undefined,
    });
  });

  next();
}

export default requestLogger;
