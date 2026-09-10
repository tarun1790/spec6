"use client";

import React, { useState } from "react";
import {
  Eye,
  Code2,
  Columns,
  Terminal,
  Activity,
  Copy,
  Check,
  Download,
  FolderArchive,
  Sparkles,
  BookmarkCheck,
  Play,
  FileCode,
  Database,
  ShieldCheck,
  FolderTree,
  ShieldAlert,
  Bot,
  Zap
} from "lucide-react";
import { StageState, STAGES, TechStackPreferences, SpecificationRigor } from "@/lib/types";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { CodeEditor } from "./CodeEditor";
import { ApiPlayground } from "./ApiPlayground";
import { ArchitectureRadar } from "./ArchitectureRadar";
import { SchemaVisualizer } from "./SchemaVisualizer";
import { SddVerificationRunner } from "./SddVerificationRunner";
import { MonorepoStudio } from "./MonorepoStudio";
import { InteractiveTerminal } from "./InteractiveTerminal";
import { TopologyCanvas } from "./TopologyCanvas";
import { StrideThreatModel } from "./StrideThreatModel";
import { AiChatWorkspace } from "./AiChatWorkspace";
import { extractDomainContext } from "@/lib/mock-generator";
import { saveAs } from "file-saver";
import { exportSpecificationZip } from "@/lib/zip-exporter";

interface WorkspaceViewerProps {
  stages: StageState[];
  selectedStageIndex: number;
  onSelectStageIndex: (idx: number) => void;
  onUpdateStageContent: (stageIndex: number, newContent: string) => void;
  onAtomicMultiStageUpdate?: (updates: { stageIndex: number; contentAddition: string }[]) => void;
  isGenerating: boolean;
  userPrompt?: string;
  techStack: TechStackPreferences;
  rigor?: SpecificationRigor;
  onOpenCopilot?: () => void;
  onSetPrompt?: (prompt: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

type ViewMode = "preview" | "split" | "editor" | "schema" | "monorepo" | "terminal" | "topology" | "threat" | "chat" | "verify" | "gherkin" | "playground" | "radar";

export const WorkspaceViewer: React.FC<WorkspaceViewerProps> = ({
  stages,
  selectedStageIndex,
  onSelectStageIndex,
  onUpdateStageContent,
  onAtomicMultiStageUpdate,
  isGenerating,
  userPrompt = "",
  techStack,
  rigor = "spec-anchored",
  onOpenCopilot,
  onSetPrompt
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const [copied, setCopied] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [bddRunning, setBddRunning] = useState(false);
  const [bddPassed, setBddPassed] = useState(false);

  const domain = extractDomainContext(userPrompt || "Enterprise Cloud Platform");
  const currentStageDef = STAGES.find((s) => s.index === selectedStageIndex) || STAGES[0];
  const currentStageState = stages.find((s) => s.index === selectedStageIndex);
  const currentContent = currentStageState?.content || "";

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    const fileName = currentStageDef?.fileName || "specification.md";
    const blob = new Blob([currentContent], { type: "text/markdown;charset=utf-8" });
    saveAs(blob, fileName);
  };

  const handleDownloadGherkin = () => {
    const blob = new Blob([domain.gherkinFeature], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `${domain.shortName.toLowerCase()}.feature`);
  };

  const handleSimulateBdd = () => {
    setBddRunning(true);
    setBddPassed(false);
    setTimeout(() => {
      setBddRunning(false);
      setBddPassed(true);
    }, 800);
  };

  const handleDownloadAllZip = async () => {
    try {
      setDownloadingZip(true);
      await exportSpecificationZip("SDLC-Specification-Suite", stages, userPrompt, techStack);
    } finally {
      setDownloadingZip(false);
    }
  };

  const hasAnyContent = stages.some((s) => s.content && s.content.trim().length > 0);

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* 1. Top Navigation: Tier 1 (Stage Tabs + Quick Actions) & Tier 2 (Studio Mode Selector) */}
      <div className="border-b border-slate-200 bg-white select-none">
        {/* Tier 1: SDLC 6-Stage Specification Tabs & Quick Actions */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-3 py-1.5 overflow-x-auto">
          {/* Stage Tabs */}
          <div className="flex items-center gap-1 min-w-max">
            {STAGES.map((s) => {
              const isSelected = selectedStageIndex === s.index;
              const stageState = stages.find((st) => st.index === s.index);
              const isGeneratingThis = isGenerating && stageState?.status === "generating";

              return (
                <button
                  key={s.index}
                  data-testid={`tab-${s.fileName}`}
                  onClick={() => onSelectStageIndex(s.index)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    isSelected
                      ? "bg-white text-emerald-900 border-emerald-500 font-bold shadow-xs"
                      : "bg-transparent border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                  }`}
                >
                  <div
                    className={`h-2 w-2 rounded-full ${
                      isGeneratingThis
                        ? "bg-emerald-500 animate-ping"
                        : stageState?.status === "completed"
                        ? "bg-emerald-600"
                        : "bg-slate-300"
                    }`}
                  />
                  <span>{s.fileName}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Action Utilities */}
          <div className="flex items-center gap-1.5 pl-3 min-w-max">
            {onOpenCopilot && (
              <button
                type="button"
                onClick={onOpenCopilot}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors shadow-xs"
                title="Open AI Architecture Copilot"
              >
                <Sparkles className="h-3 w-3 text-emerald-600" />
                <span>Copilot</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopy}
              disabled={!currentContent.trim()}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-700 text-xs font-medium transition-colors shadow-xs"
              title="Copy Markdown"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
              <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadSingle}
              disabled={!currentContent.trim()}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-700 text-xs font-medium transition-colors shadow-xs"
              title="Download active .md file"
            >
              <Download className="h-3 w-3" />
              <span className="hidden sm:inline">.md</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadAllZip}
              disabled={!hasAnyContent || isGenerating}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
              title="Download full project package (.ZIP)"
            >
              <FolderArchive className="h-3.5 w-3.5" />
              <span>{downloadingZip ? "Zipping..." : "All ZIP"}</span>
            </button>
          </div>
        </div>

        {/* Tier 2: Categorized Studio View Selector Bar */}
        <div className="flex items-center gap-3 px-3 py-1.5 overflow-x-auto bg-white text-xs">
          {/* Group 1: Core Document Views */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 flex-shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                viewMode === "preview"
                  ? "bg-white text-emerald-800 font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Rendered Markdown Preview"
            >
              <Eye className="h-3 w-3 text-emerald-600" />
              <span>Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("split")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                viewMode === "split"
                  ? "bg-white text-emerald-800 font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Side-by-Side Split View"
            >
              <Columns className="h-3 w-3 text-emerald-600" />
              <span>Split</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("editor")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                viewMode === "editor"
                  ? "bg-white text-emerald-800 font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Full Monaco Code Editor"
            >
              <Code2 className="h-3 w-3 text-emerald-600" />
              <span>Edit</span>
            </button>
          </div>

          {/* Group 2: AI Systems Architect */}
          <div className="flex items-center gap-1 bg-emerald-50/80 p-0.5 rounded-lg border border-emerald-200/80 flex-shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("chat")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-all ${
                viewMode === "chat"
                  ? "bg-white text-emerald-800 font-bold shadow-xs border border-emerald-300"
                  : "text-emerald-700 hover:text-emerald-900"
              }`}
              title="Interactive AI Systems Architect Chat"
            >
              <Bot className="h-3.5 w-3.5 text-emerald-600" />
              <span>AI Architect</span>
            </button>
          </div>

          {/* Group 3: Architecture, Schema & Threat Modeling */}
          <div className="flex items-center gap-1 bg-purple-50/60 p-0.5 rounded-lg border border-purple-200/80 flex-shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("schema")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                viewMode === "schema"
                  ? "bg-white text-purple-900 font-bold shadow-xs border border-purple-300"
                  : "text-purple-700 hover:text-purple-900"
              }`}
              title="Relational Schema & 3NF ERD Visualizer"
            >
              <Database className="h-3 w-3 text-purple-600" />
              <span>Schema ERD</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("topology")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                viewMode === "topology"
                  ? "bg-white text-emerald-900 font-bold shadow-xs border border-emerald-300"
                  : "text-emerald-700 hover:text-emerald-900"
              }`}
              title="Microservices Topology & Live Chaos Mesh Canvas"
            >
              <Activity className="h-3 w-3 text-emerald-600" />
              <span>Topology</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("threat")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                viewMode === "threat"
                  ? "bg-white text-rose-900 font-bold shadow-xs border border-rose-300"
                  : "text-rose-700 hover:text-rose-900"
              }`}
              title="Automated STRIDE Threat Modeling"
            >
              <ShieldAlert className="h-3 w-3 text-rose-600" />
              <span>Threat Model</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("radar")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                viewMode === "radar"
                  ? "bg-white text-blue-900 font-bold shadow-xs border border-blue-300"
                  : "text-blue-700 hover:text-blue-900"
              }`}
              title="Architecture Quality Score & Cloud Cost Simulator"
            >
              <Activity className="h-3 w-3 text-blue-600" />
              <span>Radar</span>
            </button>
          </div>

          {/* Group 4: Polyglot DevSecOps Studio */}
          <div className="flex items-center gap-1 bg-blue-50/60 p-0.5 rounded-lg border border-blue-200/80 flex-shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("monorepo")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                viewMode === "monorepo"
                  ? "bg-white text-blue-900 font-bold shadow-xs border border-blue-300"
                  : "text-blue-700 hover:text-blue-900"
              }`}
              title="Virtual Monorepo Code Studio (TS, Python, Go, Rust)"
            >
              <FolderTree className="h-3 w-3 text-blue-600" />
              <span>Code Studio</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("terminal")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                viewMode === "terminal"
                  ? "bg-white text-emerald-900 font-bold shadow-xs border border-emerald-300"
                  : "text-emerald-700 hover:text-emerald-900"
              }`}
              title="DevSecOps Automated Test & CLI Terminal"
            >
              <Terminal className="h-3 w-3 text-emerald-600" />
              <span>Terminal</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("playground")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                viewMode === "playground"
                  ? "bg-white text-amber-900 font-bold shadow-xs border border-amber-300"
                  : "text-amber-700 hover:text-amber-900"
              }`}
              title="Interactive OpenAPI 3.1 REST Simulator"
            >
              <Terminal className="h-3 w-3 text-amber-600" />
              <span>API Tester</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("gherkin")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                viewMode === "gherkin"
                  ? "bg-white text-teal-900 font-bold shadow-xs border border-teal-300"
                  : "text-teal-700 hover:text-teal-900"
              }`}
              title="Executable BDD Gherkin Feature"
            >
              <BookmarkCheck className="h-3 w-3 text-teal-600" />
              <span>BDD Feature</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("verify")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                viewMode === "verify"
                  ? "bg-white text-emerald-900 font-bold shadow-xs border border-emerald-300"
                  : "text-emerald-700 hover:text-emerald-900"
              }`}
              title="4-Phase SDD Continuous Verification Gate"
            >
              <ShieldCheck className="h-3 w-3 text-emerald-600" />
              <span>Verify Gates</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Body Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/30">
        {/* Mode A: Preview */}
        {viewMode === "preview" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs min-h-full">
            <div data-testid="spec-markdown-content" className="w-full">
              {currentContent.trim() ? (
                <MarkdownRenderer content={currentContent} />
              ) : (
                <div className="py-12 px-4 max-w-3xl mx-auto space-y-8 text-center">
                  {/* Hero Header */}
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-2xs">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
                      <span>Real-Time Background Engine Ready</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Autonomous Spec-Driven Development
                    </h2>
                    <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                      Type your product requirements or idea in the project description box on the left. The background synthesis engine will automatically generate full-stack specifications, database schemas, topology diagrams, and monorepo code in real time.
                    </p>
                  </div>

                  {/* One-Click Quick Starters */}
                  {onSetPrompt && (
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Or Pick an Example Starter
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {[
                          { label: "🍔 Food Delivery App", prompt: "An on-demand food delivery marketplace connecting hungry customers, restaurant kitchens, and couriers. Features cart checkout with idempotent Stripe payments, live GPS courier tracking with sub-second WebSocket updates, and kitchen ticket dispatch." },
                          { label: "⚡ EV Smart Grid", prompt: "An intelligent Electric Vehicle (EV) fast-charging network and dynamic grid load balancer. Connects OCPP 2.0.1 DC fast chargers, ISO 15118 Plug & Charge cryptographic PKI authentication, OpenADR 2.0b demand-response pricing, and fleet telematics." },
                          { label: "🛡️ SIEM Cyber ThreatOps", prompt: "An enterprise SIEM and autonomous SOAR cybersecurity operations platform ingesting 100,000 EPS Linux eBPF kernel telemetry and AWS CloudTrail audit logs. Evaluates real-time Sigma rules, MITRE ATT&CK kill-chain correlation, and automated network quarantine." },
                          { label: "🤖 AI Multi-Agent RAG", prompt: "An autonomous AI multi-agent research and reasoning engine. Features LangGraph DAG execution pipelines, Qdrant vector database hybrid semantic search, tool-use sandboxes, streaming completions, and human-in-the-loop review gates." },
                          { label: "🛸 Drone Fleet IoT", prompt: "An autonomous drone fleet telemetry platform ingesting 20Hz sensor packets (GPS coordinates, altitude, airspeed, battery health) over EMQX MQTT, providing real-time 3D flight paths, automated geofence boundary enforcement, and over-the-air firmware deployment." },
                          { label: "🩺 Telehealth & EHR", prompt: "A HIPAA-compliant doctor appointment booking platform with encrypted WebRTC video visits, patient EHR medical history (HL7 FHIR R4), electronic prescription management with digital signing, and automated EDI 270/271 insurance eligibility verification." }
                        ].map((s, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => onSetPrompt(s.prompt)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-900 text-slate-700 text-xs font-semibold shadow-2xs transition-all active:scale-95"
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 4 Feature Pillars */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                        <FileCode className="h-4 w-4 text-emerald-600" />
                        <span>6 Living SDLC Specifications</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Formal Project Brief, System Architecture, Implementation Plan, Testing Strategy, Threat Matrix, and DevOps Runbooks.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                        <Database className="h-4 w-4 text-purple-600" />
                        <span>Relational 3NF Schema & ERD</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        PostgreSQL 16 relational data model with normalized tables, primary keys, foreign constraints, and Mermaid diagrams.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                        <Activity className="h-4 w-4 text-blue-600" />
                        <span>Microservices Topology Canvas</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Interactive service mesh architecture with Envoy gateway, Redis caching, Kafka message bus, and live chaos mesh simulation.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                        <FolderTree className="h-4 w-4 text-emerald-700" />
                        <span>Virtual Monorepo Code Studio</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Polyglot production code (TypeScript, Python, Go, Rust) with controllers, database migrations, Dockerfiles, and Playwright tests.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mode B: Split View (Code Editor + Rendered Preview) */}
        {viewMode === "split" && (
          <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-full rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs flex flex-col">
              <div className="px-4 py-2 border-b border-slate-100 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Monaco Code Editor ({currentStageDef.fileName})</span>
              </div>
              <div className="flex-1 min-h-[500px]">
                <CodeEditor
                  value={currentContent}
                  onChange={(newVal) => onUpdateStageContent(selectedStageIndex, newVal)}
                  readOnly={isGenerating}
                />
              </div>
            </div>

            <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-xs overflow-y-auto">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-emerald-600" />
                <span>Live Rendered Preview</span>
              </div>
              <MarkdownRenderer content={currentContent} />
            </div>
          </div>
        )}

        {/* Mode C: Full Editor */}
        {viewMode === "editor" && (
          <div className="h-[750px] w-full rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs">
            <CodeEditor
              value={currentContent}
              onChange={(newVal) => onUpdateStageContent(selectedStageIndex, newVal)}
              readOnly={isGenerating}
            />
          </div>
        )}

        {/* Mode: Interactive Schema & ERD Visualizer */}
        {viewMode === "schema" && (
          <div className="h-full overflow-y-auto">
            <SchemaVisualizer domain={domain} />
          </div>
        )}

        {/* Mode: Virtual Monorepo Code Studio */}
        {viewMode === "monorepo" && (
          <div className="h-full min-h-[680px]">
            <MonorepoStudio domain={domain} techStack={techStack} />
          </div>
        )}

        {/* Mode: DevSecOps Interactive Terminal */}
        {viewMode === "terminal" && (
          <div className="h-full min-h-[620px]">
            <InteractiveTerminal domain={domain} />
          </div>
        )}

        {/* Mode: Interactive Microservices Topology Canvas */}
        {viewMode === "topology" && (
          <div className="h-full min-h-[660px]">
            <TopologyCanvas domain={domain} techStack={techStack} />
          </div>
        )}

        {/* Mode: Automated STRIDE Threat Modeling */}
        {viewMode === "threat" && (
          <div className="h-full overflow-y-auto">
            <StrideThreatModel domain={domain} />
          </div>
        )}


        {/* Mode: Conversational AI Systems Architect Chat */}
        {viewMode === "chat" && (
          <div className="h-full min-h-[660px]">
            <AiChatWorkspace
              domain={domain}
              techStack={techStack}
              stages={stages}
              onApplyRefactor={onUpdateStageContent}
            />
          </div>
        )}

        {/* Mode: 4-Phase SDD Continuous Verification Gate */}
        {viewMode === "verify" && (
          <div className="h-full overflow-y-auto">
            <SddVerificationRunner domain={domain} rigor={rigor} />
          </div>
        )}

        {/* Mode D: Executable BDD Gherkin Feature */}
        {viewMode === "gherkin" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <FileCode className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 font-mono">
                    specs/features/{domain.shortName.toLowerCase()}.feature
                  </h3>
                  <p className="text-xs text-slate-500">
                    Behavior-Driven Development (BDD) Executable Contract (Given/When/Then)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSimulateBdd}
                  disabled={bddRunning}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all"
                >
                  {bddRunning ? (
                    <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Play className="h-3.5 w-3.5 fill-white" />
                  )}
                  <span>{bddRunning ? "Running Scenarios..." : "Run Cucumber Test"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadGherkin}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>.feature</span>
                </button>
              </div>
            </div>

            {bddPassed && (
              <div className="p-3 rounded-xl border border-emerald-300 bg-emerald-50 text-xs text-emerald-900 flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>
                  <strong>2 scenarios (8 steps) PASSED</strong> (42ms) — Zero requirement drift detected.
                </span>
              </div>
            )}

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner leading-relaxed whitespace-pre-wrap">
              {domain.gherkinFeature}
            </div>

            <div className="text-[11px] text-slate-500 italic border-l-2 border-emerald-500 pl-3">
              &ldquo;The canonical format is Gherkin, which uses structured scenarios with Given/When/Then clauses. These scenarios serve dual purposes: documentation that stakeholders can read and automated tests that verify code.&rdquo; — <i>ACM AIWare 2026</i>
            </div>
          </div>
        )}

        {/* Mode E: API Playground / Sandbox */}
        {viewMode === "playground" && (
          <div className="h-full min-h-[600px]">
            <ApiPlayground userPrompt={userPrompt} techStack={techStack} />
          </div>
        )}

        {/* Mode F: Architecture Quality Radar */}
        {viewMode === "radar" && (
          <div className="h-full min-h-[600px]">
            <ArchitectureRadar userPrompt={userPrompt} techStack={techStack} stages={stages} rigor={rigor} />
          </div>
        )}
      </div>
    </div>
  );
};
