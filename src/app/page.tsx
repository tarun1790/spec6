"use client";

import React, { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { ControllerPanel } from "@/components/ControllerPanel";
import { WorkspaceViewer } from "@/components/WorkspaceViewer";
import { ModelSettingsModal } from "@/components/ModelSettingsModal";
import { ExportModal } from "@/components/ExportModal";
import { DiffViewerModal } from "@/components/DiffViewerModal";
import { STAGES, StageState, TechStackPreferences, LLMConfig, SSEEvent } from "@/lib/types";
import { TEMPLATES } from "@/lib/templates";
import { exportSpecificationZip } from "@/lib/zip-exporter";

const initialTechStack: TechStackPreferences = {
  frontend: "Next.js 14 (App Router) + Tailwind CSS",
  backend: "FastAPI / Node.js Microservices",
  database: "PostgreSQL 16 + Redis Cluster",
  architecture: "Event-Driven Microservices with Message Bus",
  deployment: "Kubernetes (EKS) + Docker + Terraform",
  auth: "OAuth 2.0 / JWT + RBAC",
  caching: "Redis Cluster with Cache-Aside"
};

const initialStages: StageState[] = STAGES.map((s) => ({
  index: s.index,
  fileName: s.fileName,
  status: "idle",
  content: "",
  tokensGenerated: 0,
  durationMs: 0
}));

export default function DashboardPage() {
  const [prompt, setPrompt] = useState<string>(TEMPLATES[0].prompt);
  const [techStack, setTechStack] = useState<TechStackPreferences>(TEMPLATES[0].defaultTechStack || initialTechStack);
  const [stages, setStages] = useState<StageState[]>(initialStages);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [totalTokens, setTotalTokens] = useState<number>(0);

  // Settings & Modals
  const [llmConfig, setLlmConfig] = useState<LLMConfig>({
    provider: "mock",
    model: "synthesizer-v1",
    temperature: 0.3
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [diffModal, setDiffModal] = useState<{
    isOpen: boolean;
    fileName: string;
    original: string;
    current: string;
  }>({ isOpen: false, fileName: "", original: "", current: "" });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Load saved LLM config from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("specflow_llm_config");
      if (saved) {
        setLlmConfig(JSON.parse(saved));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleSaveLlmConfig = (newConfig: LLMConfig) => {
    setLlmConfig(newConfig);
    try {
      localStorage.setItem("specflow_llm_config", JSON.stringify(newConfig));
    } catch {
      // Ignore
    }
  };

  const handleStartGeneration = async (targetStageIndex?: number) => {
    if (!prompt.trim() || isGenerating) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsGenerating(true);

    // Reset stages if running full pipeline
    if (targetStageIndex === undefined || targetStageIndex === null) {
      setStages((prev) =>
        prev.map((s) => ({
          ...s,
          status: "idle",
          content: "",
          tokensGenerated: 0,
          durationMs: 0
        }))
      );
      setActiveStageIndex(0);
      setSelectedStageIndex(0);
    } else {
      // Reset only target stage
      setStages((prev) =>
        prev.map((s) =>
          s.index === targetStageIndex
            ? { ...s, status: "idle", content: "", tokensGenerated: 0 }
            : s
        )
      );
      setActiveStageIndex(targetStageIndex);
      setSelectedStageIndex(targetStageIndex);
    }

    // Build accumulated context map
    const accumulatedContext: Record<string, string> = {};
    stages.forEach((s) => {
      if (s.content && s.index < (targetStageIndex ?? 6)) {
        accumulatedContext[s.fileName] = s.content;
      }
    });

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "text/event-stream"
        },
        body: JSON.stringify({
          prompt,
          techStack,
          llmConfig,
          targetStage: targetStageIndex,
          accumulatedContext
        }),
        signal: abortController.signal
      });

      if (!response.ok) {
        throw new Error(`Generation error HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No readable stream from orchestrator");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;
          const jsonStr = trimmed.slice(6);

          try {
            const event: SSEEvent = JSON.parse(jsonStr);

            if (event.event === "stage_start") {
              setActiveStageIndex(event.stage_index);
              setSelectedStageIndex(event.stage_index);
              setStages((prev) =>
                prev.map((s) =>
                  s.index === event.stage_index
                    ? { ...s, status: "generating", content: "" }
                    : s
                )
              );
            } else if (event.event === "chunk") {
              setStages((prev) =>
                prev.map((s) =>
                  s.index === event.stage_index
                    ? { ...s, content: s.content + event.content }
                    : s
                )
              );
            } else if (event.event === "stage_complete") {
              setStages((prev) =>
                prev.map((s) =>
                  s.index === event.stage_index
                    ? {
                        ...s,
                        status: "completed",
                        tokensGenerated: event.tokens_generated || 0,
                        durationMs: event.duration_ms || 0
                      }
                    : s
                )
              );
            } else if (event.event === "pipeline_complete") {
              setTotalTokens(event.total_tokens);
              setIsGenerating(false);
            } else if (event.event === "error") {
              setStages((prev) =>
                prev.map((s) =>
                  s.index === event.stage_index
                    ? { ...s, status: "failed", errorMessage: event.error_message }
                    : s
                )
              );
            }
          } catch {
            // Ignore parse errors on partial frames
          }
        }
      }
    } catch (err) {
      if (!abortController.signal.aborted) {
        console.error("Pipeline execution error:", err);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
  };

  const handleReset = () => {
    handleStopGeneration();
    setStages(initialStages);
    setActiveStageIndex(0);
    setSelectedStageIndex(0);
    setTotalTokens(0);
  };

  const handleUpdateStageContent = (stageIndex: number, newContent: string) => {
    setStages((prev) =>
      prev.map((s) => (s.index === stageIndex ? { ...s, content: newContent } : s))
    );
  };

  const handleQuickDownloadZip = async () => {
    await exportSpecificationZip("SpecFlow-Project", stages, prompt);
  };

  const handleShareLink = () => {
    const url = `https://tarun1790.github.io/spec6/`;
    navigator.clipboard.writeText(url);
  };

  const completedCount = stages.filter((s) => s.status === "completed").length;

  return (
    <div className="h-screen flex flex-col bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Top Header */}
      <Header
        llmConfig={llmConfig}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onQuickDownloadZip={handleQuickDownloadZip}
        onShareLink={handleShareLink}
        isGenerating={isGenerating}
        totalTokens={totalTokens}
        completedStagesCount={completedCount}
      />

      {/* Main Two-Pane Split Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Controller Pane (4 cols on lg) */}
        <div className="lg:col-span-4 h-full overflow-hidden">
          <ControllerPanel
            prompt={prompt}
            setPrompt={setPrompt}
            techStack={techStack}
            setTechStack={setTechStack}
            stages={stages}
            isGenerating={isGenerating}
            activeStageIndex={activeStageIndex}
            onStartGeneration={() => handleStartGeneration()}
            onStopGeneration={handleStopGeneration}
            onReset={handleReset}
            onRegenerateStage={(idx) => handleStartGeneration(idx)}
            onSelectStageTab={(idx) => setSelectedStageIndex(idx)}
          />
        </div>

        {/* Right Workspace Viewer Pane (8 cols on lg) */}
        <div className="lg:col-span-8 h-full overflow-hidden">
          <WorkspaceViewer
            stages={stages}
            selectedStageIndex={selectedStageIndex}
            onSelectStageIndex={setSelectedStageIndex}
            onUpdateStageContent={handleUpdateStageContent}
            onOpenDiff={(fileName, orig, curr) => {
              setDiffModal({ isOpen: true, fileName, original: orig, current: curr });
            }}
            isGenerating={isGenerating}
          />
        </div>
      </div>

      {/* Modals */}
      <ModelSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={llmConfig}
        onSave={handleSaveLlmConfig}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        stages={stages}
        userPrompt={prompt}
      />

      <DiffViewerModal
        isOpen={diffModal.isOpen}
        onClose={() => setDiffModal({ ...diffModal, isOpen: false })}
        fileName={diffModal.fileName}
        originalContent={diffModal.original}
        currentContent={diffModal.current}
      />
    </div>
  );
}
