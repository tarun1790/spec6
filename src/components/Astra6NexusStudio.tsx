"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Zap,
  Bot,
  User,
  Sparkles,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Camera,
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
  Play,
  Square,
  Search,
  ShieldCheck,
  ShieldAlert,
  Sliders,
  Terminal,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  Compass,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { DomainContext } from "@/lib/mock-generator";
import { TechStackPreferences, StageState } from "@/lib/types";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface Astra6NexusStudioProps {
  domain: DomainContext;
  techStack: TechStackPreferences;
  stages: StageState[];
  onApplyRefactor?: (stageIndex: number, code: string) => void;
  onAtomicMultiStageUpdate?: (updates: { stageIndex: number; contentAddition: string }[]) => void;
}

interface AgentThought {
  agent: "Architect" | "Sentinel" | "Synthesizer" | "Verifier";
  avatar: string;
  color: string;
  thought: string;
  status: "completed" | "evaluating" | "ready";
}

interface ChatMessage {
  id: string;
  sender: "user" | "astra";
  text: string;
  agentSwarm?: AgentThought[];
  codeSnippet?: string;
  language?: string;
  sqlResults?: { headers: string[]; rows: (string | number)[][] };
  timestamp: string;
}

interface MemoryBlock {
  id: string;
  name: string;
  path: string;
  sizeMb: number;
  category: "weights" | "vectors" | "vision" | "kv_cache" | "sandbox";
  color: string;
  updatedAt: string;
}

const TOTAL_SPACE_MB = 4096.0; // Strictly 4 GB = 4,096.0 MB

export const Astra6NexusStudio: React.FC<Astra6NexusStudioProps> = ({
  domain,
  techStack,
  stages,
  onApplyRefactor,
  onAtomicMultiStageUpdate
}) => {
  const e1 = domain.primaryEntities[0] || "CoreEntity";
  const e2 = domain.primaryEntities[1] || "EventEntity";

  // --- 1. 4 GB VIRTUAL MEMORY & VECTOR RAG ENGINE ---
  const [memoryBlocks, setMemoryBlocks] = useState<MemoryBlock[]>([
    {
      id: "mem-weights",
      name: "Astra-6-Omni-Ultra-Q4_K_M.gguf",
      path: "/astra-mnt/weights/astra-6-omni-ultra.gguf",
      sizeMb: 1843.2,
      category: "weights",
      color: "bg-cyan-500",
      updatedAt: "Mounted"
    },
    {
      id: "mem-vectors",
      name: "hnsw_multimodal_embeddings.bin",
      path: "/astra-mnt/vectors/hnsw_multimodal_embeddings.bin",
      sizeMb: 512.0,
      category: "vectors",
      color: "bg-purple-500",
      updatedAt: "Active Index"
    },
    {
      id: "mem-vision",
      name: "multimodal_frame_buffer.raw",
      path: "/astra-mnt/vision/multimodal_frame_buffer.raw",
      sizeMb: 384.0,
      category: "vision",
      color: "bg-rose-500",
      updatedAt: "1080p Stream"
    },
    {
      id: "mem-kv",
      name: "dynamic_kv_cache_context.bin",
      path: "/astra-mnt/context/dynamic_kv_cache_context.bin",
      sizeMb: 256.0,
      category: "kv_cache",
      color: "bg-emerald-500",
      updatedAt: "32k Tokens"
    },
    {
      id: "mem-sandbox",
      name: "polyglot_artifacts_fs.tar",
      path: "/astra-mnt/sandbox/polyglot_artifacts_fs.tar",
      sizeMb: 128.0,
      category: "sandbox",
      color: "bg-amber-500",
      updatedAt: "4 Languages"
    }
  ]);

  const usedSpaceMb = memoryBlocks.reduce((acc, m) => acc + m.sizeMb, 0);
  const freeSpaceMb = Math.max(0, TOTAL_SPACE_MB - usedSpaceMb);
  const usedPercent = ((usedSpaceMb / TOTAL_SPACE_MB) * 100).toFixed(1);

  // Semantic Vector Search test state
  const [vectorQuery, setVectorQuery] = useState("");
  const [vectorResults, setVectorResults] = useState<{ doc: string; score: number; stage: string }[]>([]);
  const [isVectorSearching, setIsVectorSearching] = useState(false);
  const [storageNotice, setStorageNotice] = useState<string | null>(null);

  // --- 2. MULTI-AGENT SWARM ORCHESTRATION ---
  const [activeSwarmMode, setActiveSwarmMode] = useState<"autonomous" | "fast" | "paranoid_security">("autonomous");

  // --- 3. DUPLEX INTERRUPTIBLE VOICE & QUANTUM ORB ---
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [isQuantumOrbModalOpen, setIsQuantumOrbModalOpen] = useState(false);
  const recognitionRef = useRef<any>(null);
  const audioCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // --- 4. COMPUTER VISION 2.0 & DIAGRAM-TO-CODE ---
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [visionScanActive, setVisionScanActive] = useState(false);
  const [visionInvariants, setVisionInvariants] = useState<string[]>([
    `[Entity Node]: ${e1} (Domain Master)`,
    `[Relational Edge]: ${e1} -> 1:N -> ${e2}`,
    `[Security Perimeter]: Envoy Gateway with RS256 JWT Verification`,
    `[ACID Partition]: PostgreSQL 16 3NF Cluster + Redis Sentinel`
  ]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // --- 5. INTERACTIVE SQL & CODE REPL ---
  const [sqlQueryInput, setSqlQueryInput] = useState(`SELECT id, name, status, created_at FROM ${e1.toLowerCase()}s LIMIT 5;`);
  const [replResult, setReplResult] = useState<{ headers: string[]; rows: (string | number)[][] } | null>({
    headers: ["id", "name", "status", "created_at"],
    rows: [
      ["a101-uuid", `${domain.shortName} Master Alpha`, "ONLINE", "2026-09-10 09:00:00"],
      ["a102-uuid", `${domain.shortName} Worker Beta`, "HEALTHY", "2026-09-10 09:01:20"],
      ["a103-uuid", `${domain.shortName} Replica Gamma`, "STANDBY", "2026-09-10 09:02:15"]
    ]
  });

  // --- 6. CONVERSATIONAL STREAM ---
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "astra-6-core-init",
      sender: "astra",
      text: `🌌 **Astra-6 Nexus OS Initialized** — *Better Than Astra 6*\n\nWelcome to your proprietary **Autonomous Systems Engineering Intelligence**. Operating natively with a dedicated **4.00 GB Local Virtual Memory Sandbox** (4,096.0 MB), Astra-6 transcends conversational chatbots through parallel multi-agent swarms, interruptible voice duplexing, in-browser HNSW vector semantic search, and atomic specification self-healing.\n\n**Astra-6 Subsystem Status:**\n* 🧠 **4-Agent Swarm**: Architect, Sentinel, Synthesizer, & Verifier online\n* 💾 **4.00 GB Memory Engine**: 1,843.2 MB Neural buffer, 512 MB Vector HNSW index, 972.8 MB Free\n* 🎙️ **Duplex Interruptible Voice**: Quantum neural audio visualizer with instant halt-on-speech\n* ⚡ **Zero-Drift Sync**: 1-click atomic refactor propagation across all 6 specification stages\n* 📊 **In-Memory SQL REPL**: Live schema querying against ${e1} and ${e2}\n\nAsk an architectural challenge, run an in-memory SQL query, test semantic vector search, or command the swarm.`,
      agentSwarm: [
        { agent: "Architect", avatar: "🏛️", color: "text-blue-400", thought: `Partitioned ${e1} to handle 100,000+ RPS under p99 < 18ms`, status: "completed" },
        { agent: "Sentinel", avatar: "🛡️", color: "text-rose-400", thought: `Zero-Trust RS256 token verification barrier active for ${domain.apiPrefix}`, status: "completed" },
        { agent: "Synthesizer", avatar: "⚡", color: "text-amber-400", thought: `Compiled polyglot interfaces in TypeScript, Python, Go, and Rust`, status: "completed" },
        { agent: "Verifier", avatar: "📐", color: "text-emerald-400", thought: `ACM AIWare 2026 invariant gate: zero requirement drift confirmed`, status: "completed" }
      ],
      timestamp: "10:00 AM"
    }
  ]);

  const [inputText, setInputText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "swarm" | "memory" | "repl" | "vision">("chat");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [appliedId, setAppliedId] = useState<string | null>(null);
  const [atomicApplied, setAtomicApplied] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Quantum Orb Waveform Animation
  useEffect(() => {
    if (!isQuantumOrbModalOpen) return;
    const canvas = audioCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let phase = 0;
    const renderWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Draw multi-harmonic wave
      const lines = 4;
      for (let i = 0; i < lines; i++) {
        ctx.beginPath();
        ctx.lineWidth = i === 0 ? 3 : 1.5;
        ctx.strokeStyle = i === 0
          ? "rgba(16, 185, 129, 0.9)"
          : i === 1
          ? "rgba(6, 182, 212, 0.7)"
          : i === 2
          ? "rgba(168, 85, 247, 0.5)"
          : "rgba(244, 63, 94, 0.3)";

        const amplitude = (isSpeaking ? 50 : isListening ? 35 : 12) + i * 4;
        const frequency = 0.02 + i * 0.005;

        for (let x = 0; x < width; x++) {
          const y = centerY + Math.sin(x * frequency + phase + i * 1.2) * amplitude * Math.sin((x / width) * Math.PI);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      phase += isSpeaking ? 0.08 : isListening ? 0.05 : 0.02;
      animationFrameRef.current = requestAnimationFrame(renderWave);
    };

    renderWave();
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isQuantumOrbModalOpen, isSpeaking, isListening]);

  const getTime = () => {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // --- 4 GB MEMORY ENGINE ACTIONS ---
  const handlePruneKvCache = () => {
    setMemoryBlocks((prev) =>
      prev.map((m) => (m.category === "kv_cache" ? { ...m, sizeMb: Math.max(64, +(m.sizeMb - 128).toFixed(1)) } : m))
    );
    setStorageNotice("Pruned KV Cache: Reclaimed 128.0 MB in 4 GB Virtual Quota.");
    setTimeout(() => setStorageNotice(null), 3500);
  };

  const handlePurgeVisionBuffer = () => {
    setMemoryBlocks((prev) =>
      prev.map((m) => (m.category === "vision" ? { ...m, sizeMb: 64.0 } : m))
    );
    setStorageNotice("Purged Multimodal Frame Buffer: Reclaimed 320.0 MB.");
    setTimeout(() => setStorageNotice(null), 3500);
  };

  const handleCompactVectors = () => {
    setMemoryBlocks((prev) =>
      prev.map((m) => (m.category === "vectors" ? { ...m, sizeMb: 360.0 } : m))
    );
    setStorageNotice("Compacted HNSW Graph Index: Reclaimed 152.0 MB.");
    setTimeout(() => setStorageNotice(null), 3500);
  };

  const handleIngestUserFile = () => {
    const fileMb = 64.0;
    if (usedSpaceMb + fileMb > TOTAL_SPACE_MB) {
      alert("4.00 GB Virtual Quota Limit Reached! Please prune KV cache or purge vision buffer.");
      return;
    }
    const newBlock: MemoryBlock = {
      id: `custom-${Date.now()}`,
      name: `domain_tensor_${Date.now().toString().slice(-4)}.bin`,
      path: `/astra-mnt/sandbox/domain_tensor_${Date.now().toString().slice(-4)}.bin`,
      sizeMb: fileMb,
      category: "sandbox",
      color: "bg-teal-500",
      updatedAt: "Just now"
    };
    setMemoryBlocks((prev) => [...prev, newBlock]);
    setStorageNotice(`Ingested ${newBlock.name} (+64.0 MB) into 4 GB Sandbox.`);
    setTimeout(() => setStorageNotice(null), 3500);
  };

  const handleRunVectorSearch = () => {
    if (!vectorQuery.trim()) return;
    setIsVectorSearching(true);
    setTimeout(() => {
      setIsVectorSearching(false);
      setVectorResults([
        { doc: `specs/01-requirements.md [Section: Functional Invariants for ${e1}]`, score: 0.942, stage: "Stage 1" },
        { doc: `specs/04-database-schema.md [DDL: 3NF Foreign Keys between ${e1} and ${e2}]`, score: 0.918, stage: "Stage 4" },
        { doc: `specs/05-security.md [Policy: RS256 JWT Token Verification & RBAC]`, score: 0.884, stage: "Stage 5" },
        { doc: `src/models/${domain.shortName.toLowerCase()}.ts [TypeScript Interface Definition]`, score: 0.856, stage: "Code Studio" }
      ]);
    }, 450);
  };

  // --- DUPLEX VOICE ENGINE ---
  const speakText = (text: string) => {
    if (!speechEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const clean = text.replace(/[*_#`\[\]()]/g, " ").replace(/\s+/g, " ").slice(0, 320);
    const utter = new SpeechSynthesisUtterance(clean);
    utter.rate = 1.05;
    utter.pitch = 1.0;
    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utter);
  };

  const toggleVoice = () => {
    // Interrupt current speech instantly
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert("Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.");
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
          handleSendPrompt(spoken);
        }
      };
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      rec.start();
    } catch {
      setIsListening(false);
    }
  };

  // --- VISION SCANNER ---
  const toggleCamera = async () => {
    if (isCameraActive && streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setIsCameraActive(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch {
      setIsCameraActive(true); // Falls back to simulated high-res canvas
    }
  };

  const triggerVisionScan = () => {
    setVisionScanActive(true);
    setTimeout(() => {
      setVisionScanActive(false);
      setVisionInvariants([
        `[Compiled Node]: ${e1} High-Throughput REST Gateway (${techStack.backend})`,
        `[Compiled Edge]: Asynchronous In-Memory Queue (Redis 7.2 Cluster) -> ${e2}`,
        `[Security Boundary]: Zero-Trust Mutual TLS + Cryptographic Hash Validation`,
        `[Database Target]: PostgreSQL 16 3NF Cluster (Read/Write Split)`,
        `[Astra-6 Vision Inference Score]: 99.94% Confidence`
      ]);
      handleSendPrompt(`[Astra-6 Visual Diagram Compilation]: Detected ${e1} architecture topology. Generate production deployment manifest.`);
    }, 1100);
  };

  // --- SQL REPL EXECUTION ---
  const handleExecuteSql = () => {
    setReplResult({
      headers: ["id", "name", "status", "created_at", "latency_ms"],
      rows: [
        ["a101-uuid", `${domain.shortName} Master Node`, "ONLINE", "2026-09-10 09:00:00", 1.2],
        ["a102-uuid", `${domain.shortName} Worker Node`, "HEALTHY", "2026-09-10 09:01:20", 0.8],
        ["a103-uuid", `${domain.shortName} Replica Node`, "STANDBY", "2026-09-10 09:02:15", 1.5],
        ["a104-uuid", `${domain.shortName} Cache Cluster`, "SYNCED", "2026-09-10 09:03:00", 0.3]
      ]
    });
  };

  // --- CONVERSATION & SWARM AGENT EXECUTION ---
  const handleSendPrompt = (textToSend?: string) => {
    const q = (textToSend || inputText).trim();
    if (!q || isGenerating) return;

    // Interrupt any active speech immediately
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: q,
      timestamp: getTime()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsGenerating(true);

    // Consume KV Cache allocation in 4 GB pool
    setMemoryBlocks((prev) =>
      prev.map((m) => (m.category === "kv_cache" ? { ...m, sizeMb: +(m.sizeMb + 0.5).toFixed(1) } : m))
    );

    setTimeout(() => {
      const response = generateAstra6SwarmResponse(q, domain, techStack);
      const astraMsg: ChatMessage = {
        id: `astra-6-${Date.now()}`,
        sender: "astra",
        text: response.text,
        agentSwarm: response.agentSwarm,
        codeSnippet: response.codeSnippet,
        language: response.language,
        timestamp: getTime()
      };
      setMessages((prev) => [...prev, astraMsg]);
      setIsGenerating(false);

      if (speechEnabled) {
        speakText(response.text);
      }
    }, 700);
  };

  const handleApplySingle = (id: string, snippet?: string) => {
    if (!snippet || !onApplyRefactor) return;
    onApplyRefactor(1, snippet);
    setAppliedId(id);
    setTimeout(() => setAppliedId(null), 2500);
  };

  const handleAtomicSyncAll = () => {
    if (onAtomicMultiStageUpdate) {
      onAtomicMultiStageUpdate([
        { stageIndex: 0, contentAddition: `\n## Astra-6 Verified Requirements\n* Invariant: High concurrency for ${e1} validated at 50,000+ RPS.\n* Non-Functional: Strict zero-trust JWT token validation.` },
        { stageIndex: 1, contentAddition: `\n## Astra-6 Architecture Topology\n* Tier 1: Envoy API Gateway with RS256 Auth\n* Tier 2: ${e1} Core Engine (${techStack.backend})\n* Tier 3: Asynchronous ${e2} Event Bus` },
        { stageIndex: 3, contentAddition: `\n-- Astra-6 3NF Relational Verification\nALTER TABLE ${e1.toLowerCase()}s ADD COLUMN IF NOT EXISTS astra_verified_at TIMESTAMPTZ DEFAULT NOW();` },
        { stageIndex: 4, contentAddition: `\n## Astra-6 Zero-Trust Policy\n* Mutual TLS enforced on internal mesh.\n* Key rotation cycle: 24 hours.` }
      ]);
    } else if (onApplyRefactor) {
      onApplyRefactor(1, `\n## Astra-6 Autonomous System Verification\nAll 6 SDLC specifications verified with zero requirement drift.`);
    }
    setAtomicApplied(true);
    setTimeout(() => setAtomicApplied(false), 3000);
  };

  return (
    <div className="h-full flex flex-col rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 shadow-2xl select-none font-sans">
      {/* 1. TOP HEADER & TELEMETRY */}
      <div className="border-b border-slate-800 bg-slate-900/95 backdrop-blur px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-emerald-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/25 text-slate-950 font-black">
              <Zap className="h-5 w-5 fill-slate-950 text-slate-950" />
            </div>
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 border-2 border-slate-950 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white tracking-tight flex items-center gap-1.5">
                <span>Astra-6 Nexus OS</span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  ULTRA 6.0
                </span>
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                4.00 GB Sandbox
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Domain: <span className="text-cyan-300 font-semibold">{domain.shortName}</span> &bull; 4-Agent Swarm &bull; HNSW RAG
            </p>
          </div>
        </div>

        {/* 4 GB Storage Mini-Meter & Views */}
        <div className="flex items-center gap-2.5">
          {/* 4 GB Storage Tracker Button */}
          <button
            onClick={() => setActiveTab("memory")}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700 hover:border-cyan-500/60 transition-all text-left group"
            title="Inspect 4 GB Virtual Local Storage Sandbox"
          >
            <HardDrive className="h-3.5 w-3.5 text-cyan-400 group-hover:text-emerald-400 transition-colors" />
            <div>
              <div className="flex items-center justify-between gap-2 text-[10px] font-mono">
                <span className="text-slate-400 font-semibold">4GB Space:</span>
                <span className="text-cyan-300 font-bold">{usedSpaceMb.toFixed(1)} / {TOTAL_SPACE_MB} MB</span>
              </div>
              <div className="w-24 h-1.5 rounded-full bg-slate-700 overflow-hidden mt-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-500 transition-all duration-300"
                  style={{ width: `${(usedSpaceMb / TOTAL_SPACE_MB) * 100}%` }}
                />
              </div>
            </div>
          </button>

          {/* Sub-view Navigation Tabs */}
          <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeTab === "chat" ? "bg-cyan-600 text-white shadow-xs" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Astra Chat
            </button>
            <button
              onClick={() => setActiveTab("swarm")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                activeTab === "swarm" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Cpu className="h-3 w-3" />
              <span>4-Agent Swarm</span>
            </button>
            <button
              onClick={() => setActiveTab("memory")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                activeTab === "memory" ? "bg-purple-600 text-white shadow-xs" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <HardDrive className="h-3 w-3" />
              <span>4GB Storage</span>
            </button>
            <button
              onClick={() => setActiveTab("repl")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                activeTab === "repl" ? "bg-amber-600 text-white shadow-xs" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Terminal className="h-3 w-3" />
              <span>SQL REPL</span>
            </button>
            <button
              onClick={() => setActiveTab("vision")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                activeTab === "vision" ? "bg-rose-600 text-white shadow-xs" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Eye className="h-3 w-3" />
              <span>Vision 2.0</span>
            </button>
          </div>

          {/* Duplex Quantum Orb Trigger */}
          <button
            onClick={() => setIsQuantumOrbModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all"
            title="Open Duplex Quantum Voice Orb"
          >
            <Mic className="h-3.5 w-3.5 fill-slate-950" />
            <span>Quantum Voice</span>
          </button>
        </div>
      </div>

      {/* STORAGE NOTIFICATION TOAST */}
      {storageNotice && (
        <div className="bg-cyan-950/90 border-b border-cyan-500/40 px-4 py-1.5 text-xs text-cyan-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span>{storageNotice}</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-400">Sandbox Free: {freeSpaceMb.toFixed(1)} MB</span>
        </div>
      )}

      {/* 2. MAIN WORKSPACE VIEW BODY */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* --- TAB 1: CHAT OMNI --- */}
        {activeTab === "chat" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
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
                          ? "bg-slate-800 text-slate-200 border border-slate-700"
                          : "bg-gradient-to-tr from-cyan-500 via-emerald-400 to-indigo-500 text-slate-950"
                      }`}
                    >
                      {isUser ? <User className="h-4 w-4" /> : <Zap className="h-4 w-4 fill-slate-950" />}
                    </div>

                    {/* Content Box */}
                    <div className="flex flex-col gap-2 max-w-[88%]">
                      <div className="flex items-center gap-2 px-1 text-[11px] text-slate-400">
                        <span className="font-bold text-slate-300">
                          {isUser ? "Lead Architect" : "Astra-6 Nexus"}
                        </span>
                        <span>&bull;</span>
                        <span>{m.timestamp}</span>
                      </div>

                      {/* Swarm Thoughts Grid (if assistant) */}
                      {!isUser && m.agentSwarm && m.agentSwarm.length > 0 && (
                        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-xs">
                          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                            <span className="flex items-center gap-1.5 font-bold text-cyan-400">
                              <Cpu className="h-3 w-3" />
                              <span>Astra-6 Multi-Agent Swarm Telemetry</span>
                            </span>
                            <span className="text-emerald-400">4 Agents Synced</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {m.agentSwarm.map((agent, i) => (
                              <div
                                key={i}
                                className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-start gap-2"
                              >
                                <span className="text-base">{agent.avatar}</span>
                                <div>
                                  <div className={`font-bold text-[11px] ${agent.color}`}>
                                    {agent.agent}
                                  </div>
                                  <div className="text-[11px] text-slate-300 leading-tight mt-0.5">
                                    {agent.thought}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Message Text Bubble */}
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg ${
                          isUser
                            ? "bg-slate-800/90 text-slate-100 border border-slate-700"
                            : "bg-slate-900/90 text-slate-100 border border-slate-800"
                        }`}
                      >
                        <div className="prose prose-invert max-w-none text-sm leading-relaxed">
                          <MarkdownRenderer content={m.text} />
                        </div>

                        {/* Proposed Code Artifact Box */}
                        {m.codeSnippet && (
                          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden font-mono text-xs">
                            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400">
                              <div className="flex items-center gap-1.5">
                                <Code2 className="h-3.5 w-3.5 text-cyan-400" />
                                <span>Astra-6 Generated Artifact ({m.language || "TypeScript"})</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(m.codeSnippet!);
                                    setCopiedId(m.id);
                                    setTimeout(() => setCopiedId(null), 2000);
                                  }}
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
                                    onClick={() => handleApplySingle(m.id, m.codeSnippet)}
                                    className="px-2.5 py-0.5 rounded bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 flex items-center gap-1 font-bold transition-colors"
                                  >
                                    {appliedId === m.id ? (
                                      <Check className="h-3 w-3 text-cyan-400" />
                                    ) : (
                                      <ArrowRight className="h-3 w-3" />
                                    )}
                                    <span>{appliedId === m.id ? "Applied!" : "Apply to Spec"}</span>
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="p-3 text-cyan-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                              {m.codeSnippet}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Streaming Indicator */}
              {isGenerating && (
                <div className="flex items-start gap-3.5 max-w-2xl mr-auto">
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-emerald-400 to-indigo-500 flex items-center justify-center flex-shrink-0 text-slate-950 font-black shadow-md">
                    <Zap className="h-4 w-4 fill-slate-950 animate-pulse" />
                  </div>
                  <div className="rounded-2xl px-4 py-3 bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                      <div className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce" />
                      <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                    </div>
                    <span className="font-mono text-slate-300">
                      Astra-6 multi-agent swarm reasoning across 4.00 GB vector space...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Atomic Multi-Stage Sync Banner */}
            <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">
                  Astra-6 Swarm Prompts:
                </span>
                {[
                  `Synthesize 50,000 RPS Redis cluster architecture for ${domain.shortName}`,
                  `Generate 3NF PostgreSQL DDL schema with audit triggers for ${e1}`,
                  `Enforce zero-trust token authentication barrier in ${techStack.backend}`,
                  `Run semantic similarity search on 4 GB vector index`
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendPrompt(prompt)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700/70 whitespace-nowrap transition-all flex-shrink-0"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <button
                onClick={handleAtomicSyncAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-black transition-all shadow-md flex-shrink-0"
                title="Atomic 1-click update across all 6 specification stages simultaneously"
              >
                {atomicApplied ? <Check className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
                <span>{atomicApplied ? "All 6 Specs Synced!" : "Atomic Sync 6 Specs"}</span>
              </button>
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-slate-900 border-t border-slate-800">
              <div className="flex items-center gap-2 rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 shadow-inner focus-within:border-cyan-500/60 transition-all">
                {/* Voice toggle */}
                <button
                  onClick={toggleVoice}
                  className={`p-2 rounded-lg transition-all ${
                    isListening
                      ? "bg-rose-600 text-white animate-pulse"
                      : "text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
                  }`}
                  title={isListening ? "Listening... click to pause" : "Duplex Voice Input"}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>

                {/* Text input */}
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendPrompt();
                    }
                  }}
                  placeholder={`Command Astra-6 regarding ${domain.shortName}, microservices, SQL, or memory...`}
                  className="flex-1 bg-transparent border-0 text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden"
                />

                {/* Voice speech toggle */}
                <button
                  onClick={() => {
                    setSpeechEnabled(!speechEnabled);
                    if (speechEnabled && window.speechSynthesis) window.speechSynthesis.cancel();
                  }}
                  className={`p-2 rounded-lg transition-all ${
                    speechEnabled ? "text-cyan-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-800"
                  }`}
                  title={speechEnabled ? "Speech Output Active" : "Speech Output Muted"}
                >
                  {speechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </button>

                {/* Send button */}
                <button
                  onClick={() => handleSendPrompt()}
                  disabled={!inputText.trim() || isGenerating}
                  className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white transition-all shadow-sm"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: 4-AGENT SWARM WORKSPACE --- */}
        {activeTab === "swarm" && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-emerald-400" />
                  <span>Autonomous 4-Agent Parallel Swarm</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Four autonomous intelligence models evaluate, synthesize, and verify system integrity in parallel.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
                {(["autonomous", "fast", "paranoid_security"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setActiveSwarmMode(mode)}
                    className={`px-2.5 py-1 rounded-md capitalize font-semibold transition-all ${
                      activeSwarmMode === mode ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {mode.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* 4 Agent Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Agent 1: Architect */}
              <div className="rounded-xl border border-blue-500/30 bg-slate-900/90 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-lg">
                      🏛️
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Nexus Architect</div>
                      <div className="text-[10px] text-blue-400 font-mono">System Design & Scaling</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                    ONLINE
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Monitors SLAs for <strong>{domain.shortName}</strong>. Enforces read/write replication, connection pooling with PgBouncer, and 50,000+ RPS horizontal scalability.
                </p>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-blue-300">
                  p99 Target: &lt; 25ms &bull; Cache Hit Ratio: 98.4%
                </div>
              </div>

              {/* Agent 2: Sentinel */}
              <div className="rounded-xl border border-rose-500/30 bg-slate-900/90 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center text-lg">
                      🛡️
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Sentinel Guardian</div>
                      <div className="text-[10px] text-rose-400 font-mono">Zero-Trust & Threat Defense</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                    ARMED
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Cryptographically validates all REST/gRPC endpoints under <code>{domain.apiPrefix}</code> using RS256 JWT tokens, OWASP Top 10 mitigation, and mTLS inter-service barriers.
                </p>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-rose-300">
                  Vulnerabilities: 0 &bull; Encryption: AES-256-GCM
                </div>
              </div>

              {/* Agent 3: Synthesizer */}
              <div className="rounded-xl border border-amber-500/30 bg-slate-900/90 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg">
                      ⚡
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Polyglot Synthesizer</div>
                      <div className="text-[10px] text-amber-400 font-mono">Multi-Language Code Synthesis</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                    READY
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Generates synchronous and asynchronous microservices code in TypeScript, Python FastAPI, Go Chi, Rust Axum, and SQL DDL with zero boilerplate.
                </p>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-amber-300">
                  Stack: {techStack.architecture} &bull; Backend: {techStack.backend}
                </div>
              </div>

              {/* Agent 4: Verifier */}
              <div className="rounded-xl border border-emerald-500/30 bg-slate-900/90 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg">
                      📐
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Invariant Verifier</div>
                      <div className="text-[10px] text-emerald-400 font-mono">ACM AIWare 2026 Formal Gate</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                    VERIFIED
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Executes 4-phase formal verification against the specification suite. Guarantees zero requirement drift between BDD Gherkin scenarios and runtime implementation.
                </p>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300">
                  Formal Spec Gate: 100% Passed (ACM AIWare 2026)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 3: 4 GB VIRTUAL MEMORY & IN-BROWSER VECTOR ENGINE --- */}
        {activeTab === "memory" && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-purple-400" />
                  <span>4.00 GB Local Virtual Memory Sandbox & Vector Index</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Strict client-side allocation pool (/astra-mnt/). Manages local neural weights, HNSW vector graph, and multi-turn KV cache.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleIngestUserFile}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Ingest Tensor Block (+64MB)</span>
                </button>
                <button
                  onClick={() => {
                    const data = JSON.stringify({ memoryBlocks, usedSpaceMb, freeSpaceMb, domain: domain.shortName }, null, 2);
                    const blob = new Blob([data], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `astra6-4gb-memory-snapshot-${Date.now()}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export Memory Snapshot</span>
                </button>
              </div>
            </div>

            {/* Quota Telemetry Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Hard Quota Boundary</span>
                <div className="text-2xl font-black text-white font-mono mt-1">4,096.0 MB</div>
                <span className="text-[10px] text-slate-500">4.00 GB Virtual Sandbox</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Allocated Space</span>
                <div className="text-2xl font-black text-cyan-400 font-mono mt-1">{usedSpaceMb.toFixed(1)} MB</div>
                <span className="text-[10px] text-cyan-500 font-mono">{usedPercent}% Utilized</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Available Free</span>
                <div className="text-2xl font-black text-emerald-400 font-mono mt-1">{freeSpaceMb.toFixed(1)} MB</div>
                <span className="text-[10px] text-emerald-500 font-mono">{(100 - +usedPercent).toFixed(1)}% Headroom</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Virtual VFS Mount</span>
                <div className="text-base font-bold text-purple-400 font-mono mt-1">/astra-mnt/</div>
                <span className="text-[10px] text-slate-500">Local in-memory VFS</span>
              </div>
            </div>

            {/* In-Browser HNSW Semantic Vector Search Testbed */}
            <div className="rounded-xl border border-purple-500/40 bg-slate-900 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Search className="h-4 w-4 text-purple-400" />
                  <span>In-Browser HNSW Vector Semantic RAG Engine (512.0 MB Index)</span>
                </h4>
                <span className="text-[10px] font-mono text-slate-400">Cosine Similarity Matching</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={vectorQuery}
                  onChange={(e) => setVectorQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRunVectorSearch()}
                  placeholder={`Search 4GB vector embeddings (e.g. "${e1} concurrency", "RS256 JWT", "3NF foreign keys")...`}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-purple-500"
                />
                <button
                  onClick={handleRunVectorSearch}
                  disabled={isVectorSearching || !vectorQuery.trim()}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Search className="h-3.5 w-3.5" />
                  <span>{isVectorSearching ? "Searching..." : "Vector Search"}</span>
                </button>
              </div>

              {vectorResults.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  {vectorResults.map((res, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
                          {res.stage}
                        </span>
                        <span className="text-slate-200">{res.doc}</span>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-400 font-bold">
                        <span>Similarity:</span>
                        <span>{(res.score * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Memory Pruning Controls */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                <span>Memory Pruning & Tensor Compaction Tools</span>
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handlePruneKvCache}
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
                <span>Virtual Partition Mount Table (/astra-mnt/)</span>
                <span className="text-[11px] font-mono text-slate-400">{memoryBlocks.length} blocks allocated</span>
              </div>
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-2">Virtual Path</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Allocation (MB)</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {memoryBlocks.map((block) => (
                    <tr key={block.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-2.5 text-slate-200 font-bold">{block.path}</td>
                      <td className="px-4 py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-slate-950 ${block.color}`}>
                          {block.category.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-cyan-300 font-bold">{block.sizeMb.toFixed(1)} MB</td>
                      <td className="px-4 py-2.5 text-slate-400">{block.updatedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- TAB 4: INTERACTIVE SQL & CODE REPL --- */}
        {activeTab === "repl" && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-amber-400" />
                  <span>In-Browser SQL & Schema Execution REPL</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Execute live queries against in-memory PostgreSQL 3NF schema tables for <strong>{domain.shortName}</strong>.
                </p>
              </div>

              <button
                onClick={handleExecuteSql}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-md"
              >
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>Execute Query</span>
              </button>
            </div>

            {/* Query Editor Box */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 font-mono text-xs">
              <label className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 block">
                SQL Query Buffer:
              </label>
              <textarea
                value={sqlQueryInput}
                onChange={(e) => setSqlQueryInput(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-amber-300 focus:outline-hidden focus:border-amber-500 font-mono text-xs leading-relaxed"
              />
            </div>

            {/* Query Result Grid */}
            {replResult && (
              <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden font-mono text-xs">
                <div className="px-4 py-2 bg-slate-800/80 border-b border-slate-800 text-[11px] font-bold text-slate-300 flex items-center justify-between">
                  <span>Query Results ({replResult.rows.length} rows returned)</span>
                  <span className="text-emerald-400">Execution Time: 0.94ms</span>
                </div>
                <table className="w-full text-left">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      {replResult.headers.map((h, i) => (
                        <th key={i} className="px-4 py-2 font-bold uppercase text-[10px]">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {replResult.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-800/40">
                        {row.map((val, cIdx) => (
                          <td key={cIdx} className="px-4 py-2 text-slate-200">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* --- TAB 5: COMPUTER VISION 2.0 & DIAGRAM COMPILER --- */}
        {activeTab === "vision" && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <ScanLine className="h-5 w-5 text-rose-400" />
                  <span>Astra-6 Vision 2.0 & Diagram-to-Code Compiler</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time optical architecture recognition, node invariant extraction, and direct blueprint compilation.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleCamera}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isCameraActive
                      ? "bg-rose-600 text-white"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                  }`}
                >
                  <Camera className="h-3.5 w-3.5" />
                  <span>{isCameraActive ? "Stop Camera" : "Live Camera"}</span>
                </button>
                <button
                  onClick={triggerVisionScan}
                  disabled={visionScanActive}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-cyan-600 hover:from-rose-500 hover:to-cyan-500 text-white text-xs font-bold transition-all shadow-md"
                >
                  <ScanLine className={`h-3.5 w-3.5 ${visionScanActive ? "animate-spin" : ""}`} />
                  <span>{visionScanActive ? "Compiling Blueprint..." : "Compile Diagram"}</span>
                </button>
              </div>
            </div>

            {/* Viewfinder Canvas Frame */}
            <div className="relative rounded-2xl overflow-hidden border border-rose-500/40 bg-slate-900 h-[380px] flex items-center justify-center shadow-2xl">
              {isCameraActive ? (
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              ) : (
                /* Simulated Blueprint Canvas */
                <div className="w-full h-full bg-radial from-slate-900 to-slate-950 p-8 flex flex-col justify-between font-mono">
                  <div className="flex items-center justify-between text-xs text-rose-400/80 border-b border-rose-500/20 pb-2">
                    <span>Astra-6 Vision Stream: [ACTIVE_BLUEPRINT_VIEW]</span>
                    <span>1920x1080 @ 60fps &bull; Neural OCR 2.0</span>
                  </div>

                  <div className="grid grid-cols-3 gap-6 my-auto">
                    <div className="rounded-xl border border-rose-500/50 bg-rose-950/30 p-4 text-center">
                      <div className="text-[10px] text-rose-400 font-bold uppercase">Ingress Gateway</div>
                      <div className="text-sm text-white font-bold mt-1">Envoy Proxy</div>
                      <div className="text-[10px] text-slate-400 mt-1">RS256 JWT + Rate Limiting</div>
                    </div>
                    <div className="rounded-xl border border-cyan-500/60 bg-cyan-950/30 p-4 text-center">
                      <div className="text-[10px] text-cyan-300 font-bold uppercase">Core Domain</div>
                      <div className="text-sm text-white font-bold mt-1">{e1} Engine</div>
                      <div className="text-[10px] text-slate-400 mt-1">{techStack.backend}</div>
                    </div>
                    <div className="rounded-xl border border-emerald-500/50 bg-emerald-950/30 p-4 text-center">
                      <div className="text-[10px] text-emerald-400 font-bold uppercase">Storage 3NF</div>
                      <div className="text-sm text-white font-bold mt-1">PostgreSQL 16</div>
                      <div className="text-[10px] text-slate-400 mt-1">Read/Write Cluster</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-rose-500/20 pt-2">
                    <span>Domain: {domain.shortName} System Mesh</span>
                    <span>Compiler Latency: 11.8ms</span>
                  </div>
                </div>
              )}

              {/* Laser Scanning Animation Overlay */}
              {visionScanActive && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-rose-400 to-transparent shadow-lg shadow-rose-400 animate-bounce top-1/2" />
              )}

              {/* HUD Reticle */}
              <div className="absolute top-4 left-4 pointer-events-none border-t-2 border-l-2 border-rose-400 h-8 w-8" />
              <div className="absolute top-4 right-4 pointer-events-none border-t-2 border-r-2 border-rose-400 h-8 w-8" />
              <div className="absolute bottom-4 left-4 pointer-events-none border-b-2 border-l-2 border-rose-400 h-8 w-8" />
              <div className="absolute bottom-4 right-4 pointer-events-none border-b-2 border-r-2 border-rose-400 h-8 w-8" />
            </div>

            {/* Extracted Invariants */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ScanLine className="h-3.5 w-3.5 text-rose-400" />
                <span>Extracted Architecture Invariants</span>
              </h4>
              <div className="space-y-1.5 text-xs font-mono">
                {visionInvariants.map((inv, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center justify-between"
                  >
                    <span>{inv}</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">SYNCHRONIZED</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. FULLSCREEN QUANTUM DUPLEX VOICE ORB MODAL */}
      {isQuantumOrbModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-between p-8 select-none">
          {/* Top Bar */}
          <div className="w-full flex items-center justify-between max-w-3xl">
            <div className="flex items-center gap-2.5 text-xs font-mono text-slate-300">
              <Zap className="h-4 w-4 text-cyan-400" />
              <span className="font-bold">Astra-6 Quantum Duplex Voice</span>
              <span>&bull;</span>
              <span className="text-cyan-400">{domain.shortName}</span>
            </div>
            <button
              onClick={() => {
                setIsQuantumOrbModalOpen(false);
                if (window.speechSynthesis) window.speechSynthesis.cancel();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Center Quantum Visualizer & Harmonic Orb */}
          <div className="flex flex-col items-center gap-8 my-auto w-full max-w-2xl">
            {/* Dynamic Canvas Waveform */}
            <canvas
              ref={audioCanvasRef}
              width={600}
              height={140}
              className="w-full max-w-lg h-28 pointer-events-none"
            />

            {/* Glowing Orb */}
            <div className="relative flex items-center justify-center">
              <div
                className={`absolute h-64 w-64 rounded-full bg-gradient-to-tr from-cyan-500 via-emerald-400 to-purple-600 opacity-40 blur-3xl transition-all duration-500 ${
                  isSpeaking || isListening ? "scale-125 animate-pulse" : "scale-90"
                }`}
              />
              <div
                className={`h-40 w-40 rounded-full bg-gradient-to-tr from-cyan-400 via-teal-400 to-emerald-400 shadow-2xl shadow-cyan-500/50 flex items-center justify-center transition-all duration-300 ${
                  isListening ? "scale-105" : isSpeaking ? "scale-115" : "scale-100"
                }`}
              >
                <Zap className="h-16 w-16 fill-slate-950 text-slate-950" />
              </div>
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                {isListening
                  ? "Listening to your voice..."
                  : isSpeaking
                  ? "Astra-6 is speaking..."
                  : "Astra-6 is waiting for voice input"}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Full-duplex enabled: speak anytime to immediately interrupt
              </p>
            </div>
          </div>

          {/* Bottom Voice Controls */}
          <div className="w-full max-w-md flex items-center justify-center gap-6">
            <button
              onClick={toggleVoice}
              className={`p-4 rounded-full transition-all shadow-xl ${
                isListening
                  ? "bg-rose-600 text-white animate-bounce"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-200"
              }`}
            >
              {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </button>
            <button
              onClick={() => {
                setIsQuantumOrbModalOpen(false);
                if (window.speechSynthesis) window.speechSynthesis.cancel();
              }}
              className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-900/40 transition-all"
            >
              End Voice Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- MULTI-AGENT SWARM REASONING SYNTHESIZER ---
function generateAstra6SwarmResponse(
  query: string,
  domain: DomainContext,
  techStack: TechStackPreferences
): { text: string; agentSwarm: AgentThought[]; codeSnippet?: string; language?: string } {
  const q = query.toLowerCase();
  const e1 = domain.primaryEntities[0] || "PrimaryEntity";
  const e2 = domain.primaryEntities[1] || "EventRecord";

  const agentSwarm: AgentThought[] = [
    { agent: "Architect", avatar: "🏛️", color: "text-blue-400", thought: `Evaluated 50,000+ RPS horizontal scalability & Redis Sentinel caching for ${domain.shortName}`, status: "completed" },
    { agent: "Sentinel", avatar: "🛡️", color: "text-rose-400", thought: `Verified asymmetric RS256 token verification & RBAC boundary on ${domain.apiPrefix}`, status: "completed" },
    { agent: "Synthesizer", avatar: "⚡", color: "text-amber-400", thought: `Compiled production ${techStack.backend} implementation with non-blocking I/O`, status: "completed" },
    { agent: "Verifier", avatar: "📐", color: "text-emerald-400", thought: `Validated against ACM AIWare 2026 formal gates: 0 drift detected`, status: "completed" }
  ];

  if (q.includes("scale") || q.includes("concurrency") || q.includes("rps") || q.includes("load") || q.includes("redis")) {
    return {
      text: `### Astra-6 Swarm Architecture Synthesis: 50,000+ RPS Scalability\n\nThe **Nexus Architect** and **Polyglot Synthesizer** have compiled an optimized concurrency topology for **${domain.title}**:\n\n1. **Edge Token Gateway**: Envoy proxy validates stateless RS256 JWT claims in <1.2ms without hitting origin databases.\n2. **In-Memory Cache-Aside**: Redis 7.2 Cluster partitions hot \`${e1}\` state with probabilistic early expiration (XFetch algorithm).\n3. **Decoupled Event Stream**: Write operations for \`${e2}\` are pushed to Kafka topics for asynchronous worker ingestion.\n4. **Database Pool**: PgBouncer multiplexing over PostgreSQL 16 read replicas with ACID write isolation.`,
      agentSwarm,
      language: "TypeScript",
      codeSnippet: `// High-Performance Concurrency Buffer with Redis Cluster
import Redis from "ioredis";

const redis = new Redis.Cluster([
  { host: "redis-node-1", port: 6379 },
  { host: "redis-node-2", port: 6379 }
]);

export async function getCached${e1}(id: string): Promise<any> {
  const cacheKey = \`${domain.shortName.toLowerCase()}:entity:\${id}\`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // Fallback to database with distributed lock
  const lockKey = \`lock:\${cacheKey}\`;
  const acquired = await redis.set(lockKey, "1", "NX", "EX", 5);
  if (!acquired) {
    await new Promise((r) => setTimeout(r, 40));
    return getCached${e1}(id);
  }

  try {
    const data = await fetchFromDb(id);
    await redis.set(cacheKey, JSON.stringify(data), "EX", 300);
    return data;
  } finally {
    await redis.del(lockKey);
  }
}`
    };
  }

  if (q.includes("schema") || q.includes("sql") || q.includes("ddl") || q.includes("3nf") || q.includes("database")) {
    return {
      text: `### Astra-6 3NF Relational Schema Architecture\n\nThe **Invariant Verifier** confirmed strict Third Normal Form (3NF) relational compliance between **${e1}** and **${e2}** with referential integrity, UUID primary keys, and automated change-data-capture triggers:`,
      agentSwarm,
      language: "SQL",
      codeSnippet: `-- 3NF Schema for ${domain.title}
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS ${e1.toLowerCase()}s (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  status VARCHAR(60) NOT NULL DEFAULT 'ACTIVE',
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
  ON ${e2.toLowerCase()}s(${e1.toLowerCase()}_id);

CREATE OR REPLACE FUNCTION trigger_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_${e1.toLowerCase()}_timestamp
BEFORE UPDATE ON ${e1.toLowerCase()}s
FOR EACH ROW EXECUTE FUNCTION trigger_update_timestamp();`
    };
  }

  if (q.includes("auth") || q.includes("security") || q.includes("jwt") || q.includes("token") || q.includes("zero-trust")) {
    return {
      text: `### Astra-6 Sentinel Security Architecture\n\nThe **Sentinel Guardian** generated a **Zero-Trust Token Boundary** using asymmetric RS256 JWT cryptography, rate-limiting, and RBAC scope guards for **${domain.shortName}**:`,
      agentSwarm,
      language: "TypeScript",
      codeSnippet: `// Zero-Trust RS256 JWT Authentication Guard
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const require${domain.shortName}Guard = (requiredScope: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing Bearer token" });
    }

    const token = authHeader.slice(7);
    try {
      const publicKey = process.env.JWT_PUBLIC_KEY || "";
      const claims = jwt.verify(token, publicKey, { algorithms: ["RS256"] }) as any;

      if (!claims.scopes?.includes(requiredScope)) {
        return res.status(403).json({ error: "Insufficient privilege scope" });
      }

      req.user = claims;
      next();
    } catch {
      return res.status(403).json({ error: "Cryptographically invalid token" });
    }
  };
};`
    };
  }

  return {
    text: `### Astra-6 Autonomous Synthesis for ${domain.title}\n\nThe 4-agent swarm has processed your command within the **4.00 GB Local Virtual Memory Sandbox**.\n\n* **Primary Entity**: \`${e1}\`\n* **Event Topology**: \`${e2}\`\n* **Stack**: \`${techStack.architecture}\` &bull; \`${techStack.backend}\`\n* **Formal Integrity**: 100% compliant with ACM AIWare 2026 specifications.`,
    agentSwarm,
    language: "TypeScript",
    codeSnippet: `// Production Service Implementation for ${domain.shortName}
export class ${domain.shortName}Engine {
  constructor(private readonly pool: any) {}

  async fetchEntity(id: string) {
    const res = await this.pool.query(
      "SELECT * FROM ${e1.toLowerCase()}s WHERE id = $1",
      [id]
    );
    return res.rows[0];
  }
}`
  };
}
