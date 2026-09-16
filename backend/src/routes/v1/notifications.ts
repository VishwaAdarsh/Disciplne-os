/**
 * Notification & Scheduler Routes (SPR-315 / ARCH-009)
 */

import { Router } from 'express';
import { authenticate } from '../../middleware';
import { notificationController } from '../../controllers/notifications/notificationController';

const router = Router();

// Notification preferences
router.get('/preferences', authenticate, (req, res) => notificationController.getPreferences(req, res));
router.put('/preferences', authenticate, (req, res) => notificationController.updatePreferences(req, res));

// Reminders
router.get('/reminders', authenticate, (req, res) => notificationController.getReminders(req, res));
router.post('/reminders', authenticate, (req, res) => notificationController.createReminder(req, res));
router.put('/reminders/:id', authenticate, (req, res) => notificationController.updateReminder(req, res));
router.delete('/reminders/:id', authenticate, (req, res) => notificationController.deleteReminder(req, res));

// Notifications feed & unread count
router.get('/unread-count', authenticate, (req, res) => notificationController.getUnreadCount(req, res));
router.get('/', authenticate, (req, res) => notificationController.getNotifications(req, res));
router.patch('/read-all', authenticate, (req, res) => notificationController.markAllRead(req, res));
router.patch('/:id/read', authenticate, (req, res) => notificationController.markRead(req, res));
router.delete('/:id', authenticate, (req, res) => notificationController.deleteNotification(req, res));
router.delete('/', authenticate, (req, res) => notificationController.clearAll(req, res));

export default router;
