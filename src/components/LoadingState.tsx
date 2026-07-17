import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  isLoading: boolean;
}

export default function LoadingState({ isLoading }: LoadingStateProps) {
  if (!isLoading) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm max-w-xl mx-auto space-y-4" id="loading-container">
      <div className="flex items-center gap-2.5">
        <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Generating responses...</span>
      </div>
      
      <div className="w-full space-y-2 border-t border-slate-100 pt-3">
        {/* Step 1: Querying Models */}
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full border border-indigo-200 flex items-center justify-center text-[10px] animate-pulse text-indigo-500">
              ●
            </span>
            <span className="text-slate-800 font-medium">Querying OpenAI & Gemini in parallel...</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400">In Progress</span>
        </div>

        {/* Step 2: Synthesis */}
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full border border-indigo-200 flex items-center justify-center text-[10px] animate-pulse text-indigo-500">
              ●
            </span>
            <span className="text-slate-800 font-medium">Synthesizing final consistent answer...</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400">In Progress</span>
        </div>
      </div>
    </div>
  );
}
