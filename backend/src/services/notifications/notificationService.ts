/**
 * Notification Service Implementation (SPR-315 / ARCH-009)
 * Centralizes in-app notification routing, user preference checks, and Event Engine triggers.
 */

import crypto from 'crypto';
import { notificationRepository } from '../../repositories/notifications/notificationRepository';
import { eventDispatcher } from '../../events/eventDispatcher';
import { EventDTO } from '../../types/events';
import {
  NotificationDTO,
  NotificationFilter,
  CreateNotificationInput,
  NotificationType,
  ReminderDTO,
  CreateReminderInput,
  UpdateReminderInput,
  NotificationPreferencesDTO,
  UpdatePreferencesInput,
} from '../../types/notifications';

export class NotificationService {
  private eventListenerInitialized = false;

  // ==================== NOTIFICATIONS CRUD ====================

  async getNotifications(
    userId: string,
    filter?: NotificationFilter
  ): Promise<{ notifications: NotificationDTO[]; unreadCount: number; totalCount: number }> {
    const records = await notificationRepository.findNotifications(userId, filter);
    const unreadCount = await notificationRepository.getUnreadCount(userId);
    const totalCount = await notificationRepository.getTotalCount(userId);

    const notifications = records.map((r) => notificationRepository.toNotificationDTO(r));
    return { notifications, unreadCount, totalCount };
  }

  async getUnreadCount(userId: string): Promise<number> {
    return notificationRepository.getUnreadCount(userId);
  }

  async createNotification(input: CreateNotificationInput): Promise<NotificationDTO | null> {
    // 1. Check user preferences
    const prefs = await this.getPreferences(input.userId);

    if (!prefs.enabled && input.priority !== 'critical') {
      return null;
    }

    // Category toggle checks
    if (input.type === 'discipline' && !prefs.disciplineEnabled) return null;
    if (input.type === 'body' && !prefs.bodyEnabled) return null;
    if (input.type === 'mind' && !prefs.mindEnabled) return null;
    if (input.type === 'nutrition' && !prefs.nutritionEnabled) return null;
    if (input.type === 'goal' && !prefs.goalsEnabled) return null;
    if (input.type === 'performance' && !prefs.performanceEnabled) return null;
    if (input.type === 'reminder' && !prefs.remindersEnabled) return null;

    const id = `notif_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

    const record = await notificationRepository.createNotification({
      id,
      user_id: input.userId,
      title: input.title,
      message: input.message,
      type: input.type,
      priority: input.priority || 'normal',
      is_read: 0,
      entity_type: input.entityType || null,
      entity_id: input.entityId || null,
      action_url: input.actionUrl || null,
      scheduled_for: input.scheduledFor || null,
    });

    return notificationRepository.toNotificationDTO(record);
  }

  async markAsRead(id: string, userId: string): Promise<boolean> {
    return notificationRepository.markAsRead(id, userId);
  }

  async markAllAsRead(userId: string): Promise<number> {
    return notificationRepository.markAllAsRead(userId);
  }

  async deleteNotification(id: string, userId: string): Promise<boolean> {
    return notificationRepository.deleteNotification(id, userId);
  }

  async clearAll(userId: string, onlyRead: boolean = false): Promise<number> {
    return notificationRepository.clearAll(userId, onlyRead);
  }

  // ==================== REMINDERS ====================

  async getReminders(userId: string): Promise<ReminderDTO[]> {
    const records = await notificationRepository.findReminders(userId);
    return records.map((r) => notificationRepository.toReminderDTO(r));
  }

  async createReminder(input: CreateReminderInput): Promise<ReminderDTO> {
    const id = `rem_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const daysJson = JSON.stringify(
      input.daysOfWeek || ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
    );

    const record = await notificationRepository.createReminder({
      id,
      user_id: input.userId,
      title: input.title,
      category: input.category,
      entity_type: input.entityType || null,
      entity_id: input.entityId || null,
      time_of_day: input.timeOfDay,
      days_of_week: daysJson,
      is_enabled: input.isEnabled !== undefined ? (input.isEnabled ? 1 : 0) : 1,
    });

    return notificationRepository.toReminderDTO(record);
  }

  async updateReminder(
    id: string,
    userId: string,
    updates: UpdateReminderInput
  ): Promise<ReminderDTO | null> {
    const patch: any = {};
    if (updates.title !== undefined) patch.title = updates.title;
    if (updates.category !== undefined) patch.category = updates.category;
    if (updates.entityType !== undefined) patch.entity_type = updates.entityType;
    if (updates.entityId !== undefined) patch.entity_id = updates.entityId;
    if (updates.timeOfDay !== undefined) patch.time_of_day = updates.timeOfDay;
    if (updates.daysOfWeek !== undefined) patch.days_of_week = JSON.stringify(updates.daysOfWeek);
    if (updates.isEnabled !== undefined) patch.is_enabled = updates.isEnabled ? 1 : 0;

    const updated = await notificationRepository.updateReminder(id, userId, patch);
    return updated ? notificationRepository.toReminderDTO(updated) : null;
  }

  async deleteReminder(id: string, userId: string): Promise<boolean> {
    return notificationRepository.deleteReminder(id, userId);
  }

  // ==================== PREFERENCES ====================

  async getPreferences(userId: string): Promise<NotificationPreferencesDTO> {
    let record = await notificationRepository.getPreferences(userId);
    if (!record) {
      record = await notificationRepository.upsertPreferences(userId, {
        enabled: 1,
        discipline_enabled: 1,
        body_enabled: 1,
        mind_enabled: 1,
        nutrition_enabled: 1,
        goals_enabled: 1,
        performance_enabled: 1,
        reminders_enabled: 1,
        quiet_hours_enabled: 0,
        quiet_hours_start: '22:00',
        quiet_hours_end: '07:00',
      });
    }
    return notificationRepository.toPreferencesDTO(record);
  }

  async updatePreferences(
    userId: string,
    updates: UpdatePreferencesInput
  ): Promise<NotificationPreferencesDTO> {
    const patch: any = {};
    if (updates.enabled !== undefined) patch.enabled = updates.enabled ? 1 : 0;
    if (updates.disciplineEnabled !== undefined) patch.discipline_enabled = updates.disciplineEnabled ? 1 : 0;
    if (updates.bodyEnabled !== undefined) patch.body_enabled = updates.bodyEnabled ? 1 : 0;
    if (updates.mindEnabled !== undefined) patch.mind_enabled = updates.mindEnabled ? 1 : 0;
    if (updates.nutritionEnabled !== undefined) patch.nutrition_enabled = updates.nutritionEnabled ? 1 : 0;
    if (updates.goalsEnabled !== undefined) patch.goals_enabled = updates.goalsEnabled ? 1 : 0;
    if (updates.performanceEnabled !== undefined) patch.performance_enabled = updates.performanceEnabled ? 1 : 0;
    if (updates.remindersEnabled !== undefined) patch.reminders_enabled = updates.remindersEnabled ? 1 : 0;
    if (updates.quietHoursEnabled !== undefined) patch.quiet_hours_enabled = updates.quietHoursEnabled ? 1 : 0;
    if (updates.quietHoursStart !== undefined) patch.quiet_hours_start = updates.quietHoursStart;
    if (updates.quietHoursEnd !== undefined) patch.quiet_hours_end = updates.quietHoursEnd;

    const record = await notificationRepository.upsertPreferences(userId, patch);
    return notificationRepository.toPreferencesDTO(record);
  }

  // ==================== EVENT ENGINE INTEGRATION ====================

  initEventListener(): void {
    if (this.eventListenerInitialized) return;
    this.eventListenerInitialized = true;

    eventDispatcher.subscribeAll(async (event: EventDTO) => {
      try {
        await this.handleEvent(event);
      } catch (err) {
        console.error('[NotificationService] Error handling event:', err);
      }
    });

    console.log('🔔 Notification Event Engine integration active');
  }

  private async handleEvent(event: EventDTO): Promise<void> {
    // Avoid re-triggering from scheduler or notification source
    if (event.source === 'scheduler' || event.source === 'notification') {
      return;
    }

    const { userId, eventType, title, description, module } = event;

    let notifType: NotificationType = 'system';
    let notifTitle = '';
    let notifMessage = '';
    let actionUrl = '/';
    let priority: 'low' | 'normal' | 'high' = 'normal';

    switch (eventType) {
      case 'GOAL_COMPLETED':
        notifType = 'goal';
        notifTitle = '🎯 Goal Completed!';
        notifMessage = `Outstanding achievement! You completed: "${title}".`;
        actionUrl = '/goals';
        priority = 'high';
        break;

      case 'GOAL_CREATED':
        notifType = 'goal';
        notifTitle = '🎯 Goal Initialized';
        notifMessage = `New target configured: "${title}".`;
        actionUrl = '/goals';
        priority = 'low';
        break;

      case 'TASK_COMPLETED':
        notifType = 'discipline';
        notifTitle = '⚡ Task Complete';
        notifMessage = `Great execution: "${title}" is checked off.`;
        actionUrl = '/discipline';
        priority = 'normal';
        break;

      case 'WORKOUT_LOGGED':
        notifType = 'body';
        notifTitle = '💪 Workout Logged';
        notifMessage = `Physical session recorded: "${title}".`;
        actionUrl = '/body';
        priority = 'normal';
        break;

      case 'WATER_LOGGED':
        notifType = 'body';
        notifTitle = '💧 Hydration Check';
        notifMessage = `${title}`;
        actionUrl = '/body';
        priority = 'low';
        break;

      case 'SLEEP_LOGGED':
        notifType = 'body';
        notifTitle = '🌙 Sleep Logged';
        notifMessage = `Sleep record updated: "${title}".`;
        actionUrl = '/body';
        priority = 'normal';
        break;

      case 'MEDITATION_LOGGED':
        notifType = 'mind';
        notifTitle = '🧘 Mindfulness Session Logged';
        notifMessage = `Mental clarity recorded: "${title}".`;
        actionUrl = '/mind';
        priority = 'normal';
        break;

      case 'REFLECTION_ADDED':
        notifType = 'mind';
        notifTitle = '📝 Reflection Saved';
        notifMessage = `Weekly reflection review successfully saved.`;
        actionUrl = '/reflect';
        priority = 'normal';
        break;

      case 'MEAL_ADDED':
        notifType = 'nutrition';
        notifTitle = '🥗 Meal Logged';
        notifMessage = `Nutrition record updated: "${title}".`;
        actionUrl = '/nutrition';
        priority = 'low';
        break;

      default:
        // For other events, only log if module maps cleanly
        if (module === 'nutrition') {
          notifType = 'nutrition';
          notifTitle = '🥗 Nutrition Update';
          notifMessage = description || title;
          actionUrl = '/nutrition';
          priority = 'low';
        } else if (module === 'performance') {
          notifType = 'performance';
          notifTitle = '📈 Performance Score Update';
          notifMessage = description || title;
          actionUrl = '/';
          priority = 'normal';
        } else {
          return; // Ignore other minor events
        }
    }

    await this.createNotification({
      userId,
      title: notifTitle,
      message: notifMessage,
      type: notifType,
      priority,
      actionUrl,
      entityType: event.module,
      entityId: event.id,
    });
  }
}

export const notificationService = new NotificationService();
