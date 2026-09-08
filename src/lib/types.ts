export type SpecificationRigor = "spec-first" | "spec-anchored" | "spec-as-source";

export type SddPhase = "specify" | "plan" | "implement" | "validate";

export interface StageInfo {
  index: number;
  fileName: string;
  title: string;
  sddPhase: SddPhase;
  sdlcPhase: string;
  shortDescription: string;
  badge: string;
  iconName: string;
  color: "emerald" | "red" | "indigo" | "teal" | "rose" | "emerald-dark";
  requiredSections: string[];
}

export const STAGES: StageInfo[] = [
  {
    index: 0,
    fileName: "00_PROJECT_BRIEF.md",
    title: "Project Scope & Requirements",
    sddPhase: "specify",
    sdlcPhase: "SDLC Phase 1: Requirements Analysis",
    shortDescription: "Scope boundaries, user personas, P0/P1/P2 matrix, SLAs & business value",
    badge: "1. Specify",
    iconName: "FileText",
    color: "emerald",
    requiredSections: [
      "Executive Summary & Problem Statement",
      "Target User Personas & Key Journeys",
      "Functional Requirements Matrix (P0, P1, P2)",
      "Non-Functional Requirements & SLA Commitments",
      "Scope Boundaries (In-Scope vs Out-of-Scope)"
    ]
  },
  {
    index: 1,
    fileName: "01_SYSTEM_ARCHITECTURE.md",
    title: "System Architecture & Contracts",
    sddPhase: "plan",
    sdlcPhase: "SDLC Phase 2: System & Schema Design",
    shortDescription: "Mermaid topology, ERD schemas, REST/GraphQL API contracts & sequence flows",
    badge: "2. Plan",
    iconName: "Layers",
    color: "teal",
    requiredSections: [
      "Technology Stack Selection & Architectural Rationale",
      "Visual System Topology (Mermaid Flowchart)",
      "Entity Relationship Diagram (Mermaid ERD) & Schemas",
      "RESTful / GraphQL API Contracts & Schemas",
      "Data Flow & Event Bus Architecture (Mermaid Sequence)"
    ]
  },
  {
    index: 2,
    fileName: "02_IMPLEMENTATION_PLAN.md",
    title: "Implementation Plan & Breakdown",
    sddPhase: "implement",
    sdlcPhase: "SDLC Phase 3: Software Development",
    shortDescription: "Directory tree, 4-phase milestone breakdown, actionable task checklist",
    badge: "3. Implement",
    iconName: "GitMerge",
    color: "indigo",
    requiredSections: [
      "Repository Directory Tree Structure",
      "Sequential Milestone Breakdown (Phases 1-4)",
      "Granular Task Checklist with Dependency Chains",
      "Local Development Setup & CLI Commands"
    ]
  },
  {
    index: 3,
    fileName: "03_TESTING_STRATEGY.md",
    title: "Testing Strategy & QA Matrix",
    sddPhase: "validate",
    sdlcPhase: "SDLC Phase 4: Quality Assurance & Testing",
    shortDescription: "Unit coverage >80%, API mock suites, Playwright E2E flows & edge cases",
    badge: "4. Validate (QA)",
    iconName: "CheckSquare",
    color: "red",
    requiredSections: [
      "Unit Testing Matrix (>80% Target Coverage & Mocking)",
      "API & Integration Test Suites with Mock JSON Payloads",
      "End-to-End (E2E) Test User Flows (Playwright/Cypress)",
      "Edge-Case Inventory & Boundary Failure Tests"
    ]
  },
  {
    index: 4,
    fileName: "04_SECURITY_COMPLIANCE.md",
    title: "Security & Compliance Blueprint",
    sddPhase: "validate",
    sdlcPhase: "SDLC Phase 5: Security & Hardening",
    shortDescription: "JWT/OAuth2/RBAC, OWASP Top 10 mitigations, encryption & env vars",
    badge: "5. Validate (Sec)",
    iconName: "ShieldCheck",
    color: "rose",
    requiredSections: [
      "Identity, Authentication & RBAC Permission Tables",
      "OWASP Top 10 Mitigation Blueprint",
      "Cryptographic Standards (TLS 1.3 & AES-256)",
      "Environment Variable Dictionary & Secret Policies"
    ]
  },
  {
    index: 5,
    fileName: "05_DEPLOYMENT_DEVOPS.md",
    title: "Deployment & DevOps Spec",
    sddPhase: "validate",
    sdlcPhase: "SDLC Phase 6: Deployment & Operations",
    shortDescription: "Multi-stage Dockerfile, docker-compose, CI/CD deploy.yml, IaC & observability",
    badge: "6. Validate (Ops)",
    iconName: "Terminal",
    color: "emerald-dark",
    requiredSections: [
      "Multi-Stage Dockerfile & Production docker-compose.yml",
      "CI/CD Pipeline (.github/workflows/deploy.yml)",
      "Infrastructure-as-Code Spec (Terraform / Cloud Native)",
      "Observability, Health Endpoints & Metrics"
    ]
  }
];

export type StageStatus = "idle" | "generating" | "completed" | "failed";

export interface StageState {
  index: number;
  fileName: string;
  status: StageStatus;
  content: string;
  tokensGenerated: number;
  durationMs: number;
  errorMessage?: string;
  lastUpdated?: number;
}

export interface TechStackPreferences {
  frontend: string;
  backend: string;
  database: string;
  architecture: string;
  deployment: string;
  auth: string;
  caching: string;
}

export type LLMProvider = "mock" | "openai" | "anthropic" | "gemini" | "groq" | "ollama";

export interface LLMConfig {
  provider: LLMProvider;
  apiKey?: string;
  model: string;
  temperature: number;
  customBaseUrl?: string;
}

export interface GenerationRequest {
  prompt: string;
  techStack: TechStackPreferences;
  llmConfig: LLMConfig;
  targetStage?: number;
  accumulatedContext?: Record<string, string>;
}

export type SSEEvent =
  | {
      event: "stage_start";
      stage_index: number;
      file_name: string;
      message: string;
    }
  | {
      event: "chunk";
      file_name: string;
      stage_index: number;
      content: string;
    }
  | {
      event: "stage_complete";
      file_name: string;
      stage_index: number;
      tokens_generated?: number;
      duration_ms?: number;
    }
  | {
      event: "error";
      stage_index: number;
      file_name?: string;
      error_message: string;
    }
  | {
      event: "pipeline_complete";
      total_tokens: number;
      duration_ms: number;
    };
