"use client";

import React from "react";
import { Play, Square, RotateCcw, CheckCircle2 } from "lucide-react";
import { StageState, STAGES } from "@/lib/types";

interface ControllerPanelProps {
  prompt: string;
  setPrompt: (p: string) => void;
  stages: StageState[];
  isGenerating: boolean;
  activeStageIndex: number;
  onStartGeneration: () => void;
  onStopGeneration: () => void;
  onReset: () => void;
  onSelectStageTab: (stageIndex: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const ControllerPanel: React.FC<ControllerPanelProps> = ({
  prompt,
  setPrompt,
  stages,
  isGenerating,
  activeStageIndex,
  onStartGeneration,
  onStopGeneration,
  onReset,
  onSelectStageTab
}) => {
  return (
    <div className="h-full flex flex-col bg-slate-50 border-r border-slate-200 p-4 space-y-4 overflow-y-auto">
      {/* 1. Realtime Prompt Console */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
          Enter Your Project Requirements
        </label>
        <textarea
          data-testid="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type or paste your application idea, features, target users, and requirements here..."
          rows={9}
          className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 leading-relaxed resize-y font-sans transition-all"
        />
      </div>

      {/* 2. Generation Action Controls */}
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
          className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors disabled:opacity-40"
          title="Reset Prompt and Specifications"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* 3. Realtime SDLC Stages */}
      <div className="space-y-1.5 pt-2 border-t border-slate-200 flex-1">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wide block mb-2">
          SDLC Lifecycle Stages
        </label>

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
                    ? "border-slate-200 bg-white hover:border-emerald-300 text-slate-800"
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
      </div>
    </div>
  );
};
