"use client";

import React, { useState } from "react";
import {
  X,
  BookOpen,
  FileText,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  ArrowRight,
  ExternalLink,
  Code2,
  Workflow,
  HelpCircle,
  GitPullRequest
} from "lucide-react";
import { SpecificationRigor } from "@/lib/types";

interface AiwarePaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRigor?: (rigor: SpecificationRigor) => void;
  onOpenAdvisor?: () => void;
}

export const AiwarePaperModal: React.FC<AiwarePaperModalProps> = ({
  isOpen,
  onClose,
  onSelectRigor,
  onOpenAdvisor
}) => {
  const [activeTab, setActiveTab] = useState<number>(1);

  if (!isOpen) return null;

  const pages = [
    { page: 1, title: "1. Intro & Vibe Coding", subtitle: "The AI Catalyst & Core Inversion" },
    { page: 2, title: "2. The Spectrum", subtitle: "Figure 1: Three Levels of Rigor" },
    { page: 3, title: "3. SDD Workflow", subtitle: "Figure 2: Specify & Plan Phases" },
    { page: 4, title: "4. AI Agent Boost", subtitle: "Context Windows & PBT Invariants" },
    { page: 5, title: "5. Tools & Case 6.1", subtitle: "Table 1 & FinTech API-First" },
    { page: 6, title: "6. Cases 6.2 & 6.3", subtitle: "BDD Done & Embedded ISO 26262" },
    { page: 7, title: "7. Pitfalls & HLD vs SDD", subtitle: "Spec Rot & Enforced Contracts" },
    { page: 8, title: "8. TDD/BDD & Citations", subtitle: "Decades of Wisdom & 27 References" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 md:p-6 animate-in fade-in duration-150">
      <div className="w-full max-w-5xl max-h-[92vh] rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600 text-white">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 uppercase tracking-widest border border-blue-500/30">
                  ACM AIWare 2026 Reference
                </span>
                <span className="text-[11px] text-slate-400">Montreal, Canada • 8 Pages</span>
              </div>
              <h2 className="text-sm md:text-base font-bold text-white tracking-tight">
                Spec-Driven Development: From Code to Contract in the Age of AI Coding Assistants
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Page Tab Selector */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-200 bg-slate-50 overflow-x-auto select-none">
          {pages.map((p) => {
            const isCurrent = activeTab === p.page;
            return (
              <button
                key={p.page}
                onClick={() => setActiveTab(p.page)}
                className={`flex flex-col items-start px-3 py-1.5 rounded-lg text-left transition-all shrink-0 ${
                  isCurrent
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                <span className="text-[11px] font-bold whitespace-nowrap">{p.title}</span>
                <span className={`text-[9px] whitespace-nowrap ${isCurrent ? "text-blue-100" : "text-slate-500"}`}>
                  {p.subtitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* Page Content Body */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 text-slate-800 text-sm space-y-6">
          {/* PAGE 1 */}
          {activeTab === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Page 1: The AI Catalyst & The Core SDD Inversion</h3>
                  <p className="text-xs text-slate-500">Section 1: Introduction | Section 1.1: The AI Catalyst</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  Pages 1–2 of 8
                </span>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-1 text-amber-800">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  The Problem: Vibe Coding vs. Deterministic Contracts
                </div>
                <p className="text-xs leading-relaxed">
                  The emergence of AI coding assistants has exposed a fundamental challenge: <strong>AI models are excellent at pattern completion but poor at mind reading</strong>. Relying on loose, single-shot prompts (&ldquo;vibe coding&rdquo;) forces LLMs to make dozens of unstated assumptions about permissions, error handling, storage, and schemas—resulting in subtle, brittle hallucinations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200">
                  <div className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                    Traditional Code-First & Vibe Coding
                  </div>
                  <ul className="text-xs text-rose-900 space-y-2 list-disc list-inside">
                    <li>Prompt: <em>&ldquo;Add photo sharing to my app&rdquo;</em></li>
                    <li>AI guesses storage, format, authorization, and size limits.</li>
                    <li>Code becomes the de facto truth; documentation drifts and rots.</li>
                    <li>Tests are written after the fact (or never).</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
                  <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    Spec-Driven Development (AIWare 2026)
                  </div>
                  <ul className="text-xs text-emerald-900 space-y-2 list-disc list-inside">
                    <li>Prompt backed by executable Gherkin scenarios & OpenAPI contracts.</li>
                    <li>AI receives explicit constraints: JPEG/PNG &le; 10MB, S3 user-prefix, 1024px max resize.</li>
                    <li><strong>Key Axiom:</strong> Code is the implementation detail of the specification.</li>
                    <li>The spec declares intent; the code realizes it.</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
                  Core Inversion Principle
                </h4>
                <blockquote className="text-xs italic text-blue-950 border-l-2 border-blue-500 pl-3 my-2">
                  &ldquo;In spec-driven development, code is the implementation detail of the specification—not the other way around. The spec declares intent; the code realizes it.&rdquo;
                </blockquote>
                <p className="text-[11px] text-blue-800 mt-1">
                  Instead of coding first and documenting later, teams write clear specifications of intended behavior, then generate, implement, or verify code against those specifications.
                </p>
              </div>
            </div>
          )}

          {/* PAGE 2 */}
          {activeTab === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Page 2: The Specification Spectrum (Figure 1)</h3>
                  <p className="text-xs text-slate-500">Section 2: The Specification Spectrum (Spec-First, Spec-Anchored, Spec-as-Source)</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  Page 2 of 8
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Not all spec-driven approaches require equal rigor. Teams adopt different levels of rigor depending on lifecycle constraints and automation capabilities.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Spec-First */}
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
                        Level 1: Entry Point
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-blue-950">Spec-First</h4>
                    <p className="text-[11px] text-blue-900 font-medium mt-0.5 mb-2">Guided Initial Development</p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Written before coding to prevent AI guesswork. Once code exists, the spec may drift or be discarded. Primary value is upfront clarity.
                    </p>
                    <div className="mt-3 text-[11px] text-slate-500">
                      <strong>Best For:</strong> Prototypes, one-off features, rapid proof-of-concepts.
                    </div>
                  </div>
                  {onSelectRigor && (
                    <button
                      onClick={() => {
                        onSelectRigor("spec-first");
                        onClose();
                      }}
                      className="mt-4 w-full py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      Apply Spec-First Rigor
                    </button>
                  )}
                </div>

                {/* Spec-Anchored */}
                <div className="p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50/40 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white uppercase">
                        Sweet Spot for Production
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-emerald-950">Spec-Anchored</h4>
                    <p className="text-[11px] text-emerald-900 font-medium mt-0.5 mb-2">Living Documentation</p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Spec and code evolve together as equal partners. Automated BDD scenarios (Cucumber) and contract tests (Specmatic) run on every commit. Tests fail if code drifts.
                    </p>
                    <div className="mt-3 text-[11px] text-slate-500">
                      <strong>Best For:</strong> Enterprise systems, multi-team microservices, production APIs.
                    </div>
                  </div>
                  {onSelectRigor && (
                    <button
                      onClick={() => {
                        onSelectRigor("spec-anchored");
                        onClose();
                      }}
                      className="mt-4 w-full py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                    >
                      Apply Spec-Anchored (Recommended)
                    </button>
                  )}
                </div>

                {/* Spec-as-Source */}
                <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 uppercase">
                        Level 3: Full Automation
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-purple-950">Spec-as-Source</h4>
                    <p className="text-[11px] text-purple-900 font-medium mt-0.5 mb-2">Humans Edit Specs, Machines Generate Code</p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Drawing on Design by Contract (Meyer, 1992). The spec is the ONLY artifact humans edit. Code is 100% generated; zero manual edits permitted. Eliminates drift by design.
                    </p>
                    <div className="mt-3 text-[11px] text-slate-500">
                      <strong>Best For:</strong> Embedded systems (Simulink/SCADE), OpenAPI SDK generators, Tessl AI agents.
                    </div>
                  </div>
                  {onSelectRigor && (
                    <button
                      onClick={() => {
                        onSelectRigor("spec-as-source");
                        onClose();
                      }}
                      className="mt-4 w-full py-1.5 text-xs font-semibold rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                    >
                      Apply Spec-as-Source Rigor
                    </button>
                  )}
                </div>
              </div>

              {onOpenAdvisor && (
                <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-slate-600" />
                    <span className="text-xs font-medium text-slate-700">
                      Not sure which rigor fits your project? Use the 3-step decision tree from Figure 3.
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAdvisor();
                    }}
                    className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-800 text-white hover:bg-black transition-colors"
                  >
                    Open Rigor Advisor
                  </button>
                </div>
              )}
            </div>
          )}

          {/* PAGE 3 */}
          {activeTab === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Page 3: The 4-Phase SDD Workflow (Figure 2)</h3>
                  <p className="text-xs text-slate-500">Section 3: Workflow | Section 3.1: Specify | Section 3.2: Plan</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  Page 3 of 8
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                SDD establishes a chain of accountability from intent to implementation. Each phase produces an artifact that constrains and guides the next, with human review checkpoints at every gate.
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase">
                    <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px]">Phase 1</span>
                    Specify: What should the software do?
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Separates <strong>&ldquo;what&rdquo;</strong> from <strong>&ldquo;how&rdquo;</strong>. Articulates user-facing behavior through user stories, Gherkin Given/When/Then scenarios, business rules, constraints, edge cases, and acceptance criteria without prescribing implementation details.
                  </p>
                  <div className="mt-2 text-[11px] font-semibold text-blue-800">
                    Mapped in SpecFlow AI: Stage 00_PROJECT_BRIEF.md & .feature Gherkin specifications.
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 uppercase">
                    <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px]">Phase 2</span>
                    Plan: How should we build it?
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Bridges intent with technical constraints. Formulates component boundaries, Mermaid database ERDs, OpenAPI request/response contracts, and non-functional requirements (throughput, latency, compliance). Prevents AI from generating code that contradicts architectural standards.
                  </p>
                  <div className="mt-2 text-[11px] font-semibold text-indigo-800">
                    Mapped in SpecFlow AI: Stage 01_SYSTEM_ARCHITECTURE.md (Topology, Schemas, OpenAPI 3.1).
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                <strong>Practitioner&apos;s Tip from Section 3.1:</strong> Write specs at the level of detail needed to remove ambiguity. If an AI or developer could interpret a requirement in multiple ways, add clarification. If there is only one reasonable interpretation, avoid over-specifying.
              </div>
            </div>
          )}

          {/* PAGE 4 */}
          {activeTab === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Page 4: Implementation, Validation & AI Boosting</h3>
                  <p className="text-xs text-slate-500">Section 3.3: Implement | Section 3.4: Validate | Section 4: How SDD Boosts AI Coding Agents</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  Page 4 of 8
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="text-xs font-bold text-slate-800 uppercase mb-1">
                    Phase 3: Implement & Phase 4: Validate
                  </div>
                  <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
                    <li><strong>Small, validated increments:</strong> Breaks plan into discrete reviewable tasks.</li>
                    <li><strong>Super-prompts:</strong> Specs match LLM context windows, allowing AI to conquer complex systems.</li>
                    <li><strong>Closing the loop:</strong> Automated tests verify that code matches the spec.</li>
                    <li><strong>The Authority Rule:</strong> If tests fail, fix code or revise spec; never silently ignore divergence.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
                  <div className="text-xs font-bold text-emerald-900 uppercase mb-1 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    How SDD Boosts AI Coding Agents (Section 4)
                  </div>
                  <ul className="text-xs text-emerald-950 space-y-1.5 list-disc list-inside">
                    <li><strong>50% Error Reduction:</strong> Controlled studies show up to 50% fewer bugs with human-refined specs.</li>
                    <li><strong>Parallel Multi-Agent Execution:</strong> Non-overlapping spec tasks execute simultaneously.</li>
                    <li><strong>Property-Based Testing (PBT):</strong> Invariant checks counter LLM non-determinism.</li>
                    <li><strong>Self-Spec Pattern:</strong> AI drafts spec, human refines, then agent implements.</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs">
                <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">// Property-Based Testing to Counter LLM Non-Determinism (§4)</div>
                <div className="text-emerald-400">@given(st.text(min_size=1, max_size=100))</div>
                <div>def test_domain_invariant_properties(input_val):</div>
                <div className="pl-4 text-slate-300"># Verifies behavioral contracts hold across thousands of randomized permutations</div>
                <div className="pl-4 text-slate-300">assert domain_evaluator(input_val).is_valid()</div>
              </div>
            </div>
          )}

          {/* PAGE 5 */}
          {activeTab === 5 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Page 5: Tools, Frameworks & Financial Services Case Study</h3>
                  <p className="text-xs text-slate-500">Section 5: Tools (Table 1) | Section 6.1: Case Study: API-First Microservices</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  Page 5 of 8
                </span>
              </div>

              {/* Table 1 */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Table 1: Tools and Frameworks Supporting SDD
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5 text-left">Category</th>
                        <th className="p-2.5 text-left">Industry Examples</th>
                        <th className="p-2.5 text-left">Role in SDD</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-2.5 font-semibold text-slate-900">BDD Frameworks</td>
                        <td className="p-2.5 text-slate-600">Cucumber, SpecFlow / Reqnroll, Behave</td>
                        <td className="p-2.5 text-slate-600">Natural-language executable Gherkin scenarios</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold text-slate-900">API Specification</td>
                        <td className="p-2.5 text-slate-600">OpenAPI 3.1, GraphQL SDL, Protobuf, AsyncAPI</td>
                        <td className="p-2.5 text-slate-600">Typed contracts for parallel frontend/backend builds</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold text-slate-900">Contract Testing</td>
                        <td className="p-2.5 text-slate-600">Specmatic, Pact</td>
                        <td className="p-2.5 text-slate-600">CI schema enforcement and mock servers</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold text-slate-900">AI-Assisted SDD</td>
                        <td className="p-2.5 text-slate-600">GitHub Spec Kit (/specify, /plan, /tasks), Kiro, Tessl</td>
                        <td className="p-2.5 text-slate-600">Multi-step structured prompting for code generation</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold text-slate-900">Model-Based</td>
                        <td className="p-2.5 text-slate-600">Simulink, SCADE</td>
                        <td className="p-2.5 text-slate-600">Certified C code generation from visual block models</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Case Study 6.1 */}
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white uppercase">
                    Case Study 6.1
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    75% Cycle Time Reduction
                  </span>
                </div>
                <h4 className="text-sm font-bold text-blue-950">API-First Microservices in Financial Services</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  <strong>Challenge:</strong> &ldquo;Integration hell&rdquo; occurred when microservices deployed together failed due to incompatible assumptions discovered late during staging.
                  <br />
                  <strong>Solution:</strong> Mandated OpenAPI 3.1 specifications. Teams used <strong>Specmatic</strong> to generate mock servers so frontend teams could build in parallel, and automated contract testing in CI to fail builds immediately upon schema deviation.
                </p>
              </div>
            </div>
          )}

          {/* PAGE 6 */}
          {activeTab === 6 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Page 6: Enterprise & Embedded Case Studies & Selection Guide</h3>
                  <p className="text-xs text-slate-500">Section 6.2: BDD Enterprise | Section 6.3: Embedded ISO 26262 | Section 7: When to Use SDD</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  Page 6 of 8
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Case Study 6.2 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-white uppercase">
                    Case Study 6.2
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">BDD for Enterprise Features</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    <strong>Challenge:</strong> Disagreements on what &ldquo;done&rdquo; meant between PMs, developers, and QA.
                    <br />
                    <strong>Solution:</strong> Cucumber Gherkin scenarios became the shared language. A feature was only &ldquo;done&rdquo; when all scenarios passed. Gherkin became the final authority.
                  </p>
                </div>

                {/* Case Study 6.3 */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-700 text-white uppercase">
                    Case Study 6.3
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">Model-Based Embedded Development</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    <strong>Challenge:</strong> Automotive ISO 26262 safety certification requiring line-by-line requirement tracing.
                    <br />
                    <strong>Solution:</strong> MathWorks Simulink models were verified through simulation; certified C code was 100% generated. Engineers never hand-edited code.
                  </p>
                </div>
              </div>

              {/* When to Use SDD */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-blue-600" />
                  Section 7: When to Use SDD (Decision Framework)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-emerald-50 text-emerald-950 border border-emerald-200">
                    <strong className="block mb-1 text-emerald-900">✅ High-Value SDD Scenarios:</strong>
                    <ul className="list-disc list-inside space-y-1 text-[11px]">
                      <li>AI Coding Assistants (eliminates guesswork)</li>
                      <li>Complex multi-stakeholder requirements</li>
                      <li>Multiple maintainers & team turnover</li>
                      <li>Integration-heavy microservices</li>
                      <li>Regulated domains (HIPAA, ISO 26262, SOC 2)</li>
                      <li>Legacy brownfield modernization</li>
                    </ul>
                  </div>
                  <div className="p-3 rounded-lg bg-rose-50 text-rose-950 border border-rose-200">
                    <strong className="block mb-1 text-rose-900">⚠️ Where SDD is Overkill:</strong>
                    <ul className="list-disc list-inside space-y-1 text-[11px]">
                      <li>Throwaway prototypes & spike experiments</li>
                      <li>Solo, short-lived projects</li>
                      <li>Exploratory coding when requirements are unknown</li>
                      <li>Trivial CRUD apps with obvious, unambiguous logic</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 7 */}
          {activeTab === 7 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Page 7: Common Pitfalls & SDD vs. Traditional Design Docs</h3>
                  <p className="text-xs text-slate-500">Section 8: Common Pitfalls | Section 9: SDD vs. Traditional Design Documents (HLD/LLD)</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  Page 7 of 8
                </span>
              </div>

              {/* 5 Pitfalls */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Section 8: The 5 SDD Adoption Pitfalls
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <strong className="text-rose-700">1. Over-Specification:</strong> Writing pseudo-code instead of behavioral requirements. Defeats separation of &ldquo;what&rdquo; vs &ldquo;how&rdquo;.
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <strong className="text-amber-700">2. Specification Rot:</strong> Failing to update specs as code changes. <em>Mitigation:</em> automated tests that fail on drift.
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <strong className="text-slate-700">3. Spec as Bureaucracy:</strong> Specs becoming compliance forms instead of tools for clarity. Keep specs lean.
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <strong className="text-slate-700">4. Tooling Complexity:</strong> Drowning in intermediate generated artifacts and task lists.
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 md:col-span-2">
                    <strong className="text-indigo-700">5. False Confidence:</strong> A passing test only verifies that code matches the spec. If the spec is wrong, code will faithfully implement the wrong thing.
                  </div>
                </div>
              </div>

              {/* SDD vs Traditional Design Documents */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Section 9: How is SDD Different from Traditional HLD / LLD?
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="text-left font-bold text-slate-700 border-b border-slate-300">
                      <tr>
                        <th className="pb-2">Dimension</th>
                        <th className="pb-2">Traditional HLD / LLD / SRS</th>
                        <th className="pb-2 text-emerald-800">Spec-Driven Development (SDD)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-600">
                      <tr>
                        <td className="py-2 font-semibold">Authority</td>
                        <td className="py-2">Advisory (Developers read them, hope code matches)</td>
                        <td className="py-2 font-semibold text-emerald-900">Enforced (Tests fail if code diverges)</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-semibold">Drift Lifecycle</td>
                        <td className="py-2 text-rose-700">Outdated by Sprint 3; code becomes de facto truth</td>
                        <td className="py-2 text-emerald-900">Zero drift; CI/CD blocks merges on contract breaks</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-semibold">Execution</td>
                        <td className="py-2">Read by humans as static prose</td>
                        <td className="py-2 text-emerald-900">Executable Gherkin BDD & Specmatic mock servers</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-semibold">AI Usability</td>
                        <td className="py-2">Unstructured, prompts lead to hallucinations</td>
                        <td className="py-2 text-emerald-900">Structured super-prompts matching context windows</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <blockquote className="text-xs italic text-slate-700 border-l-2 border-slate-400 pl-3 mt-3">
                  &ldquo;SDD is not a revolution... it&apos;s just BDD with branding.&rdquo; — Bryan Finster (2025)
                </blockquote>
              </div>
            </div>
          )}

          {/* PAGE 8 */}
          {activeTab === 8 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Page 8: Decades of Wisdom & Complete 27 Citations</h3>
                  <p className="text-xs text-slate-500">Section 10: Relationship to Existing Practices | Section 11: Conclusion & References</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  Page 8 of 8
                </span>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs leading-relaxed space-y-2">
                <h4 className="font-bold text-blue-950 uppercase tracking-wider">
                  The Evolutionary Lineage of SDD
                </h4>
                <p className="text-slate-700">
                  SDD is an evolution adapting proven agile engineering disciplines for the AI era:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  <li><strong>TDD (Kent Beck, 2002):</strong> SDD applied at the unit level; writing tests first is writing micro-specifications.</li>
                  <li><strong>BDD (Dan North, 2006):</strong> The direct ancestor of SDD; Gherkin scenarios as executable business contracts.</li>
                  <li><strong>DDD (Eric Evans):</strong> Ubiquitous language ensuring specifications use authentic domain terminology.</li>
                  <li><strong>Design by Contract (Bertrand Meyer, 1992):</strong> Preconditions, postconditions, and class invariants.</li>
                </ul>
              </div>

              {/* References */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Academic & Industry References (All 27 Cited Works)
                </h4>
                <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-xl p-3 bg-slate-50 text-[11px] font-mono space-y-1.5 text-slate-600">
                  <div>[1] Amazon Web Services. 2025. Kiro: Agentic AI Development.</div>
                  <div>[2] AsyncAPI Initiative. 2024. AsyncAPI Specification.</div>
                  <div>[3] Kent Beck. 2002. Test Driven Development: By Example.</div>
                  <div>[4] Behave. 2024. Behave: BDD for Python.</div>
                  <div>[5] Mark Chen et al. 2021. Evaluating Large Language Models Trained on Code.</div>
                  <div>[6] Cucumber. 2024. Cucumber Documentation.</div>
                  <div>[7] Cucumber. 2024. Gherkin Reference.</div>
                  <div>[8] Bryan Finster. 2025. 5-Minute DevOps: Spec-Driven Development Isn&apos;t New.</div>
                  <div>[9] Martin Fowler. 2025. Exploring Gen AI: Spec-Driven Development.</div>
                  <div>[10] GitHub. 2024. GitHub Copilot Documentation.</div>
                  <div>[11] GitHub. 2025. Spec-Driven Development with AI: Get Started with a New Open Source Toolkit.</div>
                  <div>[12] Google. 2024. Protocol Buffers Documentation.</div>
                  <div>[13] GraphQL Foundation. 2024. GraphQL Specification.</div>
                  <div>[14] Luke Griffin & Ryan Carroll. 2026. Spec Driven Development: When Architecture Becomes Executable. InfoQ.</div>
                  <div>[15] gRPC Authors. 2024. gRPC Documentation.</div>
                  <div>[16] ISO. 2018. ISO 26262: Road vehicles - Functional safety.</div>
                  <div>[17] MathWorks. 2024. Simulink: Simulation and Model-Based Design.</div>
                  <div>[18] Bertrand Meyer. 1992. Applying Design by Contract. IEEE Computer.</div>
                  <div>[19] Rafal Naszcyniec. 2025. How Spec-Driven Development Improves AI Coding Quality. Red Hat Developer.</div>
                  <div>[20] Dan North. 2006. Introducing BDD.</div>
                  <div>[21] OpenAPI Initiative. 2024. OpenAPI Specification v3.1.0.</div>
                  <div>[22] Pact Foundation. 2024. Pact Documentation.</div>
                  <div>[23] Reqnroll Contributors. 2024. Reqnroll (formerly SpecFlow).</div>
                  <div>[24] SmartBear. 2024. What Is API-First Development?</div>
                  <div>[25] Specmatic. 2025. Contract-Driven Development with Specmatic.</div>
                  <div>[26] Tessl. 2025. Tessl: Make Agents Work in Real Codebases.</div>
                  <div>[27] Thoughtworks. 2025. Spec-Driven Development. Technology Radar Vol 32.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">
              Viewing Page {activeTab} of 8
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab((prev) => Math.max(1, prev - 1))}
              disabled={activeTab === 1}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous Page
            </button>
            <button
              onClick={() => setActiveTab((prev) => Math.min(8, prev + 1))}
              disabled={activeTab === 8}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
