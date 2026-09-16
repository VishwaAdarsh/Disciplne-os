/**
 * Frontend Real-Time & Live Updates Types (SPR-316 / ARCH-003)
 */

export type ConnectionStatus =
  | 'connected'
  | 'connecting'
  | 'reconnecting'
  | 'disconnected';

export type RealtimeEventType =
  | 'connected'
  | 'live_event'
  | 'notification'
  | 'notification_update'
  | 'ping';

export interface TabSyncMessage<T = any> {
  type: string;
  sourceTabId: string;
  payload?: T;
  timestamp: string;
}

export interface RealtimeEventPayload<T = any> {
  type: RealtimeEventType;
  data: T;
  timestamp: string;
}
