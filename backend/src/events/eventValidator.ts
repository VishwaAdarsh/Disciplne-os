/**
 * Event Validator (SPR-305)
 */

import { ValidationError, FieldError } from '../errors/AppError';
import { CreateEventInput, SUPPORTED_EVENT_MODULES } from '../types/events';

export function validateEventInput(input: CreateEventInput): void {
  const errors: FieldError[] = [];

  if (!input.userId || typeof input.userId !== 'string' || !input.userId.trim()) {
    errors.push({ field: 'userId', message: 'userId is required and must be a non-empty string' });
  }

  if (!input.module || typeof input.module !== 'string' || !input.module.trim()) {
    errors.push({ field: 'module', message: 'module is required' });
  } else if (!SUPPORTED_EVENT_MODULES.includes(input.module.toLowerCase() as any)) {
    errors.push({
      field: 'module',
      message: `Invalid module '${input.module}'. Must be one of: ${SUPPORTED_EVENT_MODULES.join(', ')}`,
    });
  }

  if (!input.eventType || typeof input.eventType !== 'string' || !input.eventType.trim()) {
    errors.push({ field: 'eventType', message: 'eventType is required and must be a non-empty string' });
  }

  if (!input.title || typeof input.title !== 'string' || !input.title.trim()) {
    errors.push({ field: 'title', message: 'title is required' });
  }

  if (input.metadata !== undefined && (typeof input.metadata !== 'object' || input.metadata === null || Array.isArray(input.metadata))) {
    errors.push({ field: 'metadata', message: 'metadata must be a key-value object' });
  }

  if (input.timestamp !== undefined && input.timestamp !== null) {
    const parsedDate = Date.parse(input.timestamp);
    if (isNaN(parsedDate)) {
      errors.push({ field: 'timestamp', message: 'timestamp must be a valid ISO date string' });
    }
  }

  if (errors.length > 0) {
    throw new ValidationError('Event validation failed', errors);
  }
}
