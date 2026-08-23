export interface StageInfo {
  index: number;
  fileName: string;
  title: string;
  shortDescription: string;
  badge: string;
  iconName: string;
  requiredSections: string[];
}

export const STAGES: StageInfo[] = [
  {
    index: 0,
    fileName: "00_PROJECT_BRIEF.md",
    title: "Project Brief & Requirements",
    shortDescription: "Scope, user personas, P0/P1/P2 matrix, SLAs & boundaries",
    badge: "Scope & Strategy",
    iconName: "FileText",
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
    shortDescription: "Mermaid topology, ERD schemas, REST/GraphQL APIs & sequence flows",
    badge: "Architecture & Design",
    iconName: "Layers",
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
    shortDescription: "Directory tree, 4-phase milestone breakdown, actionable task checklist",
    badge: "Engineering Roadmap",
    iconName: "GitMerge",
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
    shortDescription: "Unit coverage >80%, API mock suites, E2E user flows & edge cases",
    badge: "Quality Assurance",
    iconName: "CheckSquare",
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
    shortDescription: "JWT/OAuth2/RBAC, OWASP Top 10 mitigations, encryption & env vars",
    badge: "Security & Hardening",
    iconName: "ShieldCheck",
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
    shortDescription: "Multi-stage Dockerfile, docker-compose, CI/CD deploy.yml, IaC & observability",
    badge: "Infra & Operations",
    iconName: "Terminal",
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
  targetStage?: number; // if re-generating a specific stage
  accumulatedContext?: Record<string, string>; // for passing previous stages if selective
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
