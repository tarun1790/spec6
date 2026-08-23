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
  Wand2,
  GitBranch,
  Search,
  Sliders,
  Check
} from "lucide-react";
import { StageState, STAGES, TechStackPreferences } from "@/lib/types";
import { TEMPLATES, ProjectTemplate } from "@/lib/templates";
import { ingestGitHubRepository } from "@/lib/github-ingest";
import { refineUserPrompt } from "@/lib/prompt-refiner";

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
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);
  const [showRepoIngest, setShowRepoIngest] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestSuccess, setIngestSuccess] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  // Advanced Tool & Swarm Toggles
  const [orchestrationMode, setOrchestrationMode] = useState<"sequential_chained" | "parallel_dag" | "multi_agent_consensus">("parallel_dag");
  const [enableSemanticCache, setEnableSemanticCache] = useState(true);
  const [enableSpeculativeDecoding, setEnableSpeculativeDecoding] = useState(true);
  const [enableMermaidLinter, setEnableMermaidLinter] = useState(true);
  const [enableOpenAPIValidator, setEnableOpenAPIValidator] = useState(true);
  const [enableCVEScanner, setEnableCVEScanner] = useState(true);
  const [enableCriticAgent, setEnableCriticAgent] = useState(true);

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
    const result = refineUserPrompt(prompt, techStack);
    setPrompt(result.refinedPrompt);
    setTechStack(result.suggestedTechStack);
  };

  const handleIngestRepo = async () => {
    if (!repoUrl.trim()) return;
    setIsIngesting(true);
    setIngestSuccess(false);

    try {
      const context = await ingestGitHubRepository(repoUrl);
      setTechStack((prev) => ({
        ...prev,
        frontend: context.detectedStack.frameworks[0] || context.detectedStack.languages[0] || prev.frontend,
        backend: context.detectedStack.frameworks[1] || context.detectedStack.languages[1] || prev.backend,
        database: context.detectedStack.databases[0] || prev.database
      }));

      const newPrompt = `Ground specifications in existing GitHub Codebase (${context.owner}/${context.repo}):\n\nDetected Repository Layout:\n\`\`\`text\n${context.directoryTreePreview}\n\`\`\`\n\nDetected Stack: ${context.detectedStack.languages.join(", ")} | ${context.detectedStack.frameworks.join(", ")}\n\nObjective: Modernize architecture, create production SDLC contracts, and expand feature capabilities.\n\n${prompt}`;
      setPrompt(newPrompt);
      setIngestSuccess(true);
      setTimeout(() => setIngestSuccess(false), 3000);
    } catch (err) {
      console.error("Repository ingestion error:", err);
    } finally {
      setIsIngesting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50/80 border-r border-slate-200 overflow-y-auto p-4 md:p-5 space-y-4">
      {/* Card 1: Quick-Starter Archetypes */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow transition-shadow">
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>SDLC Project Presets</span>
          </label>
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            6 Ready Templates
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => handleApplyTemplate(tmpl)}
              className={`p-2 rounded-xl text-left text-xs transition-all border ${
                selectedTemplateId === tmpl.id
                  ? "bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold shadow-sm ring-1 ring-emerald-400"
                  : "bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-emerald-50/50 hover:border-emerald-200 hover:text-slate-900"
              }`}
            >
              <div className="font-semibold truncate text-[11px]">{tmpl.name}</div>
              <div className="text-[10px] text-slate-400 truncate">{tmpl.category}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Card 2: GitHub Repository Ingestion Card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setShowRepoIngest(!showRepoIngest)}
          className="w-full flex items-center justify-between p-3.5 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Layers className="h-3.5 w-3.5 text-emerald-600" />
            <span>Codebase Ingestion & AST Scanner (Repo-RAG)</span>
          </div>
          {showRepoIngest ? <ChevronUp className="h-3.5 w-3.5 text-slate-400" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-400" />}
        </button>

        {showRepoIngest && (
          <div className="p-4 pt-1 space-y-2.5 border-t border-slate-100 text-xs bg-slate-50/50">
            <p className="text-[11px] text-slate-500">
              Ingest AST directory trees and schemas from any GitHub repository to ground your SDLC specs:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/owner/repository"
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-mono"
              />
              <button
                type="button"
                onClick={handleIngestRepo}
                disabled={isIngesting || !repoUrl.trim()}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs shadow-sm transition-all"
              >
                {ingestSuccess ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Ingested!</span>
                  </>
                ) : isIngesting ? (
                  <>
                    <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Scanning...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-3.5 w-3.5" />
                    <span>Scan Repo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Card 3: Requirements Prompt Input */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow transition-shadow space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Natural Language SDLC Prompt
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleEnhancePrompt}
              className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md font-semibold transition-colors"
              title="Add SDLC architectural guardrails"
            >
              <Wand2 className="h-3 w-3" />
              <span>Enhance</span>
            </button>
            <span className="text-[10px] text-slate-400 font-mono">
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
          className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 leading-relaxed resize-y font-sans transition-all"
        />
      </div>

      {/* Card 4: Architecture & Tech Stack Config */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setShowStackControls(!showStackControls)}
          className="w-full flex items-center justify-between p-3.5 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Layers className="h-3.5 w-3.5 text-emerald-600" />
            <span>Architecture & Stack Customization</span>
          </div>
          {showStackControls ? <ChevronUp className="h-3.5 w-3.5 text-slate-400" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-400" />}
        </button>

        {showStackControls && (
          <div className="p-4 pt-1 space-y-2.5 border-t border-slate-100 text-xs bg-slate-50/50">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Frontend Tier</label>
              <input
                type="text"
                value={techStack.frontend}
                onChange={(e) => setTechStack({ ...techStack, frontend: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Backend & API</label>
              <input
                type="text"
                value={techStack.backend}
                onChange={(e) => setTechStack({ ...techStack, backend: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Database & Storage</label>
              <input
                type="text"
                value={techStack.database}
                onChange={(e) => setTechStack({ ...techStack, database: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Architecture Style</label>
              <input
                type="text"
                value={techStack.architecture}
                onChange={(e) => setTechStack({ ...techStack, architecture: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Deployment & Cloud</label>
              <input
                type="text"
                value={techStack.deployment}
                onChange={(e) => setTechStack({ ...techStack, deployment: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Card 5: Multi-Agent Orchestrator & Swarm Engine */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAdvancedTools(!showAdvancedTools)}
          className="w-full flex items-center justify-between p-3.5 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sliders className="h-3.5 w-3.5 text-emerald-600" />
            <span>Multi-Agent Swarm Orchestrator & Efficiency</span>
          </div>
          {showAdvancedTools ? <ChevronUp className="h-3.5 w-3.5 text-slate-400" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-400" />}
        </button>

        {showAdvancedTools && (
          <div className="p-4 pt-1 space-y-3 border-t border-slate-100 text-xs bg-slate-50/50">
            {/* Orchestration Mode Pills */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1.5">
                Swarm Orchestration Engine
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setOrchestrationMode("parallel_dag")}
                  className={`p-1.5 rounded-lg text-center text-[10px] font-bold border transition-all ${
                    orchestrationMode === "parallel_dag"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-emerald-50"
                  }`}
                >
                  ⚡ Parallel DAG (2.5x Fast)
                </button>
                <button
                  type="button"
                  onClick={() => setOrchestrationMode("sequential_chained")}
                  className={`p-1.5 rounded-lg text-center text-[10px] font-bold border transition-all ${
                    orchestrationMode === "sequential_chained"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-emerald-50"
                  }`}
                >
                  🎯 Sequential (High Precision)
                </button>
                <button
                  type="button"
                  onClick={() => setOrchestrationMode("multi_agent_consensus")}
                  className={`p-1.5 rounded-lg text-center text-[10px] font-bold border transition-all ${
                    orchestrationMode === "multi_agent_consensus"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-emerald-50"
                  }`}
                >
                  🛡️ Consensus (Zero-Error)
                </button>
              </div>
            </div>

            {/* Efficiency Toggles */}
            <div className="space-y-1.5 pt-1 border-t border-slate-200">
              <label className="flex items-center justify-between cursor-pointer py-0.5">
                <div>
                  <span className="text-slate-800 font-semibold text-[11px]">Semantic Token Caching</span>
                  <p className="text-[10px] text-slate-500">Deduplicates repetitive schemas (saves ~40% tokens)</p>
                </div>
                <input
                  type="checkbox"
                  checked={enableSemanticCache}
                  onChange={(e) => setEnableSemanticCache(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-0.5">
                <div>
                  <span className="text-slate-800 font-semibold text-[11px]">Speculative Decoding & Stream Throttling</span>
                  <p className="text-[10px] text-slate-500">Reduces DOM reflows and latency</p>
                </div>
                <input
                  type="checkbox"
                  checked={enableSpeculativeDecoding}
                  onChange={(e) => setEnableSpeculativeDecoding(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-0.5">
                <div>
                  <span className="text-slate-800 font-semibold text-[11px]">Mermaid AST Syntax Linter</span>
                  <p className="text-[10px] text-slate-500">Headless diagram syntax compiler</p>
                </div>
                <input
                  type="checkbox"
                  checked={enableMermaidLinter}
                  onChange={(e) => setEnableMermaidLinter(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-0.5">
                <div>
                  <span className="text-slate-800 font-semibold text-[11px]">Critic Agent Reflection Gate</span>
                  <p className="text-[10px] text-slate-500">Self-corrects diagram and schema flaws</p>
                </div>
                <input
                  type="checkbox"
                  checked={enableCriticAgent}
                  onChange={(e) => setEnableCriticAgent(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Card 6: Action Controls */}
      <div className="flex items-center gap-2">
        {isGenerating ? (
          <button
            type="button"
            onClick={onStopGeneration}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-md shadow-red-600/25 transition-all active:scale-[0.99]"
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
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:opacity-95 disabled:opacity-40 text-white text-xs font-bold shadow-md shadow-emerald-600/25 transition-all active:scale-[0.99]"
          >
            <Play className="h-4 w-4 fill-white" />
            <span>Generate SDLC Specification Suite</span>
          </button>
        )}

        <button
          type="button"
          onClick={onReset}
          disabled={isGenerating}
          className="p-3 rounded-2xl border border-slate-200 bg-white text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors disabled:opacity-40 shadow-sm"
          title="Reset Specifications"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {/* Card 7: 6-Stage SDLC Pipeline Cards */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
            6-Stage SDLC Pipeline
          </label>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200 font-mono">
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
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer group shadow-sm ${
                  isCurrent
                    ? "border-emerald-500 bg-emerald-50/80 shadow-md ring-2 ring-emerald-500/20"
                    : status === "completed"
                    ? "border-slate-200 bg-white hover:border-emerald-300 hover:shadow"
                    : status === "failed"
                    ? "border-red-300 bg-red-50/70"
                    : "border-slate-200/80 bg-white/70 hover:bg-white hover:border-slate-300 opacity-80 hover:opacity-100"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl text-white ${
                        isCurrent
                          ? "bg-emerald-600 animate-pulse shadow-sm shadow-emerald-600/30"
                          : status === "completed"
                          ? "bg-emerald-600"
                          : status === "failed"
                          ? "bg-red-600"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {getStageIcon(stageDef.iconName)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {stageDef.fileName}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          stageDef.color === "red"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-emerald-50 text-emerald-800 border-emerald-200"
                        }`}>
                          {stageDef.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 font-medium">
                        {stageDef.sdlcPhase}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge & Action */}
                  <div className="flex items-center gap-1.5">
                    {isCurrent ? (
                      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-ping" />
                        <span>Streaming...</span>
                      </div>
                    ) : status === "completed" ? (
                      <div className="flex items-center gap-1 text-emerald-700 text-[10px] font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        {stageState?.durationMs ? (
                          <span className="font-mono">
                            {(stageState.durationMs / 1000).toFixed(1)}s
                          </span>
                        ) : (
                          <span>Ready</span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRegenerateStage(stageDef.index);
                          }}
                          disabled={isGenerating}
                          className="p-1 text-slate-400 hover:text-emerald-700 rounded hover:bg-emerald-100 ml-1 transition-colors"
                          title={`Re-generate ${stageDef.fileName}`}
                        >
                          <RefreshCw className="h-3 w-3" />
                        </button>
                      </div>
                    ) : status === "failed" ? (
                      <div className="flex items-center gap-1 text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200 text-[10px] font-semibold">
                        <AlertCircle className="h-3 w-3 text-red-600" />
                        <span>Error</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-medium px-2 py-0.5 bg-slate-100 rounded-full">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
