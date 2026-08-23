"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Play,
  Square,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Layers,
  GitMerge,
  CheckSquare,
  ShieldCheck,
  Terminal,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Wand2
} from "lucide-react";
import { StageState, STAGES, TechStackPreferences } from "@/lib/types";
import { TEMPLATES, ProjectTemplate } from "@/lib/templates";

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
  onRegenerateStage: (stageIndex: number) => void;
  onSelectStageTab: (stageIndex: number) => void;
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
  onRegenerateStage,
  onSelectStageTab
}) => {
  const [showStackControls, setShowStackControls] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const getStageIcon = (name: string) => {
    switch (name) {
      case "FileText": return <FileText className="h-4 w-4" />;
      case "Layers": return <Layers className="h-4 w-4" />;
      case "GitMerge": return <GitMerge className="h-4 w-4" />;
      case "CheckSquare": return <CheckSquare className="h-4 w-4" />;
      case "ShieldCheck": return <ShieldCheck className="h-4 w-4" />;
      case "Terminal": return <Terminal className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleApplyTemplate = (tmpl: ProjectTemplate) => {
    setSelectedTemplateId(tmpl.id);
    setPrompt(tmpl.prompt);
    setTechStack(tmpl.defaultTechStack);
  };

  const handleEnhancePrompt = () => {
    if (!prompt.trim()) return;
    const enhanced = `${prompt.trim()}\n\nKey Architectural Priorities:\n- High availability (99.99% uptime) and sub-50ms latency SLAs.\n- Strict horizontal scalability and decoupled microservices boundaries.\n- Complete type safety across client, API, and database layers.\n- Zero-trust security model with end-to-end audit logging and OWASP compliance.`;
    setPrompt(enhanced);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900/60 border-r border-slate-800 overflow-y-auto">
      <div className="p-4 md:p-5 space-y-5">
        {/* Quick Starters / Templates */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>Quick-Starter Templates</span>
            </label>
            <span className="text-[10px] text-slate-500">6 Archetypes</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => handleApplyTemplate(tmpl)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedTemplateId === tmpl.id
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 font-semibold"
                    : "bg-slate-950/70 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                }`}
                title={tmpl.description}
              >
                {tmpl.name}
              </button>
            ))}
          </div>
        </div>

        {/* Requirements Prompt Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Application Prompt & Requirements
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleEnhancePrompt}
                className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                title="Expand and polish prompt with architectural guardrails"
              >
                <Wand2 className="h-3 w-3" />
                <span>Enhance</span>
              </button>
              <span className="text-[10px] text-slate-500">
                {prompt.length} chars
              </span>
            </div>
          </div>

          <textarea
            data-testid="prompt-input"
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              setSelectedTemplateId(null);
            }}
            placeholder="Describe your system requirements, target users, core business workflows, and data entities..."
            rows={5}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed resize-y font-sans transition-colors"
          />
        </div>

        {/* Architecture & Tech Stack Toggles */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowStackControls(!showStackControls)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-900/60 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Layers className="h-3.5 w-3.5 text-indigo-400" />
              <span>Architecture & Tech Stack Configuration</span>
            </div>
            {showStackControls ? <ChevronUp className="h-3.5 w-3.5 text-slate-400" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-400" />}
          </button>

          {showStackControls && (
            <div className="p-3.5 pt-1 space-y-2.5 border-t border-slate-800/80 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Frontend Tier</label>
                <input
                  type="text"
                  value={techStack.frontend}
                  onChange={(e) => setTechStack({ ...techStack, frontend: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Backend & API</label>
                <input
                  type="text"
                  value={techStack.backend}
                  onChange={(e) => setTechStack({ ...techStack, backend: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Database & Storage</label>
                <input
                  type="text"
                  value={techStack.database}
                  onChange={(e) => setTechStack({ ...techStack, database: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Architecture Style</label>
                <input
                  type="text"
                  value={techStack.architecture}
                  onChange={(e) => setTechStack({ ...techStack, architecture: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Deployment & Cloud</label>
                <input
                  type="text"
                  value={techStack.deployment}
                  onChange={(e) => setTechStack({ ...techStack, deployment: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          {isGenerating ? (
            <button
              type="button"
              onClick={onStopGeneration}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/25 transition-all"
            >
              <Square className="h-4 w-4 fill-white" />
              <span>Abort Generation</span>
            </button>
          ) : (
            <button
              type="button"
              data-testid="btn-generate"
              onClick={onStartGeneration}
              disabled={!prompt.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 disabled:opacity-40 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.99]"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>Generate Specification Suite</span>
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            disabled={isGenerating}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:border-slate-700 transition-colors disabled:opacity-40"
            title="Reset All Specifications"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        {/* 6-Stage Pipeline Progress Tracker */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              6-Stage Pipeline Tracker
            </label>
            <span className="text-[10px] text-indigo-400 font-semibold font-mono">
              {stages.filter((s) => s.status === "completed").length} / 6 Complete
            </span>
          </div>

          <div className="space-y-2">
            {STAGES.map((stageDef) => {
              const stageState = stages.find((s) => s.index === stageDef.index);
              const status = stageState?.status || "idle";
              const isCurrent = isGenerating && activeStageIndex === stageDef.index;

              return (
                <div
                  key={stageDef.index}
                  data-testid={`stage-item-${stageDef.index}`}
                  data-status={status}
                  onClick={() => onSelectStageTab(stageDef.index)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                    isCurrent
                      ? "border-cyan-500/60 bg-cyan-950/20 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/30"
                      : status === "completed"
                      ? "border-slate-800/80 bg-slate-950/60 hover:border-slate-700"
                      : status === "failed"
                      ? "border-rose-500/40 bg-rose-950/20"
                      : "border-slate-800/50 bg-slate-950/30 opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`p-1.5 rounded-lg text-white ${
                          isCurrent
                            ? "bg-cyan-500 animate-pulse"
                            : status === "completed"
                            ? "bg-emerald-600"
                            : status === "failed"
                            ? "bg-rose-600"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {getStageIcon(stageDef.iconName)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-white">
                            {stageDef.fileName}
                          </span>
                          <span className="text-[10px] text-indigo-300/80 px-1.5 py-0.2 rounded bg-indigo-500/10 border border-indigo-500/20">
                            {stageDef.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                          {stageDef.title}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge & Action */}
                    <div className="flex items-center gap-1.5">
                      {isCurrent ? (
                        <div className="flex items-center gap-1 text-[10px] font-semibold text-cyan-400">
                          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                          <span>Generating...</span>
                        </div>
                      ) : status === "completed" ? (
                        <div className="flex items-center gap-1 text-emerald-400 text-[10px]">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {stageState?.durationMs ? (
                            <span className="text-slate-500 font-mono">
                              {(stageState.durationMs / 1000).toFixed(1)}s
                            </span>
                          ) : null}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRegenerateStage(stageDef.index);
                            }}
                            disabled={isGenerating}
                            className="p-1 text-slate-500 hover:text-white rounded hover:bg-slate-800 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title={`Re-generate ${stageDef.fileName}`}
                          >
                            <RefreshCw className="h-3 w-3" />
                          </button>
                        </div>
                      ) : status === "failed" ? (
                        <div className="flex items-center gap-1 text-rose-400 text-[10px]">
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>Error</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-600 font-mono">Pending</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
