"use client";

import React, { useState } from "react";
import {
  Eye,
  Code2,
  Columns,
  Copy,
  Check,
  Download,
  GitCompare,
  Search,
  BookOpen,
  FolderGit2,
  Sparkles
} from "lucide-react";
import { StageState, STAGES, TechStackPreferences } from "@/lib/types";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { CodeEditor } from "./CodeEditor";
import { AgentCouncilPanel } from "./AgentCouncilPanel";
import { DiagnosticsDrawer } from "./DiagnosticsDrawer";
import { exportStarterCodebase } from "@/lib/code-scaffolder";
import { saveAs } from "file-saver";

interface WorkspaceViewerProps {
  stages: StageState[];
  selectedStageIndex: number;
  onSelectStageIndex: (idx: number) => void;
  onUpdateStageContent: (stageIndex: number, newContent: string) => void;
  onOpenDiff: (fileName: string, original: string, current: string) => void;
  isGenerating: boolean;
  techStack?: TechStackPreferences;
  userPrompt?: string;
}

type ViewMode = "preview" | "editor" | "split";

export const WorkspaceViewer: React.FC<WorkspaceViewerProps> = ({
  stages,
  selectedStageIndex,
  onSelectStageIndex,
  onUpdateStageContent,
  onOpenDiff,
  isGenerating,
  techStack = {
    frontend: "Next.js 14 (App Router) + Tailwind CSS",
    backend: "FastAPI / Node.js Microservices",
    database: "PostgreSQL 16 + Redis Cluster",
    architecture: "Event-Driven Microservices with Message Bus",
    deployment: "Kubernetes (EKS) + Docker + Terraform",
    auth: "OAuth 2.0 / JWT + RBAC",
    caching: "Redis Cluster with Cache-Aside"
  },
  userPrompt = ""
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const [searchTerm, setSearchTerm] = useState("");
  const [copied, setCopied] = useState(false);
  const [isScaffolding, setIsScaffolding] = useState(false);

  const isCombinedView = selectedStageIndex === -1;

  const currentStageDef = !isCombinedView
    ? STAGES.find((s) => s.index === selectedStageIndex) || STAGES[0]
    : null;

  const currentStageState = !isCombinedView
    ? stages.find((s) => s.index === selectedStageIndex)
    : null;

  const currentContent = !isCombinedView
    ? currentStageState?.content || ""
    : `# Master Combined Engineering Specification Suite\n\n` +
      stages
        .map((s) => {
          const def = STAGES.find((st) => st.index === s.index);
          return s.content || `# ${def?.fileName}\n\n*Pending generation.*`;
        })
        .join("\n\n---\n\n");

  const wordCount = currentContent ? currentContent.trim().split(/\s+/).length : 0;
  const lineCount = currentContent ? currentContent.split("\n").length : 0;
  const charCount = currentContent.length;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    const fileName = currentStageDef?.fileName || "all_specifications.md";
    const blob = new Blob([currentContent], { type: "text/markdown;charset=utf-8" });
    saveAs(blob, fileName);
  };

  const handleScaffoldCodebase = async () => {
    setIsScaffolding(true);
    try {
      await exportStarterCodebase({
        projectName: "SpecFlow-App",
        stages,
        techStack,
        userPrompt
      });
    } catch (err) {
      console.error("Codebase scaffold error:", err);
    } finally {
      setIsScaffolding(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Tab Navigation Card Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/90 px-3 py-2 overflow-x-auto select-none">
        <div className="flex items-center gap-1.5 min-w-max">
          {STAGES.map((s) => {
            const stageState = stages.find((st) => st.index === s.index);
            const isSelected = selectedStageIndex === s.index;
            const isCompleted = stageState?.status === "completed";
            const isGeneratingThis = isGenerating && stageState?.status === "generating";

            return (
              <button
                key={s.index}
                data-testid={`tab-${s.fileName}`}
                onClick={() => onSelectStageIndex(s.index)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                  isSelected
                    ? "bg-white text-emerald-900 border-emerald-400 font-bold shadow-sm ring-1 ring-emerald-300"
                    : "bg-slate-100/70 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white"
                }`}
              >
                <div
                  className={`h-2 w-2 rounded-full ${
                    isGeneratingThis
                      ? "bg-emerald-500 animate-ping"
                      : isCompleted
                      ? "bg-emerald-600"
                      : "bg-slate-300"
                  }`}
                />
                <span>{s.fileName}</span>
              </button>
            );
          })}

          <button
            onClick={() => onSelectStageIndex(-1)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              isCombinedView
                ? "bg-white text-emerald-900 border-emerald-400 font-bold shadow-sm ring-1 ring-emerald-300"
                : "bg-slate-100/70 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
            <span>Master Spec Index</span>
          </button>
        </div>

        {/* Spec-to-Code Scaffolder Action */}
        <div className="hidden sm:flex items-center gap-2 pl-3">
          <button
            onClick={handleScaffoldCodebase}
            disabled={isScaffolding || stages.every((s) => !s.content)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
            title="Generate full runnable starter codebase (Next.js + Prisma + Docker + Playwright)"
          >
            <FolderGit2 className="h-3.5 w-3.5" />
            <span>{isScaffolding ? "Scaffolding..." : "Scaffold Codebase"}</span>
          </button>
        </div>
      </div>

      {/* Toolbar & Metrics Card */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2 text-xs">
        {/* Left: View Mode Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
                viewMode === "preview"
                  ? "bg-white text-emerald-800 font-bold shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("editor")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
                viewMode === "editor"
                  ? "bg-white text-emerald-800 font-bold shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>Monaco Editor</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("split")}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
                viewMode === "split"
                  ? "bg-white text-emerald-800 font-bold shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Columns className="h-3.5 w-3.5" />
              <span>Split View</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-400">
            <Search className="h-3 w-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter spec..."
              className="bg-transparent text-[11px] text-slate-800 focus:outline-none w-24 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Right: Word Count & Action Buttons */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            <span>{wordCount.toLocaleString()} words</span>
            <span>•</span>
            <span>{lineCount} lines</span>
          </div>

          <div className="flex items-center gap-1.5">
            {!isCombinedView && (
              <button
                type="button"
                onClick={() => {
                  if (currentStageDef) {
                    onOpenDiff(currentStageDef.fileName, "", currentContent);
                  }
                }}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="View Changes & Diff"
              >
                <GitCompare className="h-3.5 w-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Copy Markdown"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            </button>

            <button
              type="button"
              onClick={handleDownloadSingle}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Download Current .md"
            >
              <Download className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area: Dynamic Viewport */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/50">
        {/* Document Container Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm min-h-[500px]">
          {viewMode === "preview" && (
            <div data-testid="spec-markdown-content" className="w-full">
              {currentContent.trim() ? (
                <MarkdownRenderer content={currentContent} />
              ) : (
                <div className="py-24 text-center text-slate-400 space-y-3">
                  <BookOpen className="h-12 w-12 mx-auto stroke-1 text-slate-300" />
                  <p className="text-sm font-semibold text-slate-600">
                    No specification generated yet for this phase.
                  </p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Click &ldquo;Generate SDLC Specification Suite&rdquo; on the left controller to trigger the chained LLM pipeline.
                  </p>
                </div>
              )}
            </div>
          )}

          {viewMode === "editor" && (
            <div className="h-[600px] w-full rounded-xl overflow-hidden border border-slate-200">
              <CodeEditor
                value={currentContent}
                onChange={(newVal) => {
                  if (!isCombinedView && selectedStageIndex >= 0) {
                    onUpdateStageContent(selectedStageIndex, newVal);
                  }
                }}
                readOnly={isCombinedView || isGenerating}
              />
            </div>
          )}

          {viewMode === "split" && (
            <div className="grid grid-cols-2 gap-6 h-[600px]">
              <div className="h-full rounded-xl overflow-hidden border border-slate-200">
                <CodeEditor
                  value={currentContent}
                  onChange={(newVal) => {
                    if (!isCombinedView && selectedStageIndex >= 0) {
                      onUpdateStageContent(selectedStageIndex, newVal);
                    }
                  }}
                  readOnly={isCombinedView || isGenerating}
                />
              </div>
              <div className="h-full overflow-y-auto p-4 rounded-xl border border-slate-200 bg-slate-50">
                <MarkdownRenderer content={currentContent} />
              </div>
            </div>
          )}
        </div>

        {/* Hyper-Advanced Widgets: Agent Council & Live Diagnostics */}
        <AgentCouncilPanel stages={stages} isGenerating={isGenerating} />
        <DiagnosticsDrawer techStack={techStack} stages={stages} />
      </div>
    </div>
  );
};
