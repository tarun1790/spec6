"use client";

import React, { useState, useRef, useEffect } from "react";
import { Terminal, Play, RotateCcw, CheckCircle2, ShieldAlert, Cpu, Check, ArrowRight } from "lucide-react";
import { DomainContext } from "@/lib/mock-generator";

interface InteractiveTerminalProps {
  domain: DomainContext;
}

interface LogEntry {
  type: "cmd" | "info" | "pass" | "warn" | "error";
  text: string;
  timestamp: string;
}

export const InteractiveTerminal: React.FC<InteractiveTerminalProps> = ({ domain }) => {
  const e1 = domain.primaryEntities[0] || "PrimaryRecord";
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      type: "info",
      text: `[INIT] SpecFlow Continuous Verification Shell initialized for ${domain.title}.`,
      timestamp: "10:00:01"
    },
    {
      type: "info",
      text: `[ENV] Target Domain: ${domain.shortName} | Security: Zero-Trust | Compliance: ${domain.complianceFramework.split(",")[0]}`,
      timestamp: "10:00:02"
    },
    {
      type: "info",
      text: "Type 'help' or click any quick action below to execute real-time automated verification suites.",
      timestamp: "10:00:03"
    }
  ]);
  const [commandInput, setCommandInput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const getTime = () => {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;
  };

  const appendLog = (type: LogEntry["type"], text: string) => {
    setLogs((prev) => [...prev, { type, text, timestamp: getTime() }]);
  };

  const handleRunCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed || isExecuting) return;

    setCommandInput("");
    appendLog("cmd", `$ ${trimmed}`);
    setIsExecuting(true);

    const c = trimmed.toLowerCase();

    if (c === "clear") {
      setLogs([]);
      setIsExecuting(false);
      return;
    }

    if (c === "help") {
      appendLog("info", "Available Commands:");
      appendLog("info", "  specmatic test     - Execute API contract verification against OpenAPI 3.1");
      appendLog("info", "  npm test           - Run full-stack unit & domain mutation test suite");
      appendLog("info", "  playwright test    - Run headless browser end-to-end integration tests");
      appendLog("info", "  docker compose up  - Spin up PostgreSQL 16, Redis, and Microservice mesh");
      appendLog("info", "  chaos test         - Inject 800ms latency spike and verify circuit breaker");
      appendLog("info", "  clear              - Clear terminal output");
      setIsExecuting(false);
      return;
    }

    if (c.includes("specmatic")) {
      appendLog("info", `[SPECMATIC] Loading specs/openapi.yaml for ${domain.shortName}...`);
      await delay(400);
      appendLog("info", `[SPECMATIC] Starting mock server on http://localhost:9000...`);
      await delay(500);
      appendLog("pass", `✓ [CONTRACT PASS] GET ${domain.apiPrefix} conforms to schema array[${e1}] (24ms)`);
      await delay(350);
      appendLog("pass", `✓ [CONTRACT PASS] POST ${domain.apiPrefix} enforces mandatory payload attributes (31ms)`);
      await delay(300);
      appendLog("pass", `✓ [CONTRACT PASS] Negative test: HTTP 422 returned on malformed payload`);
      await delay(250);
      appendLog("pass", `[SPECMATIC SUMMARY] 3/3 contracts PASSED (100% API-first conformance, 0% spec rot).`);
    } else if (c.includes("npm test") || c.includes("pytest") || c.includes("vitest")) {
      appendLog("info", `[TEST RUNNER] Executing test suite for ${domain.shortName}...`);
      await delay(350);
      appendLog("pass", `✓ tests/unit/${e1.toLowerCase()}.test.ts (6 tests passed, 42ms)`);
      await delay(300);
      appendLog("pass", `✓ tests/unit/state_machine.test.ts (4 tests passed, 18ms)`);
      await delay(300);
      appendLog("pass", `✓ tests/unit/invariants.test.ts (Property-based tests 100 iterations passed)`);
      await delay(200);
      appendLog("info", `------------------------------------------------------------`);
      appendLog("info", `Test Suites: 3 passed, 3 total | Tests: 14 passed, 14 total`);
      appendLog("info", `Code Coverage: 94.2% statements | 91.8% branch coverage`);
    } else if (c.includes("playwright")) {
      appendLog("info", `[PLAYWRIGHT] Launching Chromium headless browser...`);
      await delay(400);
      appendLog("info", `[PLAYWRIGHT] Navigating to ${domain.apiPrefix}...`);
      await delay(500);
      appendLog("pass", `✓ [TC-01] User dispatches create ${e1} mutation -> HTTP 201 Created (142ms)`);
      await delay(400);
      appendLog("pass", `✓ [TC-02] UI reflects optimistic update and commits record ID (88ms)`);
      await delay(300);
      appendLog("pass", `[PLAYWRIGHT] 2 passed (1.2s). Screenshot artifacts saved.`);
    } else if (c.includes("docker")) {
      appendLog("info", `[DOCKER] Creating network "${domain.shortName.toLowerCase()}_default"...`);
      await delay(300);
      appendLog("info", `[DOCKER] Container db (postgres:16-alpine) Started (Port 5432)`);
      await delay(300);
      appendLog("info", `[DOCKER] Container cache (redis:7-alpine) Started (Port 6379)`);
      await delay(400);
      appendLog("info", `[DOCKER] Container api (${domain.shortName.toLowerCase()}-service) Started (Port 8080)`);
      await delay(200);
      appendLog("pass", `[DOCKER READY] All 3 containers online and listening with healthcheck PASS.`);
    } else if (c.includes("chaos")) {
      appendLog("warn", `[CHAOS INJECTION] Simulating 850ms network latency spike to database...`);
      await delay(500);
      appendLog("warn", `[CIRCUIT BREAKER] Threshold breached: Gateway tripped circuit breaker to OPEN state.`);
      await delay(400);
      appendLog("pass", `✓ [FALLBACK ACTIVATED] Graceful degraded cache-aside serving cached ${e1} items (<15ms).`);
      await delay(300);
      appendLog("info", `[HEALING] Circuit breaker entered HALF-OPEN; probe successful; state restored to CLOSED.`);
      await delay(200);
      appendLog("pass", `[CHAOS SUMMARY] System sustained zero downtime and zero 5xx errors under failure.`);
    } else {
      appendLog("warn", `Command not recognized: "${trimmed}". Type 'help' for available commands.`);
    }

    setIsExecuting(false);
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  return (
    <div className="h-full flex flex-col rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-xs shadow-2xl">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-slate-400 font-bold ml-2 text-[11px]">
            bash — {domain.shortName.toLowerCase()}@specflow-ai:~ (DevSecOps CLI)
          </span>
        </div>

        <button
          type="button"
          onClick={() => setLogs([])}
          className="text-slate-400 hover:text-slate-200 transition-colors"
          title="Clear Output"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Quick Action Chips */}
      <div className="flex flex-wrap items-center gap-1.5 p-2.5 bg-slate-900/60 border-b border-slate-800/80 text-[11px]">
        <span className="text-slate-500 font-bold mr-1 uppercase text-[10px]">Actions:</span>
        {[
          { label: "Specmatic Test", cmd: "specmatic test", color: "text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10" },
          { label: "Unit Test Suite", cmd: "npm test", color: "text-blue-400 border-blue-500/30 hover:bg-blue-500/10" },
          { label: "Playwright E2E", cmd: "npx playwright test", color: "text-purple-400 border-purple-500/30 hover:bg-purple-500/10" },
          { label: "Docker Compose Up", cmd: "docker compose up", color: "text-amber-400 border-amber-500/30 hover:bg-amber-500/10" },
          { label: "Chaos Injection", cmd: "chaos test", color: "text-rose-400 border-rose-500/30 hover:bg-rose-500/10" }
        ].map((act, i) => (
          <button
            key={i}
            type="button"
            disabled={isExecuting}
            onClick={() => handleRunCommand(act.cmd)}
            className={`px-2 py-0.5 rounded-md border bg-slate-900 transition-all font-semibold disabled:opacity-40 flex items-center gap-1 ${act.color}`}
          >
            <Play className="h-2.5 w-2.5 fill-current" />
            <span>{act.label}</span>
          </button>
        ))}
      </div>

      {/* Terminal Log Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1 text-slate-300">
        {logs.map((log, idx) => (
          <div key={idx} className="flex items-start gap-2 leading-relaxed">
            <span className="text-slate-600 select-none text-[10px] mt-0.5">{log.timestamp}</span>
            {log.type === "cmd" && <span className="text-emerald-400 font-bold">{log.text}</span>}
            {log.type === "info" && <span className="text-slate-300">{log.text}</span>}
            {log.type === "pass" && <span className="text-emerald-400 font-semibold">{log.text}</span>}
            {log.type === "warn" && <span className="text-amber-300 font-medium">{log.text}</span>}
            {log.type === "error" && <span className="text-rose-400 font-bold">{log.text}</span>}
          </div>
        ))}
        {isExecuting && (
          <div className="flex items-center gap-2 text-emerald-400 animate-pulse pt-1">
            <span className="text-slate-600 select-none text-[10px]">{getTime()}</span>
            <span>Executing automated verification pipeline...</span>
          </div>
        )}
        <div ref={terminalEndRef} />
      </div>

      {/* Terminal Command Input Prompt */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRunCommand(commandInput);
        }}
        className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border-t border-slate-800"
      >
        <div className="text-emerald-400 font-bold select-none flex items-center gap-1">
          <span>{domain.shortName.toLowerCase()}$</span>
        </div>
        <input
          type="text"
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          placeholder="Type a command (e.g. 'specmatic test', 'npm test', 'help')..."
          disabled={isExecuting}
          className="flex-1 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none font-mono text-xs disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!commandInput.trim() || isExecuting}
          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs transition-all"
        >
          Run
        </button>
      </form>
    </div>
  );
};
