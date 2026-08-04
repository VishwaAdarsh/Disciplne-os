/**
 * Standard Application Error Hierarchy (SPR-304 / ARCH-002)
 */

import { HTTP_STATUS, ERROR_CODES } from '../constants';

export interface FieldError {
  field?: string;
  message: string;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly errors: FieldError[];

  constructor(
    message: string,
    statusCode: number = HTTP_STATUS.SERVER_ERROR,
    errorCode: string = ERROR_CODES.INTERNAL_ERROR,
    errors: FieldError[] = []
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', errors: FieldError[] = []) {
    super(message, HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR, errors);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', errors: FieldError[] = []) {
    super(message, HTTP_STATUS.VALIDATION_ERROR, ERROR_CODES.VALIDATION_ERROR, errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required', errors: FieldError[] = []) {
    super(message, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED, errors);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access denied', errors: FieldError[] = []) {
    super(message, HTTP_STATUS.FORBIDDEN, ERROR_CODES.FORBIDDEN, errors);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', errors: FieldError[] = []) {
    super(message, HTTP_STATUS.NOT_FOUND, ERROR_CODES.RESOURCE_NOT_FOUND, errors);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict', errors: FieldError[] = []) {
    super(message, HTTP_STATUS.CONFLICT, ERROR_CODES.USER_EXISTS, errors);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal server error', errors: FieldError[] = []) {
    super(message, HTTP_STATUS.SERVER_ERROR, ERROR_CODES.INTERNAL_ERROR, errors);
  }
}
