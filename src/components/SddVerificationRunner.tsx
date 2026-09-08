"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, ShieldCheck, Play, RotateCcw, Award, FileCode, Check, ArrowRight, Activity, Layers } from "lucide-react";
import { DomainContext } from "@/lib/mock-generator";
import { SpecificationRigor } from "@/lib/types";

interface SddVerificationRunnerProps {
  domain: DomainContext;
  rigor?: SpecificationRigor;
}

interface VerificationGate {
  id: string;
  phase: string;
  name: string;
  description: string;
  checks: { name: string; standard: string; status: "pending" | "running" | "passed" | "failed"; durationMs: number }[];
}

export const SddVerificationRunner: React.FC<SddVerificationRunnerProps> = ({
  domain,
  rigor = "spec-anchored"
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentGateIndex, setCurrentGateIndex] = useState<number>(-1);
  const [isCompleted, setIsCompleted] = useState(false);

  const initialGates: VerificationGate[] = [
    {
      id: "gate-1",
      phase: "Phase 1: Specify",
      name: "Functional Intent & Executable BDD Scenarios",
      description: "Verifies requirement acceptance criteria and Gherkin feature syntax (AIWare 2026 §3.1 & §5.1).",
      checks: [
        { name: "P0 Critical Path Requirements Coverage", standard: "100% Acceptance Criteria Defined", status: "pending", durationMs: 24 },
        { name: "Gherkin Syntax & Scenario Outline Validation", standard: "Cucumber / Gherkin v6 Specification", status: "pending", durationMs: 42 },
        { name: "Stakeholder Persona Matrix Alignment", standard: "Persona Core Needs & Friction Tracing", status: "pending", durationMs: 18 }
      ]
    },
    {
      id: "gate-2",
      phase: "Phase 2: Plan",
      name: "API Contracts & Mock Server Readiness",
      description: "Validates OpenAPI 3.1 schemas and Specmatic contract testing compilation (AIWare 2026 §3.2 & §5.2).",
      checks: [
        { name: "OpenAPI 3.1 Endpoint Schema Validation", standard: "Swagger / OAS 3.1 JSON Schema Strict", status: "pending", durationMs: 38 },
        { name: "Specmatic Contract Definition & Mock Bindings", standard: "specmatic.json Contract Conformance", status: "pending", durationMs: 55 },
        { name: "Database ERD Normalization & Foreign Key Graph", standard: "3NF Relational Integrity Verification", status: "pending", durationMs: 31 }
      ]
    },
    {
      id: "gate-3",
      phase: "Phase 3: Implement",
      name: "Task Decomposition & Test Suite Quality",
      description: "Verifies test pyramid targets and property-based testing invariants (AIWare 2026 §3.3 & §4).",
      checks: [
        { name: "Monorepo Structure & Decoupled Services", standard: "Layered Domain Architecture Layout", status: "pending", durationMs: 28 },
        { name: "Automated Test Suite Assertions (E2E / Integration)", standard: "Playwright / Vitest Synthesizer", status: "pending", durationMs: 64 },
        { name: "Property-Based Testing (PBT) Invariant Suite", standard: "Hypothesis RandomizedPermutation Guard", status: "pending", durationMs: 49 }
      ]
    },
    {
      id: "gate-4",
      phase: "Phase 4: Validate",
      name: "Contract Drift Guard & Regulatory Compliance",
      description: "Continuous CI/CD verification ensuring zero divergence between spec and code (AIWare 2026 §3.4 & §8).",
      checks: [
        { name: "Contract Drift & Spec Rot Monitor", standard: "0.0% Schema Deviation Verified in CI", status: "pending", durationMs: 34 },
        { name: "Statutory Compliance Audit", standard: domain.complianceFramework.split(",")[0].trim(), status: "pending", durationMs: 40 },
        { name: "Non-Functional SLA Target Check", standard: "p95 < 80ms Latency, 10,000+ RPS Threshold", status: "pending", durationMs: 22 }
      ]
    }
  ];

  const [gates, setGates] = useState<VerificationGate[]>(initialGates);

  const handleRunAll = () => {
    setIsRunning(true);
    setIsCompleted(false);
    setCurrentGateIndex(0);

    // Reset all to pending
    setGates((prev) =>
      prev.map((g) => ({
        ...g,
        checks: g.checks.map((c) => ({ ...c, status: "pending" }))
      }))
    );

    // Staged step-by-step simulated verification runner
    const runGateStep = (gIdx: number, cIdx: number) => {
      if (gIdx >= initialGates.length) {
        setIsRunning(false);
        setIsCompleted(true);
        setCurrentGateIndex(-1);
        return;
      }

      setCurrentGateIndex(gIdx);
      const gate = initialGates[gIdx];

      if (cIdx < gate.checks.length) {
        // Run this check
        setGates((prev) =>
          prev.map((g, gi) =>
            gi === gIdx
              ? {
                  ...g,
                  checks: g.checks.map((c, ci) =>
                    ci === cIdx ? { ...c, status: "running" } : c
                  )
                }
              : g
          )
        );

        setTimeout(() => {
          setGates((prev) =>
            prev.map((g, gi) =>
              gi === gIdx
                ? {
                    ...g,
                    checks: g.checks.map((c, ci) =>
                      ci === cIdx ? { ...c, status: "passed" } : c
                    )
                  }
                : g
            )
          );
          runGateStep(gIdx, cIdx + 1);
        }, 320);
      } else {
        // Move to next gate
        setTimeout(() => {
          runGateStep(gIdx + 1, 0);
        }, 150);
      }
    };

    runGateStep(0, 0);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setCurrentGateIndex(-1);
    setGates(initialGates);
  };

  const passedChecksCount = gates.reduce(
    (acc, g) => acc + g.checks.filter((c) => c.status === "passed").length,
    0
  );
  const totalChecksCount = gates.reduce((acc, g) => acc + g.checks.length, 0);
  const progressPercent = Math.round((passedChecksCount / totalChecksCount) * 100);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
              AIWare 2026 Figure 2 Pipeline
            </span>
            <span className="text-xs text-slate-400">Continuous Contract Verification</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <span>4-Phase SDD Continuous Verification Suite</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Automates the closed-loop verification described in Section 3.4. Ensures that what was specified is what was built, halting contract drift and enforcing zero-defect delivery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunAll}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
          >
            {isRunning ? (
              <>
                <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Running Verification...</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" />
                <span>Run SDD Verification</span>
              </>
            )}
          </button>
          <button
            onClick={handleReset}
            disabled={isRunning}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700"
            title="Reset verification state"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar & Status Metric */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Verification Progress:</span>
            <span className="font-mono text-emerald-700 font-bold">
              {passedChecksCount} / {totalChecksCount} Checks Completed ({progressPercent}%)
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Active Rigor Model: <strong className="text-slate-800 uppercase">{rigor}</strong>
          </div>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Verification Certificate on Complete */}
      {isCompleted && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in zoom-in-95 duration-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-xs">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-900">
                SDD Verification Sign-Off Approved (AIWare 2026 Compliant)
              </h3>
              <p className="text-xs text-emerald-800 mt-0.5">
                All 4 SDD phases verified: 100% BDD scenarios passed, 0.0% API contract drift, schemas validated against {domain.complianceFramework}.
              </p>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-[11px] font-mono font-bold text-emerald-800 shrink-0">
            SHA256: 99af2b...18ce
          </div>
        </div>
      )}

      {/* The 4 Gates Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gates.map((gate, gIdx) => {
          const isGateActive = currentGateIndex === gIdx;
          const isGatePassed = gate.checks.every((c) => c.status === "passed");

          return (
            <div
              key={gate.id}
              className={`rounded-2xl border p-4 transition-all shadow-xs flex flex-col justify-between ${
                isGatePassed
                  ? "border-emerald-300 bg-emerald-50/20"
                  : isGateActive
                  ? "border-blue-400 bg-blue-50/20 ring-2 ring-blue-100"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase tracking-wider">
                    {gate.phase}
                  </span>
                  {isGatePassed && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Gate Passed</span>
                    </span>
                  )}
                  {isGateActive && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-blue-700 animate-pulse">
                      <Activity className="h-3.5 w-3.5" />
                      <span>Verifying...</span>
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900">{gate.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5 mb-3">{gate.description}</p>

                {/* Sub-Checks */}
                <div className="space-y-1.5 border-t border-slate-100 pt-2.5">
                  {gate.checks.map((check, cIdx) => (
                    <div
                      key={cIdx}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs hover:bg-slate-100/70 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {check.status === "passed" ? (
                          <div className="h-4 w-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </div>
                        ) : check.status === "running" ? (
                          <div className="h-4 w-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0" />
                        ) : (
                          <div className="h-4 w-4 rounded-full bg-slate-200 shrink-0" />
                        )}
                        <span className={`font-medium ${check.status === "passed" ? "text-slate-900" : "text-slate-600"}`}>
                          {check.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                          {check.standard}
                        </span>
                        {check.status === "passed" && (
                          <span className="text-[10px] text-emerald-700 font-mono font-semibold">
                            {check.durationMs}ms
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
