/**
 * Frontend Notification & Scheduler API Client (SPR-315 / ARCH-009)
 */

import type {
  NotificationItem,
  NotificationFilter,
  NotificationPreferences,
  ReminderItem,
  CreateReminderPayload,
} from '../../types/notifications';

const API_BASE = '/api/v1/notifications';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('dos_token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers as Record<string, string>),
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.message || 'API Request failed');
  }
  return data.data;
}

export const notificationApi = {
  // Feed & Counters
  async getNotifications(
    filter?: NotificationFilter
  ): Promise<{ notifications: NotificationItem[]; unreadCount: number; totalCount: number }> {
    const params = new URLSearchParams();
    if (filter?.isRead !== undefined) params.set('isRead', String(filter.isRead));
    if (filter?.type) params.set('type', filter.type);
    if (filter?.limit) params.set('limit', String(filter.limit));
    if (filter?.offset) params.set('offset', String(filter.offset));

    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchJson(`${API_BASE}${query}`);
  },

  async getUnreadCount(): Promise<{ unreadCount: number }> {
    return fetchJson(`${API_BASE}/unread-count`);
  },

  async markAsRead(id: string): Promise<{ id: string; read: boolean }> {
    return fetchJson(`${API_BASE}/${id}/read`, { method: 'PATCH' });
  },

  async markAllAsRead(): Promise<{ updatedCount: number }> {
    return fetchJson(`${API_BASE}/read-all`, { method: 'PATCH' });
  },

  async deleteNotification(id: string): Promise<{ id: string; deleted: boolean }> {
    return fetchJson(`${API_BASE}/${id}`, { method: 'DELETE' });
  },

  async clearAll(onlyRead: boolean = true): Promise<{ clearedCount: number }> {
    return fetchJson(`${API_BASE}?onlyRead=${onlyRead}`, { method: 'DELETE' });
  },

  // Preferences
  async getPreferences(): Promise<NotificationPreferences> {
    return fetchJson(`${API_BASE}/preferences`);
  },

  async updatePreferences(
    updates: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    return fetchJson(`${API_BASE}/preferences`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Reminders
  async getReminders(): Promise<ReminderItem[]> {
    return fetchJson(`${API_BASE}/reminders`);
  },

  async createReminder(payload: CreateReminderPayload): Promise<ReminderItem> {
    return fetchJson(`${API_BASE}/reminders`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateReminder(
    id: string,
    updates: Partial<CreateReminderPayload>
  ): Promise<ReminderItem> {
    return fetchJson(`${API_BASE}/reminders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteReminder(id: string): Promise<{ id: string; deleted: boolean }> {
    return fetchJson(`${API_BASE}/reminders/${id}`, { method: 'DELETE' });
  },
};
