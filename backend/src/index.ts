import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { initDB } from './db';
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';
import analyticsRoutes from './routes/analytics';
import reflectionRoutes from './routes/reflections';
import settingsRoutes from './routes/settings';
import { errorHandler } from './middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10kb' }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: { error: 'Too many requests' } });
app.use('/api', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reflections', reflectionRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/api/health', (_, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));
app.use(errorHandler);

initDB();
app.listen(PORT, () => {
  console.log(`\n🧠 DisciplineOS Backend running on http://localhost:${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}/api/health\n`);
});

export default app;
