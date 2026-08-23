"use client";

import React, { useState } from "react";
import {
  X,
  Download,
  FileCode,
  Check,
  FolderArchive,
  FileText,
  Code2,
  Share2,
  Copy,
  Globe
} from "lucide-react";
import { StageState, STAGES } from "@/lib/types";
import { exportSpecificationZip } from "@/lib/zip-exporter";
import { saveAs } from "file-saver";

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
  projectName = "SpecFlow-SDLC-Architecture"
}) => {
  const [name, setName] = useState(projectName);
  const [isExporting, setIsExporting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    setIsExporting(true);
    try {
      await exportSpecificationZip(name, stages, userPrompt);
    } catch (err) {
      console.error("Export zip error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadMasterMarkdown = () => {
    let combined = `# Master Architecture Specification Suite: ${name}\n\n`;
    combined += `> Generated on ${new Date().toISOString().split("T")[0]} with SpecFlow AI SDLC Engine.\n\n`;
    combined += `## 📋 Requirements Prompt\n\n\`\`\`text\n${userPrompt.trim()}\n\`\`\`\n\n---\n\n`;

    STAGES.forEach((s) => {
      const state = stages.find((st) => st.index === s.index);
      combined += state?.content || `# ${s.fileName}\n\n*Pending generation.*\n\n`;
      combined += `\n\n---\n\n`;
    });

    const blob = new Blob([combined], { type: "text/markdown;charset=utf-8" });
    saveAs(blob, `${name.toLowerCase()}-master-spec.md`);
  };

  const handleDownloadHTMLReport = () => {
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - SpecFlow AI Architecture Suite</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
    mermaid.initialize({ startOnLoad: true, theme: 'default' });
  </script>
</head>
<body class="bg-slate-50 text-slate-900 font-sans p-8 max-w-5xl mx-auto">
  <header class="mb-8 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
    <h1 class="text-3xl font-bold text-slate-900">${name}</h1>
    <p class="text-sm text-emerald-700 font-semibold mt-1">SpecFlow AI SDLC Specification Report • ${new Date().toISOString().split("T")[0]}</p>
  </header>
  <main class="space-y-6">
`;

    STAGES.forEach((s) => {
      const state = stages.find((st) => st.index === s.index);
      html += `    <section class="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <h2 class="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">${s.fileName}: ${s.title}</h2>
      <pre class="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto whitespace-pre-wrap">${state?.content || "Pending"}</pre>
    </section>\n`;
    });

    html += `  </main>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    saveAs(blob, `${name.toLowerCase()}-report.html`);
  };

  const handleDownloadJSONManifest = () => {
    const manifest = {
      projectTitle: name,
      generatedAt: new Date().toISOString(),
      generator: "SpecFlow AI SDLC Engine",
      userPrompt,
      specifications: stages.map((s) => {
        const def = STAGES.find((d) => d.index === s.index);
        return {
          index: s.index,
          fileName: s.fileName,
          title: def?.title,
          sdlcPhase: def?.sdlcPhase,
          tokens: s.tokensGenerated,
          durationMs: s.durationMs,
          content: s.content
        };
      })
    };

    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json;charset=utf-8" });
    saveAs(blob, `${name.toLowerCase()}-manifest.json`);
  };

  const handleCopyShareUrl = () => {
    const shareableUrl = `https://tarun1790.github.io/spec6/?template=${encodeURIComponent(name)}`;
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200">
              <FolderArchive className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Multi-Format Export & Sharing Hub</h2>
              <p className="text-xs text-slate-500">Download bundles or generate live shareable links</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Project Title Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Project Archive Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. MyEnterpriseArchitecture"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 font-mono"
            />
          </div>

          {/* Shareable Link Card */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Globe className="h-4 w-4 text-emerald-700" />
              <div>
                <div className="text-xs font-bold text-emerald-950">Live GitHub.io Shareable Link</div>
                <div className="text-[11px] text-emerald-800 font-mono">https://tarun1790.github.io/spec6/</div>
              </div>
            </div>
            <button
              onClick={handleCopyShareUrl}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedLink ? "Copied!" : "Copy"}</span>
            </button>
          </div>

          {/* Export Grid */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {/* ZIP Export */}
            <button
              onClick={handleDownloadZip}
              disabled={isExporting}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <FolderArchive className="h-4 w-4 text-emerald-600" />
                <Download className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-700" />
              </div>
              <div className="text-xs font-bold text-slate-900">Full .ZIP Archive</div>
              <div className="text-[10px] text-slate-500">.specs/ folder + README.md index</div>
            </button>

            {/* Master Markdown */}
            <button
              onClick={handleDownloadMasterMarkdown}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <FileText className="h-4 w-4 text-indigo-600" />
                <Download className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-700" />
              </div>
              <div className="text-xs font-bold text-slate-900">Master Markdown (.md)</div>
              <div className="text-[10px] text-slate-500">All 6 documents combined</div>
            </button>

            {/* Interactive HTML Report */}
            <button
              onClick={handleDownloadHTMLReport}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <FileCode className="h-4 w-4 text-teal-600" />
                <Download className="h-3.5 w-3.5 text-slate-400 group-hover:text-teal-700" />
              </div>
              <div className="text-xs font-bold text-slate-900">HTML Presentation Deck</div>
              <div className="text-[10px] text-slate-500">Standalone report with Mermaid</div>
            </button>

            {/* JSON Manifest */}
            <button
              onClick={handleDownloadJSONManifest}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <Code2 className="h-4 w-4 text-orange-600" />
                <Download className="h-3.5 w-3.5 text-slate-400 group-hover:text-orange-700" />
              </div>
              <div className="text-xs font-bold text-slate-900">JSON Spec Bundle</div>
              <div className="text-[10px] text-slate-500">Structured data with AST metadata</div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          >
            Close Hub
          </button>
        </div>
      </div>
    </div>
  );
};
