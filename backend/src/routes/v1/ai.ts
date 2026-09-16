import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticate } from '../../middleware';
import { aiController } from '../../controllers/ai/aiController';

const router = Router();

// Rate limiter for chat endpoint (30 requests per minute per IP)
const aiChatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { success: false, message: 'Too many AI requests. Please wait a moment before asking again.' },
});

// AI Chat Turn
router.post('/chat', authenticate, aiChatLimiter, aiController.chat.bind(aiController));

// Conversations Management
router.get('/conversations', authenticate, aiController.getConversations.bind(aiController));
router.post('/conversations', authenticate, aiController.createConversation.bind(aiController));
router.get('/conversations/:id/messages', authenticate, aiController.getMessages.bind(aiController));
router.delete('/conversations/:id', authenticate, aiController.deleteConversation.bind(aiController));

// Telemetry Briefing & Reports
router.get('/briefing', authenticate, aiController.getBriefing.bind(aiController));
router.post('/reports', authenticate, aiController.generateReport.bind(aiController));

export default router;
