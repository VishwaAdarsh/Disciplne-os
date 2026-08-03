import type { SystemEvent, EventType } from '../types/events';

type EventCallback<T = any> = (event: SystemEvent<T>) => void | Promise<void>;

class EventBus {
  private listeners: Map<string, Set<EventCallback>> = new Map();

  /**
   * Subscribe to a specific event type or '*' for all events.
   */
  public subscribe(eventType: EventType | '*', callback: EventCallback): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    const listenerSet = this.listeners.get(eventType)!;
    listenerSet.add(callback);

    // Return unsubscribe cleanup function
    return () => {
      listenerSet.delete(callback);
      if (listenerSet.size === 0) {
        this.listeners.delete(eventType);
      }
    };
  }

  /**
   * Publish an event to registered listeners
   */
  public async publish(event: SystemEvent): Promise<void> {
    const targetListeners = this.listeners.get(event.eventType);
    const wildcardListeners = this.listeners.get('*');

    const callbacksToInvoke: EventCallback[] = [];
    if (targetListeners) callbacksToInvoke.push(...Array.from(targetListeners));
    if (wildcardListeners) callbacksToInvoke.push(...Array.from(wildcardListeners));

    for (const callback of callbacksToInvoke) {
      try {
        await callback(event);
      } catch (err) {
        console.error(`[EventBus] Error handling event ${event.eventType} (${event.eventId}):`, err);
      }
    }
  }

  /**
   * Clear all listeners
   */
  public clear(): void {
    this.listeners.clear();
  }
}

export const eventBus = new EventBus();
