/**
 * Request Validation Middleware (SPR-304 / ARCH-002)
 */

import type { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../errors/AppError';

export interface RequestValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export function validateRequest(schemas: RequestValidationSchemas | ZodSchema) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if ('parseAsync' in schemas && typeof schemas.parseAsync === 'function') {
        req.body = await schemas.parseAsync(req.body);
      } else {
        const s = schemas as RequestValidationSchemas;
        if (s.body) req.body = await s.body.parseAsync(req.body);
        if (s.query) req.query = await s.query.parseAsync(req.query);
        if (s.params) req.params = await s.params.parseAsync(req.params);
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        next(new ValidationError('Validation failed', errors));
      } else {
        next(err);
      }
    }
  };
}

export default validateRequest;
