"use client";

import React, { useState } from "react";
import {
  FileText,
  Eye,
  Code2,
  Columns,
  Copy,
  Check,
  Download,
  GitCompare,
  Search,
  Sparkles,
  BookOpen
} from "lucide-react";
import { StageState, STAGES } from "@/lib/types";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { CodeEditor } from "./CodeEditor";
import { saveAs } from "file-saver";

interface WorkspaceViewerProps {
  stages: StageState[];
  selectedStageIndex: number;
  onSelectStageIndex: (idx: number) => void;
  onUpdateStageContent: (stageIndex: number, newContent: string) => void;
  onOpenDiff: (fileName: string, original: string, current: string) => void;
  isGenerating: boolean;
}

type ViewMode = "preview" | "editor" | "split";

export const WorkspaceViewer: React.FC<WorkspaceViewerProps> = ({
  stages,
  selectedStageIndex,
  onSelectStageIndex,
  onUpdateStageContent,
  onOpenDiff,
  isGenerating
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const [searchTerm, setSearchTerm] = useState("");
  const [copied, setCopied] = useState(false);

  // Tab index -1 indicates "All Combined Specs"
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

  return (
    <div className="h-full flex flex-col bg-slate-950 overflow-hidden">
      {/* Tab Navigation Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-3 overflow-x-auto select-none scrollbar-none">
        <div className="flex items-center gap-1 py-1.5 min-w-max">
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
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  isSelected
                    ? "bg-slate-800/90 text-white font-semibold shadow-sm border border-slate-700"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${
                  isGeneratingThis ? "bg-cyan-400 animate-ping" : isCompleted ? "bg-emerald-400" : "bg-slate-600"
                }`} />
                <span>{s.fileName}</span>
              </button>
            );
          })}

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Combined Master View Tab */}
          <button
            onClick={() => onSelectStageIndex(-1)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              isCombinedView
                ? "bg-indigo-600/30 text-indigo-200 font-semibold border border-indigo-500/40"
                : "text-indigo-400/80 hover:text-indigo-300 hover:bg-slate-900/60 border border-transparent"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Master Spec Index</span>
          </button>
        </div>
      </div>

      {/* Workspace Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-slate-900/50 border-b border-slate-800/80 text-xs">
        {/* Left Stats & View Switcher */}
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-800">
            <button
              onClick={() => setViewMode("preview")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                viewMode === "preview" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
              title="Rendered HTML Preview with Diagrams"
            >
              <Eye className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Preview</span>
            </button>
            <button
              data-testid="viewmode-editor"
              onClick={() => setViewMode("editor")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                viewMode === "editor" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
              title="Raw Code & Monaco In-Place Editor"
            >
              <Code2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Editor</span>
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                viewMode === "split" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
              title="Side-by-Side Split View"
            >
              <Columns className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Split</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="hidden md:flex items-center gap-3 text-[11px] text-slate-500 font-mono">
            <span>{lineCount.toLocaleString()} lines</span>
            <span>•</span>
            <span>{wordCount.toLocaleString()} words</span>
            <span>•</span>
            <span>{charCount.toLocaleString()} chars</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <div className="relative hidden lg:block">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search in spec..."
              className="pl-8 pr-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-36"
            />
          </div>

          {!isCombinedView && (
            <button
              onClick={() => {
                if (currentStageDef) {
                  onOpenDiff(currentStageDef.fileName, currentStageState?.content || "", currentContent);
                }
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              title="Compare revisions"
            >
              <GitCompare className="h-3.5 w-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Diff</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            title="Copy Markdown"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadSingle}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            title="Download this markdown file"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Save .md</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {viewMode === "preview" && (
          <div data-testid="markdown-viewer" className="h-full overflow-y-auto p-6 md:p-8 max-w-5xl mx-auto">
            <MarkdownRenderer content={currentContent} />
          </div>
        )}

        {viewMode === "editor" && (
          <div className="h-full p-4">
            <CodeEditor
              value={currentContent}
              onChange={(val) => {
                if (!isCombinedView && currentStageDef) {
                  onUpdateStageContent(currentStageDef.index, val);
                }
              }}
              readOnly={isCombinedView || isGenerating}
            />
          </div>
        )}

        {viewMode === "split" && (
          <div className="h-full grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="h-full p-4 overflow-hidden">
              <CodeEditor
                value={currentContent}
                onChange={(val) => {
                  if (!isCombinedView && currentStageDef) {
                    onUpdateStageContent(currentStageDef.index, val);
                  }
                }}
                readOnly={isCombinedView || isGenerating}
              />
            </div>
            <div className="h-full overflow-y-auto p-6">
              <MarkdownRenderer content={currentContent} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
