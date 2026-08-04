/**
 * Centralized Application Configuration (SPR-301)
 */

export interface AppConfig {
  apiBaseUrl: string;
  appName: string;
  appVersion: string;
  environment: 'development' | 'staging' | 'production';
  timeouts: {
    requestMs: number;
  };
  featureFlags: {
    enableAiCoach: boolean;
    enableOfflineQueue: boolean;
    enableRealtimeSync: boolean;
  };
}

export const config: AppConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  appName: 'DisciplineOS',
  appVersion: '1.0.0',
  environment: (import.meta.env.VITE_ENV as AppConfig['environment']) || 'development',
  timeouts: {
    requestMs: 15000,
  },
  featureFlags: {
    enableAiCoach: true,
    enableOfflineQueue: true,
    enableRealtimeSync: false,
  },
};

export default config;
