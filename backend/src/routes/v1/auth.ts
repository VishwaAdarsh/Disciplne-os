import { Router } from 'express';
import { authController } from '../../controllers/auth/authController';
import { authenticate } from '../../middleware';

const router = Router();

// POST /api/v1/auth/register
router.post('/register', authController.register);

// POST /api/v1/auth/login
router.post('/login', authController.login);

// POST /api/v1/auth/refresh
router.post('/refresh', authController.refresh);

// GET /api/v1/auth/me
router.get('/me', authenticate, authController.me);

// POST /api/v1/auth/verify-email
router.post('/verify-email', authController.verifyEmail);

// POST /api/v1/auth/forgot-password
router.post('/forgot-password', authController.forgotPassword);

// POST /api/v1/auth/reset-password
router.post('/reset-password', authController.resetPassword);

// POST /api/v1/auth/logout
router.post('/logout', authenticate, authController.logout);

export default router;
