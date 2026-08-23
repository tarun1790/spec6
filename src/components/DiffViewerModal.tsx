"use client";

import React from "react";
import { X, GitCompare } from "lucide-react";

interface DiffViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  originalContent: string;
  currentContent: string;
}

export const DiffViewerModal: React.FC<DiffViewerModalProps> = ({
  isOpen,
  onClose,
  fileName,
  originalContent,
  currentContent
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl h-[85vh] rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <GitCompare className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Compare Document Revisions</h2>
              <p className="text-xs text-slate-400">Comparing original synthesized vs current edits for {fileName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-px bg-slate-800 overflow-hidden">
          <div className="flex flex-col bg-slate-950 overflow-hidden">
            <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-800 text-xs font-semibold text-slate-400">
              Original Generated Content
            </div>
            <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-400 whitespace-pre-wrap leading-relaxed">
              {originalContent || "No original content available."}
            </div>
          </div>
          <div className="flex flex-col bg-slate-950 overflow-hidden">
            <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-800 text-xs font-semibold text-emerald-400">
              Current Working Content (Edited)
            </div>
            <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
              {currentContent || "No current content available."}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end px-6 py-3 border-t border-slate-800 bg-slate-950/50">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
