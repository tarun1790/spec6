"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Play,
  Activity,
  Server,
  Database,
  Shield,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  Terminal,
  ArrowRight,
  TrendingUp,
  Cpu,
  Radio,
  Sliders,
  Flame,
  Check,
  Plus
} from "lucide-react";
import { DomainContext } from "@/lib/mock-generator";
import { TechStackPreferences, SpecificationRigor } from "@/lib/types";
import {
  generatePrototypeConfig,
  PrototypeConfig,
  PrototypeItem,
  enhanceIdeaWithAstra6,
  IdeaEnhancementResult
} from "@/lib/astra6-engine";

interface IdeaImplementationStudioProps {
  domain: DomainContext;
  techStack: TechStackPreferences;
  userPrompt?: string;
  rigor?: SpecificationRigor;
  onOpenCopilot?: () => void;
  onApplyRefactor?: (stageIndex: number, addition: string) => void;
}

interface SimulatedEvent {
  id: string;
  timestamp: string;
  topic: string;
  type: "INFO" | "SUCCESS" | "WARN" | "ALERT";
  payload: Record<string, any>;
  latencyMs: number;
}

export const IdeaImplementationStudio: React.FC<IdeaImplementationStudioProps> = ({
  domain,
  techStack,
  userPrompt = "",
  rigor = "spec-anchored",
  onOpenCopilot
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"prototype" | "operator" | "events" | "database" | "blueprint">("prototype");

  // Astra 6 Comprehension Analysis
  const enhancement: IdeaEnhancementResult = enhanceIdeaWithAstra6(userPrompt || domain.userPromptRaw || domain.title, techStack);
  const initialConfig: PrototypeConfig = generatePrototypeConfig(domain, techStack);

  // Simulator state
  const [items, setItems] = useState<PrototypeItem[]>(initialConfig.items);
  const [workflow, setWorkflow] = useState(initialConfig.workflowSteps);
  const [isSimulatingAction, setIsSimulatingAction] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Metrics state
  const [throughputRps, setThroughputRps] = useState(2420);
  const [p95LatencyMs, setP95LatencyMs] = useState(34);
  const [activeConnections, setActiveConnections] = useState(148);
  const [simulationStatus, setSimulationStatus] = useState<"normal" | "surge" | "attack" | "failover">("normal");

  // Event stream state
  const [events, setEvents] = useState<SimulatedEvent[]>([
    {
      id: "evt-01",
      timestamp: new Date(Date.now() - 60000).toLocaleTimeString(),
      topic: `${domain.apiPrefix.replace("/api/v1/", "")}.lifecycle`,
      type: "SUCCESS",
      payload: { event: "SystemInitialized", status: "ONLINE", cluster: "us-east-1" },
      latencyMs: 12
    },
    {
      id: "evt-02",
      timestamp: new Date(Date.now() - 30000).toLocaleTimeString(),
      topic: `${domain.apiPrefix.replace("/api/v1/", "")}.telemetry`,
      type: "INFO",
      payload: { heartbeat: "OK", queue_depth: 0, p95_latency: "28ms" },
      latencyMs: 8
    }
  ]);

  // Update items if domain changes
  useEffect(() => {
    const fresh = generatePrototypeConfig(domain, techStack);
    setItems(fresh.items);
    setWorkflow(fresh.workflowSteps);
  }, [domain, techStack]);

  const addSimulatedEvent = (topic: string, type: "INFO" | "SUCCESS" | "WARN" | "ALERT", payload: Record<string, any>, latencyMs: number) => {
    const newEvt: SimulatedEvent = {
      id: `evt-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString(),
      topic,
      type,
      payload,
      latencyMs
    };
    setEvents((prev) => [newEvt, ...prev.slice(0, 39)]);
  };

  // Primary interactive action trigger (e.g. Place Order, Book Telehealth, Start Charge, Submit Trade)
  const handleExecutePrimaryAction = () => {
    setIsSimulatingAction(true);
    setActionSuccessMessage(null);

    setTimeout(() => {
      const e1 = domain.primaryEntities[0] || "Entity";
      const newItemId = `${e1.toLowerCase().slice(0, 3)}-${Date.now().toString().slice(-3)}`;
      const newItem: PrototypeItem = {
        id: newItemId,
        title: `Live Action: ${domain.title} Request`,
        subtitle: `Created at ${new Date().toLocaleTimeString()} • Verified 3NF Commit`,
        status: "Processing (In-Flight)",
        statusColor: "emerald",
        badge: "Just Created",
        meta: {
          ID: newItemId,
          State: "COMMITTED",
          Latency: "24ms",
          Executor: initialConfig.clientRole
        }
      };

      setItems((prev) => [newItem, ...prev]);

      // Progress workflow
      setWorkflow((prev) =>
        prev.map((w, idx) => (idx === 0 || idx === 1 ? { ...w, completed: true } : w))
      );

      // Add to event stream
      addSimulatedEvent(
        `${domain.apiPrefix.replace("/api/v1/", "")}.mutation`,
        "SUCCESS",
        { action: "EntityStateTransition", id: newItemId, status: "COMMITTED" },
        24
      );

      setIsSimulatingAction(false);
      setActionSuccessMessage(`Successfully executed action! Created ${newItemId} with sub-second commit.`);
      setTimeout(() => setActionSuccessMessage(null), 4000);
    }, 450);
  };

  // Simulation controls
  const triggerTrafficSurge = () => {
    setSimulationStatus("surge");
    setThroughputRps(12800);
    setP95LatencyMs(62);
    setActiveConnections(890);

    addSimulatedEvent(
      "system.autoscaler",
      "WARN",
      { message: "Traffic Surge Detected (12,800 RPS)", action: "Scaling pods from 3 to 12" },
      45
    );

    setTimeout(() => {
      setSimulationStatus("normal");
      setThroughputRps(2850);
      setP95LatencyMs(32);
      setActiveConnections(180);
      addSimulatedEvent("system.autoscaler", "SUCCESS", { message: "Traffic normalized, pods steady" }, 18);
    }, 4500);
  };

  const triggerSecurityAttack = () => {
    setSimulationStatus("attack");
    addSimulatedEvent(
      "security.waf",
      "ALERT",
      { threat: "IDOR enumeration probe detected", source_ip: "198.51.100.44", mitigation: "IP Quarantined (403)" },
      4
    );

    setTimeout(() => {
      setSimulationStatus("normal");
      addSimulatedEvent("security.audit", "SUCCESS", { audit_log: "Attack blocked, 0 leakage" }, 2);
    }, 3500);
  };

  const triggerDbFailover = () => {
    setSimulationStatus("failover");
    setP95LatencyMs(110);
    addSimulatedEvent(
      "database.sentinel",
      "WARN",
      { event: "Primary DB heartbeat timeout", action: "Promoting read replica to primary" },
      110
    );

    setTimeout(() => {
      setSimulationStatus("normal");
      setP95LatencyMs(34);
      addSimulatedEvent("database.sentinel", "SUCCESS", { status: "Failover complete, RPO=0, RTO=1.2s" }, 15);
    }, 3500);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-slate-100 rounded-2xl overflow-hidden border border-slate-800 shadow-xl select-none">
      {/* 1. Header & Live System Status */}
      <div className="p-4 md:p-5 bg-slate-950 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold tracking-wider uppercase">
              <Sparkles className="h-3 w-3 text-emerald-400 animate-pulse" />
              <span>Astra 6 Enhanced Implementation</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {domain.category}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>{initialConfig.appTitle}</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            {initialConfig.appSubtitle} — Fully operational live simulator grounded in your specifications.
          </p>
        </div>

        {/* Live Gauges */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-center min-w-[75px]">
            <div className={`text-sm font-bold font-mono ${simulationStatus === "surge" ? "text-amber-400" : "text-emerald-400"}`}>
              {throughputRps.toLocaleString()}
            </div>
            <div className="text-[9px] text-slate-500 uppercase font-semibold">Throughput RPS</div>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-center min-w-[75px]">
            <div className={`text-sm font-bold font-mono ${simulationStatus === "failover" ? "text-rose-400" : "text-blue-400"}`}>
              {p95LatencyMs}ms
            </div>
            <div className="text-[9px] text-slate-500 uppercase font-semibold">p95 Latency</div>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-center min-w-[75px]">
            <div className="text-sm font-bold font-mono text-purple-400">
              {items.length}
            </div>
            <div className="text-[9px] text-slate-500 uppercase font-semibold">Active Rows</div>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-center min-w-[75px]">
            <div className="text-sm font-bold font-mono text-teal-400">
              {events.length}
            </div>
            <div className="text-[9px] text-slate-500 uppercase font-semibold">Kafka Events</div>
          </div>
        </div>
      </div>

      {/* 2. Sub-Tab Ribbon */}
      <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setActiveSubTab("prototype")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
              activeSubTab === "prototype"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Play className="h-3.5 w-3.5" />
            <span>Interactive App</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("operator")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
              activeSubTab === "operator"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Command Center & Stress</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("events")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
              activeSubTab === "events"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Radio className="h-3.5 w-3.5" />
            <span>Live Event Stream</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("database")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
              activeSubTab === "database"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            <span>Database State</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("blueprint")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
              activeSubTab === "blueprint"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Astra 6 Blueprint</span>
          </button>
        </div>

        {/* Quick Trigger Button in Bar */}
        <div className="flex items-center gap-2">
          {actionSuccessMessage && (
            <span className="text-[11px] text-emerald-400 font-semibold animate-in fade-in flex items-center gap-1">
              <Check className="h-3.5 w-3.5" />
              <span>{actionSuccessMessage}</span>
            </span>
          )}
          <button
            type="button"
            onClick={handleExecutePrimaryAction}
            disabled={isSimulatingAction}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 text-xs font-bold transition-all shadow-xs disabled:opacity-50"
          >
            {isSimulatingAction ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
            <span>Execute Live Action</span>
          </button>
        </div>
      </div>

      {/* 3. Main Body Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-900/60">
        {/* SUBTAB 1: INTERACTIVE APP SIMULATOR */}
        {activeSubTab === "prototype" && (
          <div className="space-y-6 max-w-6xl mx-auto">
            {/* Action Bar & Workflow Tracker */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Client Interface ({initialConfig.clientRole})
                  </div>
                  <div className="text-sm font-semibold text-slate-200">
                    Interact directly with simulated operational endpoints:
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleExecutePrimaryAction}
                  disabled={isSimulatingAction}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSimulatingAction ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                  <span>{initialConfig.primaryActionLabel}</span>
                </button>
              </div>

              {/* Workflow Stepper */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80">
                {workflow.map((w) => (
                  <div
                    key={w.step}
                    className={`p-2.5 rounded-xl border transition-all ${
                      w.completed
                        ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
                        : "bg-slate-900 border-slate-800 text-slate-400"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[11px] font-bold">
                      {w.completed ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <div className="h-3.5 w-3.5 rounded-full border border-slate-600 flex items-center justify-center text-[9px] shrink-0 font-mono">
                          {w.step}
                        </div>
                      )}
                      <span>{w.title}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 leading-tight line-clamp-2">
                      {w.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Interactive Entity Cards List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {initialConfig.itemNoun} ({items.length} Active)
                </div>
                <div className="text-[11px] text-slate-500">
                  Clicking actions updates state, broadcasts events, and writes 3NF rows
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {items.map((it) => (
                  <div
                    key={it.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all shadow-md space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-bold">
                          {it.id}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full bg-${it.statusColor}-500/20 text-${it.statusColor}-400 border border-${it.statusColor}-500/30`}>
                          {it.badge}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-white tracking-tight">
                        {it.title}
                      </div>
                      <div className="text-xs text-slate-400 leading-relaxed">
                        {it.subtitle}
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">Status:</span>
                        <span className="font-semibold text-emerald-400 font-mono">
                          {it.status}
                        </span>
                      </div>

                      {/* Key-value attributes */}
                      <div className="grid grid-cols-2 gap-1 text-[10px] font-mono bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                        {Object.entries(it.meta).map(([k, v]) => (
                          <div key={k} className="truncate">
                            <span className="text-slate-500">{k}: </span>
                            <span className="text-slate-200 font-semibold">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Telemetry KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {initialConfig.liveMetricLabels.map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 shadow-sm space-y-1">
                  <div className="text-[11px] text-slate-400 font-medium">{m.label}</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold font-mono text-white">{m.value}</span>
                    <span className="text-xs text-slate-500 font-mono">{m.unit}</span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-semibold">{m.change}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 2: OPERATOR COMMAND CENTER & STRESS TESTING */}
        {activeSubTab === "operator" && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-emerald-400" />
                    <span>Live Architecture Stress & Chaos Simulator</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Inject production load, test rate limits, and evaluate failover recovery without downtime.
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase ${
                  simulationStatus === "normal"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse"
                }`}>
                  Status: {simulationStatus.toUpperCase()}
                </span>
              </div>

              {/* Stress Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={triggerTrafficSurge}
                  className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-left transition-all active:scale-95 space-y-1"
                >
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <TrendingUp className="h-4 w-4 text-amber-400" />
                    <span>Simulate Surge (12.8k RPS)</span>
                  </div>
                  <p className="text-[11px] text-amber-200/70">
                    Tests HPA Kubernetes pod autoscaling and Redis connection pooling.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={triggerSecurityAttack}
                  className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-left transition-all active:scale-95 space-y-1"
                >
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <Shield className="h-4 w-4 text-rose-400" />
                    <span>Simulate Injection Attack</span>
                  </div>
                  <p className="text-[11px] text-rose-200/70">
                    Validates WAF rate-limiting and token verification boundaries.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={triggerDbFailover}
                  className="p-3.5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-left transition-all active:scale-95 space-y-1"
                >
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <Database className="h-4 w-4 text-blue-400" />
                    <span>Simulate DB Failover</span>
                  </div>
                  <p className="text-[11px] text-blue-200/70">
                    Tests replica promotion with zero data loss (RPO = 0, RTO &lt; 2s).
                  </p>
                </button>
              </div>
            </div>

            {/* Architectural Health Gauges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>CPU / Pod Allocation</span>
                  <span className="font-mono text-emerald-400 font-bold">{simulationStatus === "surge" ? "88%" : "28%"}</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${simulationStatus === "surge" ? "bg-amber-500 w-[88%]" : "bg-emerald-500 w-[28%]"}`}
                  />
                </div>
                <div className="text-[10px] text-slate-500">
                  {simulationStatus === "surge" ? "12 active Kubernetes worker pods" : "3 steady-state worker pods"}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Cache Hit Ratio (Redis)</span>
                  <span className="font-mono text-blue-400 font-bold">96.8%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[96.8%] transition-all duration-500" />
                </div>
                <div className="text-[10px] text-slate-500">
                  Sub-millisecond query offloading via Cache-Aside Pattern
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Zero-Trust Token Integrity</span>
                  <span className="font-mono text-teal-400 font-bold">100%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 w-[100%] transition-all duration-500" />
                </div>
                <div className="text-[10px] text-slate-500">
                  RS256 asymmetric signature verification at API gateway
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 3: LIVE EVENT STREAM */}
        {activeSubTab === "events" && (
          <div className="space-y-4 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                <span>Distributed Message Bus (Apache Kafka / Redis Stream Feed)</span>
              </div>
              <button
                type="button"
                onClick={() => addSimulatedEvent("system.manual_poll", "INFO", { trigger: "Manual ping" }, 6)}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              >
                + Inject Test Event
              </button>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 space-y-2 max-h-[550px] overflow-y-auto">
              {events.map((e) => (
                <div
                  key={e.id}
                  className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">{e.timestamp}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        e.type === "SUCCESS"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : e.type === "WARN"
                          ? "bg-amber-500/20 text-amber-400"
                          : e.type === "ALERT"
                          ? "bg-rose-500/20 text-rose-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {e.type}
                    </span>
                    <span className="text-emerald-400 font-semibold">{e.topic}</span>
                  </div>
                  <div className="text-slate-300 text-[11px] truncate max-w-xl">
                    {JSON.stringify(e.payload)}
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0">
                    {e.latencyMs}ms
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 4: DATABASE STATE INSPECTOR */}
        {activeSubTab === "database" && (
          <div className="space-y-4 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Database className="h-4 w-4 text-purple-400" />
                  <span>PostgreSQL 16 In-Memory Relational State</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Normalized 3NF relational records representing active database rows:
                </p>
              </div>
              <span className="text-xs font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-lg">
                Table: {domain.primaryEntities[0]?.toLowerCase() || "entities"}s ({items.length} rows)
              </span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs divide-y divide-slate-800">
                  <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-mono">
                    <tr>
                      <th className="px-4 py-3">id (PK)</th>
                      <th className="px-4 py-3">title_name</th>
                      <th className="px-4 py-3">lifecycle_status</th>
                      <th className="px-4 py-3">attributes (JSON)</th>
                      <th className="px-4 py-3">created_at</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px] text-slate-300">
                    {items.map((it) => (
                      <tr key={it.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="px-4 py-3 font-semibold text-emerald-400">{it.id}</td>
                        <td className="px-4 py-3 font-sans text-white font-medium">{it.title}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px]">
                            {it.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 truncate max-w-xs">
                          {JSON.stringify(it.meta)}
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-[10px]">
                          2026-09-10T10:00:00Z
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 5: ASTRA 6 ARCHITECTURAL BLUEPRINT */}
        {activeSubTab === "blueprint" && (
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Core Problem & Value Proposition */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-md space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase">
                  Astra 6 Idea Comprehension
                </span>
              </div>
              <h3 className="text-base font-bold text-white">
                {enhancement.valueProposition}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-300">Core Problem Solved: </strong>
                {enhancement.problemStatement}
              </p>
            </div>

            {/* 4 Architectural Strategy Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <Server className="h-4 w-4" />
                  <span>Microservices Topology</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {enhancement.architecturalStrategy.microservicesTopology}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
                  <Database className="h-4 w-4" />
                  <span>Persistence & 3NF Schema</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {enhancement.architecturalStrategy.persistenceStrategy}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                  <Zap className="h-4 w-4" />
                  <span>Concurrency & Event Streaming</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {enhancement.architecturalStrategy.concurrencyHandling}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                  <Shield className="h-4 w-4" />
                  <span>Zero-Trust Security Posture</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {enhancement.architecturalStrategy.securityPosture}
                </p>
              </div>
            </div>

            {/* Core Innovations Identified */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Astra 6 Injected Enterprise Moats & Innovations
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {enhancement.coreInnovations.map((inn, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{inn}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
