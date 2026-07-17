import React, { useState } from 'react';
import ReactMarkdown from "react-markdown";
import { Copy, Check, ShieldCheck, Zap, Sparkles } from 'lucide-react';

interface ResponseCardProps {
  modelName: string;
  response: string;
  status?: 'success' | 'failed' | 'skipped';
  isProminent?: boolean;
  error?: string;
  provider: 'openai' | 'gemini' | 'evaluator';
}

export default function ResponseCard({
  modelName,
  response,
  status = 'success',
  isProminent = false,
  error,
  provider,
}: ResponseCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silently fail to avoid exposing console errors or polluting logs in sandboxed iframe environments
    }
  };

  const isOpenAI = provider === 'openai';
  const isGemini = provider === 'gemini';

  if (status === 'failed' || status === 'skipped') {
    return (
      <div className="bg-red-50/50 border border-red-200/50 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-red-100 pb-3 mb-3">
          <h4 className="text-xs font-bold text-red-800 uppercase tracking-wider">{modelName}</h4>
          <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
            {status === 'failed' ? 'FAILED' : 'SKIPPED'}
          </span>
        </div>
        <p className="text-xs text-red-700 font-sans leading-relaxed">
          {error || 'No response text collected. Either the API key was not configured, or the request timed out.'}
        </p>
      </div>
    );
  }

  if (isProminent) {
    return (
      <div
        className="bg-indigo-50/20 rounded-r-xl rounded-l-lg border border-slate-200/80 border-l-4 border-l-indigo-600 p-6 shadow-sm flex flex-col relative"
        id="response-card-synthesized"
      >
        <div className="flex justify-between items-start mb-4 pb-3 border-b border-indigo-100/60">
          <div>
            <h2 className="text-indigo-950 font-extrabold text-base flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-indigo-600" />
              Synthesized Answer
            </h2>
            <p className="text-[11px] text-indigo-600/70 font-medium">Consolidated output from Evaluator Service</p>
          </div>
          <div className="flex items-center gap-2">
            {response && (
              <button
                onClick={handleCopy}
                className="px-3 py-1 rounded bg-indigo-100/70 text-indigo-700 hover:bg-indigo-200/70 transition duration-150 flex items-center gap-1.5 text-xs font-semibold cursor-pointer border border-indigo-200/50"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
            <div className="hidden sm:block bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
              PRIMARY RESULT
            </div>
          </div>
        </div>

            <div className="prose prose-slate max-w-none text-slate-800">
      <ReactMarkdown>
        {response || "No response returned."}
      </ReactMarkdown>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col h-full"
      id={`response-card-${modelName.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex justify-between items-center mb-3 pb-2.5 border-b border-slate-100">
        <h3 className={`text-xs font-bold uppercase tracking-wider ${isOpenAI ? 'text-indigo-600' : isGemini ? 'text-emerald-600' : 'text-slate-500'}`}>
          {modelName}
        </h3>
        {response && (
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded transition duration-150 border border-slate-100 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        )}
      </div>

              <div className="prose prose-sm prose-slate max-w-none flex-1">
          <ReactMarkdown>
            {response || "No response returned."}
          </ReactMarkdown>
        </div>
    </div>
  );
}
