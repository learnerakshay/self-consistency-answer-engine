import React from 'react';
import { ClipboardCheck, Sparkles, Check } from 'lucide-react';

interface EvaluationSummaryProps {
  bullets: string[];
  confidence: 'High' | 'Medium' | 'Low' | 'N/A';
}

export default function EvaluationSummary({ bullets, confidence }: EvaluationSummaryProps) {
  const getConfidenceColor = (conf: 'High' | 'Medium' | 'Low' | 'N/A') => {
    switch (conf) {
      case 'High':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Medium':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Low':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm" id="evaluation-summary-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 mb-3 gap-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <ClipboardCheck className="w-4 h-4 text-slate-400" />
          Evaluation Summary
        </h3>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <span>Confidence Score:</span>
          <span className={`px-2 py-0.5 text-[11px] font-bold rounded border ${getConfidenceColor(confidence)}`}>
            {confidence.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="space-y-2.5">
        {bullets && bullets.length > 0 ? (
          bullets.map((bullet, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed font-sans">
              <span className="w-5 h-5 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-indigo-500" />
              </span>
              <span className="pt-0.5">{bullet}</span>
            </div>
          ))
        ) : (
          <div className="flex items-start gap-2 text-xs text-slate-400 italic py-1">
            <span>No automated evaluation details returned by the service.</span>
          </div>
        )}
      </div>
    </div>
  );
}
