/**
 * Structured Backend JSON Logger Utility (SPR-301 / ARCH-010)
 */

import config from '../config';

export type ServerLogLevel = 'info' | 'warn' | 'error' | 'debug';

const LEVEL_PRIORITY: Record<ServerLogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class ServerLogger {
  private minLevel: ServerLogLevel = config.logging.level;

  private shouldLog(level: ServerLogLevel): boolean {
    return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[this.minLevel];
  }

  private formatJson(level: ServerLogLevel, message: string, meta?: Record<string, any>): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      service: 'discipline-os-backend',
      environment: config.environment,
      ...meta,
    });
  }

  public debug(message: string, meta?: Record<string, any>): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatJson('debug', message, meta));
    }
  }

  public info(message: string, meta?: Record<string, any>): void {
    if (this.shouldLog('info')) {
      console.info(this.formatJson('info', message, meta));
    }
  }

  public warn(message: string, meta?: Record<string, any>): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatJson('warn', message, meta));
    }
  }

  public error(message: string, error?: any, meta?: Record<string, any>): void {
    if (this.shouldLog('error')) {
      const errObj = error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : { raw: error };
      console.error(this.formatJson('error', message, { error: errObj, ...meta }));
    }
  }
}

export const logger = new ServerLogger();
export default logger;
