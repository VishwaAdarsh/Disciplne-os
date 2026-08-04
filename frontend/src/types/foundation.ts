/**
 * Shared Foundation Types & Interfaces (SPR-301 / ARCH-002)
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  meta?: ResponseMeta;
}

export interface ResponseMeta {
  timestamp: string;
  requestId?: string;
  [key: string]: any;
}

export interface PaginationMeta extends ResponseMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  message: string;
  data: T[];
  meta: PaginationMeta;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
    timestamp: string;
    requestId?: string;
  };
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';
export type ThemeMode = 'dark' | 'light';
export type LogLevel = 'info' | 'warn' | 'error' | 'debug';
