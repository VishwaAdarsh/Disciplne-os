/**
 * Standardized Error Handling Helper (SPR-301)
 */

import { logger } from './logger';
import type { ApiErrorResponse } from '../types/foundation';

export interface ParsedError {
  code: string;
  message: string;
  fieldDetails?: Array<{ field?: string; message: string }>;
}

export function parseError(error: any): ParsedError {
  // Handle Axios / API Envelope Error
  if (error?.response?.data?.error) {
    const apiError = error.response.data as ApiErrorResponse;
    return {
      code: apiError.error.code || 'API_ERROR',
      message: apiError.error.message || 'An error occurred during API request execution.',
      fieldDetails: apiError.error.details,
    };
  }

  // Handle standard HTTP status codes
  if (error?.response?.status) {
    const status = error.response.status;
    if (status === 401) return { code: 'UNAUTHORIZED', message: 'Session expired or authentication token required.' };
    if (status === 403) return { code: 'FORBIDDEN', message: 'You do not have permission to perform this action.' };
    if (status === 404) return { code: 'NOT_FOUND', message: 'The requested resource was not found.' };
    if (status === 429) return { code: 'RATE_LIMITED', message: 'Too many requests. Please slow down.' };
    if (status >= 500) return { code: 'SERVER_ERROR', message: 'A backend system error occurred. Please try again.' };
  }

  // Handle Network Error
  if (error?.message === 'Network Error' || error?.code === 'ERR_NETWORK') {
    return { code: 'NETWORK_ERROR', message: 'Unable to connect to DisciplineOS services. Check connection.' };
  }

  // Handle standard JavaScript Error
  if (error instanceof Error) {
    return { code: 'CLIENT_ERROR', message: error.message };
  }

  // Fallback
  logger.error('Unhandled System Exception', error);
  return { code: 'UNKNOWN_ERROR', message: 'An unexpected system exception occurred.' };
}
