"use client";

import React, { useState } from "react";
import { Play, Square, RotateCcw, CheckCircle2, Download, Layers, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { StageState, STAGES, TechStackPreferences } from "@/lib/types";
import { STACK_PRESETS } from "@/lib/stack-detector";

interface ControllerPanelProps {
  prompt: string;
  setPrompt: (p: string) => void;
  techStack: TechStackPreferences;
  setTechStack: React.Dispatch<React.SetStateAction<TechStackPreferences>>;
  stages: StageState[];
  isGenerating: boolean;
  activeStageIndex: number;
  onStartGeneration: () => void;
  onStopGeneration: () => void;
  onReset: () => void;
  onSelectStageTab: (stageIndex: number) => void;
  onQuickDownloadZip?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const ControllerPanel: React.FC<ControllerPanelProps> = ({
  prompt,
  setPrompt,
  techStack,
  setTechStack,
  stages,
  isGenerating,
  activeStageIndex,
  onStartGeneration,
  onStopGeneration,
  onReset,
  onSelectStageTab,
  onQuickDownloadZip
}) => {
  const [isStackExpanded, setIsStackExpanded] = useState(false);
  const hasCompletedAny = stages.some((s) => s.status === "completed" || (s.content && s.content.trim().length > 0));

  const handleApplyPreset = (presetStack: TechStackPreferences) => {
    setTechStack(presetStack);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 border-r border-slate-200 p-4 space-y-3.5 overflow-y-auto">
      {/* 1. Realtime Prompt Console */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            Project Description
          </label>
          <span className="text-[10px] text-slate-400">Natural Language Prompt</span>
        </div>
        <textarea
          data-testid="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your application idea, features, target users, hardware or business logic..."
          rows={7}
          className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 leading-relaxed resize-y font-sans transition-all shadow-sm"
        />
      </div>

      {/* 2. Interactive Tech Stack Selector & Presets */}
      <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2.5 shadow-sm">
        <div
          onClick={() => setIsStackExpanded(!isStackExpanded)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Architecture & Stack
            </span>
          </div>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-700 transition-colors"
          >
            {isStackExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {/* Stack Preset Pills */}
        <div className="flex flex-wrap gap-1">
          {STACK_PRESETS.map((preset) => {
            const isSelected = techStack.backend === preset.stack.backend;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset.stack)}
                className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                  isSelected
                    ? "bg-emerald-50 text-emerald-900 border-emerald-500 font-bold shadow-xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                }`}
                title={preset.description}
              >
                {preset.name}
              </button>
            );
          })}
        </div>

        {/* Current Active Stack Summary */}
        <div className="text-[11px] font-mono text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 space-y-1">
          <div><span className="text-slate-400">Backend:</span> <span className="font-semibold text-slate-800">{techStack.backend.split("/")[0].trim()}</span></div>
          <div><span className="text-slate-400">Database:</span> <span className="font-semibold text-slate-800">{techStack.database.split("+")[0].trim()}</span></div>
          <div><span className="text-slate-400">Cache/Bus:</span> <span className="font-semibold text-slate-800">{techStack.caching.split("+")[0].trim()}</span></div>
        </div>

        {/* Expandable Manual Customization */}
        {isStackExpanded && (
          <div className="pt-2 border-t border-slate-100 space-y-2 text-xs animate-in fade-in duration-150">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Frontend</label>
              <input
                type="text"
                value={techStack.frontend}
                onChange={(e) => setTechStack({ ...techStack, frontend: e.target.value })}
                className="w-full px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Backend Core</label>
              <input
                type="text"
                value={techStack.backend}
                onChange={(e) => setTechStack({ ...techStack, backend: e.target.value })}
                className="w-full px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Primary Database</label>
              <input
                type="text"
                value={techStack.database}
                onChange={(e) => setTechStack({ ...techStack, database: e.target.value })}
                className="w-full px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Caching & Broker</label>
              <input
                type="text"
                value={techStack.caching}
                onChange={(e) => setTechStack({ ...techStack, caching: e.target.value })}
                className="w-full px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. Generation Action Controls */}
      <div className="flex items-center gap-2">
        {isGenerating ? (
          <button
            type="button"
            onClick={onStopGeneration}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Square className="h-3.5 w-3.5 fill-white" />
            <span>Stop Generation</span>
          </button>
        ) : (
          <button
            type="button"
            data-testid="btn-generate"
            onClick={onStartGeneration}
            disabled={!prompt.trim()}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold shadow-sm transition-all active:scale-[0.99]"
          >
            <Play className="h-3.5 w-3.5 fill-white" />
            <span>Generate Specifications</span>
          </button>
        )}

        <button
          type="button"
          onClick={onReset}
          disabled={isGenerating}
          className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors disabled:opacity-40 shadow-sm"
          title="Reset Prompt and Specifications"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* 4. Realtime SDLC Stages */}
      <div className="space-y-1.5 pt-2 border-t border-slate-200 flex-1">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
            SDLC Lifecycle Stages
          </label>
        </div>

        <div className="space-y-1.5">
          {STAGES.map((s) => {
            const stageState = stages.find((st) => st.index === s.index);
            const isCompleted = stageState?.status === "completed";
            const isCurrent = isGenerating && activeStageIndex === s.index;

            return (
              <div
                key={s.index}
                data-testid={`stage-item-${s.index}`}
                onClick={() => onSelectStageTab(s.index)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isCurrent
                    ? "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold"
                    : isCompleted
                    ? "border-slate-200 bg-white hover:border-emerald-300 text-slate-800 shadow-xs"
                    : "border-slate-200 bg-white/60 text-slate-500"
                }`}
              >
                <div>
                  <div className="font-semibold text-xs">{s.title}</div>
                  <div className="font-mono text-[10px] text-slate-400">{s.fileName}</div>
                </div>

                <div>
                  {isCurrent ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md animate-pulse">
                      Generating...
                    </span>
                  ) : isCompleted ? (
                    <div className="flex items-center gap-1 text-emerald-700 text-[10px] font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      <span>Ready</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400">Waiting</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Instant Download All Button */}
        {hasCompletedAny && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onQuickDownloadZip}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold shadow-sm transition-all active:scale-[0.99]"
            >
              <Download className="h-3.5 w-3.5 text-emerald-600" />
              <span>Download 6 Specs (.ZIP)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
