/**
 * Authentication Route Controllers (SPR-302 / ARCH-002)
 */

import type { Response } from 'express';
import { authService } from '../../services/auth/authService';
import { validateRegisterInput, validateLoginInput } from '../../validators/authValidator';
import { sendSuccess, sendError } from '../../utils/response';
import { HTTP_STATUS } from '../../constants';
import type { AuthRequest } from '../../types/foundation';
import { logger } from '../../utils/logger';

export class AuthController {
  /**
   * POST /api/v1/auth/register
   */
  public register = async (req: AuthRequest, res: Response): Promise<any> => {
    const validation = validateRegisterInput(req.body);
    if (!validation.valid || !validation.data) {
      const err = validation.error!;
      return res.status(err.status).json({
        success: false,
        message: err.message,
        error: {
          code: err.code,
          message: err.message,
          details: err.details,
          timestamp: new Date().toISOString(),
          requestId: req.requestId,
        },
      });
    }

    const { email, name, password } = validation.data;

    // Check duplicate user
    const existing = authService.findUserByEmail(email);
    if (existing) {
      return sendError(res, 'An account with this email address already exists. Please sign in instead.', HTTP_STATUS.CONFLICT);
    }

    // Hash password & create user
    const passwordHash = await authService.hashPassword(password);
    const user = authService.createUser(email, name, passwordHash);
    const verificationToken = authService.generateEmailVerificationToken(user.id);

    // Create session & tokens
    const { sessionId, refreshToken } = authService.createSession(user.id);
    const accessToken = authService.generateAccessToken(user, sessionId);

    logger.info(`User registered successfully: ${user.id}`);

    return sendSuccess(
      res,
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified,
        },
        accessToken,
        refreshToken,
        verificationToken,
      },
      'User registered successfully',
      HTTP_STATUS.CREATED
    );
  };

  /**
   * POST /api/v1/auth/login
   */
  public login = async (req: AuthRequest, res: Response): Promise<any> => {
    const validation = validateLoginInput(req.body);
    if (!validation.valid || !validation.data) {
      return sendError(res, 'Email and password are required', HTTP_STATUS.BAD_REQUEST);
    }

    const { email, password } = validation.data;
    const user = authService.findUserByEmail(email);

    if (!user) {
      return sendError(res, 'Invalid credentials. Please check your email and password.', HTTP_STATUS.UNAUTHORIZED);
    }

    const isValidPassword = await authService.verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return sendError(res, 'Invalid credentials. Please check your email and password.', HTTP_STATUS.UNAUTHORIZED);
    }

    // Create session & tokens
    const { sessionId, refreshToken } = authService.createSession(user.id);
    const accessToken = authService.generateAccessToken(user, sessionId);

    return sendSuccess(
      res,
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified,
        },
        accessToken,
        refreshToken,
      },
      'Login successful'
    );
  };

  /**
   * POST /api/v1/auth/refresh
   */
  public refresh = (req: AuthRequest, res: Response): any => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return sendError(res, 'Refresh token required', HTTP_STATUS.BAD_REQUEST);
    }

    const tokens = authService.rotateRefreshToken(refreshToken);
    if (!tokens) {
      return sendError(res, 'Invalid or expired refresh token', HTTP_STATUS.UNAUTHORIZED);
    }

    return sendSuccess(res, tokens, 'Token refreshed successfully');
  };

  /**
   * GET /api/v1/auth/me
   */
  public me = (req: AuthRequest, res: Response): any => {
    if (!req.userId) {
      return sendError(res, 'Unauthorized', HTTP_STATUS.UNAUTHORIZED);
    }

    const user = authService.findUserById(req.userId);
    if (!user) {
      return sendError(res, 'User profile not found', HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccess(
      res,
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified,
        },
      },
      'User profile retrieved'
    );
  };

  /**
   * POST /api/v1/auth/verify-email
   */
  public verifyEmail = (req: AuthRequest, res: Response): any => {
    const { token } = req.body;
    if (!token) return sendError(res, 'Verification token required', HTTP_STATUS.BAD_REQUEST);

    const success = authService.verifyEmailToken(token);
    if (!success) {
      return sendError(res, 'Invalid or expired verification token', HTTP_STATUS.BAD_REQUEST);
    }

    return sendSuccess(res, { emailVerified: true }, 'Email address successfully verified');
  };

  /**
   * POST /api/v1/auth/forgot-password
   */
  public forgotPassword = (req: AuthRequest, res: Response): any => {
    const { email } = req.body;
    if (!email) return sendError(res, 'Email address is required', HTTP_STATUS.BAD_REQUEST);

    const user = authService.findUserByEmail(email);
    if (user) {
      const resetToken = authService.generatePasswordResetToken(user.id);
      logger.info(`Generated reset token for ${email}: ${resetToken}`);
    }

    return sendSuccess(res, null, 'If an account exists for this email, password reset instructions have been sent.');
  };

  /**
   * POST /api/v1/auth/reset-password
   */
  public resetPassword = async (req: AuthRequest, res: Response): Promise<any> => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      return sendError(res, 'Valid reset token and password (min 8 characters) required', HTTP_STATUS.BAD_REQUEST);
    }

    const success = await authService.resetPasswordWithToken(token, newPassword);
    if (!success) {
      return sendError(res, 'Invalid or expired reset token', HTTP_STATUS.BAD_REQUEST);
    }

    return sendSuccess(res, null, 'Password reset successful. All active sessions have been invalidated.');
  };

  /**
   * POST /api/v1/auth/logout
   */
  public logout = (req: AuthRequest, res: Response): any => {
    if (req.sessionId) {
      authService.revokeSession(req.sessionId);
    }
    return sendSuccess(res, null, 'Logged out successfully');
  };
}

export const authController = new AuthController();
export default authController;
