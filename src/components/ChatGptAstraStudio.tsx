"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Camera,
  CameraOff,
  HardDrive,
  Database,
  Cpu,
  Layers,
  Trash2,
  RefreshCw,
  Download,
  Upload,
  Copy,
  Check,
  ArrowRight,
  Code2,
  Eye,
  ScanLine,
  Zap,
  Sliders,
  ChevronDown,
  ChevronUp,
  X,
  Plus
} from "lucide-react";
import { DomainContext } from "@/lib/mock-generator";
import { TechStackPreferences, StageState } from "@/lib/types";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface ChatGptAstraStudioProps {
  domain: DomainContext;
  techStack: TechStackPreferences;
  stages: StageState[];
  onApplyRefactor?: (stageIndex: number, code: string) => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  thoughtChain?: string[];
  codeSnippet?: string;
  imageAttachment?: string;
  timestamp: string;
}

interface VirtualFile {
  name: string;
  path: string;
  sizeMb: number;
  category: "model" | "vectors" | "vision" | "context" | "artifacts";
  lastUpdated: string;
}

const TOTAL_SPACE_MB = 4096.0; // Strictly 4 GB = 4,096 MB

export const ChatGptAstraStudio: React.FC<ChatGptAstraStudioProps> = ({
  domain,
  techStack,
  stages,
  onApplyRefactor
}) => {
  const e1 = domain.primaryEntities[0] || "EntityAlpha";
  const e2 = domain.primaryEntities[1] || "EntityBeta";

  // --- 1. 4 GB VIRTUAL STORAGE & CONTEXT ENGINE STATE ---
  const [virtualFiles, setVirtualFiles] = useState<VirtualFile[]>([
    {
      name: "astra-7b-omni-q4_k_m.gguf",
      path: "/astra-mnt/models/astra-7b-omni-q4_k_m.gguf",
      sizeMb: 1843.2,
      category: "model",
      lastUpdated: "Just now"
    },
    {
      name: "hnsw_spec_embeddings.bin",
      path: "/astra-mnt/vectors/hnsw_spec_embeddings.bin",
      sizeMb: 512.0,
      category: "vectors",
      lastUpdated: "2 mins ago"
    },
    {
      name: "multimodal_vision_cache.raw",
      path: "/astra-mnt/vision/multimodal_vision_cache.raw",
      sizeMb: 384.0,
      category: "vision",
      lastUpdated: "5 mins ago"
    },
    {
      name: "active_session_kv_cache.bin",
      path: "/astra-mnt/context/active_session_kv_cache.bin",
      sizeMb: 256.0,
      category: "context",
      lastUpdated: "Active"
    },
    {
      name: "polyglot_artifacts_bundle.zip",
      path: "/astra-mnt/artifacts/polyglot_artifacts_bundle.zip",
      sizeMb: 128.0,
      category: "artifacts",
      lastUpdated: "12 mins ago"
    }
  ]);

  const usedSpaceMb = virtualFiles.reduce((acc, f) => acc + f.sizeMb, 0);
  const freeSpaceMb = Math.max(0, TOTAL_SPACE_MB - usedSpaceMb);
  const usedPercent = ((usedSpaceMb / TOTAL_SPACE_MB) * 100).toFixed(1);

  // Storage notification
  const [storageNotice, setStorageNotice] = useState<string | null>(null);

  // --- 2. MULTIMODAL VISION ENGINE STATE ---
  const [isVisionActive, setIsVisionActive] = useState<boolean>(false);
  const [visionMode, setVisionMode] = useState<"webcam" | "diagram">("diagram");
  const [detectedOcr, setDetectedOcr] = useState<string[]>([
    `[Entity Node]: ${e1} (Primary)`,
    `[Relational Edge]: 1-to-N -> ${e2}`,
    `[Network Gateway]: Envoy Proxy (RS256 JWT)`,
    `[Data Lake]: PostgreSQL 16 3NF + Redis Sentinel`
  ]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // --- 3. CHATGPT ADVANCED VOICE ENGINE STATE ---
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(true);
  const [isVoiceCallModalOpen, setIsVoiceCallModalOpen] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // --- 4. CONVERSATIONAL CHAT ENGINE STATE ---
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "astra-init",
      sender: "assistant",
      text: `⚡ **ChatGPT Astra Omni Studio Initialized**\n\nI am your unified **Multimodal Real-Time Assistant & Systems Architect** for **${domain.title}** operating strictly within an isolated **4.00 GB Local Virtual Memory Sandbox** (4,096.0 MB).\n\n**Active Multimodal Capabilities:**\n* 🎙️ **ChatGPT Advanced Voice**: Live bidirectional conversational voice synthesis\n* 📷 **Project Astra Vision**: Live webcam & diagram OCR scene analyzer\n* 💾 **4 GB Local Quota Manager**: In-memory vector embeddings & quantized weights\n* ⚡ **Systems Intelligence**: Architecture scaling (100k+ RPS), 3NF SQL schemas, zero-trust token security, and polyglot code synthesis.\n\nHow can I assist you with **${domain.shortName}** right now?`,
      thoughtChain: [
        "Allocated 4,096 MB local virtual boundary (/astra-mnt)",
        `Mounted quantized Astra-7B Omni weights (1,843.2 MB)`,
        `Initialized HNSW vector database for ${domain.shortName} domain specs`,
        "Voice synthesizer audio pipeline calibrated"
      ],
      timestamp: "10:00 AM"
    }
  ]);

  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [reasoningDepth, setReasoningDepth] = useState<"fast" | "deep">("deep");
  const [activeTab, setActiveTab] = useState<"chat" | "vision" | "storage">("chat");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [appliedId, setAppliedId] = useState<string | null>(null);
  const [expandedThoughts, setExpandedThoughts] = useState<Record<string, boolean>>({ "astra-init": true });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Clean up media streams on unmount
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const getTime = () => {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // --- STORAGE ACTIONS ---
  const handlePruneCache = () => {
    setVirtualFiles((prev) =>
      prev.map((f) => (f.category === "context" ? { ...f, sizeMb: Math.max(64, f.sizeMb - 128) } : f))
    );
    setStorageNotice("Pruned KV Cache: Reclaimed 128.0 MB of space.");
    setTimeout(() => setStorageNotice(null), 3500);
  };

  const handlePurgeVisionBuffer = () => {
    setVirtualFiles((prev) =>
      prev.map((f) => (f.category === "vision" ? { ...f, sizeMb: 64.0 } : f))
    );
    setStorageNotice("Purged Multimodal Vision Buffer: Reclaimed 320.0 MB.");
    setTimeout(() => setStorageNotice(null), 3500);
  };

  const handleCompactVectors = () => {
    setVirtualFiles((prev) =>
      prev.map((f) => (f.category === "vectors" ? { ...f, sizeMb: 360.0 } : f))
    );
    setStorageNotice("Compacted HNSW Vector Store: Reclaimed 152.0 MB.");
    setTimeout(() => setStorageNotice(null), 3500);
  };

  const handleAddCustomFile = () => {
    const sizeToAdd = 64.0;
    if (usedSpaceMb + sizeToAdd > TOTAL_SPACE_MB) {
      alert("Cannot add file: 4 GB Virtual Quota Exceeded! Please prune cache.");
      return;
    }
    const newFile: VirtualFile = {
      name: `user_spec_dataset_${Date.now().toString().slice(-4)}.json`,
      path: `/astra-mnt/artifacts/user_spec_dataset_${Date.now().toString().slice(-4)}.json`,
      sizeMb: sizeToAdd,
      category: "artifacts",
      lastUpdated: "Just now"
    };
    setVirtualFiles((prev) => [...prev, newFile]);
    setStorageNotice(`Ingested ${newFile.name} (64.0 MB) into 4 GB Sandbox.`);
    setTimeout(() => setStorageNotice(null), 3500);
  };

  const handleExportStorageDump = () => {
    const dump = {
      timestamp: new Date().toISOString(),
      quotaLimitMb: TOTAL_SPACE_MB,
      usedSpaceMb,
      freeSpaceMb,
      virtualFiles,
      domain: domain.shortName
    };
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `astra-4gb-sandbox-dump-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- VISION ACTIONS ---
  const toggleWebcam = async () => {
    if (isVisionActive && mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
      setIsVisionActive(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsVisionActive(true);
      setVisionMode("webcam");
    } catch {
      // Fallback to diagram mode if user denies webcam
      setIsVisionActive(true);
      setVisionMode("diagram");
    }
  };

  const triggerVisionScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setDetectedOcr([
        `[Node 01]: ${e1} Microservice (${techStack.backend})`,
        `[Node 02]: ${e2} Event Consumer (Kafka/Redis)`,
        `[Security Boundary]: Zero-Trust OAuth2 MTLS Barrier`,
        `[Database Target]: PostgreSQL 16 Read Replica Pool`,
        `[Live Inference Confidence]: 99.78% (Astra Vision 2.0)`
      ]);

      // Automatically add response to chat
      const ocrSummary = `I scanned the active visual scene. Identified:
1. **${e1} Core Engine**
2. **${e2} Event Bus**
3. **Zero-Trust Auth Gateway**
4. Database connection strings to PostgreSQL 16 cluster. All structural invariants verified.`;
      
      handleSendMessage(`[Astra Vision Scan]: ${ocrSummary}`);
    }, 1200);
  };

  // --- VOICE ACTIONS ---
  const speakText = (text: string) => {
    if (!speechEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    // Strip markdown formatting for cleaner speech
    const clean = text.replace(/[*_#`\[\]()]/g, " ").replace(/\s+/g, " ").slice(0, 300);
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleVoice = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert("Voice speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    try {
      const rec = new SpeechRec();
      recognitionRef.current = rec;
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onstart = () => setIsListening(true);
      rec.onresult = (e: any) => {
        const spoken = e.results[0][0].transcript;
        if (spoken) {
          setInputText(spoken);
          handleSendMessage(spoken);
        }
      };
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      rec.start();
    } catch {
      setIsListening(false);
    }
  };

  // --- CHAT ACTIONS ---
  const handleSendMessage = (textToSend?: string) => {
    const q = (textToSend || inputText).trim();
    if (!q || isThinking) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: q,
      timestamp: getTime()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsThinking(true);

    // Consume some KV Cache memory in our 4 GB quota
    setVirtualFiles((prev) =>
      prev.map((f) => (f.category === "context" ? { ...f, sizeMb: +(f.sizeMb + 0.4).toFixed(1) } : f))
    );

    setTimeout(() => {
      const res = generateAstraResponse(q, domain, techStack, reasoningDepth);
      const aiMsg: ChatMessage = {
        id: `astra-${Date.now()}`,
        sender: "assistant",
        text: res.text,
        thoughtChain: res.thoughtChain,
        codeSnippet: res.codeSnippet,
        timestamp: getTime()
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);

      if (speechEnabled) {
        speakText(res.text);
      }
    }, reasoningDepth === "deep" ? 850 : 400);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApply = (id: string, snippet?: string) => {
    if (!snippet || !onApplyRefactor) return;
    onApplyRefactor(1, snippet);
    setAppliedId(id);
    setTimeout(() => setAppliedId(null), 2500);
  };

  return (
    <div className="h-full flex flex-col rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 text-slate-100 shadow-xl select-none">
      {/* 1. TOP TITLEBAR & 4 GB TELEMETRY HUD */}
      <div className="border-b border-slate-800 bg-slate-900/90 backdrop-blur px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Status */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black">
            <Zap className="h-5 w-5 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white tracking-tight">ChatGPT Astra Omni</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Astra-7B-Omni
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                4.00 GB Sandbox
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Domain: <span className="text-emerald-300 font-semibold">{domain.shortName}</span> &bull; {techStack.architecture} &bull; {techStack.backend}
            </p>
          </div>
        </div>

        {/* 4 GB Storage Mini-Meter & Tabs */}
        <div className="flex items-center gap-3">
          {/* 4 GB Space Meter */}
          <div
            onClick={() => setActiveTab("storage")}
            className="cursor-pointer group flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 hover:border-emerald-500/50 transition-all"
            title="Inspect 4 GB Local Storage Sandbox"
          >
            <HardDrive className="h-3.5 w-3.5 text-cyan-400 group-hover:text-emerald-400 transition-colors" />
            <div className="flex flex-col">
              <div className="flex items-center justify-between gap-3 text-[10px] font-mono">
                <span className="text-slate-400">4GB Space:</span>
                <span className="text-emerald-400 font-bold">{usedSpaceMb.toFixed(1)} MB / {TOTAL_SPACE_MB} MB</span>
              </div>
              <div className="w-24 h-1.5 rounded-full bg-slate-700 overflow-hidden mt-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400"
                  style={{ width: `${Math.min(100, (usedSpaceMb / TOTAL_SPACE_MB) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Sub-view Switches */}
          <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700 text-xs">
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                activeTab === "chat"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Chat Omni
            </button>
            <button
              onClick={() => setActiveTab("vision")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-all ${
                activeTab === "vision"
                  ? "bg-cyan-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Eye className="h-3 w-3" />
              <span>Astra Vision</span>
            </button>
            <button
              onClick={() => setActiveTab("storage")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-all ${
                activeTab === "storage"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <HardDrive className="h-3 w-3" />
              <span>4GB Storage</span>
            </button>
          </div>

          {/* Voice Call Mode Trigger */}
          <button
            onClick={() => setIsVoiceCallModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-900/30 transition-all"
            title="Open Fullscreen ChatGPT Astra Voice Orb"
          >
            <Mic className="h-3.5 w-3.5 fill-slate-950" />
            <span>Voice Call</span>
          </button>
        </div>
      </div>

      {/* STORAGE NOTIFICATION BANNER */}
      {storageNotice && (
        <div className="bg-emerald-950/90 border-b border-emerald-500/40 px-4 py-1.5 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span>{storageNotice}</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">Sandbox Free: {freeSpaceMb.toFixed(1)} MB</span>
        </div>
      )}

      {/* 2. MAIN BODY PANELS */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* --- VIEW TAB 1: CHAT OMNI --- */}
        {activeTab === "chat" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {messages.map((m) => {
                const isUser = m.sender === "user";
                return (
                  <div
                    key={m.id}
                    className={`flex items-start gap-3.5 max-w-4xl ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-md ${
                        isUser
                          ? "bg-slate-700 text-slate-200"
                          : "bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950"
                      }`}
                    >
                      {isUser ? <User className="h-4 w-4" /> : <Zap className="h-4 w-4 fill-slate-950" />}
                    </div>

                    {/* Message Bubble */}
                    <div className="flex flex-col gap-1.5 max-w-[88%]">
                      <div className="flex items-center gap-2 px-1 text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-300">
                          {isUser ? "You" : "ChatGPT Astra"}
                        </span>
                        <span>&bull;</span>
                        <span>{m.timestamp}</span>
                      </div>

                      {/* Thought Chain Accordion (for assistant) */}
                      {!isUser && m.thoughtChain && m.thoughtChain.length > 0 && (
                        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 text-xs text-slate-400 font-mono">
                          <button
                            onClick={() =>
                              setExpandedThoughts((prev) => ({ ...prev, [m.id]: !prev[m.id] }))
                            }
                            className="flex items-center justify-between w-full text-slate-400 hover:text-emerald-400 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Cpu className="h-3.5 w-3.5 text-cyan-400" />
                              <span className="font-bold text-[11px] text-slate-300">
                                Astra Reasoning Chain ({m.thoughtChain.length} steps)
                              </span>
                            </div>
                            {expandedThoughts[m.id] ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronDown className="h-3 w-3" />
                            )}
                          </button>
                          {expandedThoughts[m.id] && (
                            <ul className="mt-2 space-y-1 pl-4 border-l border-cyan-500/30 text-[11px] text-slate-400">
                              {m.thoughtChain.map((step, idx) => (
                                <li key={idx} className="flex items-center gap-1.5">
                                  <span className="text-cyan-400">&rsaquo;</span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}

                      {/* Text Content */}
                      <div
                        className={`rounded-2xl px-4 py-3 shadow-md text-sm leading-relaxed ${
                          isUser
                            ? "bg-slate-800 text-slate-100 border border-slate-700"
                            : "bg-slate-900 text-slate-100 border border-slate-800"
                        }`}
                      >
                        <div className="prose prose-invert max-w-none text-sm leading-relaxed">
                          <MarkdownRenderer content={m.text} />
                        </div>

                        {/* Code Snippet Box with Apply to Spec */}
                        {m.codeSnippet && (
                          <div className="mt-3.5 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden font-mono text-xs">
                            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400">
                              <div className="flex items-center gap-1.5">
                                <Code2 className="h-3.5 w-3.5 text-emerald-400" />
                                <span>Astra Proposed Artifact</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleCopy(m.id, m.codeSnippet!)}
                                  className="px-2 py-0.5 rounded hover:bg-slate-800 text-slate-300 flex items-center gap-1 transition-colors"
                                >
                                  {copiedId === m.id ? (
                                    <Check className="h-3 w-3 text-emerald-400" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                  <span>{copiedId === m.id ? "Copied" : "Copy"}</span>
                                </button>
                                {onApplyRefactor && (
                                  <button
                                    onClick={() => handleApply(m.id, m.codeSnippet)}
                                    className="px-2 py-0.5 rounded bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 font-semibold transition-colors"
                                  >
                                    {appliedId === m.id ? (
                                      <Check className="h-3 w-3 text-emerald-400" />
                                    ) : (
                                      <ArrowRight className="h-3 w-3" />
                                    )}
                                    <span>{appliedId === m.id ? "Applied to Spec!" : "Apply to Spec"}</span>
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="p-3 text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                              {m.codeSnippet}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Thinking / Streaming Indicator */}
              {isThinking && (
                <div className="flex items-start gap-3.5 max-w-2xl mr-auto">
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0 text-slate-950 font-black shadow-md">
                    <Zap className="h-4 w-4 fill-slate-950 animate-pulse" />
                  </div>
                  <div className="rounded-2xl px-4 py-3 bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                      <div className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" />
                      <div className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
                    </div>
                    <span className="font-mono text-slate-400">
                      Astra reasoning across 4 GB vector index ({domain.shortName})...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-900/40 flex items-center gap-2 overflow-x-auto">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">
                Astra Prompts:
              </span>
              {[
                `Scale ${domain.shortName} to 50,000 RPS with Redis cluster`,
                `Generate 3NF schema for ${e1} with audit triggers`,
                `Synthesize zero-trust JWT middleware in ${techStack.backend}`,
                `Inspect active 4GB memory quota breakdown`,
                `Formulate BDD edge test scenarios for ${e2}`
              ].map((promptText, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(promptText)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700/60 hover:border-emerald-500/40 whitespace-nowrap transition-all flex-shrink-0"
                >
                  {promptText}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-slate-900 border-t border-slate-800">
              <div className="flex items-center gap-2 rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 shadow-inner focus-within:border-emerald-500/60 transition-all">
                {/* Voice button */}
                <button
                  onClick={toggleVoice}
                  className={`p-2 rounded-lg transition-all ${
                    isListening
                      ? "bg-rose-600 text-white animate-pulse"
                      : "text-slate-400 hover:text-emerald-400 hover:bg-slate-800"
                  }`}
                  title={isListening ? "Listening... click to stop" : "Voice Input (Speech-to-Text)"}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>

                {/* Vision trigger */}
                <button
                  onClick={() => setActiveTab("vision")}
                  className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-all"
                  title="Switch to Astra Vision Viewfinder"
                >
                  <Camera className="h-4 w-4" />
                </button>

                {/* Text Input */}
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={`Ask ChatGPT Astra about ${domain.shortName}, microservices, schemas, or memory...`}
                  className="flex-1 bg-transparent border-0 text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden"
                />

                {/* Thinking Depth Toggle */}
                <button
                  onClick={() => setReasoningDepth(reasoningDepth === "deep" ? "fast" : "deep")}
                  className={`px-2 py-1 rounded text-[10px] font-mono font-bold border transition-colors ${
                    reasoningDepth === "deep"
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}
                  title="Toggle Fast Instant vs Deep Thought Chain"
                >
                  {reasoningDepth === "deep" ? "Deep Mind" : "Fast Flash"}
                </button>

                {/* Speech Synthesis Audio Toggle */}
                <button
                  onClick={() => setSpeechEnabled(!speechEnabled)}
                  className={`p-2 rounded-lg transition-all ${
                    speechEnabled
                      ? "text-emerald-400 hover:bg-slate-800"
                      : "text-slate-500 hover:bg-slate-800"
                  }`}
                  title={speechEnabled ? "Voice Output ON" : "Voice Output Muted"}
                >
                  {speechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </button>

                {/* Send Button */}
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || isThinking}
                  className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition-all shadow-sm"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW TAB 2: PROJECT ASTRA VISION HUD --- */}
        {activeTab === "vision" && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <ScanLine className="h-5 w-5 text-cyan-400" />
                  <span>Project Astra Multimodal Vision Viewfinder</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time visual stream OCR, entity bounding boxes, and architectural blueprint comprehension.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleWebcam}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isVisionActive && visionMode === "webcam"
                      ? "bg-rose-600 text-white"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                  }`}
                >
                  <Camera className="h-3.5 w-3.5" />
                  <span>{isVisionActive && visionMode === "webcam" ? "Stop Webcam" : "Live Camera"}</span>
                </button>
                <button
                  onClick={triggerVisionScan}
                  disabled={isScanning}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white text-xs font-bold transition-all shadow-md"
                >
                  <ScanLine className={`h-3.5 w-3.5 ${isScanning ? "animate-spin" : ""}`} />
                  <span>{isScanning ? "Scanning Frame..." : "Scan Viewfinder"}</span>
                </button>
              </div>
            </div>

            {/* Viewfinder Canvas Frame */}
            <div className="relative rounded-2xl overflow-hidden border border-cyan-500/40 bg-slate-900 h-[400px] flex items-center justify-center shadow-2xl">
              {isVisionActive && visionMode === "webcam" ? (
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              ) : (
                /* Simulated High-Res Diagram Canvas */
                <div className="w-full h-full bg-radial from-slate-900 to-slate-950 p-8 flex flex-col justify-between font-mono">
                  <div className="flex items-center justify-between text-xs text-cyan-400/80 border-b border-cyan-500/20 pb-2">
                    <span>Astra Vision Stream: [ACTIVE_SCENE_01]</span>
                    <span>Resolution: 1920x1080 @ 60fps</span>
                  </div>

                  {/* Architecture Diagram Mockup */}
                  <div className="grid grid-cols-3 gap-6 my-auto">
                    <div className="rounded-xl border border-emerald-500/50 bg-emerald-950/30 p-4 text-center">
                      <div className="text-[10px] text-emerald-400 font-bold uppercase">Client Traffic</div>
                      <div className="text-sm text-white font-bold mt-1">Envoy Proxy</div>
                      <div className="text-[10px] text-slate-400 mt-1">mTLS + RS256 Auth</div>
                    </div>
                    <div className="rounded-xl border border-cyan-500/60 bg-cyan-950/30 p-4 text-center relative">
                      <div className="text-[10px] text-cyan-300 font-bold uppercase">Core Domain</div>
                      <div className="text-sm text-white font-bold mt-1">{e1} Engine</div>
                      <div className="text-[10px] text-slate-400 mt-1">{techStack.backend}</div>
                    </div>
                    <div className="rounded-xl border border-purple-500/50 bg-purple-950/30 p-4 text-center">
                      <div className="text-[10px] text-purple-300 font-bold uppercase">Storage 3NF</div>
                      <div className="text-sm text-white font-bold mt-1">PostgreSQL 16</div>
                      <div className="text-[10px] text-slate-400 mt-1">ACID Replicas</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-cyan-500/20 pt-2">
                    <span>Target: {domain.shortName} System Mesh</span>
                    <span>Inference Latency: 14.2ms</span>
                  </div>
                </div>
              )}

              {/* Laser Scanning Animation Overlay */}
              {isScanning && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400 animate-bounce top-1/2" />
              )}

              {/* HUD Bounding Reticle */}
              <div className="absolute top-4 left-4 pointer-events-none border-t-2 border-l-2 border-cyan-400 h-8 w-8" />
              <div className="absolute top-4 right-4 pointer-events-none border-t-2 border-r-2 border-cyan-400 h-8 w-8" />
              <div className="absolute bottom-4 left-4 pointer-events-none border-b-2 border-l-2 border-cyan-400 h-8 w-8" />
              <div className="absolute bottom-4 right-4 pointer-events-none border-b-2 border-r-2 border-cyan-400 h-8 w-8" />

              <div className="absolute bottom-3 left-4 bg-slate-950/80 backdrop-blur px-3 py-1 rounded-lg border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                Astra Realtime Vision HUD &bull; Frame Cache: 384.0 MB
              </div>
            </div>

            {/* OCR Extracted Text & Invariants */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ScanLine className="h-3.5 w-3.5 text-cyan-400" />
                <span>Extracted Visual Invariants & OCR Tokens</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {detectedOcr.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center justify-between"
                  >
                    <span>{item}</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">VERIFIED</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW TAB 3: 4 GB VIRTUAL STORAGE & CONTEXT ENGINE --- */}
        {activeTab === "storage" && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-purple-400" />
                  <span>4.00 GB Local Virtual Memory & Quota Sandbox</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Strict client-side allocation boundary (/astra-mnt). Manages model weights, KV context, and HNSW vector embeddings.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddCustomFile}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Ingest File (+64MB)</span>
                </button>
                <button
                  onClick={handleExportStorageDump}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export Memory Snapshot</span>
                </button>
              </div>
            </div>

            {/* Quota Ring & Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Total Quota</span>
                <div className="text-xl font-extrabold text-white font-mono mt-1">4,096.0 MB</div>
                <span className="text-[10px] text-slate-500">4.00 GB Hard Boundary</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Used Allocation</span>
                <div className="text-xl font-extrabold text-cyan-400 font-mono mt-1">{usedSpaceMb.toFixed(1)} MB</div>
                <span className="text-[10px] text-cyan-500 font-mono">{usedPercent}% Capacity</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Free Unallocated</span>
                <div className="text-xl font-extrabold text-emerald-400 font-mono mt-1">{freeSpaceMb.toFixed(1)} MB</div>
                <span className="text-[10px] text-emerald-500 font-mono">{(100 - +usedPercent).toFixed(1)}% Available</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Virtual Mount</span>
                <div className="text-base font-bold text-purple-400 font-mono mt-1">/astra-mnt/</div>
                <span className="text-[10px] text-slate-500">Local in-memory VFS</span>
              </div>
            </div>

            {/* Quick Memory Pruning Controls */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                <span>Memory Pruning & Cache Compactor</span>
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handlePruneCache}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
                >
                  <RefreshCw className="h-3 w-3 text-cyan-400" />
                  <span>Prune KV Context (-128 MB)</span>
                </button>
                <button
                  onClick={handlePurgeVisionBuffer}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
                >
                  <Camera className="h-3 w-3 text-rose-400" />
                  <span>Purge Vision Buffer (-320 MB)</span>
                </button>
                <button
                  onClick={handleCompactVectors}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
                >
                  <Database className="h-3 w-3 text-purple-400" />
                  <span>Compact HNSW Vectors (-152 MB)</span>
                </button>
              </div>
            </div>

            {/* Virtual File System Browser Table */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-800/80 border-b border-slate-800 text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Virtual Partition Filesystem (/astra-mnt/)</span>
                <span className="text-[11px] font-mono text-slate-400">{virtualFiles.length} files mounted</span>
              </div>
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-2">Virtual Path</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Size (MB)</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {virtualFiles.map((file, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-2.5 text-slate-200 font-bold">{file.path}</td>
                      <td className="px-4 py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          file.category === "model" ? "bg-cyan-500/20 text-cyan-300" :
                          file.category === "vectors" ? "bg-purple-500/20 text-purple-300" :
                          file.category === "vision" ? "bg-rose-500/20 text-rose-300" :
                          file.category === "context" ? "bg-emerald-500/20 text-emerald-300" :
                          "bg-slate-700 text-slate-300"
                        }`}>
                          {file.category}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-emerald-400 font-bold">{file.sizeMb.toFixed(1)} MB</td>
                      <td className="px-4 py-2.5 text-slate-400">{file.lastUpdated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 3. FULLSCREEN ADVANCED VOICE CALL ORB MODAL */}
      {isVoiceCallModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-between p-8 select-none">
          {/* Top Bar */}
          <div className="w-full flex items-center justify-between max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Zap className="h-4 w-4 text-emerald-400" />
              <span>ChatGPT Astra Voice Call Mode</span>
              <span>&bull;</span>
              <span className="text-emerald-400 font-bold">{domain.shortName}</span>
            </div>
            <button
              onClick={() => {
                setIsVoiceCallModalOpen(false);
                if (window.speechSynthesis) window.speechSynthesis.cancel();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Glowing Animated Astra Audio Orb */}
          <div className="flex flex-col items-center gap-6 my-auto">
            <div className="relative flex items-center justify-center">
              {/* Outer pulsing radiance */}
              <div
                className={`absolute h-64 w-64 rounded-full bg-gradient-to-tr from-emerald-500 via-cyan-400 to-indigo-500 opacity-40 blur-3xl transition-all duration-700 ${
                  isSpeaking || isListening ? "scale-125 animate-pulse" : "scale-90"
                }`}
              />
              {/* Mid ring */}
              <div
                className={`h-48 w-48 rounded-full border-2 border-cyan-400/40 flex items-center justify-center transition-transform duration-500 ${
                  isSpeaking ? "rotate-45 scale-110" : ""
                }`}
              >
                {/* Core Orb */}
                <div
                  className={`h-36 w-36 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 shadow-2xl shadow-cyan-500/50 flex items-center justify-center transition-all ${
                    isListening ? "scale-105" : isSpeaking ? "scale-115 animate-pulse" : "scale-100"
                  }`}
                >
                  <Zap className="h-14 w-14 fill-slate-950 text-slate-950" />
                </div>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                {isListening ? "Listening to your voice..." : isSpeaking ? "Astra is speaking..." : "Astra is listening"}
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Say &ldquo;Explain ${e1} architecture&rdquo; or &ldquo;How to scale to 20,000 RPS&rdquo;
              </p>
            </div>
          </div>

          {/* Voice Call Controls */}
          <div className="w-full max-w-md flex items-center justify-center gap-6">
            <button
              onClick={toggleVoice}
              className={`p-4 rounded-full transition-all shadow-lg ${
                isListening
                  ? "bg-rose-600 text-white animate-bounce"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-200"
              }`}
            >
              {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </button>
            <button
              onClick={() => {
                setIsVoiceCallModalOpen(false);
                if (window.speechSynthesis) window.speechSynthesis.cancel();
              }}
              className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-900/40 transition-all"
            >
              End Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- CHATGPT ASTRA CONVERSATIONAL REASONING SYNTHESIZER ---
function generateAstraResponse(
  query: string,
  domain: DomainContext,
  techStack: TechStackPreferences,
  depth: "fast" | "deep"
): { text: string; thoughtChain: string[]; codeSnippet?: string } {
  const q = query.toLowerCase();
  const e1 = domain.primaryEntities[0] || "PrimaryEntity";
  const e2 = domain.primaryEntities[1] || "EventRecord";

  const thoughtChain = [
    `Ingested prompt: "${query.slice(0, 40)}..."`,
    `Queried 4 GB HNSW vector index for domain: ${domain.shortName}`,
    `Resolved entity model: ${e1} [1-to-N] ${e2}`,
    `Applied architectural constraints: ${techStack.architecture}, ${techStack.backend}`
  ];

  if (depth === "deep") {
    thoughtChain.push("Performed 4-step formal invariant verification (ACM AIWare 2026)");
    thoughtChain.push("Evaluated zero-trust cryptographic token boundaries");
  }

  // 1. Concurrency / Scale
  if (q.includes("scale") || q.includes("concurrency") || q.includes("rps") || q.includes("load")) {
    return {
      text: `To scale **${domain.title}** to high throughput (50,000+ RPS), we leverage a multi-tiered caching topology and non-blocking asynchronous event processing:\n\n1. **Edge Tier**: CDN caching with Cloudflare Workers / Envoy API gateway validating stateless RS256 JWT tokens without database roundtrips.\n2. **In-Memory Cache (Redis Sentinel)**: Cache ${e1} metadata with Cache-Aside pattern (TTL 300s, LRU eviction).\n3. **Database Write Pool**: Partitioned PostgreSQL 16 read replicas with PgBouncer connection pooling.\n4. **Event Bus**: Kafka / Redis Streams to decouple write transactions for ${e2}.`,
      thoughtChain,
      codeSnippet: `// High-Performance Concurrency Buffer & Rate Limiter
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export async function rateLimitAndCache${e1}(entityId: string): Promise<boolean> {
  const windowSec = 1;
  const maxRps = 2500;
  const key = \`ratelimit:${domain.shortName.toLowerCase()}:\${entityId}\`;

  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, windowSec);
  }
  return current <= maxRps;
}`
    };
  }

  // 2. Schema / Database
  if (q.includes("schema") || q.includes("sql") || q.includes("database") || q.includes("3nf") || q.includes("foreign key")) {
    return {
      text: `Here is the **Third Normal Form (3NF)** relational PostgreSQL DDL schema for **${domain.shortName}** ensuring referential integrity and strict typing between **${e1}** and **${e2}**:`,
      thoughtChain,
      codeSnippet: `-- 3NF Schema with Foreign Keys and Audit Logging
CREATE TABLE IF NOT EXISTS ${e1.toLowerCase()}s (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ${e2.toLowerCase()}s (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ${e1.toLowerCase()}_id UUID NOT NULL REFERENCES ${e1.toLowerCase()}s(id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_${e2.toLowerCase()}_parent 
  ON ${e2.toLowerCase()}s(${e1.toLowerCase()}_id);`
    };
  }

  // 3. Security / Auth
  if (q.includes("auth") || q.includes("security") || q.includes("jwt") || q.includes("token") || q.includes("zero-trust")) {
    return {
      text: `**${domain.title}** implements a **Zero-Trust Security Architecture** using asymmetric RS256 JWT tokens, cryptographic claim verification, and tenant isolation:`,
      thoughtChain,
      codeSnippet: `// Zero-Trust RS256 JWT Authentication Guard
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const require${domain.shortName}Auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing Bearer token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const publicKey = process.env.JWT_PUBLIC_KEY || "";
    const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] });
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};`
    };
  }

  // 4. BDD / Testing
  if (q.includes("bdd") || q.includes("gherkin") || q.includes("test") || q.includes("scenario")) {
    return {
      text: `Here are executable **BDD Gherkin test scenarios** covering edge cases for **${domain.shortName}**:`,
      thoughtChain,
      codeSnippet: `Feature: ${domain.title} Verification Contract

  Scenario: Successfully create and verify ${e1}
    Given the client is authenticated with role "ADMIN"
    When the client posts a valid payload to "${domain.apiPrefix}/${e1.toLowerCase()}s"
    Then the response status code should be 201
    And the response body should contain "${e1.toLowerCase()}_id"

  Scenario: Prevent duplicate conflicting mutations
    Given an existing ${e1} with ID "test-uuid-101"
    When the client submits a conflicting creation payload
    Then the response status code should be 409
    And the error code should be "ENTITY_CONFLICT"`
    };
  }

  // 5. Default General Response
  return {
    text: `Based on your request, I analyzed the architecture of **${domain.title}** within our **4.00 GB Local Virtual Memory Space**.\n\n* **Primary Entity**: \`${e1}\`\n* **Event Processing**: \`${e2}\`\n* **Target Stack**: \`${techStack.architecture}\` with \`${techStack.backend}\`\n\nI have synthesized a production implementation module meeting all non-functional SLAs (<50ms p99 latency, zero requirement drift).`,
    thoughtChain,
    codeSnippet: `// Production Implementation for ${domain.shortName}
export class ${domain.shortName}Service {
  constructor(private readonly dbPool: any) {}

  async fetch${e1}(id: string) {
    const res = await this.dbPool.query(
      "SELECT * FROM ${e1.toLowerCase()}s WHERE id = $1",
      [id]
    );
    return res.rows[0];
  }
}`
  };
}
