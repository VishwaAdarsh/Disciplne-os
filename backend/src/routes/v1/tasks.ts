/**
 * API v1 Tasks Router (SPR-307)
 */

import { Router } from 'express';
import { authenticate } from '../../middleware';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  completeTask,
  archiveTask,
  restoreTask,
  deleteTask,
} from '../../controllers/tasks/taskController';

const router = Router();

// GET /api/v1/tasks - Get tasks with filters & pagination
router.get('/', authenticate, getTasks);

// POST /api/v1/tasks - Create new task
router.post('/', authenticate, createTask);

// GET /api/v1/tasks/:id - Get task detail by ID
router.get('/:id', authenticate, getTaskById);

// PATCH /api/v1/tasks/:id - Update task attributes
router.patch('/:id', authenticate, updateTask);

// PATCH /api/v1/tasks/:id/complete - Toggle task completion status
router.patch('/:id/complete', authenticate, completeTask);

// PATCH /api/v1/tasks/:id/archive - Archive task
router.patch('/:id/archive', authenticate, archiveTask);

// PATCH /api/v1/tasks/:id/restore - Restore archived task
router.patch('/:id/restore', authenticate, restoreTask);

// DELETE /api/v1/tasks/:id - Delete task
router.delete('/:id', authenticate, deleteTask);

export default router;
