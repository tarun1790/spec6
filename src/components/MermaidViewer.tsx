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
          theme: "default",
          securityLevel: "loose",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          themeVariables: {
            primaryColor: "#ecfdf5",
            primaryTextColor: "#064e3b",
            primaryBorderColor: "#059669",
            lineColor: "#047857",
            secondaryColor: "#fef2f2",
            secondaryTextColor: "#991b1b",
            secondaryBorderColor: "#ef4444",
            tertiaryColor: "#f8fafc",
            background: "#ffffff"
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
    <div className={`my-6 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all ${isFullscreen ? "fixed inset-4 z-50 flex flex-col bg-white/95 backdrop-blur-xl border-emerald-500 shadow-2xl" : ""}`}>
      {/* Diagram Toolbar Card */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">SDLC Visual Architecture Diagram</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setScale((s) => Math.min(s + 0.15, 2.5))}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setScale((s) => Math.max(s - 0.15, 0.5))}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setScale(1)}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <div className="h-3.5 w-px bg-slate-300 mx-1" />
          <button
            onClick={handleCopyCode}
            className="p-1.5 hover:bg-emerald-50 rounded-lg text-slate-600 hover:text-emerald-700 transition-colors"
            title="Copy Mermaid Code"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={handleDownloadSvg}
            className="p-1.5 hover:bg-emerald-50 rounded-lg text-slate-600 hover:text-emerald-700 transition-colors"
            title="Download SVG"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Render Area */}
      <div
        ref={containerRef}
        className={`p-6 overflow-auto flex items-center justify-center min-h-[240px] bg-slate-50/50 ${isFullscreen ? "flex-1" : "max-h-[550px]"}`}
      >
        {error ? (
          <div className="w-full text-left p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
            <div className="flex items-center gap-2 font-bold mb-2 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              <span>Diagram Rendering Notice</span>
            </div>
            <p className="text-slate-600 mb-3 font-mono text-[11px]">{error}</p>
            <div className="p-3 rounded-lg bg-white border border-red-200 font-mono text-[11px] overflow-x-auto text-slate-800">
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
            <div className="h-4 w-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span>Compiling Visual SDLC Diagram...</span>
          </div>
        )}
      </div>
    </div>
  );
};
