/**
 * Real-Time Controller (SPR-316 / ARCH-003)
 * Handles SSE connections and provides telemetry stats.
 */

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { JwtPayload } from '../../types/foundation';
import { realtimeService } from '../../services/realtime/realtimeService';
import { sendSuccess, sendError } from '../../utils/response';

export class RealtimeController {
  /**
   * SSE Stream endpoint: GET /api/v1/realtime/stream
   * Authenticates via Authorization header OR query param ?token=...
   */
  handleStream(req: Request, res: Response): void {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.query.token && typeof req.query.token === 'string') {
      token = req.query.token;
    }

    if (!token) {
      sendError(res, 'Authentication token required for real-time connection', 401);
      return;
    }

    let userId: string;
    try {
      const payload = jwt.verify(token, config.jwt.secret) as JwtPayload;
      userId = payload.userId;
    } catch {
      sendError(res, 'Invalid or expired token', 401);
      return;
    }

    // Set Server-Sent Events headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    if (typeof (res as any).flushHeaders === 'function') {
      (res as any).flushHeaders();
    }

    // Register active client
    realtimeService.addClient(userId, res);

    // Clean up on disconnect
    req.on('close', () => {
      realtimeService.removeClient(userId, res);
    });
  }

  /**
   * Health and telemetry stats: GET /api/v1/realtime/stats
   */
  getStats(_req: Request, res: Response): void {
    const stats = realtimeService.getStats();
    sendSuccess(res, stats, 'Real-time telemetry retrieved');
  }
}

export const realtimeController = new RealtimeController();
