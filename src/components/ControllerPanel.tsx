"use client";

import React, { useState } from "react";
import { Play, Square, RotateCcw, CheckCircle2, Download, Layers, ChevronDown, ChevronUp, Sparkles, Cpu, Key } from "lucide-react";
import { StageState, STAGES, TechStackPreferences, LLMConfig } from "@/lib/types";
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
  llmConfig?: LLMConfig;
  onOpenSettings?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const DOMAIN_STARTERS = [
  {
    name: "🩺 Telehealth & EHR",
    prompt: "A HIPAA-compliant doctor appointment booking platform with encrypted WebRTC video visits, patient EHR medical history (HL7 FHIR R4), electronic prescription management with digital signing, and automated EDI 270/271 insurance eligibility verification."
  },
  {
    name: "📈 Crypto Algo Bot",
    prompt: "An algorithmic crypto trading bot connecting to Binance and Coinbase WebSockets, calculating 14-period RSI and MACD momentum indicators, executing stop-loss market orders within 10ms of risk breach, and sending Telegram trade execution alerts."
  },
  {
    name: "🛸 Drone Fleet IoT",
    prompt: "An autonomous drone fleet telemetry platform ingesting 20Hz sensor packets (GPS coordinates, altitude, airspeed, battery health) over EMQX MQTT, providing real-time 3D flight paths, automated geofence boundary enforcement, and over-the-air firmware deployment."
  },
  {
    name: "🍔 Food Delivery App",
    prompt: "An on-demand food delivery marketplace connecting hungry customers, restaurant kitchens, and couriers. Features cart checkout with idempotent Stripe payments, live GPS courier tracking with sub-second WebSocket updates, and kitchen ticket dispatch."
  },
  {
    name: "🤖 Multi-Agent RAG",
    prompt: "An autonomous AI research agent platform with vector search in Qdrant, document chunking pipeline, tool execution sandboxes, streaming chat responses, and human-in-the-loop review gates."
  }
];

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
  onQuickDownloadZip,
  llmConfig,
  onOpenSettings
}) => {
  const [isStackExpanded, setIsStackExpanded] = useState(false);
  const hasCompletedAny = stages.some((s) => s.status === "completed" || (s.content && s.content.trim().length > 0));

  const handleApplyPreset = (presetStack: TechStackPreferences) => {
    setTechStack(presetStack);
  };

  const isRealLLM = llmConfig && llmConfig.provider !== "mock" && Boolean(llmConfig.apiKey || llmConfig.provider === "ollama");

  return (
    <div className="h-full flex flex-col bg-slate-50 border-r border-slate-200 p-4 space-y-3.5 overflow-y-auto">
      {/* 1. AI Engine Banner */}
      <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${isRealLLM ? "bg-emerald-100 text-emerald-800" : "bg-blue-50 text-blue-800"}`}>
            {isRealLLM ? <Sparkles className="h-3.5 w-3.5" /> : <Cpu className="h-3.5 w-3.5" />}
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-800">
              {isRealLLM ? `Cloud AI: ${llmConfig?.provider?.toUpperCase()}` : "Deep Semantic Engine"}
            </div>
            <div className="text-[10px] text-slate-500">
              {isRealLLM ? "Streaming directly from live model" : "Zero-latency domain synthesis"}
            </div>
          </div>
        </div>

        {onOpenSettings && (
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-1 rounded-lg transition-colors"
          >
            <Key className="h-3 w-3" />
            <span>{isRealLLM ? "Change Key" : "Connect Real AI"}</span>
          </button>
        )}
      </div>

      {/* 2. Realtime Prompt Console */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            Project Description
          </label>
          <span className="text-[10px] text-slate-400">Natural Language Prompt</span>
        </div>

        {/* Quick Domain Starters */}
        <div className="flex flex-wrap gap-1 pb-1">
          {DOMAIN_STARTERS.map((starter, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setPrompt(starter.prompt)}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 border border-slate-200 transition-colors"
              title="Click to populate example prompt"
            >
              {starter.name}
            </button>
          ))}
        </div>

        <textarea
          data-testid="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your application idea, features, target users, hardware or business logic..."
          rows={6}
          className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 leading-relaxed resize-y font-sans transition-all shadow-xs"
        />
      </div>

      {/* 3. Interactive Tech Stack Selector & Presets */}
      <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2.5 shadow-xs">
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

      {/* 4. Generation Action Controls */}
      <div className="flex items-center gap-2">
        {isGenerating ? (
          <button
            type="button"
            onClick={onStopGeneration}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-xs transition-all"
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
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold shadow-xs transition-all active:scale-[0.99]"
          >
            <Play className="h-3.5 w-3.5 fill-white" />
            <span>Generate Specifications</span>
          </button>
        )}

        <button
          type="button"
          onClick={onReset}
          disabled={isGenerating}
          className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors disabled:opacity-40 shadow-xs"
          title="Reset Prompt and Specifications"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* 5. Realtime SDLC Stages */}
      <div className="space-y-1.5 pt-2 border-t border-slate-200 flex-1">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
            SDLC Lifecycle Stages
          </label>
        </div>

        {STAGES.map((s) => {
          const stageState = stages.find((st) => st.index === s.index);
          const isDone = stageState?.status === "completed";
          const isCurrent = isGenerating && stageState?.status === "generating";
          const isFailed = stageState?.status === "failed";
          const isActiveTab = activeStageIndex === s.index;

          return (
            <div
              key={s.index}
              onClick={() => onSelectStageTab(s.index)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer select-none flex items-center justify-between ${
                isActiveTab
                  ? "bg-emerald-50/60 border-emerald-500 shadow-xs"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`h-6 w-6 rounded-lg flex items-center justify-center text-[11px] font-bold ${
                    isDone
                      ? "bg-emerald-600 text-white"
                      : isCurrent
                      ? "bg-emerald-100 text-emerald-800 animate-pulse border border-emerald-300"
                      : isFailed
                      ? "bg-red-600 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : s.index}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-800 truncate">
                    {s.fileName}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {s.shortDescription}
                  </div>
                </div>
              </div>

              {stageState?.tokensGenerated && stageState.tokensGenerated > 0 ? (
                <div className="text-[10px] font-mono text-slate-400">
                  {stageState.tokensGenerated} tok
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* 6. Quick Download Zip Button */}
      {hasCompletedAny && onQuickDownloadZip && (
        <div className="pt-2 border-t border-slate-200">
          <button
            type="button"
            onClick={onQuickDownloadZip}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download All Scaffolds (.ZIP)</span>
          </button>
        </div>
      )}
    </div>
  );
};
