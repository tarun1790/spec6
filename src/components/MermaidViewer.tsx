"use client";

import React, { useEffect, useRef, useState } from "react";
import { Maximize2, ZoomIn, ZoomOut, RotateCcw, Copy, Check, Download, AlertTriangle } from "lucide-react";

interface MermaidViewerProps {
  chart: string;
  id?: string;
}

export const MermaidViewer: React.FC<MermaidViewerProps> = ({ chart, id }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const chartId = useRef(`mermaid-${id || Math.random().toString(36).substring(2, 9)}`);

  useEffect(() => {
    let isMounted = true;

    async function renderChart() {
      if (!chart.trim()) return;

      try {
        setError(null);
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "loose",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          themeVariables: {
            darkMode: true,
            background: "#0f172a",
            primaryColor: "#6366f1",
            primaryTextColor: "#f8fafc",
            primaryBorderColor: "#818cf8",
            lineColor: "#94a3b8",
            secondaryColor: "#1e293b",
            tertiaryColor: "#090d16"
          }
        });

        const cleanChart = chart.trim();
        const renderId = `${chartId.current}-${Date.now()}`;
        const { svg } = await mermaid.render(renderId, cleanChart);

        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err) {
        if (isMounted) {
          console.warn("Mermaid rendering error:", err);
          setError(err instanceof Error ? err.message : "Failed to compile Mermaid diagram");
        }
      }
    }

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(chart);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSvg = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `diagram-${chartId.current}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`my-6 rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl transition-all ${isFullscreen ? "fixed inset-4 z-50 flex flex-col bg-slate-950/95 backdrop-blur-xl border-indigo-500/50" : ""}`}>
      {/* Diagram Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/70 border-b border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">Mermaid Visual Diagram</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setScale((s) => Math.min(s + 0.15, 2.5))}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setScale((s) => Math.max(s - 0.15, 0.5))}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setScale(1)}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            title="Reset Zoom"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <div className="h-3 w-px bg-slate-800 mx-1" />
          <button
            onClick={handleCopyCode}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            title="Copy Mermaid Code"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={handleDownloadSvg}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            title="Download SVG"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Render Area */}
      <div
        ref={containerRef}
        className={`p-6 overflow-auto flex items-center justify-center min-h-[220px] bg-gradient-to-b from-slate-900/50 to-slate-950/80 ${isFullscreen ? "flex-1" : "max-h-[550px]"}`}
      >
        {error ? (
          <div className="w-full text-left p-4 rounded-lg bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs">
            <div className="flex items-center gap-2 font-semibold mb-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span>Diagram Rendering Note</span>
            </div>
            <p className="text-slate-400 mb-3 font-mono text-[11px]">{error}</p>
            <div className="p-3 rounded bg-slate-950 font-mono text-[11px] overflow-x-auto text-slate-300">
              <pre>{chart}</pre>
            </div>
          </div>
        ) : svgContent ? (
          <div
            className="transition-transform duration-150 ease-out flex justify-center items-center select-none"
            style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span>Compiling Mermaid diagram...</span>
          </div>
        )}
      </div>
    </div>
  );
};
