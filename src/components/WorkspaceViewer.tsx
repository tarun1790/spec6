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
                <span className={`h-2 w-2 rounded-full ${
                  isGeneratingThis
                    ? "bg-emerald-500 animate-ping"
                    : isCompleted
                    ? "bg-emerald-500"
                    : "bg-slate-300"
                }`} />
                <span>{s.fileName}</span>
              </button>
            );
          })}

          <div className="h-4 w-px bg-slate-300 mx-1" />

          {/* Master View Tab Card */}
          <button
            onClick={() => onSelectStageIndex(-1)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
              isCombinedView
                ? "bg-red-50 text-red-800 border-red-300 font-bold shadow-sm ring-1 ring-red-300"
                : "bg-slate-100/70 border-slate-200 text-red-600 hover:bg-red-50/50 hover:text-red-700"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Master Spec Index</span>
          </button>
        </div>
      </div>

      {/* Workspace Toolbar Card */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-2.5 bg-white border-b border-slate-200 text-xs">
        {/* Left Stats & View Switcher */}
        <div className="flex items-center gap-3">
          {/* View Mode Toggle Pill Card */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 shadow-inner">
            <button
              onClick={() => setViewMode("preview")}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                viewMode === "preview"
                  ? "bg-white text-emerald-800 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Rendered HTML Preview with Diagrams"
            >
              <Eye className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Preview</span>
            </button>
            <button
              data-testid="viewmode-editor"
              onClick={() => setViewMode("editor")}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                viewMode === "editor"
                  ? "bg-white text-emerald-800 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Raw Code & Monaco In-Place Editor"
            >
              <Code2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Editor</span>
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                viewMode === "split"
                  ? "bg-white text-emerald-800 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Side-by-Side Split View"
            >
              <Columns className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Split</span>
            </button>
          </div>

          {/* Quick Metrics Card */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 font-mono">
            <span>{lineCount.toLocaleString()} lines</span>
            <span>•</span>
            <span>{wordCount.toLocaleString()} words</span>
            <span>•</span>
            <span>{charCount.toLocaleString()} chars</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Search Box */}
          <div className="relative hidden lg:block">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search in spec..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 w-40"
            />
          </div>

          {!isCombinedView && (
            <button
              onClick={() => {
                if (currentStageDef) {
                  onOpenDiff(currentStageDef.fileName, currentStageState?.content || "", currentContent);
                }
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 font-medium transition-colors"
              title="Compare revisions"
            >
              <GitCompare className="h-3.5 w-3.5 text-red-600" />
              <span className="hidden sm:inline">Diff</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-white hover:border-emerald-300 font-medium transition-colors"
            title="Copy Markdown"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied</span>
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
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold transition-colors"
            title="Download this markdown file"
          >
            <Download className="h-3.5 w-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Save .md</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden bg-slate-50/50">
        {viewMode === "preview" && (
          <div data-testid="markdown-viewer" className="h-full overflow-y-auto p-6 md:p-8 max-w-5xl mx-auto">
            <div className="rounded-2xl bg-white border border-slate-200 p-8 shadow-sm">
              <MarkdownRenderer content={currentContent} />
            </div>
          </div>
        )}

        {viewMode === "editor" && (
          <div className="h-full p-4">
            <div className="h-full rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
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
          </div>
        )}

        {viewMode === "split" && (
          <div className="h-full grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            <div className="h-full p-4 overflow-hidden">
              <div className="h-full rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
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
            </div>
            <div className="h-full overflow-y-auto p-6">
              <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
                <MarkdownRenderer content={currentContent} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
