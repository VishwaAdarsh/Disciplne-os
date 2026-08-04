/**
 * Event Service (SPR-305 / ARCH-002)
 */

import { eventDispatcher } from '../../events/eventDispatcher';
import { eventRepository } from '../../repositories/eventRepository';
import { CreateEventInput, EventDTO, EventFilter } from '../../types/events';
import { ParsedPagination } from '../../utils/pagination';
import { NotFoundError } from '../../errors/AppError';

export class EventService {
  async publishEvent(input: CreateEventInput): Promise<EventDTO> {
    return eventDispatcher.publish(input);
  }

  async getEvents(userId: string, pagination: ParsedPagination, filter: EventFilter) {
    const combinedFilter: EventFilter = { ...filter, userId };
    const paginated = await eventRepository.paginate(pagination, combinedFilter);

    const dtoItems = paginated.items.map((record) => eventRepository.toDTO(record));

    return {
      items: dtoItems,
      meta: paginated.meta,
    };
  }

  async getEventById(eventId: string, userId?: string): Promise<EventDTO> {
    const record = await eventRepository.findById(eventId);
    if (!record) {
      throw new NotFoundError(`Event with ID ${eventId} not found`);
    }
    if (userId && record.user_id !== userId) {
      throw new NotFoundError(`Event with ID ${eventId} not found`);
    }
    return eventRepository.toDTO(record);
  }

  async deleteEvent(eventId: string, userId?: string): Promise<boolean> {
    await this.getEventById(eventId, userId);
    return eventRepository.delete(eventId);
  }
}

export const eventService = new EventService();
