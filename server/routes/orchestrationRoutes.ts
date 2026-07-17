import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { handleOrchestration } from '../controllers/orchestrationController';
import { validatePrompt } from '../middleware/validation';

const router = Router();

// Configure rate limiter to prevent abuse and manage costs
const orchestrateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Rate limit exceeded. You have made too many requests to the synthesis engine. Please try again in 15 minutes.',
  },
});

// Endpoint for processing user prompt with self-consistency AI orchestration
router.post('/orchestrate', orchestrateLimiter, validatePrompt, handleOrchestration);

export default router;
