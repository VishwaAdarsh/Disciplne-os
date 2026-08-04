/**
 * Safe LocalStorage Wrapper Utility (SPR-301)
 */

import { logger } from '../lib/logger';

export const storage = {
  getItem<T = string>(key: string, defaultValue: T | null = null): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      try {
        return JSON.parse(item) as T;
      } catch {
        return item as unknown as T;
      }
    } catch (err) {
      logger.error(`LocalStorage getItem error for key "${key}"`, err);
      return defaultValue;
    }
  },

  setItem<T>(key: string, value: T): boolean {
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (err) {
      logger.error(`LocalStorage setItem error for key "${key}"`, err);
      return false;
    }
  },

  removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (err) {
      logger.error(`LocalStorage removeItem error for key "${key}"`, err);
      return false;
    }
  },

  clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (err) {
      logger.error('LocalStorage clear error', err);
      return false;
    }
  },
};

export default storage;
