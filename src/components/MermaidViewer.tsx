"use client";

import React, { useEffect, useRef, useState } from "react";
import { Maximize2, ZoomIn, ZoomOut, RotateCcw, Copy, Check, Download } from "lucide-react";

interface MermaidViewerProps {
  chart: string;
  id?: string;
}

export const MermaidViewer: React.FC<MermaidViewerProps> = ({ chart, id }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const chartId = useRef(`mermaid-${id || Math.random().toString(36).substring(2, 9)}`);

  useEffect(() => {
    let isMounted = true;

    // Helper to sweep and remove any stray error elements injected by Mermaid
    const cleanupStrayErrors = () => {
      if (typeof document === "undefined") return;
      const strays = document.querySelectorAll('[id^="dmermaid"], #dmermaid, .error-icon, .error-text');
      strays.forEach((el) => el.remove());
    };

    async function renderChart() {
      if (!chart.trim()) return;

      try {
        setHasError(false);
        cleanupStrayErrors();

        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          suppressErrorRendering: true,
          securityLevel: "loose",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          theme: "default",
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

        // Validate syntax first before attempting to render
        const isValid = await mermaid.parse(cleanChart, { suppressErrors: true });
        if (!isValid) {
          if (isMounted) setHasError(true);
          cleanupStrayErrors();
          return;
        }

        const renderId = `${chartId.current}-${Date.now()}`;
        const { svg } = await mermaid.render(renderId, cleanChart);

        cleanupStrayErrors();

        if (isMounted) {
          setSvgContent(svg);
        }
      } catch {
        cleanupStrayErrors();
        if (isMounted) {
          setHasError(true);
        }
      }
    }

    renderChart();

    return () => {
      isMounted = false;
      cleanupStrayErrors();
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
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">System Architecture Diagram</span>
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
            title="Copy Diagram Code"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
          {svgContent && (
            <button
              onClick={handleDownloadSvg}
              className="p-1.5 hover:bg-emerald-50 rounded-lg text-slate-600 hover:text-emerald-700 transition-colors"
              title="Download SVG"
            >
              <Download className="h-3.5 w-3.5" />
            </button>
          )}
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
        className={`p-6 overflow-auto flex items-center justify-center min-h-[200px] bg-slate-50/50 ${isFullscreen ? "flex-1" : "max-h-[550px]"}`}
      >
        {hasError ? (
          <div className="w-full text-left p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto">
            <div className="text-emerald-400 font-bold mb-2">mermaid</div>
            <pre className="text-slate-300">{chart}</pre>
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
            <span>Rendering Diagram...</span>
          </div>
        )}
      </div>
    </div>
  );
};
