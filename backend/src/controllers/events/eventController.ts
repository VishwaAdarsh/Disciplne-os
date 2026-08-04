/**
 * Event Controller (SPR-305 / ARCH-002)
 */

import type { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types/foundation';
import { eventService } from '../../services/events/eventService';
import { sendSuccess } from '../../responses/apiResponse';
import { getPaginationParams } from '../../utils/pagination';
import { getFilterParams } from '../../utils/filtering';
import { EventFilter } from '../../types/events';

export async function publishEvent(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || req.body.userId || 'demo-user';
    const { module, eventType, title, description, icon, metadata, payload, scoreImpact, source, status, timestamp } = req.body;

    const event = await eventService.publishEvent({
      userId,
      module,
      eventType,
      title,
      description,
      icon,
      metadata: metadata || payload || {},
      scoreImpact,
      source,
      status,
      timestamp,
    });

    sendSuccess(res, event, 'Event published successfully to activity pipeline', 201);
  } catch (err) {
    next(err);
  }
}

export async function getEvents(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const pagination = getPaginationParams(req.query);
    const rawFilter = getFilterParams(req.query);

    const period = typeof req.query.period === 'string' && ['today', 'week', 'month'].includes(req.query.period.trim())
      ? (req.query.period.trim() as 'today' | 'week' | 'month')
      : undefined;

    const filter: EventFilter = {
      module: rawFilter.category || (typeof req.query.module === 'string' ? req.query.module : undefined),
      eventType: typeof req.query.eventType === 'string' ? req.query.eventType : undefined,
      period,
      startDate: rawFilter.startDate,
      endDate: rawFilter.endDate,
      search: rawFilter.search,
    };

    const result = await eventService.getEvents(userId, pagination, filter);
    sendSuccess(res, result.items, 'Event history retrieved successfully', 200, result.meta);
  } catch (err) {
    next(err);
  }
}

export async function getEventById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const { id } = req.params;

    const event = await eventService.getEventById(id, userId);
    sendSuccess(res, event, 'Event retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

export async function deleteEvent(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId || 'demo-user';
    const { id } = req.params;

    await eventService.deleteEvent(id, userId);
    sendSuccess(res, { id, deleted: true }, 'Event deleted successfully', 200);
  } catch (err) {
    next(err);
  }
}
