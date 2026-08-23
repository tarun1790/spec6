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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl h-[85vh] rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-100 text-red-700 border border-red-200">
              <GitCompare className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Compare Document Revisions</h2>
              <p className="text-xs text-slate-500">Comparing original generated vs current edits for {fileName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-px bg-slate-200 overflow-hidden">
          <div className="flex flex-col bg-slate-50 overflow-hidden">
            <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-600">
              Original Generated Content
            </div>
            <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-600 whitespace-pre-wrap leading-relaxed">
              {originalContent || "No original content available."}
            </div>
          </div>
          <div className="flex flex-col bg-white overflow-hidden">
            <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-200 text-xs font-bold text-emerald-800">
              Current Working Content (Edited)
            </div>
            <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
              {currentContent || "No current content available."}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end px-6 py-3 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
