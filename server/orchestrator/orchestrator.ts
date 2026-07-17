import { queryGemini } from '../services/geminiService';
import { queryOpenAI } from '../services/openaiService';
import { evaluateAndSynthesize } from '../services/evaluatorService';
import { OrchestrationResponse, ModelResponse, PipelineMetadata } from '../utils/types';
import { checkKeys } from '../config/config';
import { createSkippedResponse } from '../utils/modelResponseFactory';

/**
 * Executes the complete AI orchestration flow.
 * Queries OpenAI and Gemini in parallel, normalizes response times/word counts,
 * runs the Evaluator synthesis engine, and packages all telemetry metadata.
 */
export async function orchestratePrompt(prompt: string): Promise<OrchestrationResponse> {
  const pipelineStart = Date.now();
  const keys = checkKeys();

  // Launch independent model queries simultaneously using Promise.allSettled
  const geminiPromise = keys.hasGemini
    ? queryGemini(prompt)
    : Promise.resolve(createSkippedResponse('Gemini'));

  const openaiPromise = keys.hasOpenAI
    ? queryOpenAI(prompt)
    : Promise.resolve(createSkippedResponse('OpenAI'));

  // Parallel collection
  const results = await Promise.allSettled([geminiPromise, openaiPromise]);

  // Convert settled results back into normal ModelResponse objects
  const geminiRes = results[0].status === 'fulfilled'
    ? results[0].value
    : {
        text: '',
        status: 'failed' as const,
        responseTimeMs: 0,
        wordCount: 0,
        error: results[0].reason instanceof Error ? results[0].reason.message : String(results[0].reason),
      };

  const openaiRes = results[1].status === 'fulfilled'
    ? results[1].value
    : {
        text: '',
        status: 'failed' as const,
        responseTimeMs: 0,
        wordCount: 0,
        error: results[1].reason instanceof Error ? results[1].reason.message : String(results[1].reason),
      };

  // Handle absolute failure scenario: both primary models failed or were skipped
  const isGeminiAvailable = geminiRes.status === 'success';
  const isOpenAIAvailable = openaiRes.status === 'success';

  if (!isGeminiAvailable && !isOpenAIAvailable) {
    const totalPipelineTimeMs = Date.now() - pipelineStart;
    return {
      originalPrompt: prompt,
      openai: openaiRes,
      gemini: geminiRes,
      synthesizedAnswer: 'Pipeline Error: Both OpenAI and Gemini models failed to respond. Please verify your backend API keys in settings.',
      evaluationSummary: [
        'OpenAI model call failed or was skipped.',
        'Gemini model call failed or was skipped.',
        'Synthesis aborted due to a lack of valid source answers.',
      ],
      confidence: 'Low',
      metadata: {
        openai: {
          status: keys.hasOpenAI ? 'failed' : 'skipped',
          responseTimeMs: openaiRes.responseTimeMs,
          wordCount: 0,
        },
        gemini: {
          status: keys.hasGemini ? 'failed' : 'skipped',
          responseTimeMs: geminiRes.responseTimeMs,
          wordCount: 0,
        },
        evaluator: {
          status: 'failed',
          confidence: 'N/A',
        },
        totalPipelineTimeMs,
      },
    };
  }

  // Pass available text to Evaluator for self-consistency synthesis
  // Wrap evaluateAndSynthesize inside try...catch
  let evalResult;
  let evaluatorStatus: 'success' | 'failed' = 'success';
  let confidence: 'High' | 'Medium' | 'Low' | 'N/A' = 'Low';
  let synthesizedAnswer = '';
  let evaluationSummary: string[] = [];

  try {
    evalResult = await evaluateAndSynthesize(prompt, openaiRes.text, geminiRes.text);
    confidence = evalResult.confidence;
    synthesizedAnswer = evalResult.synthesizedAnswer;
    evaluationSummary = evalResult.summaryBullets;
  } catch (error: unknown) {
    console.error('Evaluator failed during orchestration:', error);
    evaluatorStatus = 'failed';
    confidence = 'N/A';
    synthesizedAnswer = 'Evaluator failed to generate a synthesized response.';
    evaluationSummary = [
      'The multi-model synthesis evaluator failed to run successfully.',
      error instanceof Error ? error.message : 'An unknown error occurred during evaluation.',
      'Raw model responses are displayed side-by-side above for fallback reference.',
    ];
  }

  const totalPipelineTimeMs = Date.now() - pipelineStart;

  // Build robust consistent metadata envelope
  const metadata: PipelineMetadata = {
    openai: {
      status: keys.hasOpenAI ? openaiRes.status : 'skipped',
      responseTimeMs: openaiRes.responseTimeMs,
      wordCount: openaiRes.wordCount,
    },
    gemini: {
      status: keys.hasGemini ? geminiRes.status : 'skipped',
      responseTimeMs: geminiRes.responseTimeMs,
      wordCount: geminiRes.wordCount,
    },
    evaluator: {
      status: evaluatorStatus,
      confidence,
    },
    totalPipelineTimeMs,
  };

  return {
    originalPrompt: prompt,
    openai: openaiRes,
    gemini: geminiRes,
    synthesizedAnswer,
    evaluationSummary,
    confidence,
    metadata,
  };
}
