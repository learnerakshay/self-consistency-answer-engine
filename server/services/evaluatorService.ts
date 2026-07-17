import { GoogleGenAI, Type } from '@google/genai';
import OpenAI from 'openai';
import { config } from '../config/config';
import { EvaluationResult } from '../utils/types';

let geminiClient: GoogleGenAI | null = null;
let openaiClient: OpenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && config.geminiApiKey) {
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

function getOpenAIClient(): OpenAI | null {
  if (!openaiClient && config.openaiApiKey) {
    openaiClient = new OpenAI({
      apiKey: config.openaiApiKey,
    });
  }
  return openaiClient;
}

/**
 * Synthesizes the responses from OpenAI and Gemini using the Evaluator LLM.
 * Strictly avoids choosing one over the other; synthesizes a new answer.
 */
export async function evaluateAndSynthesize(
  originalPrompt: string,
  openaiText: string,
  geminiText: string
): Promise<EvaluationResult> {
  // Construct the orchestration/evaluator instruction
  const systemInstruction = `You are a Senior AI Synthesis & Verification Engine. Your goal is to run a Self-Consistency evaluation over multiple independent LLM responses and construct a single, comprehensive, highly-accurate, and self-consistent final response.

CRITICAL RULES:
1. Do NOT simply copy-paste or select one model's answer over the other.
2. Carefully cross-reference both responses for factual correctness, completeness, clarity, and depth.
3. Synthesize a BRAND NEW response that merges the technical depth, clarity, examples, and nuances of both inputs while removing duplication, passive preamble, fluff, and errors.
4. Provide a list of 3 to 4 clear, action-oriented evaluation summary bullets explaining the merge decisions (e.g., "OpenAI contributed architectural depth.", "Gemini added concrete code examples.", "Redundancies and introductory filler were stripped.").
5. Assess a confidence level ('High', 'Medium', or 'Low') based on how consistent and reliable the sources are.`;

  const promptContent = `
Original User Prompt:
"${originalPrompt}"

Input Response A (OpenAI):
"${openaiText || '(No response returned / Failed)'}"

Input Response B (Gemini):
"${geminiText || '(No response returned / Failed)'}"

Analyze both responses, execute self-consistency filtering, and output your structured analysis in JSON format matching the schema rules.
`;

  // Prefer Gemini as the evaluator
  const gemini = getGeminiClient();
  if (gemini) {
    try {
      const response = await gemini.models.generateContent({
        model: config.geminiModel,
        contents: promptContent,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              synthesizedAnswer: {
                type: Type.STRING,
                description: 'The complete newly synthesized comprehensive self-consistent response.',
              },
              summaryBullets: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '3-4 summary bullets detailing the synthesis decisions and contributions.',
              },
              confidence: {
                type: Type.STRING,
                enum: ['High', 'Medium', 'Low'],
                description: 'The engine confidence score on the synthesized outcome.',
              },
            },
            required: ['synthesizedAnswer', 'summaryBullets', 'confidence'],
          },
        },
      });

      const text = response.text || '';
      try {
        const parsedResult: EvaluationResult = JSON.parse(text);
        return parsedResult;
      } catch (parseError) {
        console.error('Failed to parse Gemini evaluator response as JSON:', parseError);
        throw parseError;
      }
    } catch (error) {
      console.error('Gemini evaluator failed, trying OpenAI fallback:', error);
    }
  }

  // Fallback to OpenAI as the evaluator
  const openai = getOpenAIClient();
  if (openai) {
    try {
      const response = await openai.chat.completions.create({
        model: config.openaiModel,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: promptContent },
        ],
        response_format: { type: 'json_object' },
      });

      const text = response.choices[0]?.message?.content || '';
      try {
        const parsed = JSON.parse(text);
        return {
          synthesizedAnswer: parsed.synthesizedAnswer || parsed.synthesized_answer || '',
          summaryBullets: parsed.summaryBullets || parsed.summary_bullets || [],
          confidence: parsed.confidence || 'Medium',
        };
      } catch (parseError) {
        console.error('Failed to parse OpenAI evaluator response as JSON:', parseError);
        throw parseError;
      }
    } catch (error) {
      console.error('OpenAI evaluator fallback failed:', error);
    }
  }

  // Double fallback if all evaluation attempts fail
  const fallbackAnswer = `The self-consistency evaluation engine could not automatically synthesize a unified answer. To ensure you receive a complete response, both models' answers are presented below for comparative analysis.

---

### OpenAI Response
${openaiText || '*No response or failed to query.*'}

---

### Gemini Response
${geminiText || '*No response or failed to query.*'}`;

  return {
    synthesizedAnswer: fallbackAnswer,
    summaryBullets: [
      'The multi-model synthesis engine experienced an unexpected disruption.',
      'A secure, comparative fallback presentation was automatically activated.',
      'Review both model perspectives above to determine the optimal consistent solution.'
    ],
    confidence: 'Low',
  };
}
