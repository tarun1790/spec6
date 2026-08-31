"use client";

import React from "react";
import { Download, Sparkles, Settings, FolderArchive } from "lucide-react";
import { LLMConfig } from "@/lib/types";

interface HeaderProps {
  onOpenExport: () => void;
  onQuickDownloadZip?: () => void;
  onOpenSettings?: () => void;
  llmConfig?: LLMConfig;
  isGenerating: boolean;
  completedStagesCount?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenExport,
  onQuickDownloadZip,
  onOpenSettings,
  llmConfig,
  isGenerating
}) => {
  const getProviderLabel = () => {
    if (!llmConfig || llmConfig.provider === "mock") {
      return "Principal AI Architect (Deep Synthesizer)";
    }
    switch (llmConfig.provider) {
      case "openai": return `OpenAI (${llmConfig.model || "gpt-4o"})`;
      case "gemini": return `Gemini (${llmConfig.model || "2.0-flash"})`;
      case "anthropic": return `Claude (${llmConfig.model || "3.5-sonnet"})`;
      case "groq": return `Groq (${llmConfig.model || "llama-3.3-70b"})`;
      case "ollama": return `Ollama (${llmConfig.model || "local"})`;
      default: return `${llmConfig.provider} (${llmConfig.model})`;
    }
  };

  return (
    <header className="h-14 border-b border-slate-200 bg-white px-4 md:px-6 flex items-center justify-between shadow-sm select-none">
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
          S
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base text-slate-900 tracking-tight">SpecFlow AI</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Principal SDLC Engine
            </span>
          </div>
        </div>
      </div>

      {/* Model Selector / Provider Badge */}
      <div className="hidden sm:flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors shadow-sm"
          title="Configure LLM Provider & API Keys"
        >
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
          <span>{getProviderLabel()}</span>
          <Settings className="h-3 w-3 text-slate-400 ml-1" />
        </button>

        {isGenerating && (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-pulse flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Streaming Production Specs...</span>
          </span>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenSettings}
          className="sm:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 border border-slate-200"
          title="LLM Settings"
        >
          <Settings className="h-4 w-4" />
        </button>

        {onQuickDownloadZip && (
          <button
            type="button"
            onClick={onQuickDownloadZip}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-colors"
            title="Download full project package (.ZIP)"
          >
            <FolderArchive className="h-3.5 w-3.5 text-emerald-600" />
            <span className="hidden md:inline">Download .ZIP</span>
          </button>
        )}

        <button
          type="button"
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export Hub</span>
        </button>
      </div>
    </header>
  );
};
