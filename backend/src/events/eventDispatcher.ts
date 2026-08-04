/**
 * Event Dispatcher - Central Activity Pipeline (SPR-305)
 */

import crypto from 'crypto';
import { validateEventInput } from './eventValidator';
import { logEventProcessed } from './eventLogger';
import { eventRepository } from '../repositories/eventRepository';
import { CreateEventInput, EventDTO } from '../types/events';

export type EventListener = (event: EventDTO) => void | Promise<void>;

export class EventDispatcher {
  private static instance: EventDispatcher;
  private listeners: Map<string, Set<EventListener>> = new Map();
  private globalListeners: Set<EventListener> = new Set();

  private constructor() {}

  public static getInstance(): EventDispatcher {
    if (!EventDispatcher.instance) {
      EventDispatcher.instance = new EventDispatcher();
    }
    return EventDispatcher.instance;
  }

  /**
   * Publish an event into the central Event Engine
   */
  async publish(input: CreateEventInput): Promise<EventDTO> {
    const startTime = Date.now();

    // 1. Validation
    validateEventInput(input);

    const id = `evt_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const payloadJson = JSON.stringify(input.metadata || {});

    // 2. Storage via Repository
    const record = await eventRepository.create({
      id,
      user_id: input.userId,
      module: input.module.toLowerCase(),
      event_type: input.eventType.toUpperCase(),
      title: input.title,
      description: input.description || null,
      icon: input.icon || '⚡',
      payload_json: payloadJson,
      score_impact: input.scoreImpact ?? 0,
      source: input.source || 'user',
      status: input.status || 'completed',
      created_at: input.timestamp || new Date().toISOString(),
    });

    const dto = eventRepository.toDTO(record);
    const duration = Date.now() - startTime;

    // 3. Structured Logging
    logEventProcessed({
      eventId: dto.id,
      userId: dto.userId,
      module: dto.module,
      eventType: dto.eventType,
      processingTimeMs: duration,
      timestamp: dto.createdAt,
    });

    // 4. Notify async listeners (Decoupled publishing)
    this.notifyListeners(dto);

    return dto;
  }

  /**
   * Subscribe to specific event types
   */
  on(eventType: string, listener: EventListener): () => void {
    const normalizedType = eventType.toUpperCase();
    if (!this.listeners.has(normalizedType)) {
      this.listeners.set(normalizedType, new Set());
    }
    this.listeners.get(normalizedType)!.add(listener);

    return () => {
      this.listeners.get(normalizedType)?.delete(listener);
    };
  }

  /**
   * Subscribe to all published events
   */
  subscribeAll(listener: EventListener): () => void {
    this.globalListeners.add(listener);
    return () => {
      this.globalListeners.delete(listener);
    };
  }

  private notifyListeners(event: EventDTO): void {
    const typeListeners = this.listeners.get(event.eventType);

    if (typeListeners) {
      for (const listener of typeListeners) {
        Promise.resolve(listener(event)).catch((err) => {
          console.error(`[EVENT DISPATCHER] Error in listener for ${event.eventType}:`, err);
        });
      }
    }

    for (const listener of this.globalListeners) {
      Promise.resolve(listener(event)).catch((err) => {
        console.error(`[EVENT DISPATCHER] Error in global listener:`, err);
      });
    }
  }
}

export const eventDispatcher = EventDispatcher.getInstance();
