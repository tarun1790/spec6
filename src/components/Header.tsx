"use client";

import React from "react";
import { Download } from "lucide-react";

interface HeaderProps {
  onOpenExport: () => void;
  isGenerating: boolean;
  completedStagesCount: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenExport,
  isGenerating
}) => {
  return (
    <header className="h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-md bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
          S
        </div>
        <span className="font-bold text-base text-slate-900">SpecFlow AI</span>
      </div>

      <div className="flex items-center gap-3">
        {isGenerating && (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 animate-pulse">
            Generating specifications...
          </span>
        )}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export .ZIP</span>
        </button>
      </div>
    </header>
  );
};
