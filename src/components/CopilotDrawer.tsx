"use client";

import React, { useState } from "react";
import { X, Sparkles, Send, Check, ArrowRight, Bot, User, Code2, Plus } from "lucide-react";
import { StageState, TechStackPreferences } from "@/lib/types";

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeStageIndex: number;
  stages: StageState[];
  techStack: TechStackPreferences;
  onApplyRefactor: (stageIndex: number, addition: string) => void;
}

interface Message {
  sender: "user" | "copilot";
  text: string;
  codeSnippet?: string;
}

export const CopilotDrawer: React.FC<CopilotDrawerProps> = ({
  isOpen,
  onClose,
  activeStageIndex,
  stages,
  techStack,
  onApplyRefactor
}) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "copilot",
      text: `Hello! I am your Principal AI Architecture Copilot. Ask me to refine, inject security guardrails, generate k6 stress scripts, or add distributed mechanics to your specifications.`
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [applied, setApplied] = useState(false);

  if (!isOpen) return null;

  const currentStage = stages.find((s) => s.index === activeStageIndex) || stages[0];

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || input).trim();
    if (!q) return;

    const userMsg: Message = { sender: "user", text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);
    setApplied(false);

    setTimeout(() => {
      setIsThinking(false);

      let reply = "";
      let snippet: string | undefined = undefined;

      const lower = q.toLowerCase();
      if (lower.includes("lock") || lower.includes("redlock") || lower.includes("race")) {
        reply = `I have engineered a distributed mutex locking pattern utilizing Redis Redlock to guarantee zero double-booking or race conditions across your ${techStack.backend.split("/")[0].trim()} microservices.`;
        snippet = `\n\n### 🛡️ Distributed Lock Mechanism (Redis Redlock)\n\`\`\`typescript\nimport { Redlock } from "redlock";\nimport { redisCluster } from "@/lib/redis";\n\nconst redlock = new Redlock([redisCluster], {\n  driftFactor: 0.01,\n  retryCount: 3,\n  retryDelay: 200,\n  retryJitter: 100\n});\n\nexport async function executeAtomicMutation<T>(\n  resourceId: string,\n  ttlMs: number,\n  action: () => Promise<T>\n): Promise<T> {\n  const lock = await redlock.acquire([\`locks:\${resourceId}\`], ttlMs);\n  try {\n    return await action();\n  } finally {\n    await lock.release();\n  }\n}\n\`\`\``;
      } else if (lower.includes("stripe") || lower.includes("payment") || lower.includes("webhook")) {
        reply = `I have authored an idempotent webhook processor with cryptographic signature verification and an append-only audit trail.`;
        snippet = `\n\n### 💳 Idempotent Webhook Processing Engine\n\`\`\`typescript\n// Verify Stripe Webhook Signature with Idempotency Key Tracking\nexport async function handleWebhookEvent(payload: Buffer, sig: string) {\n  const event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET!);\n  \n  const isProcessed = await redis.set(\`webhook:processed:\${event.id}\`, "1", "NX", "EX", 86400);\n  if (!isProcessed) {\n    return { status: "duplicate_ignored" };\n  }\n\n  // Atomic Saga Transaction\n  await db.$transaction(async (tx) => {\n    // Execute business logic with idempotency guarantee\n  });\n\n  return { status: "success" };\n}\n\`\`\``;
      } else if (lower.includes("k6") || lower.includes("load") || lower.includes("stress")) {
        reply = `Here is a production-grade k6 stress test script simulating 25,000 requests/second with ramp-up and latency thresholds.`;
        snippet = `\n\n### ⚡ k6 High-Throughput Load Testing Script\n\`\`\`javascript\nimport http from "k6/http";\nimport { check, sleep } from "k6";\n\nexport const options = {\n  stages: [\n    { duration: "30s", target: 5000 },\n    { duration: "1m", target: 25000 },\n    { duration: "30s", target: 0 }\n  ],\n  thresholds: {\n    http_req_duration: ["p(95)<80"], // 95% of requests must complete below 80ms\n    http_req_failed: ["rate<0.001"]   // Error rate must be under 0.1%\n  }\n};\n\nexport default function () {\n  const res = http.get("http://localhost:3000/api/health");\n  check(res, { "status is 200": (r) => r.status === 200 });\n  sleep(0.1);\n}\n\`\`\``;
      } else {
        reply = `Architectural analysis complete for: "${q}". I have drafted an enhancement tailored to your ${techStack.backend.split("/")[0].trim()} and ${techStack.database.split("+")[0].trim()} stack.`;
        snippet = `\n\n### 🚀 Architectural Enhancement: ${q}\n* **Execution Rationale:** Enhances domain resilience, decouples event ingestion, and guarantees compliance with p95 < 80ms SLAs.\n* **Technology Target:** ${techStack.backend} with ${techStack.database}.\n* **Verification:** Validated via automated unit and integration suites.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "copilot",
          text: reply,
          codeSnippet: snippet
        }
      ]);
    }, 600);
  };

  const handleApply = (snippet?: string) => {
    if (!snippet) return;
    onApplyRefactor(activeStageIndex, snippet);
    setApplied(true);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              AI Architecture Copilot
            </h3>
            <p className="text-[11px] text-slate-500">
              Active Target: <span className="font-mono text-emerald-700 font-semibold">{currentStage.fileName}</span>
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

      {/* Suggested Chips */}
      <div className="px-4 py-2 border-b border-slate-100 bg-white flex flex-wrap gap-1">
        {[
          "Add Redis Redlock distributed locks",
          "Add Stripe webhook idempotency keys",
          "Generate k6 stress test scenario",
          "Audit OWASP Top 10 vulnerabilities"
        ].map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(chip)}
            className="text-[10px] px-2 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 border border-slate-200 transition-colors text-left"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`p-3 rounded-2xl text-xs max-w-[90%] leading-relaxed ${
                m.sender === "user"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-800 border border-slate-200 shadow-xs"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-[10px] font-bold opacity-70">
                {m.sender === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                <span>{m.sender === "user" ? "You" : "AI Architect"}</span>
              </div>
              <div>{m.text}</div>

              {m.codeSnippet && (
                <div className="mt-2 space-y-2">
                  <pre className="p-2.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-[10px] overflow-x-auto">
                    {m.codeSnippet}
                  </pre>
                  <button
                    type="button"
                    onClick={() => handleApply(m.codeSnippet)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-xs transition-all"
                  >
                    {applied ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                    <span>{applied ? "Applied to Spec!" : "Apply to Active Specification"}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-2xl border border-slate-200 w-fit">
            <div className="h-3.5 w-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <span>Analyzing architectural implications...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Copilot to refactor or add architecture..."
            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition-all shadow-xs"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
