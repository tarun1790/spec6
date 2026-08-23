import { TechStackPreferences } from "./types";

export interface RefinedPromptResult {
  originalPrompt: string;
  refinedPrompt: string;
  detectedDomain: string;
  injectedArchitecturalGuardrails: string[];
  suggestedTechStack: TechStackPreferences;
  estimatedComplexity: "Low" | "Medium" | "High" | "Enterprise-Scale";
}

export function refineUserPrompt(prompt: string, currentStack?: TechStackPreferences): RefinedPromptResult {
  const p = prompt.toLowerCase();

  let domain = "Enterprise Cloud Service";
  const guardrails: string[] = [
    "Strict 99.99% Availability SLA with sub-50ms p95 read latency and sub-150ms p95 write latency.",
    "Decoupled asynchronous event-driven architecture with distributed message bus (Kafka/Redis Streams).",
    "Zero-trust security posture: JWT RS256 tokens, RBAC permissions, and field-level AES-256 PII encryption.",
    "Comprehensive observability: Structured JSON logging, Prometheus metrics, and /healthz & /ready probes."
  ];

  let complexity: "Low" | "Medium" | "High" | "Enterprise-Scale" = "Enterprise-Scale";

  let suggestedStack: TechStackPreferences = currentStack || {
    frontend: "Next.js 14 (App Router) + Tailwind CSS",
    backend: "FastAPI / Node.js Microservices (gRPC + REST)",
    database: "PostgreSQL 16 (Prisma/SQLAlchemy) + Redis Cluster",
    architecture: "Event-Driven Microservices with Saga Orchestration",
    deployment: "Kubernetes (EKS) + Docker + Terraform",
    auth: "OAuth 2.0 / JWT + RBAC",
    caching: "Redis Cluster with Cache-Aside"
  };

  if (p.includes("commerce") || p.includes("shop") || p.includes("store") || p.includes("cart")) {
    domain = "Omnichannel E-Commerce & Order Orchestration";
    guardrails.push("Distributed inventory locks (Redis Redlock) to prevent overselling during surge flash sales.");
    guardrails.push("Idempotent payment webhook processing with automated compensation sagas.");
  } else if (p.includes("chat") || p.includes("collab") || p.includes("whiteboard") || p.includes("messenger")) {
    domain = "Real-Time Collaboration & CRDT Mesh";
    guardrails.push("Conflict-Free Replicated Data Types (Yjs/CRDTs) for concurrent multi-cursor document editing.");
    guardrails.push("Ultra-low latency WebSocket gateway with presence broadcasting and ephemeral heartbeats.");
  } else if (p.includes("health") || p.includes("telemed") || p.includes("patient") || p.includes("doctor")) {
    domain = "HIPAA-Compliant Telehealth & FHIR EHR";
    guardrails.push("End-to-End Encrypted WebRTC consultation rooms with zero ephemeral storage leakage.");
    guardrails.push("HL7 FHIR R4 clinical data repository with immutable PHI access audit logging.");
  } else if (p.includes("agent") || p.includes("ai") || p.includes("workflow") || p.includes("dag")) {
    domain = "Autonomous Multi-Agent Workflow Engine";
    guardrails.push("Dynamic DAG task compiler with tool-calling sandboxes and episodic vector memory.");
    guardrails.push("Human-in-the-Loop (HITL) approval gates and streaming intermediate reasoning chains.");
  } else if (p.includes("fintech") || p.includes("ledger") || p.includes("bank") || p.includes("payment")) {
    domain = "Double-Entry Multi-Currency Ledger";
    guardrails.push("Strict double-entry bookkeeping engine ensuring zero fractional penny drift.");
    guardrails.push("Real-time fraud scoring pipeline with geo-anomaly velocity and device fingerprinting.");
  }

  const refined = `### Refined Master Engineering Specification Prompt: ${domain}

#### 1. Core Problem Statement & Mission
${prompt.trim()}

#### 2. Mandatory Architectural Invariants & Non-Negotiable Guardrails
${guardrails.map((g, idx) => `${idx + 1}. **${g.split(":")[0]}**: ${g.split(":")[1] || g}`).join("\n")}

#### 3. Execution Mandates
- Deliver complete, production-ready specifications across all 6 SDLC phases (00 to 05).
- Ensure all Mermaid diagrams compile cleanly with valid AST syntax.
- Ensure 100% entity consistency between ERDs, API routes, and engineering task breakdowns.`;

  return {
    originalPrompt: prompt,
    refinedPrompt: refined,
    detectedDomain: domain,
    injectedArchitecturalGuardrails: guardrails,
    suggestedTechStack: suggestedStack,
    estimatedComplexity: complexity
  };
}
