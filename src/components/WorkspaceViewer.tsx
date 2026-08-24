"use client";

import React, { useState } from "react";
import {
  Eye,
  Code2,
  Copy,
  Check,
  Download,
  FolderArchive
} from "lucide-react";
import { StageState, STAGES } from "@/lib/types";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { CodeEditor } from "./CodeEditor";
import { saveAs } from "file-saver";
import { exportSpecificationZip } from "@/lib/zip-exporter";

interface WorkspaceViewerProps {
  stages: StageState[];
  selectedStageIndex: number;
  onSelectStageIndex: (idx: number) => void;
  onUpdateStageContent: (stageIndex: number, newContent: string) => void;
  isGenerating: boolean;
  userPrompt?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

type ViewMode = "preview" | "editor";

export const WorkspaceViewer: React.FC<WorkspaceViewerProps> = ({
  stages,
  selectedStageIndex,
  onSelectStageIndex,
  onUpdateStageContent,
  isGenerating,
  userPrompt = ""
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const [copied, setCopied] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);

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

  const handleDownloadAllZip = async () => {
    try {
      setDownloadingZip(true);
      await exportSpecificationZip("SDLC-Specification-Suite", stages, userPrompt);
    } finally {
      setDownloadingZip(false);
    }
  };

  const hasAnyContent = stages.some((s) => s.content && s.content.trim().length > 0);

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* 1. Tab Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2 overflow-x-auto select-none">
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
                    ? "bg-white text-emerald-900 border-emerald-500 font-bold shadow-sm"
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

        {/* 2. Top Right Actions */}
        <div className="flex items-center gap-1.5 pl-3 min-w-max">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-all ${
                viewMode === "preview"
                  ? "bg-white text-emerald-800 font-bold shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Eye className="h-3 w-3" />
              <span>Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("editor")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-all ${
                viewMode === "editor"
                  ? "bg-white text-emerald-800 font-bold shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Code2 className="h-3 w-3" />
              <span>Edit</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            disabled={!currentContent.trim()}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-700 text-xs font-medium transition-colors"
            title="Copy Markdown"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadSingle}
            disabled={!currentContent.trim()}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-700 text-xs font-medium transition-colors"
            title="Download active .md file"
          >
            <Download className="h-3 w-3" />
            <span>Download .md</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadAllZip}
            disabled={!hasAnyContent || isGenerating}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
            title="Download all 6 specifications in a .ZIP archive"
          >
            <FolderArchive className="h-3.5 w-3.5" />
            <span>{downloadingZip ? "Zipping..." : "Download All (.ZIP)"}</span>
          </button>
        </div>
      </div>

      {/* 3. Main Document View */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm min-h-full">
          {viewMode === "preview" && (
            <div data-testid="spec-markdown-content" className="w-full">
              {currentContent.trim() ? (
                <MarkdownRenderer content={currentContent} />
              ) : (
                <div className="py-20 text-center text-slate-400">
                  <p className="text-sm font-semibold text-slate-600">No content generated yet for {currentStageDef.fileName}.</p>
                  <p className="text-xs text-slate-400 mt-1">Enter your custom requirements on the left and click Generate Specifications.</p>
                </div>
              )}
            </div>
          )}

          {viewMode === "editor" && (
            <div className="h-[750px] w-full rounded-xl overflow-hidden border border-slate-200">
              <CodeEditor
                value={currentContent}
                onChange={(newVal) => onUpdateStageContent(selectedStageIndex, newVal)}
                readOnly={isGenerating}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
