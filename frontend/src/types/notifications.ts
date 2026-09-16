/**
 * Frontend Notification & Scheduler Types (SPR-315 / ARCH-009)
 */

export const NOTIFICATION_TYPES = [
  'reminder',
  'goal',
  'discipline',
  'body',
  'nutrition',
  'mind',
  'performance',
  'system',
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export type NotificationPriority = 'low' | 'normal' | 'high' | 'critical';

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  entityType?: string | null;
  entityId?: string | null;
  actionUrl?: string | null;
  scheduledFor?: string | null;
  createdAt: string;
}

export interface NotificationFilter {
  isRead?: boolean;
  type?: string;
  limit?: number;
  offset?: number;
}

export interface ReminderItem {
  id: string;
  userId: string;
  title: string;
  category: string;
  entityType?: string | null;
  entityId?: string | null;
  timeOfDay: string;
  daysOfWeek: string[];
  isEnabled: boolean;
  lastTriggeredAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreferences {
  id: string;
  userId: string;
  enabled: boolean;
  disciplineEnabled: boolean;
  bodyEnabled: boolean;
  mindEnabled: boolean;
  nutritionEnabled: boolean;
  goalsEnabled: boolean;
  performanceEnabled: boolean;
  remindersEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReminderPayload {
  title: string;
  category: string;
  timeOfDay: string;
  entityType?: string;
  entityId?: string;
  daysOfWeek?: string[];
  isEnabled?: boolean;
}
