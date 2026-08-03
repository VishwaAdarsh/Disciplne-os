import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from './utils/response';

const JWT_SECRET = process.env.JWT_SECRET || 'discipline-os-super-secret-jwt-key-2026';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'Authentication token required', 401);
    return;
  }

  const token = authHeader.substring(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; role?: 'USER' | 'ADMIN' | 'SUPER_ADMIN' };
    req.userId = payload.userId;
    req.userRole = payload.role || 'USER';
    next();
  } catch (err) {
    sendError(res, 'Invalid or expired token', 401);
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
