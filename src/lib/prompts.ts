import { TechStackPreferences } from "./types";

export function getSystemPrompt(): string {
  return `You are a Principal Software Architect and Lead Engineering Director.
You generate exhaustive, production-grade, industry-standard software engineering specifications.
Always adhere to these principles:
- Generate pure, clean, professional Markdown with no introductory or concluding conversational filler (e.g. do NOT say "Sure, here is...").
- Write concrete, high-fidelity specifications with exact types, real schema definitions, precise code examples, and explicit checklist items.
- Ensure all Mermaid diagrams use valid syntax (e.g. flowchart TD, erDiagram, sequenceDiagram) without syntax errors or unescaped quotes.
- Maintain absolute consistency across all documents: names of entities, tables, API endpoints, microservices, and environment variables MUST align 100% across all generated files.`;
}

export function buildStagePrompt(
  stageIndex: number,
  userPrompt: string,
  techStack: TechStackPreferences,
  accumulatedContext: Record<string, string>
): string {
  const stackSummary = `
Selected Technology Stack:
- Frontend: ${techStack.frontend}
- Backend: ${techStack.backend}
- Database: ${techStack.database}
- Architecture Style: ${techStack.architecture}
- Deployment Target: ${techStack.deployment}
- Authentication: ${techStack.auth}
- Caching & State: ${techStack.caching}
`.trim();

  const contextSummary = Object.keys(accumulatedContext).length > 0
    ? `\n\n--- PREVIOUS ACCUMULATED SPECIFICATIONS FOR CONSISTENCY ---\n` +
      Object.entries(accumulatedContext)
        .map(([fileName, content]) => `### [Context from ${fileName}]\n${content.slice(0, 3500)}\n`)
        .join("\n") +
      `\n--- END OF PREVIOUS CONTEXT ---\n`
    : "";

  switch (stageIndex) {
    case 0:
      return `Generate "00_PROJECT_BRIEF.md" for the following application request:

USER REQUIREMENTS:
"${userPrompt}"

${stackSummary}

Structure the document with the following mandatory sections and detail:
# 00_PROJECT_BRIEF.md: Product Scope & Requirements

## 1. Executive Summary & Problem Statement
- 1.1 Business Objective & Value Proposition
- 1.2 Core Problem Definition & Current Inefficiencies

## 2. Target User Personas & Core User Journeys
- Detailed Personas (e.g., End User, Operations Admin, System Integrator) with Goals, Pain Points, and Permissions.
- Step-by-step User Journeys for the 3 primary workflows.

## 3. Functional Requirements Matrix
Provide a comprehensive Markdown table with columns:
| Requirement ID | Module / Area | Feature Description | Priority (P0: Must-Have / P1: Should-Have / P2: Nice-to-Have) | Acceptance Criteria |
Include at least 8-12 granular requirements covering P0, P1, and P2.

## 4. Non-Functional Requirements & SLA Commitments
- 4.1 Latency & Performance (p95 / p99 response times, throughput target RPS)
- 4.2 Availability & Reliability (99.99% uptime target, MTTR, RTO/RPO)
- 4.3 Data Sovereignty, Retention & Privacy (GDPR, SOC2, HIPAA where applicable)
- 4.4 Scalability Targets (horizontal scale thresholds, concurrent active users)

## 5. Scope Boundaries
- 5.1 Explicitly In-Scope for Phase 1 / MVP
- 5.2 Explicitly Out-of-Scope / Deferred to Phase 2+
- 5.3 Technical Assumptions & External Dependencies`;

    case 1:
      return `Generate "01_SYSTEM_ARCHITECTURE.md" based on the user requirements and previous project brief.

USER REQUIREMENTS:
"${userPrompt}"

${stackSummary}
${contextSummary}

Structure the document with the following mandatory sections:
# 01_SYSTEM_ARCHITECTURE.md: System Design & Contracts

## 1. Technology Stack Selection & Architectural Rationale
- Detailed justification for choosing each tier (${techStack.frontend}, ${techStack.backend}, ${techStack.database}, ${techStack.caching}, ${techStack.deployment}).

## 2. Visual System Topology (Mermaid Flowchart)
Include a clean, syntax-valid \`\`\`mermaid flowchart TD\`\`\` diagram mapping out:
- Client Layers (Web/Mobile/Desktop)
- Edge / CDN / Reverse Proxy / Load Balancer
- API Gateway / Auth Middleware
- Microservices / Backend Application Services
- Event Bus / Message Broker (e.g., Kafka / RabbitMQ / Redis Streams)
- Primary & Secondary Databases + Cache Tiers
- External Integrations / Third-Party Services

## 3. Database Schema & Entity Relationship Diagram (Mermaid ERD)
- Include a complete \`\`\`mermaid erDiagram\`\`\` containing all primary entities, relationships (e.g., ||--o{, ||--||), primary keys (PK), and foreign keys (FK).
- Followed by structured table definitions detailing Field Name, Data Type, Constraints, Nullability, Default, and Indexing notes.

## 4. RESTful & Real-time API Contracts
- Provide structured API route contracts (e.g., POST /api/v1/..., GET /api/v1/...).
- For each endpoint specify: HTTP Method, Path, Auth Level, Request Headers, JSON Request Body Schema, Success Response Schema (200/201), Error Responses (400, 401, 403, 404, 429, 500).

## 5. Data Flow & Event Bus Architecture (Mermaid Sequence)
- Include a \`\`\`mermaid sequenceDiagram\`\`\` mapping the end-to-end flow of the primary transaction/action through Client, Gateway, Service, Database, and Event Bus.`;

    case 2:
      return `Generate "02_IMPLEMENTATION_PLAN.md" based on the architecture and contracts.

USER REQUIREMENTS:
"${userPrompt}"

${stackSummary}
${contextSummary}

Structure the document with the following mandatory sections:
# 02_IMPLEMENTATION_PLAN.md: Engineering Breakdown

## 1. Repository Directory Tree Structure
- Provide an exhaustive, clean directory tree layout (e.g. using ASCII tree format \`/\` \`├── \` \`└── \`) covering monorepo/services, apps, packages, configs, tests, and CI/CD assets.
- Explain the role of key directories.

## 2. Sequential Milestone Breakdown
Detail 4 sequential development phases with deliverables:
- Phase 1: Foundation, Tooling, Core Data Models & Base Scaffolding
- Phase 2: Core Domain Services, Data Access Layer & Business Logic
- Phase 3: Integration, API Gateway, Real-Time Sockets & Frontend UI
- Phase 4: Security Hardening, Performance Optimization & Pre-Launch Audits

## 3. Granular Task Checklist with Dependency Chains
Provide an actionable, checklist-ready engineering task list using Markdown checkboxes (\`- [ ]\`).
Format: \`- [ ] **TASK-ID**: Title - Detailed description [Depends on: PREV-TASK] [Owner: Team/Role]\`.
Include at least 15-20 distinct tasks across database, backend, frontend, security, and DevOps.

## 4. Local Development Setup & CLI Run Commands
- Prerequisites (Node.js, Docker, CLI tools, etc.).
- Step-by-step setup commands (git clone, env copy, dependency install, database migration, seed data).
- Commands to run services concurrently, run test suites, and execute database migrations.`;

    case 3:
      return `Generate "03_TESTING_STRATEGY.md" for the designed system.

USER REQUIREMENTS:
"${userPrompt}"

${stackSummary}
${contextSummary}

Structure the document with the following mandatory sections:
# 03_TESTING_STRATEGY.md: Quality Assurance Matrix

## 1. Unit Testing Matrix (>80% Target Coverage)
- Strategy for unit testing isolated domain logic, service layers, utility functions, and validation schemas.
- Mocking boundaries: Database mocks, HTTP client interceptors, and message broker stubs.
- Concrete unit test code examples demonstrating high-value assertion patterns.

## 2. API & Integration Test Suites
- Comprehensive test matrix for endpoints with mock JSON request payloads, expected HTTP response status codes, and JSON response bodies.
- Database transaction isolation and test fixture teardown strategies.

## 3. End-to-End (E2E) Test User Flows
- Concrete Playwright or Cypress test definitions for the primary critical path user journey.
- Include full code snippet with setup, page navigation, input interactions, assertion steps, and session cleanup.

## 4. Edge-Case Inventory & Boundary Failure Tests
Structured table analyzing edge cases:
| Category | Edge Scenario | Failure Mode / Threat | Expected Mitigation / Test Assertion |
Cover: Network partitions/timeouts, race conditions / concurrency collisions, corrupted payloads, rate limit exhaustion, and boundary numerical values.`;

    case 4:
      return `Generate "04_SECURITY_COMPLIANCE.md" for the system.

USER REQUIREMENTS:
"${userPrompt}"

${stackSummary}
${contextSummary}

Structure the document with the following mandatory sections:
# 04_SECURITY_COMPLIANCE.md: Security & Compliance Blueprint

## 1. Identity, Authentication & RBAC Permission Matrix
- Authentication scheme: JWT format (claims, algorithms, expiry), refresh token rotation, OAuth2 / OIDC integration.
- Granular Role-Based Access Control (RBAC) / Attribute-Based Access Control (ABAC) matrix table:
| Role | Resource | Read | Create | Update | Delete | Admin / Execute | Conditions |

## 2. OWASP Top 10 Mitigation Blueprint
Detailed defense-in-depth implementations for:
- Injection (SQLi, NoSQLi, Command Injection) - parameterized queries & ORMs
- Broken Authentication & Session Hijacking
- Sensitive Data Exposure & PII Redaction
- XML/JSON External Entities & Deserialization
- Broken Access Control & IDOR (Insecure Direct Object References)
- Security Misconfiguration & Default Passwords
- Cross-Site Scripting (XSS) - CSP headers & sanitization
- Insecure Deserialization
- Using Components with Known Vulnerabilities - automated CVE scans
- Insufficient Logging & Monitoring - tamper-proof audit trails

## 3. Cryptographic Standards & Secret Rotation Policy
- In-Transit: TLS 1.3 cipher suites, HSTS headers.
- At-Rest: AES-256-GCM database and disk encryption, field-level encryption for sensitive PII.
- Key management: KMS / HashiCorp Vault with 90-day automated rotation.

## 4. Environment Variable Dictionary
Comprehensive Markdown table detailing all required environment variables:
| Variable Name | Environment (Dev/Staging/Prod) | Sensitivity (Public/Secret) | Default / Example Value | Description |`;

    case 5:
      return `Generate "05_DEPLOYMENT_DEVOPS.md" for the system.

USER REQUIREMENTS:
"${userPrompt}"

${stackSummary}
${contextSummary}

Structure the document with the following mandatory sections:
# 05_DEPLOYMENT_DEVOPS.md: Infrastructure & Operations

## 1. Production Multi-Stage Dockerfile & docker-compose.yml
- Complete, copy-paste ready multi-stage \`Dockerfile\` optimizing for minimal image size, non-root user execution, and layer caching.
- Production-ready \`docker-compose.yml\` orchestrating the backend service, frontend, database, Redis cache, and reverse proxy with health checks, resource limits, and network isolation.

## 2. Production CI/CD Workflow (.github/workflows/deploy.yml)
- Full YAML file for GitHub Actions covering:
  - Linting & Static Code Analysis
  - Automated Unit & Integration Testing
  - Container Vulnerability Scanning (Trivy / Snyk)
  - Docker Container Build & Push to Registry
  - Automated Deployment to Staging & Production (Zero-Downtime Rolling / Blue-Green)

## 3. Infrastructure-as-Code (Terraform / Cloud Spec)
- Complete Terraform or CloudFormation / Kubernetes Manifest spec provisioning the cloud resources (VPC, Container Cluster, Managed Database, S3/Storage bucket, TLS Certificates).

## 4. Observability, Health Endpoints & Metrics
- Health check endpoints specification (\`/healthz\` liveness, \`/ready\` readiness) with dependency check logic.
- Structured JSON logging schema (level, trace_id, span_id, timestamp, service, message, latency_ms).
- Prometheus metrics hooks (HTTP request duration, error rate, active connections, queue depth).`;

    default:
      return `Generate production engineering specification for phase ${stageIndex}: ${userPrompt}`;
  }
}
