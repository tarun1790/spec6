"use client";

import React, { useState } from "react";
import { Folder, FileCode, Copy, Check, Download, Layers, Terminal, Sparkles, FolderTree } from "lucide-react";
import { DomainContext } from "@/lib/mock-generator";
import { TechStackPreferences } from "@/lib/types";
import { generateVirtualMonorepo, SupportedLanguage, VirtualFile } from "@/lib/monorepo-generator";
import { saveAs } from "file-saver";

interface MonorepoStudioProps {
  domain: DomainContext;
  techStack: TechStackPreferences;
}

export const MonorepoStudio: React.FC<MonorepoStudioProps> = ({ domain, techStack }) => {
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>("typescript");
  const files = generateVirtualMonorepo(domain, techStack, selectedLang);
  const [selectedFilePath, setSelectedFilePath] = useState<string>(files[3]?.path || files[0].path);
  const [copied, setCopied] = useState(false);

  const activeFile = files.find((f) => f.path === selectedFilePath) || files[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([activeFile.content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, activeFile.name);
  };

  // Group files by top-level category
  const categories: { key: VirtualFile["category"]; label: string; icon: string }[] = [
    { key: "specs", label: "specs/ (Contracts & BDD)", icon: "📋" },
    { key: "backend", label: selectedLang === "python" ? "app/ (FastAPI Core)" : selectedLang === "go" ? "cmd/ (Go Engine)" : selectedLang === "rust" ? "src/ (Axum Core)" : "src/ (Express/TypeScript)", icon: "⚡" },
    { key: "models", label: "models/ (Relational Schemas)", icon: "🗄️" },
    { key: "tests", label: "tests/ (E2E & Contract Suites)", icon: "🧪" },
    { key: "deploy", label: "deploy/ (Docker & CI/CD)", icon: "🚀" }
  ];

  return (
    <div className="h-full flex flex-col bg-slate-900 text-slate-100 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
      {/* Top Studio Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-3 gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <FolderTree className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{domain.shortName} Monorepo Code Studio</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                v1.0.0
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              Complete scaffold automatically generated for {domain.title}
            </div>
          </div>
        </div>

        {/* Polyglot Language Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
            Language:
          </span>
          <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            {[
              { id: "typescript", label: "TypeScript", ext: "TS" },
              { id: "python", label: "Python", ext: "PY" },
              { id: "go", label: "Go", ext: "GO" },
              { id: "rust", label: "Rust", ext: "RS" }
            ].map((lang) => {
              const isSelected = selectedLang === lang.id;
              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => {
                    setSelectedLang(lang.id as SupportedLanguage);
                    // Reset selected file to matching first backend file in new language
                    const newFiles = generateVirtualMonorepo(domain, techStack, lang.id as SupportedLanguage);
                    setSelectedFilePath(newFiles[3]?.path || newFiles[0].path);
                  }}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-emerald-600 text-white font-bold shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {lang.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Studio Body: Two Pane (File Tree | Code Viewer) */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        {/* Left Pane: Virtual File Tree (4 cols on md) */}
        <div className="md:col-span-4 border-r border-slate-800 bg-slate-950/60 p-3 overflow-y-auto space-y-4 select-none">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1">
            Project Explorer ({files.length} Files)
          </div>

          {categories.map((cat) => {
            const catFiles = files.filter((f) => f.category === cat.key);
            if (catFiles.length === 0) return null;

            return (
              <div key={cat.key} className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 px-1.5 py-1 rounded">
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </div>
                <div className="pl-3 space-y-0.5 border-l border-slate-800/80 ml-2">
                  {catFiles.map((file) => {
                    const isSelected = selectedFilePath === file.path;
                    return (
                      <button
                        key={file.path}
                        type="button"
                        onClick={() => setSelectedFilePath(file.path)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all text-left ${
                          isSelected
                            ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileCode className="h-3.5 w-3.5 flex-shrink-0 text-slate-500" />
                          <span className="truncate">{file.name}</span>
                        </div>
                        <span className="text-[9px] uppercase font-bold text-slate-600 px-1 rounded bg-slate-900">
                          {file.language}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Pane: Code Viewer with syntax highlight, line count, actions */}
        <div className="md:col-span-8 flex flex-col overflow-hidden bg-slate-900">
          {/* File Header / Breadcrumb */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-950/80">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-300 truncate">
              <span className="text-slate-500">{domain.shortName.toLowerCase()}/</span>
              <span className="text-emerald-400 font-bold">{activeFile.path}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                title="Copy File Content"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadFile}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                title="Download single file"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>

          {/* Code Body */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-slate-200">
            <pre className="whitespace-pre">
              <code>{activeFile.content}</code>
            </pre>
          </div>

          {/* Bottom Status Bar */}
          <div className="px-4 py-1.5 border-t border-slate-800 bg-slate-950 text-[10px] font-mono text-slate-500 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span>Encoding: UTF-8</span>
              <span>Lines: {activeFile.content.split("\n").length}</span>
              <span>Bytes: {activeFile.content.length} B</span>
            </div>
            <div className="text-emerald-400 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              <span>Production-Ready Clean Architecture</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
