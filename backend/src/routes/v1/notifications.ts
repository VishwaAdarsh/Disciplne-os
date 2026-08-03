import { Router } from 'express';
import { sendSuccess } from '../../utils/response';
import { authenticate, AuthRequest } from '../../middleware';

const router = Router();

// GET /api/v1/notifications
router.get('/', authenticate, (_req: AuthRequest, res) => {
  const notifications = [
    {
      id: 'notif-1',
      title: '🔥 14-Day Streak Protection',
      message: 'You have completed all non-negotiables today.',
      type: 'achievement',
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'notif-2',
      title: '⚡ Performance Increased',
      message: 'Performance score increased by +12 pts today.',
      type: 'success',
      read: true,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ];
  return sendSuccess(res, notifications, 'Notifications feed retrieved');
});

// PATCH /api/v1/notifications/:id/read
router.patch('/:id/read', authenticate, (req: AuthRequest, res) => {
  return sendSuccess(res, { notificationId: req.params.id, read: true }, 'Notification marked read');
});

export default router;
