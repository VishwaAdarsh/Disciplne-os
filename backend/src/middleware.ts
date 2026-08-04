import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from './utils/response';
import config from './config';
import type { JwtPayload } from './types/foundation';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  sessionId?: string;
  requestId?: string;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  req.requestId = (req.headers['x-request-id'] as string) || `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'Authentication token required', 401);
    return;
  }

  const token = authHeader.substring(7);
  try {
    const payload = jwt.verify(token, config.jwt.secret) as JwtPayload;
    req.userId = payload.userId;
    req.userRole = payload.role || 'USER';
    req.sessionId = payload.sessionId;
    next();
  } catch (err) {
    sendError(res, 'Invalid or expired access token', 401);
  }
}

export function requireRole(allowedRoles: Array<'USER' | 'ADMIN' | 'SUPER_ADMIN'>) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.userRole || !allowedRoles.includes(req.userRole)) {
      sendError(res, 'Forbidden: Insufficient privileges', 403);
      return;
    }
    next();
  };
}

export function globalErrorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  console.error('[System Error]:', err);
  sendError(res, err.message || 'Internal system exception occurred', 500);
}
