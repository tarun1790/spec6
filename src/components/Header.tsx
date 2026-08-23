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
        return { label: `OpenAI (${llmConfig.model || "gpt-4o"})`, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
      case "anthropic":
        return { label: `Claude (${llmConfig.model || "claude-3-5"})`, color: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
      case "gemini":
        return { label: `Gemini (${llmConfig.model || "2.0-flash"})`, color: "bg-blue-500/10 text-blue-400 border-blue-500/20" };
      case "groq":
        return { label: `Groq (${llmConfig.model || "llama-3.3"})`, color: "bg-orange-500/10 text-orange-400 border-orange-500/20" };
      case "ollama":
        return { label: `Ollama (${llmConfig.model || "local"})`, color: "bg-purple-500/10 text-purple-400 border-purple-500/20" };
      default:
        return { label: "High-Fidelity Synthesizer", color: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20" };
    }
  };

  const badge = getProviderBadge();

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
          <Layers className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-white tracking-tight">SpecFlow AI</span>
            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              SDD Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">
            Automated Spec-Driven Development & 6-Stage Artifact Generator
          </p>
        </div>
      </div>

      {/* Center Status / Model pill */}
      <div className="hidden lg:flex items-center gap-4">
        <button
          onClick={onOpenSettings}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors hover:border-slate-600 ${badge.color}`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>{badge.label}</span>
          <Settings className="h-3 w-3 opacity-60 ml-1" />
        </button>

        {isGenerating ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs animate-pulse">
            <Zap className="h-3.5 w-3.5 animate-spin" />
            <span>Streaming Chained Pipeline...</span>
          </div>
        ) : completedStagesCount === 6 ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>All 6 Specs Ready</span>
            {totalTokens > 0 && <span className="opacity-75">({totalTokens.toLocaleString()} tokens)</span>}
          </div>
        ) : null}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-700"
          title="Configure LLM & Providers"
        >
          <Settings className="h-4 w-4" />
        </button>

        <a
          href="https://github.com/tarun1790/spec6"
          target="_blank"
          rel="noreferrer"
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-700"
          title="GitHub Repository"
        >
          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        </a>

        <button
          onClick={onQuickDownloadZip}
          disabled={isGenerating || completedStagesCount === 0}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all active:scale-95"
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Export .ZIP</span>
        </button>
      </div>
    </header>
  );
};
