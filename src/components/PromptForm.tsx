import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface PromptFormProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

const PRESETS = [
  {
    label: 'Reasoning Puzzle (Math)',
    prompt: 'Compare the numbers 9.11 and 9.9. Which one is larger and why?',
  },
  {
    label: 'Spelling Trick',
    prompt: 'How many letters "r" are in the word "Raspberry"? Break down the letters step-by-step.',
  },
  {
    label: 'Technical Trade-offs',
    prompt: 'Should a growing startup select a monolithic backend or microservices? Synthesize key pros/cons for both.',
  },
];

export default function PromptForm({ onSubmit, isLoading }: PromptFormProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || prompt.length > 5000 || isLoading) return;
    onSubmit(prompt);
  };

  const handlePresetClick = (presetText: string) => {
    if (isLoading) return;
    setPrompt(presetText);
  };

  return (
    <div className="bg-white border-2 border-slate-200/70 rounded-xl p-6 shadow-sm" id="prompt-form-container">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col space-y-1">
          <label htmlFor="prompt-input" className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-sans">
            Prompt Input
          </label>
          <textarea
            id="prompt-input"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
            maxLength={5000}
            placeholder="Type your prompt here... (e.g. Try a logical comparison or coding trade-off question to evaluate consistency)"
            className="w-full rounded-lg bg-slate-50 border border-slate-200 p-4 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 disabled:bg-slate-100 disabled:cursor-not-allowed transition-all duration-150"
          />
          <div className="text-right">
            <span className={`text-[11px] font-mono ${prompt.length > 5000 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
              {prompt.length} / 5000
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mr-1">
              Suggestions:
            </span>
            {PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetClick(preset.prompt)}
                disabled={isLoading}
                className="text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition duration-150 border border-slate-200 disabled:opacity-50 cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Action Trigger */}
          <button
            id="generate-button"
            type="submit"
            disabled={!prompt.trim() || prompt.length > 5000 || isLoading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 active:bg-indigo-800 transition-colors disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer shadow-sm min-w-[120px] h-11"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>GENERATE</span>
          </button>
        </div>
      </form>
    </div>
  );
}
