"use client";

import React from "react";
import {
  Layers,
  Settings,
  Download,
  Sparkles,
  Zap,
  CheckCircle2
} from "lucide-react";
import { LLMConfig } from "@/lib/types";

interface HeaderProps {
  llmConfig: LLMConfig;
  onOpenSettings: () => void;
  onOpenExport: () => void;
  onQuickDownloadZip: () => void;
  isGenerating: boolean;
  totalTokens: number;
  completedStagesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  llmConfig,
  onOpenSettings,
  onOpenExport,
  onQuickDownloadZip,
  isGenerating,
  totalTokens,
  completedStagesCount
}) => {
  const getProviderBadge = () => {
    switch (llmConfig.provider) {
      case "openai":
        return { label: `OpenAI (${llmConfig.model || "gpt-4o"})`, color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
      case "anthropic":
        return { label: `Claude (${llmConfig.model || "claude-3-5"})`, color: "bg-amber-50 text-amber-700 border-amber-200" };
      case "gemini":
        return { label: `Gemini (${llmConfig.model || "2.0-flash"})`, color: "bg-blue-50 text-blue-700 border-blue-200" };
      case "groq":
        return { label: `Groq (${llmConfig.model || "llama-3.3"})`, color: "bg-orange-50 text-orange-700 border-orange-200" };
      case "ollama":
        return { label: `Ollama (${llmConfig.model || "local"})`, color: "bg-purple-50 text-purple-700 border-purple-200" };
      default:
        return { label: "High-Fidelity Synthesizer", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    }
  };

  const badge = getProviderBadge();

  return (
    <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between shadow-sm">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white">
          <Layers className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-slate-900 tracking-tight">SpecFlow AI</span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              SDLC Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 hidden sm:block">
            Software Development Life Cycle Specification & Artifact Generator
          </p>
        </div>
      </div>

      {/* Center Status / Model pill */}
      <div className="hidden lg:flex items-center gap-4">
        <button
          onClick={onOpenSettings}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all hover:shadow-sm ${badge.color}`}
        >
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
          <span>{badge.label}</span>
          <Settings className="h-3 w-3 opacity-60 ml-1" />
        </button>

        {isGenerating ? (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-semibold animate-pulse shadow-sm">
            <Zap className="h-3.5 w-3.5 text-emerald-600 animate-spin" />
            <span>Generating SDLC Pipeline...</span>
          </div>
        ) : completedStagesCount === 6 ? (
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold shadow-sm">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>All 6 SDLC Specs Ready</span>
            {totalTokens > 0 && <span className="opacity-80">({totalTokens.toLocaleString()} tokens)</span>}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
            <span>SDLC Pipeline Ready</span>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
          title="Configure LLM & Providers"
        >
          <Settings className="h-4 w-4" />
        </button>

        <a
          href="https://github.com/tarun1790/spec6"
          target="_blank"
          rel="noreferrer"
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
          title="GitHub Repository"
        >
          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        </a>

        <button
          onClick={onQuickDownloadZip}
          disabled={isGenerating || completedStagesCount === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:hover:from-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-600/25 transition-all active:scale-95"
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Export .ZIP</span>
        </button>
      </div>
    </header>
  );
};
