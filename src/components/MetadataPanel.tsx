import React from 'react';
import { Clock, CheckCircle2, AlertTriangle, HelpCircle, Layers, Cpu, Zap, Activity } from 'lucide-react';
import { PipelineMetadata } from '../types';

interface MetadataPanelProps {
  metadata: PipelineMetadata;
}

export default function MetadataPanel({ metadata }: MetadataPanelProps) {
  const getStatusBadge = (status: 'success' | 'failed' | 'skipped') => {
    switch (status) {
      case 'success':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold font-mono text-green-600">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> SUCCESS
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold font-mono text-red-600">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full text-xs"></span> FAILED
          </span>
        );
      case 'skipped':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold font-mono text-amber-600">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> SKIPPED
          </span>
        );
    }
  };

  const getConfidenceBadge = (confidence: 'High' | 'Medium' | 'Low' | 'N/A') => {
    switch (confidence) {
      case 'High':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-green-50 text-green-700 border border-green-200">
            HIGH
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-indigo-50 text-indigo-700 border border-indigo-200">
            MEDIUM
          </span>
        );
      case 'Low':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-red-50 text-red-700 border border-red-200">
            LOW
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-slate-100 text-slate-600 border border-slate-200">
            N/A
          </span>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="metadata-panel">
      {/* OpenAI Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-indigo-500" />
            OpenAI
          </span>
          {getStatusBadge(metadata.openai.status)}
        </div>
        <div className="space-y-1.5 text-xs font-sans">
          <div className="flex justify-between text-slate-500">
            <span>Response Time</span>
            <span className="font-mono font-semibold text-slate-800">
              {metadata.openai.status === 'success' ? `${(metadata.openai.responseTimeMs / 1000).toFixed(2)}s` : '--'}
            </span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Word Count</span>
            <span className="font-mono font-semibold text-slate-800">
              {metadata.openai.status === 'success' ? `${metadata.openai.wordCount} words` : '--'}
            </span>
          </div>
        </div>
      </div>

      {/* Gemini Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-500" />
            Gemini
          </span>
          {getStatusBadge(metadata.gemini.status)}
        </div>
        <div className="space-y-1.5 text-xs font-sans">
          <div className="flex justify-between text-slate-500">
            <span>Response Time</span>
            <span className="font-mono font-semibold text-slate-800">
              {metadata.gemini.status === 'success' ? `${(metadata.gemini.responseTimeMs / 1000).toFixed(2)}s` : '--'}
            </span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Word Count</span>
            <span className="font-mono font-semibold text-slate-800">
              {metadata.gemini.status === 'success' ? `${metadata.gemini.wordCount} words` : '--'}
            </span>
          </div>
        </div>
      </div>

      {/* Evaluator Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-500" />
            Evaluator
          </span>
          {getStatusBadge(metadata.evaluator.status)}
        </div>
        <div className="space-y-1.5 text-xs font-sans">
          <div className="flex justify-between text-slate-500">
            <span>Status</span>
            <span className={`font-semibold uppercase text-[11px] font-mono ${metadata.evaluator.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {metadata.evaluator.status === 'success' ? 'Completed' : 'Failed'}
            </span>
          </div>
          <div className="flex justify-between text-slate-500 items-center">
            <span>Confidence</span>
            {getConfidenceBadge(metadata.evaluator.confidence)}
          </div>
        </div>
      </div>

      {/* Pipeline Card */}
      <div className="bg-indigo-50/20 border border-indigo-100 rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-1">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-indigo-50/40 pb-2">
          <Clock className="w-3.5 h-3.5 text-indigo-500" />
          <span>Pipeline</span>
        </div>
        <div className="py-1">
          <div className="text-[10px] text-slate-400 font-bold uppercase">Total Time</div>
          <div className="font-mono text-2xl font-extrabold text-indigo-600 tracking-tight">
            {(metadata.totalPipelineTimeMs / 1000).toFixed(2)}<span className="text-sm font-semibold text-indigo-400 ml-0.5">s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
