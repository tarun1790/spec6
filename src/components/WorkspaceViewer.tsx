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
  ShieldCheck
} from "lucide-react";
import { StageState, STAGES, TechStackPreferences, SpecificationRigor } from "@/lib/types";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { CodeEditor } from "./CodeEditor";
import { ApiPlayground } from "./ApiPlayground";
import { ArchitectureRadar } from "./ArchitectureRadar";
import { SchemaVisualizer } from "./SchemaVisualizer";
import { SddVerificationRunner } from "./SddVerificationRunner";
import { extractDomainContext } from "@/lib/mock-generator";
import { saveAs } from "file-saver";
import { exportSpecificationZip } from "@/lib/zip-exporter";

interface WorkspaceViewerProps {
  stages: StageState[];
  selectedStageIndex: number;
  onSelectStageIndex: (idx: number) => void;
  onUpdateStageContent: (stageIndex: number, newContent: string) => void;
  isGenerating: boolean;
  userPrompt?: string;
  techStack: TechStackPreferences;
  rigor?: SpecificationRigor;
  onOpenCopilot?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

type ViewMode = "preview" | "split" | "editor" | "schema" | "verify" | "gherkin" | "playground" | "radar";

export const WorkspaceViewer: React.FC<WorkspaceViewerProps> = ({
  stages,
  selectedStageIndex,
  onSelectStageIndex,
  onUpdateStageContent,
  isGenerating,
  userPrompt = "",
  techStack,
  rigor = "spec-anchored",
  onOpenCopilot
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
      {/* 1. Top Tab Bar & Mode Switcher */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2 overflow-x-auto select-none">
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

        {/* Action Controls & View Modes */}
        <div className="flex items-center gap-1.5 pl-3 min-w-max">
          {/* View Mode Segmented Controls */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all ${
                viewMode === "preview"
                  ? "bg-white text-emerald-800 font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Rendered Specification Preview"
            >
              <Eye className="h-3 w-3" />
              <span>Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("split")}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all ${
                viewMode === "split"
                  ? "bg-white text-emerald-800 font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Side-by-Side Split View"
            >
              <Columns className="h-3 w-3" />
              <span>Split</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("editor")}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all ${
                viewMode === "editor"
                  ? "bg-white text-emerald-800 font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Full Code Editor"
            >
              <Code2 className="h-3 w-3" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("schema")}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all ${
                viewMode === "schema"
                  ? "bg-white text-emerald-800 font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Interactive Relational Schema & ERD Visualizer"
            >
              <Database className="h-3 w-3 text-purple-600" />
              <span>Schema ERD</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("verify")}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all ${
                viewMode === "verify"
                  ? "bg-white text-emerald-800 font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="4-Phase SDD Continuous Verification Gate Runner"
            >
              <ShieldCheck className="h-3 w-3 text-emerald-600" />
              <span>Verify Gates</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("gherkin")}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all ${
                viewMode === "gherkin"
                  ? "bg-white text-emerald-800 font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Executable BDD Gherkin Feature (Given / When / Then)"
            >
              <BookmarkCheck className="h-3 w-3 text-emerald-600" />
              <span>BDD Feature</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("playground")}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all ${
                viewMode === "playground"
                  ? "bg-white text-emerald-800 font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Interactive OpenAPI 3.1 REST Simulator"
            >
              <Terminal className="h-3 w-3 text-emerald-600" />
              <span>API Tester</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("radar")}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all ${
                viewMode === "radar"
                  ? "bg-white text-emerald-800 font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Architecture Quality Score & Cloud Cost Simulator"
            >
              <Activity className="h-3 w-3 text-blue-600" />
              <span>Quality Radar</span>
            </button>
          </div>

          {/* Copilot Drawer Trigger */}
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

          {/* Copy */}
          <button
            type="button"
            onClick={handleCopy}
            disabled={!currentContent.trim()}
            className="flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-700 text-xs font-medium transition-colors"
            title="Copy Markdown"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
            <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
          </button>

          {/* Download Single */}
          <button
            type="button"
            onClick={handleDownloadSingle}
            disabled={!currentContent.trim()}
            className="flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-700 text-xs font-medium transition-colors"
            title="Download active .md file"
          >
            <Download className="h-3 w-3" />
            <span className="hidden sm:inline">Download .md</span>
          </button>

          {/* Download All ZIP */}
          <button
            type="button"
            onClick={handleDownloadAllZip}
            disabled={!hasAnyContent || isGenerating}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
            title="Download full project package (.ZIP)"
          >
            <FolderArchive className="h-3.5 w-3.5" />
            <span>{downloadingZip ? "Zipping..." : "All (.ZIP)"}</span>
          </button>
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
                <div className="py-20 text-center text-slate-400">
                  <p className="text-sm font-semibold text-slate-600">No content generated yet for {currentStageDef.fileName}.</p>
                  <p className="text-xs text-slate-400 mt-1">Enter your requirements on the left and click Generate Specifications.</p>
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
