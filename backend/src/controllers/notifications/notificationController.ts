/**
 * Notification & Scheduler Controller (SPR-315 / ARCH-009)
 */

import { Response } from 'express';
import { AuthRequest } from '../../middleware';
import { sendSuccess, sendError } from '../../utils/response';
import { notificationService } from '../../services/notifications/notificationService';
import { schedulerService } from '../../services/notifications/schedulerService';

export class NotificationController {
  async getNotifications(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { isRead, type, limit, offset } = req.query;

      const filter: any = {};
      if (isRead !== undefined) {
        filter.isRead = isRead === 'true' || isRead === '1';
      }
      if (type && typeof type === 'string') {
        filter.type = type;
      }
      if (limit) {
        filter.limit = parseInt(limit as string, 10);
      }
      if (offset) {
        filter.offset = parseInt(offset as string, 10);
      }

      const result = await notificationService.getNotifications(userId, filter);
      return sendSuccess(res, result, 'Notifications retrieved successfully');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to retrieve notifications', 500);
    }
  }

  async getUnreadCount(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const unreadCount = await notificationService.getUnreadCount(userId);
      return sendSuccess(res, { unreadCount }, 'Unread count retrieved');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to retrieve unread count', 500);
    }
  }

  async markRead(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const success = await notificationService.markAsRead(id, userId);
      return sendSuccess(res, { id, read: success }, 'Notification marked as read');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to mark notification as read', 500);
    }
  }

  async markAllRead(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const updatedCount = await notificationService.markAllAsRead(userId);
      return sendSuccess(res, { updatedCount }, 'All notifications marked as read');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to mark all as read', 500);
    }
  }

  async deleteNotification(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const deleted = await notificationService.deleteNotification(id, userId);
      return sendSuccess(res, { id, deleted }, 'Notification dismissed');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to dismiss notification', 500);
    }
  }

  async clearAll(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const onlyRead = req.query.onlyRead === 'true' || req.query.onlyRead === '1';
      const clearedCount = await notificationService.clearAll(userId, onlyRead);
      return sendSuccess(res, { clearedCount }, 'Notifications cleared');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to clear notifications', 500);
    }
  }

  // ==================== REMINDERS ====================

  async getReminders(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      await schedulerService.ensureDefaultReminders(userId);
      const reminders = await notificationService.getReminders(userId);
      return sendSuccess(res, reminders, 'Reminders retrieved successfully');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to retrieve reminders', 500);
    }
  }

  async createReminder(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { title, category, entityType, entityId, timeOfDay, daysOfWeek, isEnabled } = req.body;

      if (!title || !category || !timeOfDay) {
        return sendError(res, 'title, category, and timeOfDay are required', 400);
      }

      const reminder = await notificationService.createReminder({
        userId,
        title,
        category,
        entityType,
        entityId,
        timeOfDay,
        daysOfWeek,
        isEnabled,
      });

      return sendSuccess(res, reminder, 'Reminder created successfully', 201);
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to create reminder', 500);
    }
  }

  async updateReminder(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const updated = await notificationService.updateReminder(id, userId, req.body);

      if (!updated) {
        return sendError(res, 'Reminder not found', 404);
      }

      return sendSuccess(res, updated, 'Reminder updated successfully');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to update reminder', 500);
    }
  }

  async deleteReminder(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const deleted = await notificationService.deleteReminder(id, userId);
      return sendSuccess(res, { id, deleted }, 'Reminder deleted successfully');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to delete reminder', 500);
    }
  }

  // ==================== PREFERENCES ====================

  async getPreferences(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const prefs = await notificationService.getPreferences(userId);
      return sendSuccess(res, prefs, 'Notification preferences retrieved');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to retrieve preferences', 500);
    }
  }

  async updatePreferences(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const updated = await notificationService.updatePreferences(userId, req.body);
      return sendSuccess(res, updated, 'Notification preferences updated');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to update preferences', 500);
    }
  }
}

export const notificationController = new NotificationController();
