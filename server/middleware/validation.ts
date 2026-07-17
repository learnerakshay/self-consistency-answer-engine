import { Request, Response, NextFunction } from 'express';
import { config } from '../config/config';

/**
 * Validates the prompt input from the user.
 */
export function validatePrompt(req: Request, res: Response, next: NextFunction): void {
  const { prompt } = req.body;

  if (typeof prompt !== 'string') {
    res.status(400).json({
      error: 'Invalid input. The field "prompt" must be a string.',
    });
    return;
  }

  const trimmedPrompt = prompt.trim();

  if (!trimmedPrompt) {
    res.status(400).json({
      error: 'The prompt cannot be empty. Please enter a valid question or instructions.',
    });
    return;
  }

  if (trimmedPrompt.length > config.maxPromptLength) {
    res.status(400).json({
      error: `The prompt exceeds the maximum allowed length of ${config.maxPromptLength} characters (current length: ${trimmedPrompt.length} characters).`,
    });
    return;
  }

  // Replace prompt with trimmed version to clean downstream requests
  req.body.prompt = trimmedPrompt;
  next();
}
