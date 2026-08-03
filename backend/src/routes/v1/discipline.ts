import { Router } from 'express';
import { sendSuccess, sendError } from '../../utils/response';
import { authenticate, AuthRequest } from '../../middleware';

const router = Router();

// GET /api/v1/discipline/tasks
router.get('/tasks', authenticate, (req: AuthRequest, res) => {
  const mockTasks = [
    {
      id: 'dt-1',
      title: 'Morning Routine & Cold Shower',
      category: 'nonneg',
      priority: 'high',
      completed: true,
      streak: 14,
      xpReward: 20,
    },
    {
      id: 'dt-2',
      title: 'Deep Work Block 1 (Core Coding)',
      category: 'nonneg',
      priority: 'high',
      completed: true,
      streak: 8,
      xpReward: 40,
    },
  ];
  return sendSuccess(res, mockTasks, 'Tasks retrieved successfully');
});

// POST /api/v1/discipline/tasks
router.post('/tasks', authenticate, (req: AuthRequest, res) => {
  const { title, category, priority, estimatedMinutes } = req.body;
  if (!title) return sendError(res, 'Task title is required', 400);

  const newTask = {
    id: `dt-${Date.now()}`,
    userId: req.userId,
    title,
    category: category || 'nonneg',
    priority: priority || 'medium',
    estimatedMinutes: estimatedMinutes || 30,
    completed: false,
    streak: 0,
    createdAt: new Date().toISOString(),
  };

  return sendSuccess(res, newTask, 'Task created successfully', 201);
});

// PATCH /api/v1/discipline/tasks/:id/toggle
router.patch('/tasks/:id/toggle', authenticate, (req: AuthRequest, res) => {
  const { id } = req.params;
  return sendSuccess(res, { taskId: id, completed: true, streak: 15, xpGained: 20 }, 'Task status toggled');
});

// POST /api/v1/discipline/sessions/start
router.post('/sessions/start', authenticate, (req: AuthRequest, res) => {
  const { sessionName, targetMinutes } = req.body;
  const session = {
    id: `sess-${Date.now()}`,
    sessionName: sessionName || 'Deep Work',
    status: 'running',
    targetMinutes: targetMinutes || 60,
    startTime: new Date().toISOString(),
  };
  return sendSuccess(res, session, 'Focus session started');
});

export default router;
