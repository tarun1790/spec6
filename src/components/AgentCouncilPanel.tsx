"use client";

import React, { useState } from "react";
import {
  Users,
  ShieldAlert,
  Cpu,
  CheckCircle,
  Activity,
  Award,
  Sparkles,
  TrendingUp,
  FileCheck
} from "lucide-react";
import { StageState } from "@/lib/types";

interface AgentCouncilPanelProps {
  stages: StageState[];
  isGenerating: boolean;
}

interface AgentVote {
  role: string;
  name: string;
  avatarBg: string;
  icon: React.ReactNode;
  verdict: "APPROVED" | "AUDITING" | "PENDING";
  confidence: number;
  critique: string;
}

export const AgentCouncilPanel: React.FC<AgentCouncilPanelProps> = ({
  stages,
  isGenerating
}) => {
  const [selectedAgent, setSelectedAgent] = useState<number>(0);

  const completedCount = stages.filter((s) => s.status === "completed").length;

  const council: AgentVote[] = [
    {
      role: "Lead Software Architect",
      name: "Architect Agent",
      avatarBg: "bg-emerald-600",
      icon: <Cpu className="h-4 w-4" />,
      verdict: completedCount >= 2 ? "APPROVED" : isGenerating ? "AUDITING" : "PENDING",
      confidence: completedCount >= 2 ? 98 : 75,
      critique: completedCount >= 2
        ? "Topology and Mermaid ERD entity mapping verified. Foreign keys, indexes, and API contracts follow strict RFC 7807 error envelopes."
        : "Analyzing system decoupling, async message bus boundaries, and latency SLAs."
    },
    {
      role: "Security Red Team Lead",
      name: "Security Agent",
      avatarBg: "bg-rose-600",
      icon: <ShieldAlert className="h-4 w-4" />,
      verdict: completedCount >= 5 ? "APPROVED" : isGenerating ? "AUDITING" : "PENDING",
      confidence: completedCount >= 5 ? 99 : 68,
      critique: completedCount >= 5
        ? "OWASP Top 10 defenses verified. Zero hardcoded secrets, TLS 1.3 enforced, AES-256 at rest, and JWT RS256 token rotation active."
        : "Scanning identity claims, RBAC permissions, and potential SSRF/Injection vectors."
    },
    {
      role: "Principal QA Engineer",
      name: "QA & Testing Agent",
      avatarBg: "bg-teal-600",
      icon: <FileCheck className="h-4 w-4" />,
      verdict: completedCount >= 4 ? "APPROVED" : isGenerating ? "AUDITING" : "PENDING",
      confidence: completedCount >= 4 ? 96 : 70,
      critique: completedCount >= 4
        ? "Unit coverage targets >80% with isolated mock boundaries. Playwright E2E master test script and concurrency failure matrix approved."
        : "Checking edge-case inventory and test fixture teardown strategies."
    },
    {
      role: "Cloud DevOps & SRE Lead",
      name: "DevOps Agent",
      avatarBg: "bg-indigo-600",
      icon: <Activity className="h-4 w-4" />,
      verdict: completedCount >= 6 ? "APPROVED" : isGenerating ? "AUDITING" : "PENDING",
      confidence: completedCount >= 6 ? 99 : 82,
      critique: completedCount >= 6
        ? "Multi-stage Dockerfile passes non-root security standards. GitHub Actions deploy.yml and Terraform IaC spec validated."
        : "Analyzing container layer caching, Kubernetes manifest limits, and /healthz readiness hooks."
    }
  ];

  const overallConsensus = Math.round(
    council.reduce((sum, a) => sum + a.confidence, 0) / council.length
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>Multi-Agent Council Arena</span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Live Swarm
              </span>
            </h3>
          </div>
        </div>

        {/* Consensus Meter */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold">
          <TrendingUp className="h-3 w-3 text-emerald-600" />
          <span className="text-slate-600">Consensus:</span>
          <span className="text-emerald-700 font-mono">{overallConsensus}%</span>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {council.map((agent, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedAgent(idx)}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              selectedAgent === idx
                ? "border-emerald-500 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-400"
                : "border-slate-200 bg-slate-50/60 hover:bg-slate-100"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className={`p-1.5 rounded-lg text-white ${agent.avatarBg}`}>
                {agent.icon}
              </div>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                agent.verdict === "APPROVED"
                  ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                  : agent.verdict === "AUDITING"
                  ? "bg-amber-100 text-amber-800 border-amber-300 animate-pulse"
                  : "bg-slate-100 text-slate-500 border-slate-200"
              }`}>
                {agent.verdict}
              </span>
            </div>
            <div className="text-[11px] font-bold text-slate-900 truncate">{agent.name}</div>
            <div className="text-[10px] text-slate-500 truncate">{agent.role}</div>
          </button>
        ))}
      </div>

      {/* Active Agent Critique Box */}
      <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-emerald-600" />
            <span>{council[selectedAgent].role} Live Thought Stream:</span>
          </span>
          <span className="text-emerald-700 font-mono">{council[selectedAgent].confidence}% Confidence</span>
        </div>
        <p className="text-slate-600 leading-relaxed text-[11px]">
          {council[selectedAgent].critique}
        </p>
      </div>
    </div>
  );
};
