/**
 * Centralized Backend Application Configuration (SPR-301)
 */

import dotenv from 'dotenv';
dotenv.config();

export interface ServerConfig {
  port: number;
  environment: 'development' | 'staging' | 'production';
  databaseUrl: string;
  jwt: {
    secret: string;
    expiresIn: string;
    refreshExpiresIn: string;
  };
  cors: {
    origin: string | boolean;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  logging: {
    level: 'info' | 'warn' | 'error' | 'debug';
  };
}

export const config: ServerConfig = {
  port: parseInt(process.env.PORT || '3001', 10),
  environment: (process.env.NODE_ENV as ServerConfig['environment']) || 'development',
  databaseUrl: process.env.DATABASE_URL || 'file:../dev.db',
  jwt: {
    secret: process.env.JWT_SECRET || 'discipline-os-super-secret-jwt-key-2026',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || true,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 300,
  },
  logging: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
};

export default config;
