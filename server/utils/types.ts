/**
 * Contract models for the Self Consistency Answer Engine Orchestration layer.
 */

export interface ModelResponse {
  text: string;
  status: 'success' | 'failed';
  responseTimeMs: number;
  wordCount: number;
  error?: string;
}

export interface EvaluationResult {
  synthesizedAnswer: string;
  summaryBullets: string[];
  confidence: 'High' | 'Medium' | 'Low' | 'N/A';
}

export interface PipelineMetadata {
  openai: {
    status: 'success' | 'failed' | 'skipped';
    responseTimeMs: number;
    wordCount: number;
  };
  gemini: {
    status: 'success' | 'failed' | 'skipped';
    responseTimeMs: number;
    wordCount: number;
  };
  evaluator: {
    status: 'success' | 'failed';
    confidence: 'High' | 'Medium' | 'Low' | 'N/A';
  };
  totalPipelineTimeMs: number;
}

export interface OrchestrationResponse {
  originalPrompt: string;
  openai: ModelResponse;
  gemini: ModelResponse;
  synthesizedAnswer: string;
  evaluationSummary: string[];
  confidence: 'High' | 'Medium' | 'Low' | 'N/A';
  metadata: PipelineMetadata;
}
