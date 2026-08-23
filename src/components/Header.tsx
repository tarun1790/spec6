"use client";

import React, { useState } from "react";
import {
  Layers,
  Settings,
  Download,
  Sparkles,
  Zap,
  CheckCircle2,
  Share2,
  Globe,
  Check
} from "lucide-react";
import { LLMConfig } from "@/lib/types";

interface HeaderProps {
  llmConfig: LLMConfig;
  onOpenSettings: () => void;
  onOpenExport: () => void;
  onQuickDownloadZip: () => void;
  onShareLink: () => void;
  isGenerating: boolean;
  totalTokens: number;
  completedStagesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  llmConfig,
  onOpenSettings,
  onOpenExport,
  onShareLink,
  isGenerating,
  totalTokens,
  completedStagesCount
}) => {
  const [shared, setShared] = useState(false);

  const getProviderBadge = () => {
    switch (llmConfig.provider) {
      case "openai":
        return { label: `OpenAI (${llmConfig.model || "gpt-4o"})`, color: "bg-emerald-50 text-emerald-700 border-emerald-300" };
      case "anthropic":
        return { label: `Claude (${llmConfig.model || "claude-3-5"})`, color: "bg-amber-50 text-amber-700 border-amber-300" };
      case "gemini":
        return { label: `Gemini (${llmConfig.model || "2.0-flash"})`, color: "bg-blue-50 text-blue-700 border-blue-300" };
      case "groq":
        return { label: `Groq (${llmConfig.model || "llama-3.3"})`, color: "bg-orange-50 text-orange-700 border-orange-300" };
      case "ollama":
        return { label: `Ollama (${llmConfig.model || "local"})`, color: "bg-purple-50 text-purple-700 border-purple-300" };
      default:
        return { label: "High-Fidelity Synthesizer", color: "bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold" };
    }
  };

  const handleCopyShare = () => {
    onShareLink();
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const badge = getProviderBadge();

  return (
    <header className="h-16 border-b border-slate-200 bg-white sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between shadow-sm">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white font-bold">
          <Layers className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg text-slate-900 tracking-tight">SpecFlow AI</span>
            <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              SDLC Suite
            </span>
          </div>
          <p className="text-xs text-slate-500 hidden sm:block">
            Automated Software Development Life Cycle Specification Generator
          </p>
        </div>
      </div>

      {/* Center Status / Model pill */}
      <div className="hidden lg:flex items-center gap-3">
        <button
          onClick={onOpenSettings}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all hover:shadow-sm ${badge.color}`}
        >
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
          <span>{badge.label}</span>
          <Settings className="h-3 w-3 opacity-60 ml-1" />
        </button>

        {/* Live Site Link Pill */}
        <a
          href="https://tarun1790.github.io/spec6/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition-all shadow-sm"
          title="Open Live GitHub Pages Site"
        >
          <Globe className="h-3.5 w-3.5 text-emerald-600" />
          <span>tarun1790.github.io/spec6</span>
        </a>

        {isGenerating ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-semibold animate-pulse shadow-sm">
            <Zap className="h-3.5 w-3.5 text-emerald-600 animate-spin" />
            <span>Streaming Chained SDLC...</span>
          </div>
        ) : completedStagesCount === 6 ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold shadow-sm">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>6/6 Specifications Ready</span>
            {totalTokens > 0 && <span className="opacity-75 font-mono text-[11px]">({totalTokens.toLocaleString()} tokens)</span>}
          </div>
        ) : null}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={handleCopyShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition-colors"
          title="Shareable Project Link"
        >
          {shared ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-emerald-700">Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="h-3.5 w-3.5 text-slate-600" />
              <span className="hidden sm:inline">Share</span>
            </>
          )}
        </button>

        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 transition-colors border border-slate-200 shadow-sm"
          title="Configure LLM & Providers"
        >
          <Settings className="h-4 w-4" />
        </button>

        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export Hub</span>
        </button>
      </div>
    </header>
  );
};
