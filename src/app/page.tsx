"use client";

import React, { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { ControllerPanel } from "@/components/ControllerPanel";
import { WorkspaceViewer } from "@/components/WorkspaceViewer";
import { ModelSettingsModal } from "@/components/ModelSettingsModal";
import { ExportModal } from "@/components/ExportModal";
import { DiffViewerModal } from "@/components/DiffViewerModal";
import { CopilotDrawer } from "@/components/CopilotDrawer";
import { SddDecisionModal } from "@/components/SddDecisionModal";
import { AiwarePaperModal } from "@/components/AiwarePaperModal";
import { STAGES, StageState, TechStackPreferences, LLMConfig, SSEEvent, SpecificationRigor } from "@/lib/types";
import { TEMPLATES } from "@/lib/templates";
import { exportSpecificationZip } from "@/lib/zip-exporter";
import { generateMockStageContent, extractDomainContext } from "@/lib/mock-generator";
import { streamStageContent } from "@/lib/llm-providers";
import { X } from "lucide-react";

import { detectOptimalTechStack } from "@/lib/stack-detector";

const initialPrompt = "";

const initialTechStack: TechStackPreferences = detectOptimalTechStack(initialPrompt);

const initialStages: StageState[] = STAGES.map((s) => ({
  index: s.index,
  fileName: s.fileName,
  status: "idle" as const,
  content: "",
  tokensGenerated: 0,
  durationMs: 0
}));

const initialTotalTokens = 0;

export default function DashboardPage() {
  const [prompt, setPrompt] = useState<string>(initialPrompt);
  const [techStack, setTechStack] = useState<TechStackPreferences>(initialTechStack);
  const [stages, setStages] = useState<StageState[]>(initialStages);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [totalTokens, setTotalTokens] = useState<number>(initialTotalTokens);
  const [liveSync, setLiveSync] = useState<boolean>(true);

  const handlePromptChange = (newPrompt: string) => {
    setPrompt(newPrompt);
    if (newPrompt.trim().length > 5) {
      const detected = detectOptimalTechStack(newPrompt);
      setTechStack(detected);
    }
  };

  // Settings & Modals
  const [llmConfig, setLlmConfig] = useState<LLMConfig>({
    provider: "mock",
    model: "synthesizer-v1",
    temperature: 0.3
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);

  // Real-time reactive background synthesis engine: as the user edits or types any description,
  // all 6 specification stages automatically synthesize and update in real-time!
  useEffect(() => {
    if (!liveSync || isGenerating || llmConfig.provider !== "mock") return;
    if (!prompt || prompt.trim().length < 5) {
      if (!prompt || prompt.trim().length === 0) {
        setStages(
          STAGES.map((s) => ({
            index: s.index,
            fileName: s.fileName,
            status: "idle" as const,
            content: "",
            tokensGenerated: 0,
            durationMs: 0
          }))
        );
        setTotalTokens(0);
      }
      return;
    }

    const timer = setTimeout(() => {
      const updated = STAGES.map((s) => {
        const content = generateMockStageContent(s.index, prompt, techStack, {});
        return {
          index: s.index,
          fileName: s.fileName,
          status: "completed" as const,
          content,
          tokensGenerated: Math.round(content.length / 4),
          durationMs: 15
        };
      });
      setStages(updated);
      const sumTokens = updated.reduce((acc, st) => acc + st.tokensGenerated, 0);
      setTotalTokens(sumTokens);
    }, 180);

    return () => clearTimeout(timer);
  }, [prompt, techStack, liveSync, isGenerating, llmConfig.provider]);

  const [diffModal, setDiffModal] = useState<{
    isOpen: boolean;
    fileName: string;
    original: string;
    current: string;
  }>({ isOpen: false, fileName: "", original: "", current: "" });
  const [rigor, setRigor] = useState<SpecificationRigor>("spec-anchored");
  const [isRigorAdvisorOpen, setIsRigorAdvisorOpen] = useState<boolean>(false);
  const [isPaperModalOpen, setIsPaperModalOpen] = useState<boolean>(false);

  const handleApplyRefactor = (stageIndex: number, addition: string) => {
    setStages((prev) =>
      prev.map((s) =>
        s.index === stageIndex ? { ...s, content: s.content + "\n" + addition } : s
      )
    );
  };

  const handleAtomicMultiStageUpdate = (updates: { stageIndex: number; contentAddition: string }[]) => {
    setStages((prev) =>
      prev.map((s) => {
        const match = updates.find((u) => u.stageIndex === s.index);
        return match ? { ...s, content: s.content + "\n" + match.contentAddition } : s;
      })
    );
  };

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
    } catch {
      if (!abortController.signal.aborted) {
        // Robust client-side progressive streaming fallback for static environments (GitHub Pages)
        const startIndex = targetStageIndex !== undefined && targetStageIndex !== null ? targetStageIndex : 0;
        const endIndex = targetStageIndex !== undefined && targetStageIndex !== null ? targetStageIndex + 1 : 6;
        let runningTokens = totalTokens;

        for (let i = startIndex; i < endIndex; i++) {
          if (abortController.signal.aborted) break;

          setActiveStageIndex(i);
          setSelectedStageIndex(i);
          setStages((prev) =>
            prev.map((s) => (s.index === i ? { ...s, status: "generating", content: "" } : s))
          );

          const stageStartTime = Date.now();
          let stageContent = "";

          try {
            for await (const chunk of streamStageContent(
              i,
              prompt,
              techStack,
              llmConfig,
              accumulatedContext,
              abortController.signal
            )) {
              if (abortController.signal.aborted) break;
              stageContent += chunk;
              setStages((prev) =>
                prev.map((s) => (s.index === i ? { ...s, content: s.content + chunk } : s))
              );
            }
          } catch (streamErr) {
            console.warn("Direct stream error, falling back to synthesizer:", streamErr);
            stageContent = generateMockStageContent(i, prompt, techStack, accumulatedContext);
            setStages((prev) =>
              prev.map((s) => (s.index === i ? { ...s, content: stageContent } : s))
            );
          }

          accumulatedContext[STAGES[i].fileName] = stageContent;
          const durationMs = Date.now() - stageStartTime;
          const tokens = Math.round(stageContent.length / 4);
          runningTokens += tokens;

          setStages((prev) =>
            prev.map((s) =>
              s.index === i
                ? {
                    ...s,
                    status: "completed",
                    tokensGenerated: tokens,
                    durationMs
                  }
                : s
            )
          );
        }
        setTotalTokens(runningTokens);
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
    setPrompt("");
    const emptyStages: StageState[] = STAGES.map((s) => ({
      index: s.index,
      fileName: s.fileName,
      status: "idle",
      content: "",
      tokensGenerated: 0,
      durationMs: 0
    }));
    setStages(emptyStages);
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
    await exportSpecificationZip("SpecFlow-Project", stages, prompt, techStack, rigor);
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
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onOpenRigorAdvisor={() => setIsRigorAdvisorOpen(true)}
        onOpenPaperModal={() => setIsPaperModalOpen(true)}
        rigor={rigor}
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
            setPrompt={handlePromptChange}
            techStack={techStack}
            setTechStack={setTechStack}
            stages={stages}
            isGenerating={isGenerating}
            activeStageIndex={activeStageIndex}
            onStartGeneration={() => handleStartGeneration()}
            onStopGeneration={handleStopGeneration}
            onReset={handleReset}
            onRegenerateStage={(idx: number) => handleStartGeneration(idx)}
            onSelectStageTab={(idx: number) => setSelectedStageIndex(idx)}
            onQuickDownloadZip={handleQuickDownloadZip}
            llmConfig={llmConfig}
            onOpenSettings={() => setIsSettingsOpen(true)}
            rigor={rigor}
            setRigor={setRigor}
            onOpenRigorAdvisor={() => setIsRigorAdvisorOpen(true)}
            onOpenPaperModal={() => setIsPaperModalOpen(true)}
            liveSync={liveSync}
            setLiveSync={setLiveSync}
          />
        </div>

        {/* Right Workspace Viewer Pane (8 cols on lg) */}
        <div className="lg:col-span-8 h-full overflow-hidden">
          <WorkspaceViewer
            stages={stages}
            selectedStageIndex={selectedStageIndex}
            onSelectStageIndex={setSelectedStageIndex}
            onUpdateStageContent={handleUpdateStageContent}
            onAtomicMultiStageUpdate={handleAtomicMultiStageUpdate}
            onOpenCopilot={() => setIsCopilotOpen(true)}
            onOpenDiff={(fileName: string, orig: string, curr: string) => {
              setDiffModal({ isOpen: true, fileName, original: orig, current: curr });
            }}
            isGenerating={isGenerating}
            techStack={techStack}
            rigor={rigor}
            userPrompt={prompt}
            onSetPrompt={handlePromptChange}
          />
        </div>
      </div>

      {/* Modals & Drawers */}
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

      <CopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        activeStageIndex={selectedStageIndex}
        stages={stages}
        techStack={techStack}
        onApplyRefactor={handleApplyRefactor}
      />

      <SddDecisionModal
        isOpen={isRigorAdvisorOpen}
        onClose={() => setIsRigorAdvisorOpen(false)}
        currentRigor={rigor}
        onSelectRigor={setRigor}
      />

      <AiwarePaperModal
        isOpen={isPaperModalOpen}
        onClose={() => setIsPaperModalOpen(false)}
        onSelectRigor={setRigor}
        onOpenAdvisor={() => setIsRigorAdvisorOpen(true)}
      />
    </div>
  );
}
