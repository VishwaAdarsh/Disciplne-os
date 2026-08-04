/**
 * Task Request Validators (SPR-304 / ARCH-002)
 */

import { z } from 'zod';

export const createTaskSchema = z.object({
  name: z.string({ required_error: 'Task name is required' }).min(1, 'Task name cannot be empty'),
  type: z.enum(['nonneg', 'flex', 'habit', 'objective']).optional().default('nonneg'),
  timeTarget: z.string().optional(),
  why: z.string().optional(),
  goalId: z.string().uuid().optional().nullable(),
});

export const getTasksQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  category: z.string().optional(),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
});
