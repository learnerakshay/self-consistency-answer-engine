import OpenAI from 'openai';
import { config } from '../config/config';
import { ModelResponse } from '../utils/types';

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    if (!config.openaiApiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not defined.');
    }
    openaiClient = new OpenAI({
      apiKey: config.openaiApiKey,
    });
  }
  return openaiClient;
}

/**
 * Queries OpenAI using the official OpenAI Node library.
 */
export async function queryOpenAI(prompt: string): Promise<ModelResponse> {
  const startTime = Date.now();
  try {
    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: config.openaiModel, // Lightweight, fast, and cost-effective production model
      messages: [{ role: 'user', content: prompt }],
    });

    const responseTimeMs = Date.now() - startTime;
    const text = response.choices[0]?.message?.content || '';
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

    return {
      text,
      status: 'success',
      responseTimeMs,
      wordCount,
    };
  } catch (error: unknown) {
    const responseTimeMs = Date.now() - startTime;
    console.error('Error in openaiService:', error);
    
    let errorMsg = 'Unknown error querying OpenAI';
    if (error && typeof error === 'object') {
      const err = error as { status?: unknown; code?: unknown; message?: unknown };
      if (err.status === 401 || err.code === 'invalid_api_key') {
        errorMsg = 'Unauthorized: Invalid OpenAI API Key. Please verify your OPENAI_API_KEY in secrets/environment variables.';
      } else if (err.status === 429 || err.code === 'insufficient_quota') {
        errorMsg = 'Rate Limit Exceeded / Quota Exhausted: Your OpenAI API key has run out of credits or has been rate limited.';
      } else if (err.status === 404) {
        errorMsg = `Model Unavailable: The requested OpenAI model (${config.openaiModel}) is currently unavailable or doesn't exist.`;
      } else {
        errorMsg = typeof err.message === 'string' ? err.message : (typeof err.code === 'string' ? err.code : String(error));
      }
    }

    return {
      text: '',
      status: 'failed',
      responseTimeMs,
      wordCount: 0,
      error: errorMsg,
    };
  }
}
