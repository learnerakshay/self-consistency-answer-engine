import React, { useState } from 'react';
import axios from 'axios';
import PromptForm from './components/PromptForm';
import LoadingState from './components/LoadingState';
import MetadataPanel from './components/MetadataPanel';
import ResponseCard from './components/ResponseCard';
import EvaluationSummary from './components/EvaluationSummary';
import { orchestrate } from './services/api';
import { OrchestrationResponse } from './types';
import { AlertCircle, Network } from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<OrchestrationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await orchestrate(prompt);
      setResult(data);
    } catch (err: unknown) {
      console.error('Frontend execution error:', err);
      let apiError = 'Failed to connect to the orchestration server.';
      if (axios.isAxiosError(err)) {
        const errorData = err.response?.data as { error?: string } | undefined;
        apiError = errorData?.error || err.message || apiError;
      } else if (err instanceof Error) {
        apiError = err.message;
      }
      setError(apiError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800" id="app-root">
      {/* Main Container - Compact and Balanced Spacing */}
      <main className="flex-1 w-full max-w-4xl mx-auto py-6 px-4 sm:px-6 space-y-4">
        
        {/* Compact Modern Hero Section */}
        <div className="space-y-1 pb-1" id="hero-section">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow-sm">
              <Network className="w-5 h-5 animate-[spin_8s_linear_infinite]" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Self Consistency Answer Engine
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Compare multiple AI models and synthesize the most reliable answer.
          </p>
        </div>

        {/* Prompt Input Form */}
        <PromptForm onSubmit={handleGenerate} isLoading={isLoading} />

        {/* Loading Visualizer (Simple steps checklist with spinner) */}
        <LoadingState isLoading={isLoading} />

        {/* Metadata Panel - Displayed directly below the prompt when loaded */}
        {result && !isLoading && (
          <div className="animate-fade-in" id="metadata-container">
            <MetadataPanel metadata={result.metadata} />
          </div>
        )}

        {/* API Error Callouts */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-red-800 shadow-sm animate-fade-in" id="error-callout">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-sm">Orchestration Failure</h4>
              <p className="text-xs text-red-700 mt-1 leading-relaxed">{error}</p>
              <p className="text-[11px] text-red-600 mt-2 font-mono">
                Suggestions: Make sure your GEMINI_API_KEY and OPENAI_API_KEY secrets are correctly set up in the Settings.
              </p>
            </div>
          </div>
        )}

        {/* Orchestrated Output Display */}
        {result && !isLoading && (
          <div className="space-y-4 animate-fade-in" id="output-pipeline">
            
            {/* 1. Final Synthesized Answer (Visual focal point, larger, indigo border/bg) */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block px-1">
                Primary Result
              </span>
              <ResponseCard
                modelName="Synthesized Consolidation (Evaluator)"
                response={result.synthesizedAnswer}
                isProminent={true}
                provider="evaluator"
              />
            </div>

            {/* 2. Evaluation Summary (Below synthesized answer) */}
            <EvaluationSummary
              bullets={result.evaluationSummary}
              confidence={result.confidence}
            />

            {/* 3. Original LLM Responses (Clean comparison cards) */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-1">
                Source Responses
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResponseCard
                  modelName="OpenAI Response"
                  response={result.openai.text}
                  status={result.openai.status}
                  error={result.openai.error}
                  provider="openai"
                />
                
                <ResponseCard
                  modelName="Gemini Response"
                  response={result.gemini.text}
                  status={result.gemini.status}
                  error={result.gemini.error}
                  provider="gemini"
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Sleek Minimal Footer */}
      <footer className="border-t border-slate-200/60 bg-white py-4 mt-8 text-center text-[11px] text-slate-400 font-sans">
        <p>© 2026 Self Consistency Answer Engine • Built on robust full-stack AI orchestration guidelines</p>
      </footer>
    </div>
  );
}
