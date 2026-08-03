import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { sendSuccess, sendError } from '../../utils/response';
import { authenticate, AuthRequest } from '../../middleware';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'discipline-os-super-secret-jwt-key-2026';

// POST /api/v1/auth/register
router.post('/register', (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return sendError(res, 'Email, password, and name are required', 400);
  }

  const userId = `usr-${Date.now()}`;
  const token = jwt.sign({ userId, role: 'USER' }, JWT_SECRET, { expiresIn: '7d' });
  const refreshToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });

  return sendSuccess(res, {
    user: { id: userId, email, name, role: 'USER' },
    accessToken: token,
    refreshToken,
  }, 'User registered successfully', 201);
});

// POST /api/v1/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return sendError(res, 'Email and password required', 400);
  }

  const userId = 'usr-demo-1';
  const token = jwt.sign({ userId, role: 'USER' }, JWT_SECRET, { expiresIn: '7d' });
  const refreshToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });

  return sendSuccess(res, {
    user: { id: userId, email: email || 'adarsh@disciplineos.app', name: 'Adarsh', role: 'USER' },
    accessToken: token,
    refreshToken,
  }, 'Login successful');
});

// GET /api/v1/auth/me
router.get('/me', authenticate, (req: AuthRequest, res) => {
  return sendSuccess(res, {
    user: {
      id: req.userId || 'usr-demo-1',
      email: 'adarsh@disciplineos.app',
      name: 'Adarsh',
      role: req.userRole || 'USER',
    },
  }, 'User profile retrieved');
});

// POST /api/v1/auth/refresh
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return sendError(res, 'Refresh token required', 400);

  try {
    const payload = jwt.verify(refreshToken, JWT_SECRET) as { userId: string };
    const newToken = jwt.sign({ userId: payload.userId, role: 'USER' }, JWT_SECRET, { expiresIn: '7d' });
    return sendSuccess(res, { accessToken: newToken }, 'Token refreshed');
  } catch (err) {
    return sendError(res, 'Invalid refresh token', 401);
  }
});

// POST /api/v1/auth/logout
router.post('/logout', authenticate, (_req, res) => {
  return sendSuccess(res, null, 'Logged out successfully');
});

export default router;
