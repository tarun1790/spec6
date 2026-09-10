"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Mic, MicOff, Copy, Check, Plus, RotateCcw, Download, ArrowRight, Code2, HelpCircle } from "lucide-react";
import { DomainContext } from "@/lib/mock-generator";
import { TechStackPreferences, StageState } from "@/lib/types";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface AiChatWorkspaceProps {
  domain: DomainContext;
  techStack: TechStackPreferences;
  stages: StageState[];
  onApplyRefactor?: (stageIndex: number, code: string) => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  codeSnippet?: string;
  timestamp: string;
}

export const AiChatWorkspace: React.FC<AiChatWorkspaceProps> = ({
  domain,
  techStack,
  stages,
  onApplyRefactor
}) => {
  const e1 = domain.primaryEntities[0] || "PrimaryEntity";
  const e2 = domain.primaryEntities[1] || "EventEntity";

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "assistant",
      text: `Hello! I am your **Principal Software Architect & Systems Copilot** for **${domain.title}**.\n\nI have full contextual understanding of your specifications, 3NF schemas, **${techStack.architecture}**, and **${techStack.backend}** core. You can chat with me naturally about anything:\n\n* Architecture reviews and scaling to 100k+ RPS\n* Schema modifications, migrations, and indexing strategies\n* Security hardening, OWASP Top 10 defenses, and zero-trust policies\n* Edge-case BDD Gherkin test scenarios\n* Code generation in TypeScript, Python, Go, Rust, or Terraform\n\nWhat would you like to explore or refine?`,
      timestamp: "10:00 AM"
    }
  ]);

  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [appliedId, setAppliedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const getTime = () => {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSendMessage = (textToSend?: string) => {
    const q = (textToSend || inputText).trim();
    if (!q || isThinking) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: q,
      timestamp: getTime()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsThinking(true);

    // Context-aware intelligent AI reasoning
    setTimeout(() => {
      const response = generateConversationalResponse(q, domain, techStack);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "assistant",
        text: response.text,
        codeSnippet: response.codeSnippet,
        timestamp: getTime()
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
    }, 650);
  };

  const toggleVoice = () => {
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
          handleSendMessage(spoken);
        }
      };
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      rec.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApply = (id: string, snippet?: string) => {
    if (!snippet || !onApplyRefactor) return;
    onApplyRefactor(1, snippet); // Apply to architecture/plan stage
    setAppliedId(id);
    setTimeout(() => setAppliedId(null), 2500);
  };

  const quickPrompts = [
    `How does ${domain.shortName} handle high concurrency under 20,000 RPS?`,
    `Explain the relational foreign key schema between ${e1} and ${e2}`,
    `Suggest 3 edge-case Gherkin BDD test scenarios`,
    `How do we implement zero-trust token authentication for ${domain.apiPrefix}?`,
    `Generate production Docker Compose and healthcheck config`
  ];

  return (
    <div className="h-full flex flex-col rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
      {/* Top Chat Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>AI Systems Architect</span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                Online • Active Context
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Interactive pair-architect conversing about {domain.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMessages([messages[0]])}
            className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-900 border border-slate-200 bg-white hover:bg-slate-50 px-2.5 py-1 rounded-lg transition-colors shadow-2xs"
            title="Reset conversation"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/40">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 max-w-3xl ${m.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
          >
            {/* Avatar */}
            <div
              className={`h-7 w-7 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-2xs ${
                m.sender === "user"
                  ? "bg-slate-800 text-white"
                  : "bg-emerald-600 text-white"
              }`}
            >
              {m.sender === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
            </div>

            {/* Message Bubble */}
            <div
              className={`p-4 rounded-2xl space-y-2.5 text-xs shadow-xs transition-all ${
                m.sender === "user"
                  ? "bg-slate-900 text-white rounded-tr-xs"
                  : "bg-white text-slate-900 border border-slate-200/80 rounded-tl-xs"
              }`}
            >
              <div className="prose prose-xs max-w-none text-inherit leading-relaxed whitespace-pre-wrap">
                {m.text}
              </div>

              {/* Code Snippet Box (if provided) */}
              {m.codeSnippet && (
                <div className="mt-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-200 shadow-inner">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[10px] font-mono text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <Code2 className="h-3 w-3" />
                      <span>Proposed Architectural Artifact</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(m.id, m.codeSnippet!)}
                        className="hover:text-white transition-colors flex items-center gap-1"
                      >
                        {copiedId === m.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        <span>{copiedId === m.id ? "Copied" : "Copy"}</span>
                      </button>

                      {onApplyRefactor && (
                        <button
                          type="button"
                          onClick={() => handleApply(m.id, m.codeSnippet)}
                          className="hover:text-emerald-400 transition-colors flex items-center gap-1 font-bold text-emerald-500"
                          title="Inject this code snippet directly into your specification"
                        >
                          {appliedId === m.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Plus className="h-3 w-3" />}
                          <span>{appliedId === m.id ? "Applied!" : "Apply to Spec"}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-3 font-mono text-xs overflow-x-auto text-emerald-400 leading-relaxed">
                    <pre>
                      <code>{m.codeSnippet}</code>
                    </pre>
                  </div>
                </div>
              )}

              <div className="text-[10px] text-slate-400 text-right select-none pt-1">
                {m.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex gap-3 max-w-2xl mr-auto animate-in fade-in">
            <div className="h-7 w-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <div className="bg-white p-3.5 rounded-2xl rounded-tl-xs border border-slate-200 text-xs text-slate-600 shadow-xs flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-bounce" />
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-bounce delay-100" />
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-bounce delay-200" />
              </div>
              <span className="text-slate-500 font-medium">Analyzing system architecture & synthesizing solution...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200/80 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max text-[11px]">
          <span className="text-[10px] font-bold uppercase text-slate-400 mr-1 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-emerald-600" />
            <span>Suggestions:</span>
          </span>
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendMessage(qp)}
              disabled={isThinking}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200 text-slate-700 font-medium transition-colors shadow-2xs truncate max-w-xs"
            >
              {qp}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input Console */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <button
          type="button"
          onClick={toggleVoice}
          className={`p-2 rounded-xl border transition-all shadow-xs ${
            isListening
              ? "bg-rose-50 text-rose-700 border-rose-300 animate-pulse font-bold"
              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
          }`}
          title={isListening ? "Listening... Speak now" : "Speak to AI (Speech-to-Text)"}
        >
          {isListening ? <MicOff className="h-4 w-4 text-rose-600" /> : <Mic className="h-4 w-4 text-emerald-600" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Ask anything about ${domain.shortName}'s architecture, security, or code...`}
          disabled={isThinking}
          className="flex-1 bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-sans"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isThinking}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
        >
          <Send className="h-3.5 w-3.5 fill-white" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
};

// Conversational Reasoning Engine for domain answers
function generateConversationalResponse(
  query: string,
  domain: DomainContext,
  stack: TechStackPreferences
): { text: string; codeSnippet?: string } {
  const q = query.toLowerCase();
  const e1 = domain.primaryEntities[0] || "PrimaryRecord";
  const e2 = domain.primaryEntities[1] || "EventRecord";

  if (q.includes("concurrency") || q.includes("scale") || q.includes("rps") || q.includes("load") || q.includes("throughput")) {
    return {
      text: `To scale **${domain.shortName}** to sustain **20,000+ RPS** with sub-50ms latency, we utilize a 3-tier architectural decoupling strategy:\n\n1. **Edge Token-Bucket Rate Limiting:** Envoy API gateway rejects malicious surges and enforces 1,000 req/min quotas per tenant.\n2. **Redis L2 Cache-Aside:** High-frequency reads for \`${domain.apiPrefix}\` are cached in Redis with a 120s TTL and stale-while-revalidate invalidation, eliminating 92% of queries to PostgreSQL.\n3. **Asynchronous CQRS Ingestion:** Mutations to \`${e1}\` publish domain events directly to Kafka/Redis PubSub, offloading write pressure into background workers.`,
      codeSnippet: `// High-Concurrency Cache-Aside Pattern in ${stack.backend.split("/")[0].trim()}
export async function getCached${e1}(id: string) {
  const cacheKey = \`${e1.toLowerCase()}:\${id}\`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const dbRecord = await db.${e1.toLowerCase()}.findUnique({ where: { id } });
  if (dbRecord) {
    await redis.set(cacheKey, JSON.stringify(dbRecord), "EX", 120);
  }
  return dbRecord;
}`
    };
  }

  if (q.includes("schema") || q.includes("database") || q.includes("relation") || q.includes("foreign key") || q.includes("sql") || q.includes("erd")) {
    return {
      text: `Here is the relational 3NF mapping for **${domain.shortName}**:\n\n* **Primary Entity (\`${e1}\`):** Stores immutable operational records with primary key \`id (UUID)\` and unique \`identifier_code\`.\n* **Event Entity (\`${e2}\`):** Implements a foreign key relationship (\`${e1.toLowerCase()}_id\`) with CASCADE delete rules, ensuring all telemetry events are cleanly bounded to their parent.\n* **Cardinality:** \`${e1}\` ||--o{ \`${e2}\` (One ${e1} emits zero or many ${e2} events).`,
      codeSnippet: `-- PostgreSQL 16 DDL for ${e1} and ${e2}
CREATE TABLE ${e1.toLowerCase()}s (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier_code VARCHAR(100) UNIQUE NOT NULL,
  status_state VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ${e2.toLowerCase()}s (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ${e1.toLowerCase()}_id UUID NOT NULL REFERENCES ${e1.toLowerCase()}s(id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_${e2.toLowerCase()}_fk ON ${e2.toLowerCase()}s(${e1.toLowerCase()}_id);`
    };
  }

  if (q.includes("auth") || q.includes("security") || q.includes("jwt") || q.includes("zero trust") || q.includes("token")) {
    return {
      text: `Security for **${domain.shortName}** is enforced via **Zero-Trust JWT Cryptographic Verification**:\n\n* **Protocol:** RS256 asymmetric signing. Public keys are rotated every 24 hours via OIDC JWKS.\n* **Tenant Isolation:** Every incoming request extracts \`tenant_id\` and \`role_tier\` claims from the token payload.\n* **Compliance:** Satisfies **${domain.complianceFramework.split(",")[0]}** with zero plain-text secrets and TLS 1.3 encryption.`,
      codeSnippet: `// Middleware: Zero-Trust JWT RS256 Guard
export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Missing Bearer Token" });

  try {
    const verified = jwt.verify(token, JWKS_PUBLIC_KEY, { algorithms: ["RS256"] });
    req.user = verified;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired cryptographic signature" });
  }
}`
    };
  }

  if (q.includes("gherkin") || q.includes("bdd") || q.includes("test") || q.includes("cucumber") || q.includes("scenario")) {
    return {
      text: `Here are 3 critical edge-case Gherkin BDD scenarios formulated to verify state machine boundaries for **${domain.shortName}**:`,
      codeSnippet: `@specification @edge_cases
Feature: ${e1} Operational Invariants and Boundary Edge Cases

  Scenario: Rejection of negative monetary or invalid metric amounts
    Given an authenticated client session
    When the client posts payload with invalid payload attributes
    Then the API gateway rejects the request with HTTP 422 Unprocessable Entity
    And zero state mutations are committed to the persistence tier

  Scenario: Distributed idempotency collision prevention
    Given a valid mutation payload with idempotency key "IDEMP-9921-KEY"
    When the client dispatches two identical requests concurrently
    Then the first request commits and returns HTTP 201 Created
    And the second request returns the cached result without duplicate state creation

  Scenario: Circuit breaker activation under database downtime
    Given the persistence storage pool is unreachable
    When a read request arrives for "${domain.apiPrefix}"
    Then the system returns cached state from Redis with header "X-Cache: HIT-DEGRADED"`
    };
  }

  if (q.includes("docker") || q.includes("deploy") || q.includes("k8s") || q.includes("terraform") || q.includes("aws")) {
    return {
      text: `Here is the production Docker Compose infrastructure configuration deploying **${domain.shortName}** with PostgreSQL 16 and Redis healthchecks:`,
      codeSnippet: `version: "3.9"

services:
  ${domain.shortName.toLowerCase()}-api:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgres://user:secret@db:5432/${domain.shortName.toLowerCase()}
      - REDIS_URL=redis://cache:6379
      - NODE_ENV=production
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ${domain.shortName.toLowerCase()}
      POSTGRES_USER: user
      POSTGRES_PASSWORD: secret
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 5s
      timeout: 3s
      retries: 5

  cache:
    image: redis:7-alpine
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5`
    };
  }

  // General natural language conversational answer
  return {
    text: `Great question regarding **${query}**!\n\nIn **${domain.title}**, this is architected around **${stack.architecture}** using **${stack.backend}** and **${stack.database}**.\n\n* **Core Objective:** Guarantees strict type safety, zero-trust policy compliance (${domain.complianceFramework.split(",")[0]}), and sub-100ms response latencies.\n* **Integration Point:** Binds directly to the \`${domain.apiPrefix}\` route handling mutations for **${e1}** and telemetry for **${e2}**.\n* **Verification:** Validated automatically through continuous verification gates and contract testing.\n\nWould you like me to generate a specific code implementation, schema migration, or automated test suite for this?`
  };
}
