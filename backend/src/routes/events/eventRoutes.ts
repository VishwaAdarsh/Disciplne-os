/**
 * Event Routes (SPR-305 / ARCH-002)
 */

import { Router } from 'express';
import { authenticate } from '../../middleware';
import { publishEvent, getEvents, getEventById, deleteEvent } from '../../controllers/events/eventController';

const router = Router();

// POST /api/v1/events - Publish new activity event
router.post('/', authenticate, publishEvent);

// GET /api/v1/events - Retrieve event history with filtering & pagination
router.get('/', authenticate, getEvents);

// GET /api/v1/events/:id - Get specific event by ID
router.get('/:id', authenticate, getEventById);

// DELETE /api/v1/events/:id - Remove specific event
router.delete('/:id', authenticate, deleteEvent);

export default router;
