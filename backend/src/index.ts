import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { initDB } from './db';

// Legacy routes
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';
import analyticsRoutes from './routes/analytics';
import reflectionRoutes from './routes/reflections';
import settingsRoutes from './routes/settings';

// API v1 Routers (SPR-304 API Foundation)
import v1AuthRoutes from './routes/v1/auth';
import v1HealthRoutes from './routes/v1/health';
import v1DisciplineRoutes from './routes/v1/discipline';
import v1BodyRoutes from './routes/v1/body';
import v1MindRoutes from './routes/v1/mind';
import v1NutritionRoutes from './routes/v1/nutrition';
import v1GoalsRoutes from './routes/v1/goals';
import v1PerformanceRoutes from './routes/v1/performance';
import v1EventsRoutes from './routes/v1/events';
import v1AIRoutes from './routes/v1/ai';
import v1NotificationRoutes from './routes/v1/notifications';

import { requestLogger } from './middleware/requestLogger';
import { globalErrorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50kb' }));
app.use(requestLogger);

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300, message: { success: false, message: 'Rate limit exceeded' } });
app.use('/api', limiter);

// Mount API v1 Routes
app.use('/api/v1/health', v1HealthRoutes);
app.use('/api/v1/auth', v1AuthRoutes);
app.use('/api/v1/discipline', v1DisciplineRoutes);
app.use('/api/v1/body', v1BodyRoutes);
app.use('/api/v1/mind', v1MindRoutes);
app.use('/api/v1/nutrition', v1NutritionRoutes);
app.use('/api/v1/goals', v1GoalsRoutes);
app.use('/api/v1/performance', v1PerformanceRoutes);
app.use('/api/v1/events', v1EventsRoutes);
app.use('/api/v1/ai', v1AIRoutes);
app.use('/api/v1/notifications', v1NotificationRoutes);

// Legacy routes for backward compatibility
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reflections', reflectionRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/health', v1HealthRoutes);

// Global Error Handler
app.use(globalErrorHandler);

initDB();
app.listen(PORT, () => {
  console.log(`\n🧠 DisciplineOS System Architecture Backend running on http://localhost:${PORT}`);
  console.log(`📊 API Health: http://localhost:${PORT}/api/v1/health`);
  console.log(`🚀 API v1 Base: http://localhost:${PORT}/api/v1/\n`);
});

export default app;
