/**
 * Real-Time Service (SPR-316 / ARCH-003)
 * Manages Server-Sent Events (SSE) connections, heartbeats, and Event Engine broadcast.
 */

import { Response } from 'express';
import { eventDispatcher } from '../../events/eventDispatcher';
import { EventDTO } from '../../types/events';
import { RealtimeEventType, RealtimeStats } from '../../types/realtime';

export class RealtimeService {
  private static instance: RealtimeService;
  private clients: Map<string, Set<Response>> = new Map();
  private pingTimer: NodeJS.Timeout | null = null;
  private isEventListenerInitialized = false;
  private startTime = Date.now();

  private constructor() {
    this.startHeartbeat();
  }

  public static getInstance(): RealtimeService {
    if (!RealtimeService.instance) {
      RealtimeService.instance = new RealtimeService();
    }
    return RealtimeService.instance;
  }

  /**
   * Registers a client SSE response connection
   */
  addClient(userId: string, res: Response): void {
    if (!this.clients.has(userId)) {
      this.clients.set(userId, new Set());
    }
    this.clients.get(userId)!.add(res);

    // Send initial handshake
    this.sendRaw(res, 'connected', {
      status: 'connected',
      userId,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Removes a client SSE connection
   */
  removeClient(userId: string, res: Response): void {
    const userClients = this.clients.get(userId);
    if (userClients) {
      userClients.delete(res);
      if (userClients.size === 0) {
        this.clients.delete(userId);
      }
    }
  }

  /**
   * Broadcasts a payload directly to all open connections of a specific user
   */
  sendToUser(userId: string, eventName: RealtimeEventType | string, data: any): void {
    const userClients = this.clients.get(userId);
    if (!userClients || userClients.size === 0) return;

    for (const res of userClients) {
      this.sendRaw(res, eventName, data);
    }
  }

  /**
   * Serializes and writes SSE payload format
   */
  private sendRaw(res: Response, event: string, data: any): void {
    try {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    } catch (err) {
      // Dead or aborted socket
      console.warn('[RealtimeService] Error writing to response stream:', err);
    }
  }

  /**
   * Sends heartbeat ping to all active SSE streams
   */
  sendHeartbeat(): void {
    for (const [, connections] of this.clients.entries()) {
      for (const res of connections) {
        try {
          res.write(': ping\n\n');
        } catch {
          // Ignored - cleanup handled on req close
        }
      }
    }
  }

  /**
   * Periodic SSE heartbeat to prevent connection timeout through proxies
   */
  startHeartbeat(intervalMs: number = 25000): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
    }
    this.pingTimer = setInterval(() => {
      this.sendHeartbeat();
    }, intervalMs);
  }

  stopHeartbeat(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }

  /**
   * Returns current connection telemetry
   */
  getStats(): RealtimeStats {
    let totalConnections = 0;
    for (const connections of this.clients.values()) {
      totalConnections += connections.size;
    }

    return {
      activeUsers: this.clients.size,
      totalConnections,
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
    };
  }

  /**
   * Binds Event Engine events to the Real-Time pipeline
   */
  initEventListener(): void {
    if (this.isEventListenerInitialized) return;
    this.isEventListenerInitialized = true;

    eventDispatcher.subscribeAll(async (event: EventDTO) => {
      try {
        // Strict data isolation: only send to the event owner
        this.sendToUser(event.userId, 'live_event', event);
      } catch (err) {
        console.error('[RealtimeService] Error broadcasting event:', err);
      }
    });

    console.log('⚡ Real-time SSE Event Dispatcher integration active');
  }
}

export const realtimeService = RealtimeService.getInstance();
