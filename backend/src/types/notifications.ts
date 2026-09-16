/**
 * Notification & Scheduler Types (SPR-315 / ARCH-009)
 */

export type NotificationType =
  | 'reminder'
  | 'goal'
  | 'discipline'
  | 'body'
  | 'nutrition'
  | 'mind'
  | 'performance'
  | 'system';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'critical';

export interface NotificationRecord {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  is_read: number;
  entity_type?: string | null;
  entity_id?: string | null;
  action_url?: string | null;
  scheduled_for?: string | null;
  created_at: string;
  deleted_at?: string | null;
}

export interface NotificationDTO {
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

export interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  entityType?: string;
  entityId?: string;
  actionUrl?: string;
  scheduledFor?: string;
}

export interface NotificationFilter {
  isRead?: boolean;
  type?: string;
  limit?: number;
  offset?: number;
}

export interface ReminderRecord {
  id: string;
  user_id: string;
  title: string;
  category: string;
  entity_type?: string | null;
  entity_id?: string | null;
  time_of_day: string; // 'HH:mm'
  days_of_week: string; // JSON string e.g. '["mon","tue","wed"]'
  is_enabled: number;
  last_triggered_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReminderDTO {
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

export interface CreateReminderInput {
  userId: string;
  title: string;
  category: string;
  entityType?: string;
  entityId?: string;
  timeOfDay: string;
  daysOfWeek?: string[];
  isEnabled?: boolean;
}

export interface UpdateReminderInput {
  title?: string;
  category?: string;
  entityType?: string;
  entityId?: string;
  timeOfDay?: string;
  daysOfWeek?: string[];
  isEnabled?: boolean;
}

export interface NotificationPreferencesRecord {
  id: string;
  user_id: string;
  enabled: number;
  discipline_enabled: number;
  body_enabled: number;
  mind_enabled: number;
  nutrition_enabled: number;
  goals_enabled: number;
  performance_enabled: number;
  reminders_enabled: number;
  quiet_hours_enabled: number;
  quiet_hours_start: string;
  quiet_hours_end: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferencesDTO {
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

export interface UpdatePreferencesInput {
  enabled?: boolean;
  disciplineEnabled?: boolean;
  bodyEnabled?: boolean;
  mindEnabled?: boolean;
  nutritionEnabled?: boolean;
  goalsEnabled?: boolean;
  performanceEnabled?: boolean;
  remindersEnabled?: boolean;
  quietHoursEnabled?: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}
