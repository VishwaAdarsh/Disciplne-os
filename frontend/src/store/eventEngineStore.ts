import { create } from 'zustand';
import type {
  SystemEvent,
  EventType,
  EventModule,
  EventSource,
  LiveSession,
  LiveSessionType,
  TimelineFilterOptions,
  EventNotification,
} from '../types/events';
import { eventBus } from '../utils/eventBus';
import { usePerformanceEngineStore } from './performanceEngineStore';
import { useOverviewStore } from './overviewStore';

const STORAGE_KEYS = {
  HISTORY: 'dos_events_history',
  SESSIONS: 'dos_active_sessions',
  OFFLINE_QUEUE: 'dos_offline_queue',
};

// Initial mock events for activity timeline richness
const initialMockEvents: SystemEvent[] = [
  {
    eventId: 'evt-101',
    userId: 'usr-1',
    module: 'body',
    eventType: 'WORKOUT_COMPLETED',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    unixTimestamp: Date.now() - 25 * 60 * 1000,
    title: 'Workout Completed',
    description: 'Hyper-trophy Strength Training (45 mins)',
    icon: '💪',
    payload: { durationMinutes: 45, caloriesBurned: 320, xpEarned: 40 },
    source: 'user',
    status: 'completed',
    scoreImpact: 5,
  },
  {
    eventId: 'evt-102',
    userId: 'usr-1',
    module: 'nutrition',
    eventType: 'WATER_ADDED',
    timestamp: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
    unixTimestamp: Date.now() - 65 * 60 * 1000,
    title: 'Water Logged',
    description: 'Logged 500ml Hydration',
    icon: '💧',
    payload: { amountMl: 500, totalTodayLiters: 2.5 },
    source: 'user',
    status: 'completed',
    scoreImpact: 1,
  },
  {
    eventId: 'evt-103',
    userId: 'usr-1',
    module: 'discipline',
    eventType: 'DEEP_WORK_FINISHED',
    timestamp: new Date(Date.now() - 130 * 60 * 1000).toISOString(),
    unixTimestamp: Date.now() - 130 * 60 * 1000,
    title: 'Deep Work Session Finished',
    description: 'Completed 2 hours uninterruptible core coding',
    icon: '💻',
    payload: { durationMinutes: 120, sessionName: 'Core Coding' },
    source: 'user',
    status: 'completed',
    scoreImpact: 8,
  },
  {
    eventId: 'evt-104',
    userId: 'usr-1',
    module: 'mind',
    eventType: 'MOOD_LOGGED',
    timestamp: new Date(Date.now() - 220 * 60 * 1000).toISOString(),
    unixTimestamp: Date.now() - 220 * 60 * 1000,
    title: 'Mood & Energy Logged',
    description: 'Logged High Energy (8/10)',
    icon: '🧘',
    payload: { mood: 'Energetic', score: 8 },
    source: 'user',
    status: 'completed',
    scoreImpact: 2,
  },
  {
    eventId: 'evt-105',
    userId: 'usr-1',
    module: 'nutrition',
    eventType: 'MEAL_ADDED',
    timestamp: new Date(Date.now() - 350 * 60 * 1000).toISOString(),
    unixTimestamp: Date.now() - 350 * 60 * 1000,
    title: 'Breakfast Added',
    description: 'Oatmeal & Protein Shake (550 kcal)',
    icon: '🍳',
    payload: { mealName: 'Breakfast', calories: 550, protein: 35 },
    source: 'user',
    status: 'completed',
    scoreImpact: 3,
  },
];

function loadStoredHistory(): SystemEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse event history from storage', err);
  }
  return initialMockEvents;
}

function loadStoredSessions(): Record<string, LiveSession> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse live sessions from storage', err);
  }
  return {};
}

function loadStoredOfflineQueue(): SystemEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse offline queue', err);
  }
  return [];
}

interface EventEngineState {
  eventQueue: SystemEvent[];
  eventHistory: SystemEvent[];
  offlineQueue: SystemEvent[];
  activeSessions: Record<string, LiveSession>;
  notifications: EventNotification[];
  filterOptions: TimelineFilterOptions;
  isProcessing: boolean;
  isOffline: boolean;
  
  // Actions
  emitEvent: (
    params: Omit<SystemEvent, 'eventId' | 'timestamp' | 'unixTimestamp' | 'userId' | 'status' | 'source'> & {
      userId?: string;
      source?: EventSource;
    }
  ) => SystemEvent;
  
  processQueue: () => Promise<void>;
  syncOfflineQueue: () => Promise<void>;
  
  // Live Sessions
  startLiveSession: (
    type: LiveSessionType,
    module: EventModule,
    sessionName: string,
    targetMinutes?: number,
    payload?: Record<string, any>
  ) => LiveSession;
  pauseLiveSession: (sessionId: string) => void;
  resumeLiveSession: (sessionId: string) => void;
  finishLiveSession: (sessionId: string) => void;
  cancelLiveSession: (sessionId: string) => void;
  
  // Timeline & Filters
  setTimelineFilter: (options: Partial<TimelineFilterOptions>) => void;
  getFilteredEvents: () => SystemEvent[];
  
  // Notifications
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  
  // Dev & Stats
  clearHistory: () => void;
  getStats: () => { totalCount: number; todayCount: number; activeSessionsCount: number; offlineQueueCount: number };
}

export const useEventEngineStore = create<EventEngineState>((set, get) => {
  // Sync network state
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
      set({ isOffline: false });
      get().syncOfflineQueue();
    });
    window.addEventListener('offline', () => {
      set({ isOffline: true });
    });
  }

  return {
    eventQueue: [],
    eventHistory: loadStoredHistory(),
    offlineQueue: loadStoredOfflineQueue(),
    activeSessions: loadStoredSessions(),
    notifications: [],
    filterOptions: {
      timeframe: 'today',
      module: 'all',
      searchQuery: '',
    },
    isProcessing: false,
    isOffline: typeof navigator !== 'undefined' ? !navigator.onLine : false,

    emitEvent: (params) => {
      const now = new Date();
      const eventId = `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newEvent: SystemEvent = {
        eventId,
        userId: params.userId || 'usr-1',
        module: params.module,
        eventType: params.eventType,
        timestamp: now.toISOString(),
        unixTimestamp: now.getTime(),
        title: params.title,
        description: params.description,
        icon: params.icon || '⚡',
        payload: params.payload || {},
        source: params.source || 'user',
        status: 'queued',
        scoreImpact: params.scoreImpact || 0,
      };

      const { isOffline, eventQueue, offlineQueue } = get();

      if (isOffline) {
        const updatedOffline = [newEvent, ...offlineQueue];
        set({ offlineQueue: updatedOffline });
        localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(updatedOffline));
      } else {
        const updatedQueue = [...eventQueue, newEvent];
        set({ eventQueue: updatedQueue });
        setTimeout(() => {
          get().processQueue();
        }, 10);
      }

      return newEvent;
    },

    processQueue: async () => {
      const { eventQueue, isProcessing, eventHistory } = get();
      if (isProcessing || eventQueue.length === 0) return;

      set({ isProcessing: true });
      const currentQueue = [...eventQueue];
      set({ eventQueue: [] });

      const processedHistory = [...eventHistory];
      const newNotifications: EventNotification[] = [];

      for (const event of currentQueue) {
        try {
          event.status = 'processing';

          // 1. Publish to EventBus listeners
          await eventBus.publish(event);

          // 2. Cross-module reactions: Update overview store live activity
          useOverviewStore.getState().pushEvent({
            category: event.module === 'system' ? 'discipline' : event.module,
            icon: event.icon || '⚡',
            title: event.title,
            type: event.eventType as any,
          });

          // 3. Recalculate Performance Engine
          usePerformanceEngineStore.getState().syncFromAllModules();

          event.status = 'completed';
          processedHistory.unshift(event);

          // 4. Generate notification toast if appropriate
          if (event.scoreImpact && event.scoreImpact !== 0) {
            newNotifications.push({
              id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
              eventId: event.eventId,
              title: event.title,
              message: `${event.description || 'Action recorded.'} (${event.scoreImpact > 0 ? '+' : ''}${event.scoreImpact} pts)`,
              type: event.scoreImpact > 0 ? 'success' : 'info',
              timestamp: event.timestamp,
              read: false,
              scoreChange: event.scoreImpact,
            });
          }
        } catch (err) {
          console.error(`Failed to process event ${event.eventId}:`, err);
          event.status = 'failed';
          processedHistory.unshift(event);
        }
      }

      // Persist to state & storage
      const maxHistory = processedHistory.slice(0, 200); // keep top 200 events
      set((state) => ({
        eventHistory: maxHistory,
        isProcessing: false,
        notifications: [...newNotifications, ...state.notifications].slice(0, 50),
      }));

      try {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(maxHistory));
      } catch (err) {
        console.error('Failed to persist event history', err);
      }
    },

    syncOfflineQueue: async () => {
      const { offlineQueue, emitEvent } = get();
      if (offlineQueue.length === 0) return;

      console.log(`[EventEngine] Reconnected. Syncing ${offlineQueue.length} offline events...`);
      const eventsToSync = [...offlineQueue];
      set({ offlineQueue: [] });
      localStorage.removeItem(STORAGE_KEYS.OFFLINE_QUEUE);

      for (const event of eventsToSync) {
        emitEvent({
          module: event.module,
          eventType: event.eventType,
          title: event.title,
          description: event.description,
          icon: event.icon,
          payload: event.payload,
          source: event.source,
          scoreImpact: event.scoreImpact,
          userId: event.userId,
        });
      }
    },

    // Live Sessions
    startLiveSession: (type, module, sessionName, targetMinutes = 30, payload = {}) => {
      const sessionId = `session-${type}-${Date.now()}`;
      const newSession: LiveSession = {
        id: sessionId,
        type,
        module,
        status: 'running',
        sessionName,
        startTime: Date.now(),
        pausedTotalMs: 0,
        targetMinutes,
        breaksCount: 0,
        payload,
      };

      set((state) => {
        const updated = { ...state.activeSessions, [sessionId]: newSession };
        localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));
        return { activeSessions: updated };
      });

      // Emit event
      get().emitEvent({
        module,
        eventType: `${type.toUpperCase()}_STARTED` as EventType,
        title: `Started ${sessionName}`,
        description: `${targetMinutes} min session initialized`,
        icon: type === 'deepwork' ? '💻' : type === 'workout' ? '💪' : type === 'meditation' ? '🧘' : '🏃',
        payload: { sessionId, type, targetMinutes },
      });

      return newSession;
    },

    pauseLiveSession: (sessionId) => {
      const { activeSessions, emitEvent } = get();
      const session = activeSessions[sessionId];
      if (!session || session.status !== 'running') return;

      const updated: LiveSession = {
        ...session,
        status: 'paused',
        pausedTime: Date.now(),
        breaksCount: session.breaksCount + 1,
      };

      set((state) => {
        const newMap = { ...state.activeSessions, [sessionId]: updated };
        localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(newMap));
        return { activeSessions: newMap };
      });

      emitEvent({
        module: session.module,
        eventType: 'FOCUS_UPDATED',
        title: `Paused ${session.sessionName}`,
        description: 'Session temporarily paused',
        icon: '⏸️',
        payload: { sessionId },
      });
    },

    resumeLiveSession: (sessionId) => {
      const { activeSessions, emitEvent } = get();
      const session = activeSessions[sessionId];
      if (!session || session.status !== 'paused' || !session.pausedTime) return;

      const additionalPausedMs = Date.now() - session.pausedTime;
      const updated: LiveSession = {
        ...session,
        status: 'running',
        pausedTime: undefined,
        pausedTotalMs: session.pausedTotalMs + additionalPausedMs,
      };

      set((state) => {
        const newMap = { ...state.activeSessions, [sessionId]: updated };
        localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(newMap));
        return { activeSessions: newMap };
      });

      emitEvent({
        module: session.module,
        eventType: 'FOCUS_UPDATED',
        title: `Resumed ${session.sessionName}`,
        description: 'Session focus resumed',
        icon: '▶️',
        payload: { sessionId },
      });
    },

    finishLiveSession: (sessionId) => {
      const { activeSessions, emitEvent } = get();
      const session = activeSessions[sessionId];
      if (!session) return;

      const now = Date.now();
      const totalPaused = session.pausedTotalMs + (session.pausedTime ? now - session.pausedTime : 0);
      const elapsedMinutes = Math.max(1, Math.round((now - session.startTime - totalPaused) / 60000));

      set((state) => {
        const newMap = { ...state.activeSessions };
        delete newMap[sessionId];
        localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(newMap));
        return { activeSessions: newMap };
      });

      emitEvent({
        module: session.module,
        eventType: `${session.type.toUpperCase()}_COMPLETED` as EventType,
        title: `Finished ${session.sessionName}`,
        description: `Completed ${elapsedMinutes} minutes`,
        icon: '🎉',
        payload: { sessionId, elapsedMinutes, targetMinutes: session.targetMinutes },
        scoreImpact: 10,
      });
    },

    cancelLiveSession: (sessionId) => {
      set((state) => {
        const newMap = { ...state.activeSessions };
        delete newMap[sessionId];
        localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(newMap));
        return { activeSessions: newMap };
      });
    },

    // Filtering
    setTimelineFilter: (options) => {
      set((state) => ({
        filterOptions: { ...state.filterOptions, ...options },
      }));
    },

    getFilteredEvents: () => {
      const { eventHistory, filterOptions } = get();
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;
      const startOfWeek = startOfToday - 7 * 24 * 60 * 60 * 1000;
      const startOfMonth = startOfToday - 30 * 24 * 60 * 60 * 1000;

      return eventHistory.filter((event) => {
        // Module filter
        if (filterOptions.module !== 'all' && event.module !== filterOptions.module) {
          return false;
        }

        // Timeframe filter
        const evtTime = event.unixTimestamp || new Date(event.timestamp).getTime();
        if (filterOptions.timeframe === 'today' && evtTime < startOfToday) {
          return false;
        }
        if (filterOptions.timeframe === 'yesterday' && (evtTime < startOfYesterday || evtTime >= startOfToday)) {
          return false;
        }
        if (filterOptions.timeframe === 'week' && evtTime < startOfWeek) {
          return false;
        }
        if (filterOptions.timeframe === 'month' && evtTime < startOfMonth) {
          return false;
        }

        // Search query filter
        if (filterOptions.searchQuery.trim() !== '') {
          const q = filterOptions.searchQuery.toLowerCase();
          const matchTitle = event.title.toLowerCase().includes(q);
          const matchDesc = event.description?.toLowerCase().includes(q) || false;
          const matchType = event.eventType.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchType) return false;
        }

        return true;
      });
    },

    // Notifications
    markNotificationRead: (id) => {
      set((state) => ({
        notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
      }));
    },

    clearNotifications: () => set({ notifications: [] }),

    clearHistory: () => {
      set({ eventHistory: [] });
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    },

    getStats: () => {
      const { eventHistory, activeSessions, offlineQueue } = get();
      const startOfToday = new Date().setHours(0, 0, 0, 0);
      const todayCount = eventHistory.filter(
        (e) => (e.unixTimestamp || new Date(e.timestamp).getTime()) >= startOfToday
      ).length;

      return {
        totalCount: eventHistory.length,
        todayCount,
        activeSessionsCount: Object.keys(activeSessions).length,
        offlineQueueCount: offlineQueue.length,
      };
    },
  };
});
