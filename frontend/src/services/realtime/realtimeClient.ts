/**
 * Real-Time Client (SPR-316 / ARCH-003)
 * Manages native Server-Sent Events (SSE), multi-tab synchronization via BroadcastChannel,
 * and targeted frontend store invalidations.
 */

import { useRealtimeStore } from '../../store/realtimeStore';
import { useOverviewStore } from '../../store/overviewStore';
import { useNotificationStore } from '../../store/notificationStore';
import { usePerformanceEngineStore } from '../../store/performanceEngineStore';
import { useGoalsStore } from '../../store/goalsStore';
import { eventBus } from '../../utils/eventBus';

const TAB_ID = `tab_${Math.random().toString(36).substring(2, 9)}`;

let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel('dos_realtime_sync');
  } catch (err) {
    console.warn('[RealtimeClient] BroadcastChannel not supported:', err);
  }
}

export class RealtimeClient {
  private static instance: RealtimeClient;
  private eventSource: EventSource | null = null;
  private reconnectAttempts = 0;
  private reconnectTimeout: any = null;
  private isManuallyClosed = false;

  private constructor() {
    this.initMultiTabListener();
  }

  public static getInstance(): RealtimeClient {
    if (!RealtimeClient.instance) {
      RealtimeClient.instance = new RealtimeClient();
    }
    return RealtimeClient.instance;
  }

  /**
   * Connect to Server-Sent Events stream
   */
  connect(): void {
    if (typeof window === 'undefined') return;

    // Check if already active
    if (this.eventSource && this.eventSource.readyState !== EventSource.CLOSED) {
      return;
    }

    const token = localStorage.getItem('dos_token');
    if (!token) {
      useRealtimeStore.getState().setStatus('disconnected');
      return;
    }

    this.isManuallyClosed = false;
    useRealtimeStore.getState().setStatus('connecting');

    try {
      const url = `/api/v1/realtime/stream?token=${encodeURIComponent(token)}`;
      this.eventSource = new EventSource(url);

      this.eventSource.onopen = () => {
        this.reconnectAttempts = 0;
        useRealtimeStore.getState().setStatus('connected');
      };

      // 1. Handshake event
      this.eventSource.addEventListener('connected', () => {
        useRealtimeStore.getState().setStatus('connected');
      });

      // 2. Domain live event (from backend EventDispatcher)
      this.eventSource.addEventListener('live_event', (e) => {
        try {
          const event = JSON.parse(e.data);
          this.handleLiveEvent(event, true);
        } catch (err) {
          console.error('[RealtimeClient] Failed to parse live_event:', err);
        }
      });

      // 3. New notification created
      this.eventSource.addEventListener('notification', (e) => {
        try {
          const data = JSON.parse(e.data);
          this.handleNotification(data, true);
        } catch (err) {
          console.error('[RealtimeClient] Failed to parse notification:', err);
        }
      });

      // 4. Notification read/clear update
      this.eventSource.addEventListener('notification_update', (e) => {
        try {
          const data = JSON.parse(e.data);
          this.handleNotificationUpdate(data, true);
        } catch (err) {
          console.error('[RealtimeClient] Failed to parse notification_update:', err);
        }
      });

      // Connection error / dropped socket
      this.eventSource.onerror = () => {
        if (this.isManuallyClosed) return;

        useRealtimeStore.getState().setStatus('reconnecting');
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }

        // Exponential backoff reconnect: 1s, 2s, 4.5s, max 30s
        const delay = Math.min(30000, 1000 * Math.pow(1.5, this.reconnectAttempts));
        this.reconnectAttempts++;

        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = setTimeout(() => {
          if (!this.isManuallyClosed) {
            this.connect();
          }
        }, delay);
      };
    } catch (err) {
      console.warn('[RealtimeClient] Error establishing EventSource connection:', err);
      useRealtimeStore.getState().setStatus('reconnecting');
    }
  }

  /**
   * Disconnect and abort reconnect cycles
   */
  disconnect(): void {
    this.isManuallyClosed = true;
    clearTimeout(this.reconnectTimeout);
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    useRealtimeStore.getState().setStatus('disconnected');
  }

  /**
   * Multi-tab sync via BroadcastChannel
   */
  private initMultiTabListener(): void {
    if (!broadcastChannel) return;

    broadcastChannel.onmessage = (msgEvent) => {
      const msg = msgEvent.data;
      if (!msg || msg.sourceTabId === TAB_ID) return;

      if (msg.type === 'LIVE_EVENT') {
        this.handleLiveEvent(msg.payload, false);
      } else if (msg.type === 'NOTIFICATION') {
        this.handleNotification(msg.payload, false);
      } else if (msg.type === 'NOTIFICATION_UPDATE') {
        this.handleNotificationUpdate(msg.payload, false);
      }
    };
  }

  /**
   * Handles incoming domain live event
   */
  private handleLiveEvent(event: any, shouldBroadcast: boolean): void {
    if (!event) return;

    useRealtimeStore.getState().recordEvent(event.title);

    // Multi-tab broadcast
    if (shouldBroadcast && broadcastChannel) {
      broadcastChannel.postMessage({
        type: 'LIVE_EVENT',
        sourceTabId: TAB_ID,
        payload: event,
        timestamp: new Date().toISOString(),
      });
    }

    // Publish to local eventBus
    eventBus.publish({
      eventId: event.id || `evt_${Date.now()}`,
      userId: event.userId,
      module: event.module,
      eventType: event.eventType,
      title: event.title,
      description: event.description,
      icon: event.icon || '⚡',
      timestamp: event.createdAt || new Date().toISOString(),
      unixTimestamp: Date.now(),
      scoreImpact: event.scoreImpact || 0,
      source: 'live',
      status: 'completed',
    });

    // Targeted cache invalidation & store updates
    // 1. Always refresh Overview dashboard and Performance score
    useOverviewStore.getState().refreshOverview();
    usePerformanceEngineStore.getState().syncFromAllModules();

    // 2. Refresh notification unread count
    useNotificationStore.getState().fetchUnreadCount();

    // 3. Specific module refreshes
    if (event.module === 'goals') {
      useGoalsStore.getState().loadAllGoals();
    }
  }

  /**
   * Handles incoming notification
   */
  private handleNotification(data: any, shouldBroadcast: boolean): void {
    if (!data) return;

    if (shouldBroadcast && broadcastChannel) {
      broadcastChannel.postMessage({
        type: 'NOTIFICATION',
        sourceTabId: TAB_ID,
        payload: data,
        timestamp: new Date().toISOString(),
      });
    }

    const { notification, unreadCount } = data;
    if (unreadCount !== undefined) {
      useNotificationStore.setState({ unreadCount });
    }

    if (notification) {
      useNotificationStore.setState((state) => {
        const exists = state.notifications.some((n) => n.id === notification.id);
        if (exists) return state;
        return {
          notifications: [notification, ...state.notifications],
          totalCount: state.totalCount + 1,
        };
      });
    }
  }

  /**
   * Handles notification read/dismiss update
   */
  private handleNotificationUpdate(data: any, shouldBroadcast: boolean): void {
    if (!data) return;

    if (shouldBroadcast && broadcastChannel) {
      broadcastChannel.postMessage({
        type: 'NOTIFICATION_UPDATE',
        sourceTabId: TAB_ID,
        payload: data,
        timestamp: new Date().toISOString(),
      });
    }

    if (data.unreadCount !== undefined) {
      useNotificationStore.setState({ unreadCount: data.unreadCount });
    }

    if (data.readId) {
      useNotificationStore.setState((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === data.readId ? { ...n, isRead: true } : n
        ),
      }));
    }

    if (data.allRead) {
      useNotificationStore.setState((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      }));
    }

    if (data.deletedId) {
      useNotificationStore.setState((state) => ({
        notifications: state.notifications.filter((n) => n.id !== data.deletedId),
        totalCount: Math.max(0, state.totalCount - 1),
      }));
    }
  }
}

export const realtimeClient = RealtimeClient.getInstance();
