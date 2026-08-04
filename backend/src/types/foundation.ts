/**
 * Shared Backend Foundation Types & Interfaces (SPR-301 / ARCH-002)
 */

import type { Request } from 'express';

export interface ApiResponseEnvelope<T = any> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    timestamp: string;
    requestId?: string;
    [key: string]: any;
  };
}

export interface ApiErrorEnvelope {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{ field?: string; message: string }>;
    timestamp: string;
    requestId?: string;
  };
}

export interface JwtPayload {
  userId: string;
  role?: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  sessionId?: string;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  requestId?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sort: string;
  order: 'asc' | 'desc';
}

export interface AuditLogPayload {
  userId: string;
  action: string;
  resource?: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
}
