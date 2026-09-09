"use client";

import React, { useState } from "react";
import { Server, Database, Shield, Zap, Activity, AlertTriangle, RefreshCw, Layers, CheckCircle2, ArrowRight, ArrowDown } from "lucide-react";
import { DomainContext } from "@/lib/mock-generator";
import { TechStackPreferences } from "@/lib/types";

interface TopologyCanvasProps {
  domain: DomainContext;
  techStack: TechStackPreferences;
}

interface ServiceNode {
  id: string;
  name: string;
  type: "gateway" | "orchestrator" | "worker" | "cache" | "database";
  tier: string;
  rps: number;
  latencyMs: number;
  pods: string;
  status: "healthy" | "degraded" | "failing";
  description: string;
  dependencies: string[];
}

export const TopologyCanvas: React.FC<TopologyCanvasProps> = ({ domain, techStack }) => {
  const e1 = domain.primaryEntities[0] || "Primary";
  const e2 = domain.primaryEntities[1] || "Event";

  const [chaosMode, setChaosMode] = useState<"none" | "latency" | "surge" | "db_failover">("none");
  const [selectedNodeId, setSelectedNodeId] = useState<string>("gw");

  const nodes: ServiceNode[] = [
    {
      id: "gw",
      name: "API & Ingress Gateway",
      type: "gateway",
      tier: "Edge & Security",
      rps: chaosMode === "surge" ? 14200 : 1840,
      latencyMs: chaosMode === "surge" ? 42 : 12,
      pods: chaosMode === "surge" ? "8/8" : "3/3",
      status: "healthy",
      description: "Envoy/Kong reverse proxy terminating TLS 1.3, enforcing token bucket rate limiting and zero-trust JWT authentication.",
      dependencies: ["core", "worker"]
    },
    {
      id: "core",
      name: `${e1} Domain Orchestrator`,
      type: "orchestrator",
      tier: "Core Microservices",
      rps: chaosMode === "surge" ? 9800 : 1250,
      latencyMs: chaosMode === "latency" ? 820 : 28,
      pods: chaosMode === "surge" ? "12/12" : "4/4",
      status: chaosMode === "latency" ? "degraded" : "healthy",
      description: `Primary transactional service managing ${e1} lifecycle mutations, schema validation, and state machine enforcement.`,
      dependencies: ["db", "cache"]
    },
    {
      id: "worker",
      name: `${e2} Stream Worker`,
      type: "worker",
      tier: "Event Processing",
      rps: chaosMode === "surge" ? 4400 : 590,
      latencyMs: 16,
      pods: "3/3",
      status: "healthy",
      description: `Asynchronous background consumer ingesting continuous ${e2} telemetry and publishing to message queue.`,
      dependencies: ["cache", "db"]
    },
    {
      id: "cache",
      name: "Redis Cluster (L2 Cache & Bus)",
      type: "cache",
      tier: "In-Memory Data Tier",
      rps: chaosMode === "surge" ? 22000 : 3400,
      latencyMs: 1.8,
      pods: "6/6 (3 master + 3 replica)",
      status: "healthy",
      description: "Sub-millisecond cache-aside storage, session state store, and distributed Redlock mutex coordinator.",
      dependencies: []
    },
    {
      id: "db",
      name: "PostgreSQL 16 (Multi-AZ)",
      type: "database",
      tier: "Persistence Tier",
      rps: chaosMode === "surge" ? 6200 : 890,
      latencyMs: chaosMode === "latency" ? 890 : chaosMode === "db_failover" ? 140 : 14,
      pods: chaosMode === "db_failover" ? "Replica Promoted" : "1 Primary + 2 Standby",
      status: chaosMode === "latency" ? "degraded" : chaosMode === "db_failover" ? "degraded" : "healthy",
      description: `ACID relational database partitioned for ${domain.primaryEntities.join(", ")}, with automated point-in-time recovery.`,
      dependencies: []
    }
  ];

  const activeNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  return (
    <div className="h-full flex flex-col bg-slate-900 text-slate-100 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
      {/* Top Banner & Chaos Simulator Controls */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-3 gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>{domain.shortName} Visual Architecture & Live Mesh</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {chaosMode === "none" ? "Nominal State" : `Chaos Active: ${chaosMode.toUpperCase()}`}
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              Interactive node topology with real-time telemetry and chaos engineering resilience injection
            </div>
          </div>
        </div>

        {/* Chaos Injection Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Chaos:</span>
          <button
            type="button"
            onClick={() => setChaosMode("none")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
              chaosMode === "none"
                ? "bg-emerald-600 text-white border-emerald-500 font-bold shadow-xs"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
            }`}
          >
            Normal (Nominal)
          </button>
          <button
            type="button"
            onClick={() => setChaosMode("latency")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
              chaosMode === "latency"
                ? "bg-amber-600 text-white border-amber-500 font-bold shadow-xs"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
            }`}
          >
            DB Latency Spike (900ms)
          </button>
          <button
            type="button"
            onClick={() => setChaosMode("surge")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
              chaosMode === "surge"
                ? "bg-purple-600 text-white border-purple-500 font-bold shadow-xs"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
            }`}
          >
            Traffic Surge (15k RPS)
          </button>
          <button
            type="button"
            onClick={() => setChaosMode("db_failover")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
              chaosMode === "db_failover"
                ? "bg-rose-600 text-white border-rose-500 font-bold shadow-xs"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
            }`}
          >
            Primary DB Failover
          </button>
        </div>
      </div>

      {/* Main Canvas Split: Visual Mesh (8 cols) | Node Telemetry Inspector (4 cols) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Visual Topology Graph Canvas */}
        <div className="lg:col-span-8 p-6 overflow-y-auto bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center space-y-6 select-none relative">
          {/* Level 1: Ingress Gateway */}
          <div className="w-full max-w-md">
            <div
              onClick={() => setSelectedNodeId("gw")}
              className={`p-4 rounded-xl border transition-all cursor-pointer shadow-lg ${
                selectedNodeId === "gw"
                  ? "bg-slate-800 border-emerald-400 ring-2 ring-emerald-500/30"
                  : "bg-slate-900/90 border-slate-700 hover:border-slate-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Edge & Ingress API Gateway</div>
                    <div className="text-[10px] text-slate-400 font-mono">Envoy / TLS 1.3 / Rate Limiter</div>
                  </div>
                </div>
                <div className="text-right font-mono text-[10px]">
                  <div className="text-emerald-400 font-bold">{nodes[0].rps.toLocaleString()} RPS</div>
                  <div className="text-slate-400">{nodes[0].latencyMs}ms p95</div>
                </div>
              </div>
            </div>
          </div>

          <ArrowDown className="h-5 w-5 text-emerald-500/60 animate-bounce" />

          {/* Level 2: Core Microservices (Side-by-Side) */}
          <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Core Orchestrator */}
            <div
              onClick={() => setSelectedNodeId("core")}
              className={`p-4 rounded-xl border transition-all cursor-pointer shadow-lg ${
                selectedNodeId === "core"
                  ? "bg-slate-800 border-emerald-400 ring-2 ring-emerald-500/30"
                  : nodes[1].status === "degraded"
                  ? "bg-amber-950/40 border-amber-500/60"
                  : "bg-slate-900/90 border-slate-700 hover:border-slate-500"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${nodes[1].status === "degraded" ? "bg-amber-500/20 text-amber-400" : "bg-blue-500/20 text-blue-400"}`}>
                    <Server className="h-4 w-4" />
                  </div>
                  <div className="text-xs font-bold text-white truncate max-w-[140px]">{nodes[1].name}</div>
                </div>
                <span className={`h-2 w-2 rounded-full ${nodes[1].status === "degraded" ? "bg-amber-400 animate-ping" : "bg-emerald-400"}`} />
              </div>
              <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-1 border-t border-slate-800">
                <span>{nodes[1].rps.toLocaleString()} RPS</span>
                <span className={nodes[1].latencyMs > 100 ? "text-amber-400 font-bold" : "text-emerald-400"}>
                  {nodes[1].latencyMs}ms p95
                </span>
                <span>Pods: {nodes[1].pods}</span>
              </div>
            </div>

            {/* Stream Worker */}
            <div
              onClick={() => setSelectedNodeId("worker")}
              className={`p-4 rounded-xl border transition-all cursor-pointer shadow-lg ${
                selectedNodeId === "worker"
                  ? "bg-slate-800 border-emerald-400 ring-2 ring-emerald-500/30"
                  : "bg-slate-900/90 border-slate-700 hover:border-slate-500"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div className="text-xs font-bold text-white truncate max-w-[140px]">{nodes[2].name}</div>
                </div>
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </div>
              <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-1 border-t border-slate-800">
                <span>{nodes[2].rps.toLocaleString()} RPS</span>
                <span className="text-emerald-400">{nodes[2].latencyMs}ms p95</span>
                <span>Pods: {nodes[2].pods}</span>
              </div>
            </div>
          </div>

          <ArrowDown className="h-5 w-5 text-emerald-500/60" />

          {/* Level 3: Persistence & Caching Tier (Side-by-Side) */}
          <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Redis Cluster */}
            <div
              onClick={() => setSelectedNodeId("cache")}
              className={`p-4 rounded-xl border transition-all cursor-pointer shadow-lg ${
                selectedNodeId === "cache"
                  ? "bg-slate-800 border-emerald-400 ring-2 ring-emerald-500/30"
                  : "bg-slate-900/90 border-slate-700 hover:border-slate-500"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div className="text-xs font-bold text-white">Redis L2 Cache Cluster</div>
                </div>
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </div>
              <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-1 border-t border-slate-800">
                <span>{nodes[3].rps.toLocaleString()} Ops/s</span>
                <span className="text-emerald-400">{nodes[3].latencyMs}ms</span>
                <span>Hit Rate: 98.4%</span>
              </div>
            </div>

            {/* PostgreSQL Multi-AZ */}
            <div
              onClick={() => setSelectedNodeId("db")}
              className={`p-4 rounded-xl border transition-all cursor-pointer shadow-lg ${
                selectedNodeId === "db"
                  ? "bg-slate-800 border-emerald-400 ring-2 ring-emerald-500/30"
                  : nodes[4].status === "degraded"
                  ? "bg-amber-950/40 border-amber-500/60"
                  : "bg-slate-900/90 border-slate-700 hover:border-slate-500"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${nodes[4].status === "degraded" ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                    <Database className="h-4 w-4" />
                  </div>
                  <div className="text-xs font-bold text-white">PostgreSQL 16 Multi-AZ</div>
                </div>
                <span className={`h-2 w-2 rounded-full ${nodes[4].status === "degraded" ? "bg-amber-400 animate-ping" : "bg-emerald-400"}`} />
              </div>
              <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-1 border-t border-slate-800">
                <span>{nodes[4].rps.toLocaleString()} QPS</span>
                <span className={nodes[4].latencyMs > 100 ? "text-amber-400 font-bold" : "text-emerald-400"}>
                  {nodes[4].latencyMs}ms
                </span>
                <span>{nodes[4].pods}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane: Live Telemetry & Resilience Inspector */}
        <div className="lg:col-span-4 border-l border-slate-800 bg-slate-950 p-5 overflow-y-auto space-y-4">
          <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Inspecting Node
              </span>
              <h3 className="text-sm font-bold text-white">{activeNode.name}</h3>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
              activeNode.status === "healthy"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
            }`}>
              {activeNode.status}
            </span>
          </div>

          <div className="text-xs text-slate-300 leading-relaxed">
            {activeNode.description}
          </div>

          {/* Real-time Telemetry Metrics */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Live Telemetry Gauges
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500">THROUGHPUT</div>
                <div className="text-base font-bold text-emerald-400">{activeNode.rps.toLocaleString()} <span className="text-xs font-normal text-slate-400">RPS</span></div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500">P95 LATENCY</div>
                <div className={`text-base font-bold ${activeNode.latencyMs > 100 ? "text-amber-400" : "text-blue-400"}`}>
                  {activeNode.latencyMs} <span className="text-xs font-normal text-slate-400">ms</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500">CONTAINER PODS</div>
                <div className="text-xs font-bold text-purple-400 mt-1">{activeNode.pods}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500">SLA AVAILABILITY</div>
                <div className="text-xs font-bold text-emerald-400 mt-1">99.99% Uptime</div>
              </div>
            </div>
          </div>

          {/* Architectural Resilience Policies */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span>Resilience & Circuit Breaker Guard</span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-300">
              <div>• <strong>Retry Policy:</strong> 3 attempts with exponential backoff & jitter</div>
              <div>• <strong>Timeout Budget:</strong> 1,200ms deadline before circuit trips</div>
              <div>• <strong>Degraded Fallback:</strong> Cache-aside stale cache read enabled</div>
              <div>• <strong>Autoscaling:</strong> HPA triggers at &gt;70% CPU threshold</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
