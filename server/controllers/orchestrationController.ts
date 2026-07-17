import { Request, Response } from 'express';
import { orchestratePrompt } from '../orchestrator/orchestrator';

/**
 * Handles incoming orchestration requests.
 */
export async function handleOrchestration(req: Request, res: Response): Promise<void> {
  try {
    const { prompt } = req.body;
    
    const result = await orchestratePrompt(prompt);
    
    res.json(result);
  } catch (error: unknown) {
    console.error('Unhandled controller error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    res.status(500).json({
      error: 'An unexpected internal error occurred within the AI orchestration pipeline.',
      details: errorMessage,
    });
  }
}
