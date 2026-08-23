"use client";

import React, { useState } from "react";
import { X, Download, FileCode, Check, FolderArchive } from "lucide-react";
import { StageState, STAGES } from "@/lib/types";
import { exportSpecificationZip } from "@/lib/zip-exporter";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  stages: StageState[];
  userPrompt: string;
  projectName?: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  stages,
  userPrompt,
  projectName = "SpecFlow-Architecture"
}) => {
  const [name, setName] = useState(projectName);
  const [isExporting, setIsExporting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      await exportSpecificationZip(name, stages, userPrompt);
      setIsDone(true);
      setTimeout(() => {
        setIsDone(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FolderArchive className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Export Specification Bundle</h2>
              <p className="text-xs text-slate-400">Download .zip archive of all 6 specifications</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Project Archive Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. MyEnterpriseProject"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Archive Contents ({STAGES.length} Documents + README)
            </div>
            <div className="space-y-1.5 rounded-xl border border-slate-800 bg-slate-950/60 p-3 max-h-44 overflow-y-auto text-xs">
              <div className="flex items-center gap-2 text-indigo-300 font-mono">
                <FileCode className="h-3.5 w-3.5" />
                <span>README.md (Master Index & Architecture Guide)</span>
              </div>
              {STAGES.map((s) => {
                const stageState = stages.find((st) => st.index === s.index);
                const hasContent = (stageState?.content?.length || 0) > 50;
                return (
                  <div key={s.index} className="flex items-center justify-between text-slate-300 font-mono text-[11px] py-0.5">
                    <span className="truncate pr-2">.specs/{s.fileName}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded ${hasContent ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-500"}`}>
                      {hasContent ? "Ready" : "Pending"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-950/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
          >
            {isDone ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-300" />
                <span>Downloaded!</span>
              </>
            ) : isExporting ? (
              <>
                <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Archiving...</span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" />
                <span>Download .ZIP</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
