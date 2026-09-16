/**
 * Notification & Scheduler Repository Implementation (SPR-315 / ARCH-009)
 */

import db from '../../db';
import {
  NotificationRecord,
  NotificationDTO,
  NotificationType,
  NotificationPriority,
  NotificationFilter,
  ReminderRecord,
  ReminderDTO,
  NotificationPreferencesRecord,
  NotificationPreferencesDTO,
} from '../../types/notifications';

export class NotificationRepository {
  // ==================== DTO MAPPERS ====================

  toNotificationDTO(record: NotificationRecord): NotificationDTO {
    return {
      id: record.id,
      userId: record.user_id,
      title: record.title,
      message: record.message,
      type: record.type as NotificationType,
      priority: record.priority as NotificationPriority,
      isRead: record.is_read === 1,
      entityType: record.entity_type || null,
      entityId: record.entity_id || null,
      actionUrl: record.action_url || null,
      scheduledFor: record.scheduled_for || null,
      createdAt: record.created_at,
    };
  }

  toReminderDTO(record: ReminderRecord): ReminderDTO {
    let parsedDays: string[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    try {
      if (record.days_of_week) {
        parsedDays = JSON.parse(record.days_of_week);
      }
    } catch {
      parsedDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    }

    return {
      id: record.id,
      userId: record.user_id,
      title: record.title,
      category: record.category,
      entityType: record.entity_type || null,
      entityId: record.entity_id || null,
      timeOfDay: record.time_of_day,
      daysOfWeek: parsedDays,
      isEnabled: record.is_enabled === 1,
      lastTriggeredAt: record.last_triggered_at || null,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    };
  }

  toPreferencesDTO(record: NotificationPreferencesRecord): NotificationPreferencesDTO {
    return {
      id: record.id,
      userId: record.user_id,
      enabled: record.enabled === 1,
      disciplineEnabled: record.discipline_enabled === 1,
      bodyEnabled: record.body_enabled === 1,
      mindEnabled: record.mind_enabled === 1,
      nutritionEnabled: record.nutrition_enabled === 1,
      goalsEnabled: record.goals_enabled === 1,
      performanceEnabled: record.performance_enabled === 1,
      remindersEnabled: record.reminders_enabled === 1,
      quietHoursEnabled: record.quiet_hours_enabled === 1,
      quietHoursStart: record.quiet_hours_start || '22:00',
      quietHoursEnd: record.quiet_hours_end || '07:00',
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    };
  }

  // ==================== NOTIFICATIONS ====================

  async findNotifications(userId: string, filter?: NotificationFilter): Promise<NotificationRecord[]> {
    let query = 'SELECT * FROM notifications WHERE user_id = ? AND deleted_at IS NULL';
    const params: any[] = [userId];

    if (filter?.isRead !== undefined) {
      query += ' AND is_read = ?';
      params.push(filter.isRead ? 1 : 0);
    }

    if (filter?.type) {
      query += ' AND type = ?';
      params.push(filter.type);
    }

    query += ' ORDER BY created_at DESC';

    const limit = filter?.limit && filter.limit > 0 ? filter.limit : 50;
    query += ' LIMIT ?';
    params.push(limit);

    if (filter?.offset && filter.offset > 0) {
      query += ' OFFSET ?';
      params.push(filter.offset);
    }

    return db.prepare(query).all(...params) as NotificationRecord[];
  }

  async getUnreadCount(userId: string): Promise<number> {
    const row = db
      .prepare(
        'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0 AND deleted_at IS NULL'
      )
      .get(userId) as { count: number } | undefined;
    return row?.count || 0;
  }

  async getTotalCount(userId: string): Promise<number> {
    const row = db
      .prepare(
        'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND deleted_at IS NULL'
      )
      .get(userId) as { count: number } | undefined;
    return row?.count || 0;
  }

  async findNotificationById(id: string, userId: string): Promise<NotificationRecord | null> {
    const row = db
      .prepare(
        'SELECT * FROM notifications WHERE id = ? AND user_id = ? AND deleted_at IS NULL'
      )
      .get(id, userId) as NotificationRecord | undefined;
    return row || null;
  }

  async createNotification(data: Partial<NotificationRecord>): Promise<NotificationRecord> {
    const query = `
      INSERT INTO notifications (
        id, user_id, title, message, type, priority, is_read,
        entity_type, entity_id, action_url, scheduled_for, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const createdAt = data.created_at || new Date().toISOString();

    db.prepare(query).run(
      data.id,
      data.user_id,
      data.title,
      data.message,
      data.type || 'system',
      data.priority || 'normal',
      data.is_read || 0,
      data.entity_type || null,
      data.entity_id || null,
      data.action_url || null,
      data.scheduled_for || null,
      createdAt
    );

    return {
      id: data.id!,
      user_id: data.user_id!,
      title: data.title!,
      message: data.message!,
      type: data.type || 'system',
      priority: data.priority || 'normal',
      is_read: data.is_read || 0,
      entity_type: data.entity_type || null,
      entity_id: data.entity_id || null,
      action_url: data.action_url || null,
      scheduled_for: data.scheduled_for || null,
      created_at: createdAt,
      deleted_at: null,
    };
  }

  async markAsRead(id: string, userId: string): Promise<boolean> {
    const result = db
      .prepare(
        'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ? AND deleted_at IS NULL'
      )
      .run(id, userId);
    return result.changes > 0;
  }

  async markAllAsRead(userId: string): Promise<number> {
    const result = db
      .prepare(
        'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0 AND deleted_at IS NULL'
      )
      .run(userId);
    return result.changes;
  }

  async deleteNotification(id: string, userId: string): Promise<boolean> {
    const result = db
      .prepare(
        "UPDATE notifications SET deleted_at = datetime('now') WHERE id = ? AND user_id = ? AND deleted_at IS NULL"
      )
      .run(id, userId);
    return result.changes > 0;
  }

  async clearAll(userId: string, onlyRead: boolean = false): Promise<number> {
    let query = "UPDATE notifications SET deleted_at = datetime('now') WHERE user_id = ? AND deleted_at IS NULL";
    if (onlyRead) {
      query += ' AND is_read = 1';
    }
    const result = db.prepare(query).run(userId);
    return result.changes;
  }

  async hasRecentNotification(
    userId: string,
    entityType: string,
    entityId: string,
    type: string,
    withinHours: number
  ): Promise<boolean> {
    const sinceDate = new Date(Date.now() - withinHours * 3600 * 1000).toISOString();
    const row = db
      .prepare(
        `SELECT COUNT(*) as count FROM notifications
         WHERE user_id = ? AND entity_type = ? AND entity_id = ? AND type = ?
         AND created_at >= ? AND deleted_at IS NULL`
      )
      .get(userId, entityType, entityId, type, sinceDate) as { count: number } | undefined;
    return (row?.count || 0) > 0;
  }

  // ==================== REMINDERS ====================

  async findReminders(userId: string): Promise<ReminderRecord[]> {
    return db
      .prepare('SELECT * FROM reminders WHERE user_id = ? ORDER BY time_of_day ASC')
      .all(userId) as ReminderRecord[];
  }

  async findActiveReminders(): Promise<ReminderRecord[]> {
    return db
      .prepare('SELECT * FROM reminders WHERE is_enabled = 1')
      .all() as ReminderRecord[];
  }

  async findReminderById(id: string, userId: string): Promise<ReminderRecord | null> {
    const row = db
      .prepare('SELECT * FROM reminders WHERE id = ? AND user_id = ?')
      .get(id, userId) as ReminderRecord | undefined;
    return row || null;
  }

  async createReminder(data: Partial<ReminderRecord>): Promise<ReminderRecord> {
    const query = `
      INSERT INTO reminders (
        id, user_id, title, category, entity_type, entity_id,
        time_of_day, days_of_week, is_enabled, last_triggered_at,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const now = new Date().toISOString();

    db.prepare(query).run(
      data.id,
      data.user_id,
      data.title,
      data.category,
      data.entity_type || null,
      data.entity_id || null,
      data.time_of_day,
      data.days_of_week || '["mon","tue","wed","thu","fri","sat","sun"]',
      data.is_enabled !== undefined ? data.is_enabled : 1,
      data.last_triggered_at || null,
      now,
      now
    );

    return {
      id: data.id!,
      user_id: data.user_id!,
      title: data.title!,
      category: data.category!,
      entity_type: data.entity_type || null,
      entity_id: data.entity_id || null,
      time_of_day: data.time_of_day!,
      days_of_week: data.days_of_week || '["mon","tue","wed","thu","fri","sat","sun"]',
      is_enabled: data.is_enabled !== undefined ? data.is_enabled : 1,
      last_triggered_at: data.last_triggered_at || null,
      created_at: now,
      updated_at: now,
    };
  }

  async updateReminder(
    id: string,
    userId: string,
    updates: Partial<ReminderRecord>
  ): Promise<ReminderRecord | null> {
    const existing = await this.findReminderById(id, userId);
    if (!existing) return null;

    const setClauses: string[] = ["updated_at = datetime('now')"];
    const params: any[] = [];

    if (updates.title !== undefined) {
      setClauses.push('title = ?');
      params.push(updates.title);
    }
    if (updates.category !== undefined) {
      setClauses.push('category = ?');
      params.push(updates.category);
    }
    if (updates.entity_type !== undefined) {
      setClauses.push('entity_type = ?');
      params.push(updates.entity_type);
    }
    if (updates.entity_id !== undefined) {
      setClauses.push('entity_id = ?');
      params.push(updates.entity_id);
    }
    if (updates.time_of_day !== undefined) {
      setClauses.push('time_of_day = ?');
      params.push(updates.time_of_day);
    }
    if (updates.days_of_week !== undefined) {
      setClauses.push('days_of_week = ?');
      params.push(updates.days_of_week);
    }
    if (updates.is_enabled !== undefined) {
      setClauses.push('is_enabled = ?');
      params.push(updates.is_enabled);
    }

    params.push(id, userId);

    db.prepare(
      `UPDATE reminders SET ${setClauses.join(', ')} WHERE id = ? AND user_id = ?`
    ).run(...params);

    return this.findReminderById(id, userId);
  }

  async deleteReminder(id: string, userId: string): Promise<boolean> {
    const result = db
      .prepare('DELETE FROM reminders WHERE id = ? AND user_id = ?')
      .run(id, userId);
    return result.changes > 0;
  }

  async updateLastTriggered(id: string, timestamp: string): Promise<void> {
    db.prepare('UPDATE reminders SET last_triggered_at = ? WHERE id = ?').run(timestamp, id);
  }

  // ==================== PREFERENCES ====================

  async getPreferences(userId: string): Promise<NotificationPreferencesRecord | null> {
    const row = db
      .prepare('SELECT * FROM notification_preferences WHERE user_id = ?')
      .get(userId) as NotificationPreferencesRecord | undefined;
    return row || null;
  }

  async upsertPreferences(
    userId: string,
    data: Partial<NotificationPreferencesRecord>
  ): Promise<NotificationPreferencesRecord> {
    const existing = await this.getPreferences(userId);
    const now = new Date().toISOString();

    if (!existing) {
      const id = `pref_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const query = `
        INSERT INTO notification_preferences (
          id, user_id, enabled, discipline_enabled, body_enabled, mind_enabled,
          nutrition_enabled, goals_enabled, performance_enabled, reminders_enabled,
          quiet_hours_enabled, quiet_hours_start, quiet_hours_end, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.prepare(query).run(
        id,
        userId,
        data.enabled !== undefined ? data.enabled : 1,
        data.discipline_enabled !== undefined ? data.discipline_enabled : 1,
        data.body_enabled !== undefined ? data.body_enabled : 1,
        data.mind_enabled !== undefined ? data.mind_enabled : 1,
        data.nutrition_enabled !== undefined ? data.nutrition_enabled : 1,
        data.goals_enabled !== undefined ? data.goals_enabled : 1,
        data.performance_enabled !== undefined ? data.performance_enabled : 1,
        data.reminders_enabled !== undefined ? data.reminders_enabled : 1,
        data.quiet_hours_enabled !== undefined ? data.quiet_hours_enabled : 0,
        data.quiet_hours_start || '22:00',
        data.quiet_hours_end || '07:00',
        now,
        now
      );
    } else {
      const setClauses: string[] = ["updated_at = datetime('now')"];
      const params: any[] = [];

      const fields: Array<keyof NotificationPreferencesRecord> = [
        'enabled',
        'discipline_enabled',
        'body_enabled',
        'mind_enabled',
        'nutrition_enabled',
        'goals_enabled',
        'performance_enabled',
        'reminders_enabled',
        'quiet_hours_enabled',
        'quiet_hours_start',
        'quiet_hours_end',
      ];

      for (const field of fields) {
        if (data[field] !== undefined) {
          setClauses.push(`${field} = ?`);
          params.push(data[field]);
        }
      }

      params.push(userId);
      db.prepare(
        `UPDATE notification_preferences SET ${setClauses.join(', ')} WHERE user_id = ?`
      ).run(...params);
    }

    return (await this.getPreferences(userId))!;
  }
}

export const notificationRepository = new NotificationRepository();
