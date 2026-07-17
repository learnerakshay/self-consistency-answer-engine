import { GoogleGenAI } from '@google/genai';
import { config } from '../config/config';
import { ModelResponse } from '../utils/types';

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    if (!config.geminiApiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not defined.');
    }
    geminiClient = new GoogleGenAI({
      apiKey: config.geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

/**
 * Queries Gemini using the official @google/genai client.
 */
export async function queryGemini(prompt: string): Promise<ModelResponse> {
  const startTime = Date.now();
  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: config.geminiModel,
      contents: prompt,
    });

    const responseTimeMs = Date.now() - startTime;
    const text = response.text || '';
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

    return {
      text,
      status: 'success',
      responseTimeMs,
      wordCount,
    };
  } catch (error: unknown) {
    const responseTimeMs = Date.now() - startTime;
    console.error('Error in geminiService:', error);

    let errorMsg = 'Unknown error querying Gemini';
    if (error && typeof error === 'object') {
      const err = error as { status?: unknown; message?: unknown };
      const message = typeof err.message === 'string' ? err.message : String(error);
      if (
        message.includes('API_KEY_INVALID') ||
        message.includes('API key not valid') ||
        err.status === 400 ||
        err.status === 401
      ) {
        errorMsg = 'Unauthorized: Invalid Gemini API Key. Please verify your GEMINI_API_KEY in secrets.';
      } else if (message.includes('RESOURCE_EXHAUSTED') || err.status === 429) {
        errorMsg = 'Rate Limit Exceeded: Your Gemini API key has hit its quota or rate limits.';
      } else if (message.includes('MODEL_NOT_FOUND') || err.status === 404) {
        errorMsg = `Model Unavailable: The requested Gemini model (${config.geminiModel}) was not found or is unavailable.`;
      } else {
        errorMsg = message;
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
