"use client";

import React, { useState } from "react";
import { Play, Square, RotateCcw, CheckCircle2, Download, Layers, ChevronDown, ChevronUp, Sparkles, Cpu, Key, BookOpen, HelpCircle, FileText, Zap, Mic, MicOff } from "lucide-react";
import { StageState, STAGES, TechStackPreferences, LLMConfig, SpecificationRigor } from "@/lib/types";
import { STACK_PRESETS } from "@/lib/stack-detector";
import { extractDomainContext } from "@/lib/mock-generator";

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
  rigor?: SpecificationRigor;
  setRigor?: (r: SpecificationRigor) => void;
  onOpenRigorAdvisor?: () => void;
  onOpenPaperModal?: () => void;
  liveSync?: boolean;
  setLiveSync?: (val: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const DOMAIN_STARTERS = [
  {
    name: "🩺 Telehealth & EHR",
    prompt: "A HIPAA-compliant doctor appointment booking platform with encrypted WebRTC video visits, patient EHR medical history (HL7 FHIR R4), electronic prescription management with digital signing, and automated EDI 270/271 insurance eligibility verification."
  },
  {
    name: "⚡ EV Smart Grid",
    prompt: "An intelligent Electric Vehicle (EV) fast-charging network and dynamic grid load balancer. Connects OCPP 2.0.1 DC fast chargers, ISO 15118 Plug & Charge cryptographic PKI authentication, OpenADR 2.0b demand-response pricing, and fleet telematics."
  },
  {
    name: "🛡️ SIEM/SOAR ThreatOps",
    prompt: "An enterprise SIEM and autonomous SOAR cybersecurity operations platform ingesting 100,000 EPS Linux eBPF kernel telemetry and AWS CloudTrail audit logs. Evaluates real-time Sigma rules, MITRE ATT&CK kill-chain correlation, and automated network quarantine."
  },
  {
    name: "🤖 AI Multi-Agent RAG",
    prompt: "An autonomous AI multi-agent research and reasoning engine. Features LangGraph DAG execution pipelines, Qdrant vector database hybrid semantic search, tool-use sandboxes, streaming completions, and human-in-the-loop review gates."
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
  onOpenSettings,
  rigor = "spec-anchored",
  setRigor,
  onOpenRigorAdvisor,
  onOpenPaperModal,
  liveSync = true,
  setLiveSync
}) => {
  const domain = extractDomainContext(prompt || "Clinical Telehealth & EHR Platform");
  const [isStackExpanded, setIsStackExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = React.useRef<any>(null);

  const toggleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert("Voice input is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari.");
      return;
    }

    try {
      const rec = new SpeechRec();
      recognitionRef.current = rec;
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onstart = () => setIsListening(true);
      rec.onresult = (event: any) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          setPrompt(transcript.trim());
        }
      };
      rec.onerror = (e: any) => {
        console.warn("Speech recognition error:", e);
        setIsListening(false);
      };
      rec.onend = () => setIsListening(false);
      rec.start();
    } catch (err) {
      console.warn("Speech recognition failed to start:", err);
      setIsListening(false);
    }
  };
  const hasCompletedAny = stages.some((s) => s.status === "completed" || (s.content && s.content.trim().length > 0));

  const handleSuperPromptEnhance = () => {
    const current = prompt.trim();
    if (!current) {
      setPrompt("An enterprise-grade, high-throughput cloud platform featuring sub-100ms API response SLAs, event-driven pub/sub message brokering, 3NF-normalized PostgreSQL persistence, zero-trust token authentication, and full compliance auditing.");
      return;
    }
    const enhanced = `${current} The architecture mandates strictly typed OpenAPI 3.1 contracts, sub-80ms p95 read latency, idempotent mutations, horizontal autoscaling on Kubernetes, zero-trust cryptographic token verification, and automated continuous verification gates.`;
    setPrompt(enhanced);
  };

  const handleApplyPreset = (presetStack: TechStackPreferences) => {
    setTechStack(presetStack);
  };

  const isRealLLM = llmConfig && llmConfig.provider !== "mock" && Boolean(llmConfig.apiKey || llmConfig.provider === "ollama");

  const phases = [
    { name: "Phase 1: Specify (What)", stages: [0] },
    { name: "Phase 2: Plan (How)", stages: [1] },
    { name: "Phase 3: Implement (Build)", stages: [2] },
    { name: "Phase 4: Validate (Verify)", stages: [3, 4, 5] }
  ];

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

      {/* 2. Specification Spectrum & Rigor Selector (AIWare 2026 Figure 1) */}
      <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-xs space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
              Specification Rigor
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onOpenPaperModal && (
              <button
                type="button"
                onClick={onOpenPaperModal}
                className="text-[10px] text-blue-700 hover:text-blue-900 flex items-center gap-0.5 font-semibold"
                title="View ACM AIWare 2026 Academic Research Paper (8 Pages)"
              >
                <FileText className="h-3 w-3" />
                <span>Paper</span>
              </button>
            )}
            {onOpenRigorAdvisor && (
              <button
                type="button"
                onClick={onOpenRigorAdvisor}
                className="text-[10px] text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5 font-semibold"
              >
                <HelpCircle className="h-3 w-3" />
                <span>Advisor</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1">
          {[
            { id: "spec-first", label: "Spec-First", desc: "Guided" },
            { id: "spec-anchored", label: "Spec-Anchored", desc: "Living (Sweet Spot)" },
            { id: "spec-as-source", label: "Spec-as-Source", desc: "100% Gen" }
          ].map((r) => {
            const isSelected = rigor === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setRigor && setRigor(r.id as SpecificationRigor)}
                className={`py-1 px-1.5 rounded-lg text-center transition-all border ${
                  isSelected
                    ? "bg-emerald-50 text-emerald-900 border-emerald-500 font-bold shadow-xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="text-[10px] font-bold">{r.label}</div>
                <div className="text-[9px] text-slate-400 truncate">{r.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Realtime Prompt Console */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
            <span>Project Description</span>
            {isListening && (
              <span className="flex items-center gap-1 text-[10px] text-rose-600 font-bold animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-ping" />
                Listening...
              </span>
            )}
          </label>
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all border shadow-xs ${
              isListening
                ? "bg-rose-50 text-rose-700 border-rose-300 animate-pulse font-bold"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
            }`}
            title={isListening ? "Stop voice listening" : "Click to speak your prompt (Voice-to-Spec)"}
          >
            {isListening ? <MicOff className="h-3 w-3 text-rose-600" /> : <Mic className="h-3 w-3 text-emerald-600" />}
            <span>{isListening ? "Stop Mic" : "Voice Input"}</span>
          </button>
        </div>

        {/* Prompt Super-Enhancer & Clear */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              Domain Starters
            </span>
            {prompt.trim().length > 0 && (
              <button
                type="button"
                onClick={() => setPrompt("")}
                className="text-[10px] font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-1.5 py-0.5 rounded-md transition-colors"
                title="Clear description"
              >
                ✕ Clear
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={handleSuperPromptEnhance}
            className="text-[10px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs transition-all active:scale-95"
            title="Automatically expand your prompt with enterprise constraints, SLAs, and security requirements"
          >
            <Sparkles className="h-3 w-3 text-purple-600 animate-pulse" />
            <span>⚡ Enhance with Rigor</span>
          </button>
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
          placeholder="Describe your application idea, system architecture, or business logic (e.g. Real-time food delivery platform with live GPS driver tracking, Stripe checkout, and Redis geospatial indexing)... As you type, the engine synthesizes solutions in real time!"
          rows={5}
          className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 leading-relaxed resize-y font-sans transition-all shadow-xs"
        />

        {/* Live Prompt Intelligence Inspector */}
        <div className="rounded-xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/70 to-teal-50/40 p-2.5 space-y-2 text-xs shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-[11px]">
              <Sparkles className="h-3 w-3 text-emerald-600 animate-pulse" />
              <span>Real-Time Background Engine</span>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              {prompt.trim() ? domain.category : "Ready / Waiting"}
            </span>
          </div>

          <div className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
            {prompt.trim() ? (
              <>
                <span className="font-semibold text-slate-800">{domain.title}: </span>
                {domain.executiveSummary}
              </>
            ) : (
              <span className="text-slate-500 italic">
                Type your requirements above or click a domain starter. The engine will instantly decompose your concept into living specifications, microservices topology, 3NF database schema, and full-stack code.
              </span>
            )}
          </div>

          {prompt.trim() && domain.primaryEntities && domain.primaryEntities.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 pt-1">
              <span className="text-[10px] text-slate-500 font-semibold">Identified Entities:</span>
              {domain.primaryEntities.slice(0, 5).map((ent) => (
                <span
                  key={ent}
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-slate-800 border border-slate-200 shadow-2xs"
                >
                  {ent}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-emerald-100/80 text-emerald-950 font-medium">
            <span>Standard: <strong>{domain.complianceFramework.split(",")[0]}</strong></span>
            <span>Real-Time Engine: <strong className="text-emerald-700">Active (Live Debounced)</strong></span>
          </div>
        </div>
      </div>

      {/* 4. Interactive Tech Stack Selector & Presets */}
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

        {/* Architectural Paradigm Switcher */}
        <div className="space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
            Architectural Pattern
          </div>
          <div className="grid grid-cols-2 gap-1">
            {[
              "Event-Driven Microservices",
              "Modular Monolith (DDD)",
              "CQRS + Event Sourcing",
              "Serverless Edge & Workers"
            ].map((pattern) => {
              const isSelected = techStack.architecture.includes(pattern.split(" ")[0]);
              return (
                <button
                  key={pattern}
                  type="button"
                  onClick={() => setTechStack({ ...techStack, architecture: pattern })}
                  className={`px-2 py-1 rounded-md text-[10px] font-semibold border transition-all truncate text-left ${
                    isSelected
                      ? "bg-emerald-50 text-emerald-900 border-emerald-500 font-bold shadow-2xs"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {pattern}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stack Preset Pills */}
        <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-100">
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

      {/* 5. Generation Action Controls */}
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

        {setLiveSync && (
          <button
            type="button"
            onClick={() => setLiveSync(!liveSync)}
            className={`px-2.5 py-2.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1 shadow-xs ${
              liveSync
                ? "bg-emerald-100 text-emerald-900 border-emerald-400 font-bold"
                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
            }`}
            title={liveSync ? "Live Reactive Sync is ON (Instantly updates as you type)" : "Live Reactive Sync is OFF (Manual click required)"}
          >
            <Zap className={`h-3.5 w-3.5 ${liveSync ? "text-emerald-600 fill-emerald-600 animate-pulse" : "text-slate-400"}`} />
            <span className="text-[10px]">Live</span>
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

      {/* 6. Phased SDD Workflow Stages (Figure 2: Specify -> Plan -> Implement -> Validate) */}
      <div className="space-y-3 pt-2 border-t border-slate-200 flex-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
            SDD Workflow Pipeline
          </label>
          <span className="text-[10px] text-slate-400">Figure 2 Architecture</span>
        </div>

        {phases.map((ph, phIdx) => (
          <div key={phIdx} className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
              {ph.name}
            </div>
            {ph.stages.map((stIdx) => {
              const s = STAGES[stIdx];
              const stageState = stages.find((st) => st.index === s.index);
              const isDone = stageState?.status === "completed";
              const isCurrent = isGenerating && stageState?.status === "generating";
              const isFailed = stageState?.status === "failed";
              const isActiveTab = activeStageIndex === s.index;

              return (
                <div
                  key={s.index}
                  onClick={() => onSelectStageTab(s.index)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer select-none flex items-center justify-between ${
                    isActiveTab
                      ? "bg-emerald-50/60 border-emerald-500 shadow-xs"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`h-5 w-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                        isDone
                          ? "bg-emerald-600 text-white"
                          : isCurrent
                          ? "bg-emerald-100 text-emerald-800 animate-pulse border border-emerald-300"
                          : isFailed
                          ? "bg-red-600 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="h-3 w-3" /> : s.index}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-800 truncate">
                        {s.fileName}
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
        ))}
      </div>

      {/* 7. Quick Download Zip Button */}
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
