/**
 * Health Service (SPR-304 / ARCH-002)
 */

import db from '../db';

export interface HealthCheckStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  database: 'connected' | 'disconnected';
  uptimeSeconds: number;
  version: string;
  timestamp: string;
  memoryUsageMb: number;
}

export class HealthService {
  public async getSystemHealth(): Promise<HealthCheckStatus> {
    let dbConnected = false;
    try {
      const result = db.prepare('SELECT 1 as test').get() as { test: number } | undefined;
      if (result && result.test === 1) {
        dbConnected = true;
      }
    } catch (err) {
      dbConnected = false;
    }

    const memoryUsageMb = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);

    return {
      status: dbConnected ? 'healthy' : 'degraded',
      database: dbConnected ? 'connected' : 'disconnected',
      uptimeSeconds: Math.floor(process.uptime()),
      version: 'v1.0.0',
      timestamp: new Date().toISOString(),
      memoryUsageMb,
    };
  }
}

export const healthService = new HealthService();
