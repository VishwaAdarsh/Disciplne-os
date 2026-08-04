/**
 * Authentication Input Validators (SPR-302 / ARCH-007)
 */

import { isValidEmail, sanitizeText } from '../validators';
import { HTTP_STATUS, ERROR_CODES } from '../constants';

export interface RegisterInput {
  email: string;
  name: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export function validateRegisterInput(body: any): { valid: boolean; error?: { status: number; code: string; message: string; details?: any[] }; data?: RegisterInput } {
  const email = sanitizeText(body?.email);
  const name = sanitizeText(body?.name);
  const password = body?.password;

  const details: Array<{ field: string; message: string }> = [];

  if (!email || !isValidEmail(email)) {
    details.push({ field: 'email', message: 'A valid email address is required' });
  }

  if (!name || name.length < 2) {
    details.push({ field: 'name', message: 'Name must be at least 2 characters' });
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    details.push({ field: 'password', message: 'Password must be at least 8 characters long' });
  }

  if (details.length > 0) {
    return {
      valid: false,
      error: {
        status: HTTP_STATUS.VALIDATION_ERROR,
        code: ERROR_CODES.VALIDATION_ERROR,
        message: 'Invalid registration parameters',
        details,
      },
    };
  }

  return {
    valid: true,
    data: { email: email.toLowerCase(), name, password },
  };
}

export function validateLoginInput(body: any): { valid: boolean; error?: { status: number; code: string; message: string }; data?: LoginInput } {
  const email = sanitizeText(body?.email);
  const password = body?.password;

  if (!email || !password || typeof password !== 'string') {
    return {
      valid: false,
      error: {
        status: HTTP_STATUS.BAD_REQUEST,
        code: ERROR_CODES.VALIDATION_ERROR,
        message: 'Email and password are required',
      },
    };
  }

  return {
    valid: true,
    data: { email: email.toLowerCase(), password },
  };
}
