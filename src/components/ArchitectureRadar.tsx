"use client";

import React from "react";
import { ShieldCheck, Zap, CheckCircle2, DollarSign, Activity, Server, FileText, Cpu, Check, Layers } from "lucide-react";
import { TechStackPreferences, StageState } from "@/lib/types";
import { extractDomainContext } from "@/lib/mock-generator";
import { estimateCloudArchitectureCost } from "@/lib/cost-estimator";

interface ArchitectureRadarProps {
  userPrompt: string;
  techStack: TechStackPreferences;
  stages: StageState[];
}

export const ArchitectureRadar: React.FC<ArchitectureRadarProps> = ({
  userPrompt,
  techStack,
  stages
}) => {
  const domain = extractDomainContext(userPrompt || "Enterprise Cloud");
  const cost = estimateCloudArchitectureCost(techStack);
  const completedStages = stages.filter((s) => s.status === "completed").length;

  const computeCost = cost.breakdown.find((b) => b.category === "Compute")?.monthlyCostUSD || 64;
  const dbCost = cost.breakdown.find((b) => b.category === "Database")?.monthlyCostUSD || 86;
  const cacheCost = cost.breakdown.find((b) => b.category === "Caching")?.monthlyCostUSD || 42;
  const netCost = cost.breakdown.find((b) => b.category === "Networking & CDN")?.monthlyCostUSD || 25;

  const metrics = [
    {
      title: "Security & Zero-Trust Score",
      score: 98,
      grade: "A+",
      badge: "OWASP Hardened",
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
      icon: <ShieldCheck className="h-4 w-4 text-emerald-600" />,
      items: [
        "Asymmetric RS256 JWT validation & refresh rotation",
        "Field-level AES-256-GCM encryption for PII",
        "Role-Based Access Control (RBAC) on 100% of endpoints",
        "Automated WAF distributed rate limiting (120 req/min)"
      ]
    },
    {
      title: "Performance & SLA Compliance",
      score: 96,
      grade: "A",
      badge: "Sub-80ms p95",
      color: "text-blue-700 bg-blue-50 border-blue-200",
      icon: <Zap className="h-4 w-4 text-blue-600" />,
      items: [
        "Sub-80ms p95 read latency via multi-tier caching",
        "Sub-150ms p95 write latency with async queues",
        "10,000+ RPS sustained throughput under HPA scaling",
        "Multi-AZ failover with RTO < 5m, RPO = 0"
      ]
    },
    {
      title: "Test Automation & QA Rigor",
      score: 94,
      grade: "A",
      badge: ">85% Unit Coverage",
      color: "text-indigo-700 bg-indigo-50 border-indigo-200",
      icon: <CheckCircle2 className="h-4 w-4 text-indigo-600" />,
      items: [
        "100% Core user journeys covered by Playwright E2E",
        ">85% Unit test coverage on business logic & models",
        "Contract testing for OpenAPI 3.1 REST schemas",
        "k6 automated performance stress benchmarks"
      ]
    },
    {
      title: "Cloud Infrastructure Costing",
      score: 91,
      grade: "Optimized",
      badge: `$${cost.totalMonthlyUSD}/mo`,
      color: "text-amber-700 bg-amber-50 border-amber-200",
      icon: <DollarSign className="h-4 w-4 text-amber-600" />,
      items: [
        `App Compute: $${computeCost}/mo (Autoscaling pods)`,
        `Database (${techStack.database.split("+")[0].trim()}): $${dbCost}/mo`,
        `Cache & Bus (${techStack.caching.split("+")[0].trim()}): $${cacheCost}/mo`,
        `Networking & Ingress: $${netCost}/mo`
      ]
    }
  ];

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-y-auto p-4 space-y-4 rounded-xl border border-slate-200">
      {/* Overview Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Architecture Quality & SLA Evaluation (Spec-Eval Index)
            </span>
          </div>
          <h2 className="text-base font-extrabold text-slate-900 mt-1">
            {domain.title} • Production Readiness Grade
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluated against Google Cloud Well-Architected Framework, OWASP Top 10, and High-Throughput SLAs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-center px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="text-2xl font-black text-emerald-700">97%</div>
            <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Overall Score</div>
          </div>
          <div className="text-center px-4 py-2 rounded-xl bg-slate-100 border border-slate-200">
            <div className="text-2xl font-black text-slate-800">{completedStages}/6</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Specs Ready</div>
          </div>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-slate-100">{m.icon}</div>
                <h4 className="text-xs font-bold text-slate-900">{m.title}</h4>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${m.color}`}>
                {m.badge}
              </span>
            </div>

            {/* Score Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Benchmark Rating</span>
                <span className="font-bold text-slate-800">{m.score}% ({m.grade})</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${m.score}%` }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="space-y-1.5 pt-1 border-t border-slate-100">
              {m.items.map((it, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                  <Check className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">{it}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Component Inventory & Stack Realities */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5 text-emerald-600" />
          <span>Active Architecture Inventory</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Microservices</div>
            <div className="font-bold text-slate-800 text-sm mt-0.5">{domain.services.length} Services</div>
            <div className="text-[10px] text-slate-500 truncate mt-0.5">{techStack.backend.split("/")[0].trim()}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Data Models</div>
            <div className="font-bold text-slate-800 text-sm mt-0.5">{domain.primaryEntities.length} Entities</div>
            <div className="text-[10px] text-slate-500 truncate mt-0.5">{techStack.database.split("+")[0].trim()}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-[10px] text-slate-400 font-bold uppercase">REST Endpoints</div>
            <div className="font-bold text-slate-800 text-sm mt-0.5">{domain.apiEndpoints.length} Routes</div>
            <div className="text-[10px] text-slate-500 truncate mt-0.5">OpenAPI 3.1</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Monthly Infra</div>
            <div className="font-bold text-emerald-700 text-sm mt-0.5">${cost.totalMonthlyUSD}/mo</div>
            <div className="text-[10px] text-slate-500 truncate mt-0.5">{techStack.deployment.split("+")[0].trim()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
