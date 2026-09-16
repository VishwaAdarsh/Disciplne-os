/**
 * Real-Time & Live Updates Types (SPR-316 / ARCH-003)
 */

export type RealtimeEventType =
  | 'connected'
  | 'live_event'
  | 'notification'
  | 'ping'
  | 'sync_request';

export interface RealtimeMessage<T = any> {
  type: RealtimeEventType;
  userId?: string;
  data: T;
  timestamp: string;
}

export interface RealtimeStats {
  activeUsers: number;
  totalConnections: number;
  uptimeSeconds: number;
}
