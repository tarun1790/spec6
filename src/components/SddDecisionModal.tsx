"use client";

import React, { useState } from "react";
import { X, CheckCircle2, ArrowRight, HelpCircle, Sparkles, BookOpen, Layers, GitBranch, RefreshCw } from "lucide-react";
import { SpecificationRigor } from "@/lib/types";

interface SddDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRigor: SpecificationRigor;
  onSelectRigor: (rigor: SpecificationRigor) => void;
}

export const SddDecisionModal: React.FC<SddDecisionModalProps> = ({
  isOpen,
  onClose,
  currentRigor,
  onSelectRigor
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [hasComplexOrAI, setHasComplexOrAI] = useState<boolean | null>(null);
  const [isLongLived, setIsLongLived] = useState<boolean | null>(null);
  const [isCodeGenViable, setIsCodeGenViable] = useState<boolean | null>(null);

  if (!isOpen) return null;

  const handleReset = () => {
    setStep(1);
    setHasComplexOrAI(null);
    setIsLongLived(null);
    setIsCodeGenViable(null);
  };

  const determineRecommendation = (): {
    rigor: SpecificationRigor | "ad-hoc";
    title: string;
    description: string;
    paperQuote: string;
  } => {
    if (hasComplexOrAI === false) {
      return {
        rigor: "ad-hoc",
        title: "Ad-Hoc Coding (Minimal Spec)",
        description: "Simple throwaway scripts or exploration where formal specs add overhead without value.",
        paperQuote: "Exploratory coding suffers from premature specification that constrains learning when you don't yet know what you're building."
      };
    }
    if (isLongLived === false) {
      return {
        rigor: "spec-first",
        title: "Spec-First (Guided Initial Build)",
        description: "Write the spec upfront to guide the AI assistant, but allow the spec to drift or be discarded post-implementation.",
        paperQuote: "Spec-first works particularly well for initial feature development when working with AI coding assistants. The upfront spec prevents the AI from guessing."
      };
    }
    if (isCodeGenViable === false) {
      return {
        rigor: "spec-anchored",
        title: "Spec-Anchored (Living Documentation)",
        description: "Spec and code evolve together as equal partners. BDD scenarios (Cucumber) and contract tests (OpenAPI/Specmatic) enforce alignment on every commit.",
        paperQuote: "Spec-anchored is the sweet spot for most production systems. It provides the benefits of clear documentation and verifiable requirements without demanding that code be fully generated."
      };
    }
    return {
      rigor: "spec-as-source",
      title: "Spec-as-Source (Model-Driven Generation)",
      description: "The specification is the ONLY artifact humans edit directly. Code is 100% machine-generated and never hand-edited. Eliminates drift by construction.",
      paperQuote: "In spec-as-source development, the specification is the only artifact humans edit directly. Any change to behavior means changing the spec and regenerating."
    };
  };

  const rec = determineRecommendation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                SDD Rigor Advisor (ACM AIWare 2026 Framework)
              </h3>
              <p className="text-[11px] text-slate-500">
                Figure 3 Decision Tree for Selecting the Right Specification Rigor
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Interactive Stepper or Result */}
        <div className="p-5 space-y-4">
          {/* 3 Rigor Tabs at top for direct manual selection */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "spec-first", name: "Spec-First", desc: "Guided Initial Build" },
              { id: "spec-anchored", name: "Spec-Anchored", desc: "Living Sync (Sweet Spot)" },
              { id: "spec-as-source", name: "Spec-as-Source", desc: "100% Generated Code" }
            ].map((r) => {
              const isSelected = currentRigor === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onSelectRigor(r.id as SpecificationRigor)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50/70 shadow-xs"
                      : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/70"
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                    <span>{r.name}</span>
                    {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{r.desc}</div>
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>Interactive Decision Wizard</span>
            </h4>

            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-800">
                  Question 1: Are you building with an AI coding assistant, or does this system have complex, ambiguous requirements?
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setHasComplexOrAI(true);
                      setStep(2);
                    }}
                    className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all"
                  >
                    Yes (AI-Assisted or Complex Domain)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setHasComplexOrAI(false);
                      setStep(2);
                    }}
                    className="py-2 px-4 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium transition-all"
                  >
                    No (Simple Script)
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && hasComplexOrAI && (
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-800">
                  Question 2: Will this system be long-lived with multiple maintainers or continuous updates?
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLongLived(true);
                      setStep(3);
                    }}
                    className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all"
                  >
                    Yes (Long-Lived Production Codebase)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLongLived(false);
                      setStep(3);
                    }}
                    className="py-2 px-4 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium transition-all"
                  >
                    No (Throwaway / Prototype)
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && hasComplexOrAI && isLongLived && (
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-800">
                  Question 3: Is 100% automated code generation viable (e.g. OpenAPI server stubs, certified Simulink/Tessl models), where humans never edit the output code?
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCodeGenViable(true)}
                    className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all"
                  >
                    Yes (Strict Model / Schema Generation)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCodeGenViable(false)}
                    className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all"
                  >
                    No (Hybrid: Code + Tests Evolve Together)
                  </button>
                </div>
              </div>
            )}

            {/* Final Recommendation Card */}
            {(hasComplexOrAI === false || isLongLived === false || isCodeGenViable !== null) && (
              <div className="mt-3 p-4 rounded-xl border border-emerald-300 bg-emerald-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    Recommended SDD Rigor
                  </span>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-[10px] text-slate-500 hover:text-slate-800 underline"
                  >
                    Retake Wizard
                  </button>
                </div>
                <div className="text-sm font-black text-emerald-950">{rec.title}</div>
                <p className="text-xs text-slate-700 leading-relaxed">{rec.description}</p>
                <div className="text-[11px] italic text-slate-600 border-l-2 border-emerald-500 pl-2 mt-1">
                  &ldquo;{rec.paperQuote}&rdquo; — <i>AIWare 2026</i>
                </div>

                {rec.rigor !== "ad-hoc" && (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectRigor(rec.rigor as SpecificationRigor);
                      onClose();
                    }}
                    className="w-full mt-2 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Apply {rec.title}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
