import { ModelResponse } from './types';

/**
 * Creates a standard ModelResponse representation for skipped/unconfigured models.
 */
export function createSkippedResponse(modelName: string): ModelResponse {
  return {
    text: '',
    status: 'failed',
    responseTimeMs: 0,
    wordCount: 0,
    error: `Skipped: API key for ${modelName} is not configured in secrets.`,
  };
}
