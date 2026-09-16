/**
 * Notification & Scheduler Zustand Store (SPR-315 / ARCH-009)
 */

import { create } from 'zustand';
import type {
  NotificationItem,
  NotificationPreferences,
  ReminderItem,
  CreateReminderPayload,
} from '../types/notifications';
import { notificationApi } from '../services/notifications/notificationApi';

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  totalCount: number;
  loading: boolean;
  filter: 'all' | 'unread';
  preferences: NotificationPreferences | null;
  reminders: ReminderItem[];
  isPreferencesOpen: boolean;

  // Actions
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  setFilter: (filter: 'all' | 'unread') => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAll: (onlyRead?: boolean) => Promise<void>;

  fetchPreferences: () => Promise<void>;
  updatePreferences: (updates: Partial<NotificationPreferences>) => Promise<void>;
  setIsPreferencesOpen: (open: boolean) => void;

  fetchReminders: () => Promise<void>;
  createReminder: (payload: CreateReminderPayload) => Promise<void>;
  toggleReminder: (id: string, isEnabled: boolean) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  totalCount: 0,
  loading: false,
  filter: 'all',
  preferences: null,
  reminders: [],
  isPreferencesOpen: false,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const { filter } = get();
      const filterParam = filter === 'unread' ? { isRead: false } : undefined;
      const res = await notificationApi.getNotifications(filterParam);
      set({
        notifications: res.notifications,
        unreadCount: res.unreadCount,
        totalCount: res.totalCount,
        loading: false,
      });
    } catch (err) {
      console.error('[NotificationStore] Fetch notifications failed:', err);
      set({ loading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const res = await notificationApi.getUnreadCount();
      set({ unreadCount: res.unreadCount });
    } catch (err) {
      console.error('[NotificationStore] Fetch unread count failed:', err);
    }
  },

  setFilter: (filter: 'all' | 'unread') => {
    set({ filter });
    get().fetchNotifications();
  },

  markAsRead: async (id: string) => {
    // Optimistic update
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));

    try {
      await notificationApi.markAsRead(id);
    } catch (err) {
      console.error('[NotificationStore] Mark read failed:', err);
      get().fetchNotifications();
    }
  },

  markAllAsRead: async () => {
    // Optimistic update
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));

    try {
      await notificationApi.markAllAsRead();
    } catch (err) {
      console.error('[NotificationStore] Mark all read failed:', err);
      get().fetchNotifications();
    }
  },

  deleteNotification: async (id: string) => {
    const target = get().notifications.find((n) => n.id === id);
    const wasUnread = target && !target.isRead;

    // Optimistic update
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
      totalCount: Math.max(0, state.totalCount - 1),
      unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
    }));

    try {
      await notificationApi.deleteNotification(id);
    } catch (err) {
      console.error('[NotificationStore] Delete notification failed:', err);
      get().fetchNotifications();
    }
  },

  clearAll: async (onlyRead = true) => {
    try {
      await notificationApi.clearAll(onlyRead);
      await get().fetchNotifications();
    } catch (err) {
      console.error('[NotificationStore] Clear notifications failed:', err);
    }
  },

  fetchPreferences: async () => {
    try {
      const prefs = await notificationApi.getPreferences();
      set({ preferences: prefs });
    } catch (err) {
      console.error('[NotificationStore] Fetch preferences failed:', err);
    }
  },

  updatePreferences: async (updates: Partial<NotificationPreferences>) => {
    // Optimistic update
    set((state) => ({
      preferences: state.preferences ? { ...state.preferences, ...updates } : null,
    }));

    try {
      const updated = await notificationApi.updatePreferences(updates);
      set({ preferences: updated });
    } catch (err) {
      console.error('[NotificationStore] Update preferences failed:', err);
      get().fetchPreferences();
    }
  },

  setIsPreferencesOpen: (open: boolean) => {
    set({ isPreferencesOpen: open });
  },

  fetchReminders: async () => {
    try {
      const reminders = await notificationApi.getReminders();
      set({ reminders });
    } catch (err) {
      console.error('[NotificationStore] Fetch reminders failed:', err);
    }
  },

  createReminder: async (payload: CreateReminderPayload) => {
    try {
      const reminder = await notificationApi.createReminder(payload);
      set((state) => ({ reminders: [...state.reminders, reminder] }));
    } catch (err) {
      console.error('[NotificationStore] Create reminder failed:', err);
      throw err;
    }
  },

  toggleReminder: async (id: string, isEnabled: boolean) => {
    // Optimistic update
    set((state) => ({
      reminders: state.reminders.map((r) =>
        r.id === id ? { ...r, isEnabled } : r
      ),
    }));

    try {
      await notificationApi.updateReminder(id, { isEnabled });
    } catch (err) {
      console.error('[NotificationStore] Toggle reminder failed:', err);
      get().fetchReminders();
    }
  },

  deleteReminder: async (id: string) => {
    // Optimistic update
    set((state) => ({
      reminders: state.reminders.filter((r) => r.id !== id),
    }));

    try {
      await notificationApi.deleteReminder(id);
    } catch (err) {
      console.error('[NotificationStore] Delete reminder failed:', err);
      get().fetchReminders();
    }
  },
}));
