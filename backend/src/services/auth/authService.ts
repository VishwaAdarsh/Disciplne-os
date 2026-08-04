/**
 * Core Authentication Service (SPR-302 / ARCH-007)
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { logger } from '../../utils/logger';
import type { JwtPayload } from '../../types/foundation';

export interface UserSession {
  sessionId: string;
  userId: string;
  refreshToken: string;
  createdAt: string;
  expiresAt: string;
  isRevoked: boolean;
}

// In-memory sessions store (Syncs with DB in production)
const sessions: Map<string, UserSession> = new Map();
// In-memory email verification tokens
const verificationTokens: Map<string, { userId: string; expiresAt: number }> = new Map();
// In-memory password reset tokens
const resetTokens: Map<string, { userId: string; expiresAt: number }> = new Map();

// In-memory Mock Users DB for active session authentication (mirrors Prisma User model)
export interface MockUserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  status: 'active' | 'inactive';
  emailVerified: boolean;
  createdAt: string;
}

const usersDb: Map<string, MockUserRecord> = new Map();

// Seed initial demo user
const seedDemoUser = async () => {
  const demoEmail = 'adarsh@disciplineos.app';
  if (!Array.from(usersDb.values()).some((u) => u.email === demoEmail)) {
    const hash = await bcrypt.hash('DemoUser123!', 12);
    const demoUser: MockUserRecord = {
      id: 'usr-demo-1',
      email: demoEmail,
      name: 'Adarsh',
      passwordHash: hash,
      role: 'USER',
      status: 'active',
      emailVerified: true,
      createdAt: new Date().toISOString(),
    };
    usersDb.set(demoUser.id, demoUser);
  }
};
seedDemoUser();

export class AuthService {
  /**
   * Hash password with bcrypt cost factor 12
   */
  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  /**
   * Verify password hash
   */
  public async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Find user by email
   */
  public findUserByEmail(email: string): MockUserRecord | undefined {
    const targetEmail = email.toLowerCase().trim();
    return Array.from(usersDb.values()).find((u) => u.email.toLowerCase() === targetEmail);
  }

  /**
   * Find user by ID
   */
  public findUserById(id: string): MockUserRecord | undefined {
    return usersDb.get(id);
  }

  /**
   * Create new user record
   */
  public createUser(email: string, name: string, passwordHash: string): MockUserRecord {
    const userId = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newUser: MockUserRecord = {
      id: userId,
      email: email.toLowerCase().trim(),
      name: name.trim(),
      passwordHash,
      role: 'USER',
      status: 'inactive', // Inactive until verified
      emailVerified: false,
      createdAt: new Date().toISOString(),
    };
    usersDb.set(userId, newUser);
    return newUser;
  }

  /**
   * Generate 15-minute JWT Access Token
   */
  public generateAccessToken(user: MockUserRecord, sessionId: string): string {
    const payload: JwtPayload = {
      userId: user.id,
      role: user.role,
      sessionId,
    };
    return jwt.sign(payload, config.jwt.secret, { expiresIn: '15m' });
  }

  /**
   * Generate 30-day Refresh Token & Create Session
   */
  public createSession(userId: string): { sessionId: string; refreshToken: string } {
    const sessionId = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const refreshToken = jwt.sign({ userId, sessionId }, config.jwt.secret, { expiresIn: '30d' });

    const session: UserSession = {
      sessionId,
      userId,
      refreshToken,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isRevoked: false,
    };

    sessions.set(sessionId, session);
    logger.info(`Session created: ${sessionId} for user ${userId}`);
    return { sessionId, refreshToken };
  }

  /**
   * Rotate Refresh Token
   */
  public rotateRefreshToken(oldRefreshToken: string): { accessToken: string; refreshToken: string } | null {
    try {
      const payload = jwt.verify(oldRefreshToken, config.jwt.secret) as { userId: string; sessionId?: string };
      const session = payload.sessionId ? sessions.get(payload.sessionId) : null;

      if (session && session.isRevoked) {
        logger.warn(`Revoked refresh token reuse attempt detected for session ${session.sessionId}. Revoking all sessions.`);
        this.revokeAllUserSessions(payload.userId);
        return null;
      }

      const user = this.findUserById(payload.userId);
      if (!user) return null;

      // Invalidate old session & create new rotated session
      if (session) {
        session.isRevoked = true;
      }

      const { sessionId, refreshToken: newRefreshToken } = this.createSession(user.id);
      const newAccessToken = this.generateAccessToken(user, sessionId);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (err) {
      logger.warn('Refresh token validation failed', err);
      return null;
    }
  }

  /**
   * Revoke specific session
   */
  public revokeSession(sessionId: string): void {
    const session = sessions.get(sessionId);
    if (session) {
      session.isRevoked = true;
    }
  }

  /**
   * Revoke all sessions for a user
   */
  public revokeAllUserSessions(userId: string): void {
    for (const session of sessions.values()) {
      if (session.userId === userId) {
        session.isRevoked = true;
      }
    }
  }

  /**
   * Generate 24-hour Email Verification Token
   */
  public generateEmailVerificationToken(userId: string): string {
    const token = `verify_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    verificationTokens.set(token, {
      userId,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });
    return token;
  }

  /**
   * Verify Email Token & Activate User
   */
  public verifyEmailToken(token: string): boolean {
    const record = verificationTokens.get(token);
    if (!record) return false;

    if (Date.now() > record.expiresAt) {
      verificationTokens.delete(token);
      return false;
    }

    const user = usersDb.get(record.userId);
    if (user) {
      user.status = 'active';
      user.emailVerified = true;
      verificationTokens.delete(token);
      logger.info(`User email verified & activated: ${user.id}`);
      return true;
    }

    return false;
  }

  /**
   * Generate Password Reset Token (15 min TTL)
   */
  public generatePasswordResetToken(userId: string): string {
    const token = `reset_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    resetTokens.set(token, {
      userId,
      expiresAt: Date.now() + 15 * 60 * 1000,
    });
    return token;
  }

  /**
   * Reset Password
   */
  public async resetPasswordWithToken(token: string, newPassword: string): Promise<boolean> {
    const record = resetTokens.get(token);
    if (!record || Date.now() > record.expiresAt) {
      if (record) resetTokens.delete(token);
      return false;
    }

    const user = usersDb.get(record.userId);
    if (user) {
      user.passwordHash = await this.hashPassword(newPassword);
      this.revokeAllUserSessions(user.id);
      resetTokens.delete(token);
      logger.info(`Password successfully reset for user ${user.id}`);
      return true;
    }

    return false;
  }
}

export const authService = new AuthService();
export default authService;
