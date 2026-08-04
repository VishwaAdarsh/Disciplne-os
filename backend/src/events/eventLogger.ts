/**
 * Event Execution Logger (SPR-305)
 */

export interface EventLogEntry {
  eventId: string;
  userId: string;
  module: string;
  eventType: string;
  processingTimeMs: number;
  timestamp: string;
}

export function logEventProcessed(entry: EventLogEntry): void {
  // Structured audit log ensuring non-sensitive user logging
  console.log(
    `[EVENT ENGINE] id=${entry.eventId} userId=${entry.userId} module=${entry.module} type=${entry.eventType} duration=${entry.processingTimeMs}ms at=${entry.timestamp}`
  );
}
