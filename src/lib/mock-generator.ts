import { TechStackPreferences } from "./types";

export interface DomainContext {
  title: string;
  shortName: string;
  category: string;
  userPromptRaw: string;
  extractedKeywords: string[];
  primaryEntities: string[];
  primaryActions: string[];
  services: string[];
  apiPrefix: string;
  personas: { role: string; description: string; coreNeed: string; painPoint: string }[];
  p0Requirements: { id: string; title: string; desc: string; acceptance: string }[];
  p1Requirements: { id: string; title: string; desc: string; acceptance: string }[];
  p2Requirements: { id: string; title: string; desc: string; acceptance: string }[];
  apiEndpoints: { method: string; path: string; desc: string; payload: string; response: string }[];
  securityFocus: { area: string; mitigation: string }[];
}

function cleanPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");
}

function cleanTitle(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
  "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
  "can", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing",
  "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't",
  "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself",
  "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is",
  "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself",
  "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours",
  "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should",
  "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them",
  "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've",
  "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd",
  "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's",
  "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you",
  "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves", "build", "create",
  "make", "system", "app", "application", "platform", "tool", "website", "dashboard", "software",
  "want", "need", "like", "using", "use", "support", "features", "feature", "realtime", "real-time"
]);

export function extractDomainContext(prompt: string): DomainContext {
  const cleanPrompt = prompt.trim();
  const rawWords = cleanPrompt
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'<>]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const meaningfulWords = rawWords.filter(
    (w) => w.length > 2 && !STOP_WORDS.has(w.toLowerCase())
  );

  // Extract primary technical concepts from user prompt
  const uniqueConcepts = Array.from(new Set(meaningfulWords.map((w) => cleanPascalCase(w))));
  
  // Synthesize Project Title & Short Name
  let title = "Custom Cloud Application";
  let shortName = "AppCore";

  if (uniqueConcepts.length >= 2) {
    title = `${cleanTitle(uniqueConcepts.slice(0, 3).join(" "))} Platform`;
    shortName = uniqueConcepts.slice(0, 2).join("");
  } else if (uniqueConcepts.length === 1) {
    title = `${cleanTitle(uniqueConcepts[0])} Enterprise Suite`;
    shortName = `${uniqueConcepts[0]}Core`;
  } else if (cleanPrompt.length > 3) {
    title = cleanPrompt.length < 60 ? cleanTitle(cleanPrompt) : "High-Performance Cloud Application";
    shortName = "CustomApp";
  }

  // Derive domain-specific entities directly from prompt concepts
  const coreEntities: string[] = [];
  uniqueConcepts.forEach((concept) => {
    if (concept && concept.length > 2 && !coreEntities.includes(concept)) {
      coreEntities.push(concept);
    }
  });

  // Ensure minimum 5 rich entities
  const fallbackEntities = ["UserProfile", "TransactionRecord", "AuditLog", "NotificationEvent", "WorkspaceTenant", "AnalyticsMetric"];
  fallbackEntities.forEach((add) => {
    if (!coreEntities.includes(add) && coreEntities.length < 6) {
      coreEntities.push(add);
    }
  });

  const primaryEntities = coreEntities.slice(0, 6);

  // Synthesize domain microservices
  const services: string[] = [
    `${primaryEntities[0] || "Core"} Orchestration Service`,
    `${primaryEntities[1] || "Data"} Processing Engine`,
    `${primaryEntities[2] || "Event"} Ingestion Gateway`,
    "Real-Time Stream & Push Notification Cluster",
    "Telemetry, Metrics & Audit Logging Worker"
  ];

  // Synthesize primary domain actions
  const primaryActions: string[] = [
    `Create, validate, and persist ${primaryEntities[0]} records`,
    `Ingest and stream high-concurrency event telemetry for ${primaryEntities[1] || "transactions"}`,
    `Evaluate state transition rules and dispatch automated triggers for ${primaryEntities[2] || "events"}`,
    `Execute high-performance indexed queries on ${primaryEntities[0]} with sub-50ms latency`,
    "Enforce zero-trust authorization and emit immutable audit log entries"
  ];

  // Synthesize targeted user personas based on prompt
  const personas = [
    {
      role: `Principal Operations Lead (${primaryEntities[0]} Manager)`,
      description: `Primary administrative stakeholder responsible for orchestrating workflows, managing ${primaryEntities[0]} state transitions, and tracking platform metrics.`,
      coreNeed: `Real-time management dashboard with sub-second data refresh, automated error detection, and bulk workflow controls.`,
      painPoint: `Manual spreadsheet reconciliation, data synchronization lag across services, and lack of real-time operational visibility.`
    },
    {
      role: `End-User Consumer / Client Actor`,
      description: `Direct participant interacting with ${title} across mobile, web, and progressive interfaces.`,
      coreNeed: `Frictionless, responsive user experience with sub-100ms API response times and instant offline-ready mutations.`,
      painPoint: `Confusing navigation, validation errors without clear feedback, and latency during peak load.`
    },
    {
      role: `Systems Integration & API Engineer`,
      description: `Third-party developer connecting external enterprise software, IoT sensors, or third-party webhooks to ${shortName}.`,
      coreNeed: `Strictly typed OpenAPI 3.1 REST and gRPC endpoints, idempotent retry keys, and comprehensive SDK documentation.`,
      painPoint: `Undocumented breaking schema changes, unhandled rate-limit bursts, and opaque error envelopes.`
    },
    {
      role: `Security & Compliance Auditor`,
      description: `Governance officer auditing access controls, data sovereignty, encryption key rotation, and privacy standards.`,
      coreNeed: `Enforced zero-trust RBAC/ABAC policies, field-level AES-256-GCM encryption, and tamper-evident audit logs.`,
      painPoint: `Over-privileged API keys, unencrypted PII at rest, and lack of structured security event telemetry.`
    }
  ];

  // Synthesize P0, P1, P2 Requirements directly reflecting user prompt
  const p0Requirements = [
    {
      id: "REQ-P0-01",
      title: `Core ${primaryEntities[0]} Lifecycle & State Machine`,
      desc: `Full CRUD management, schema validation, and lifecycle state transitions for ${primaryEntities[0]} with atomic database transactions.`,
      acceptance: `Validates payloads with Zod/Pydantic schemas; persists state with <50ms p95 write latency; enforces unique constraint on identity fields.`
    },
    {
      id: "REQ-P0-02",
      title: `High-Throughput Ingestion & Stream Processing for ${primaryEntities[1] || "Events"}`,
      desc: `Asynchronous event stream processing for continuous updates to ${primaryEntities[1] || "records"} using distributed message brokers.`,
      acceptance: `Ingests 10,000 events/sec via distributed message bus with zero message loss; delivers event payloads to consumers in <20ms.`
    },
    {
      id: "REQ-P0-03",
      title: `Automated Workflow Triggers & Notification Dispatch for ${primaryEntities[2] || "Alerts"}`,
      desc: `Event-driven webhook and push notification subsystem executing on state anomalies, SLA thresholds, or completion events.`,
      acceptance: `Dispatches signed webhooks and WebSocket notifications within 300ms of trigger condition; implements exponential backoff retry.`
    },
    {
      id: "REQ-P0-04",
      title: `Zero-Trust Authentication & RBAC Authorization Engine`,
      desc: `JWT/OAuth 2.0 access control supporting RS256 token verification, refresh token rotation, and granular role permissions on all endpoints.`,
      acceptance: `Rejects unauthorized requests with RFC 7807 formatted HTTP 401/403 responses; verifies asymmetric token signatures in <2ms.`
    }
  ];

  const p1Requirements = [
    {
      id: "REQ-P1-01",
      title: `Observability, Prometheus Metrics & Distributed Tracing`,
      desc: `Structured JSON logging, Prometheus metric scraping (/metrics), and OpenTelemetry distributed tracing across all microservices.`,
      acceptance: `Exposes /healthz, /ready, and /metrics endpoints; records p50/p95/p99 request duration; alerts on error rates >0.1%.`
    },
    {
      id: "REQ-P1-02",
      title: `High-Performance Indexed Search & Asynchronous Batch Export`,
      desc: `Multi-criteria search filtering with B-Tree indexes and asynchronous background export (CSV/JSON) for ${primaryEntities[0]} datasets.`,
      acceptance: `Returns paginated search results in <60ms over 1,000,000 indexed records; generates signed downloadable export URLs in <5 seconds.`
    }
  ];

  const p2Requirements = [
    {
      id: "REQ-P2-01",
      title: `AI Copilot & Predictive Anomaly Detection`,
      desc: `Machine learning anomaly detection pipeline forecasting operational anomalies for ${primaryEntities[0]}.`,
      acceptance: `Executes sub-200ms vector inference queries; delivers automated recommendations with human review gates.`
    },
    {
      id: "REQ-P2-02",
      title: `Active-Active Multi-Region High Availability`,
      desc: `Cross-region continuous database replication and global traffic routing for automated disaster recovery.`,
      acceptance: `Regional failover completes in <30 seconds with Recovery Point Objective (RPO) = 0.`
    }
  ];

  const apiPrefix = `/api/v1/${primaryEntities[0].toLowerCase()}s`;

  const apiEndpoints = [
    {
      method: "POST",
      path: apiPrefix,
      desc: `Create and initialize a new ${primaryEntities[0]} entity`,
      payload: JSON.stringify({
        name: `${primaryEntities[0]} Master Record`,
        status: "active",
        metadata: {
          tier: "enterprise",
          priority: 1
        }
      }, null, 2),
      response: JSON.stringify({
        status: "success",
        data: {
          id: "9f3a1b2c-8d7e-4f6a-5b4c-3d2e1a0f9e8d",
          name: `${primaryEntities[0]} Master Record`,
          status: "active",
          created_at: "2026-09-01T10:00:00Z",
          updated_at: "2026-09-01T10:00:00Z"
        }
      }, null, 2)
    },
    {
      method: "GET",
      path: `${apiPrefix}?limit=20&cursor=eyJpZCI6MTAwfQ==`,
      desc: `Query paginated list of ${primaryEntities[0]} records with cursor pagination`,
      payload: "N/A (Query Parameters: limit=20, cursor, status=active, sort=desc)",
      response: JSON.stringify({
        status: "success",
        data: [
          {
            id: "9f3a1b2c-8d7e-4f6a-5b4c-3d2e1a0f9e8d",
            name: `${primaryEntities[0]} Master Record`,
            status: "active",
            created_at: "2026-09-01T10:00:00Z"
          }
        ],
        pagination: {
          limit: 20,
          has_more: false,
          next_cursor: null,
          total_count: 1
        }
      }, null, 2)
    },
    {
      method: "PUT",
      path: `${apiPrefix}/:id`,
      desc: `Update mutable attributes and state of an existing ${primaryEntities[0]}`,
      payload: JSON.stringify({
        status: "processing",
        metadata: {
          last_reviewed_by: "operator_admin"
        }
      }, null, 2),
      response: JSON.stringify({
        status: "success",
        data: {
          id: "9f3a1b2c-8d7e-4f6a-5b4c-3d2e1a0f9e8d",
          status: "processing",
          updated_at: "2026-09-01T10:05:00Z"
        }
      }, null, 2)
    },
    {
      method: "POST",
      path: `${apiPrefix}/:id/execute`,
      desc: `Trigger primary domain action on ${primaryEntities[0]}`,
      payload: JSON.stringify({
        action: "dispatch_workflow",
        parameters: {
          notify_webhook: true,
          mode: "realtime"
        }
      }, null, 2),
      response: JSON.stringify({
        status: "success",
        job_id: "job_88a9f02b-11c4-4e78-90b1",
        state: "queued",
        estimated_duration_ms: 120
      }, null, 2)
    }
  ];

  const securityFocus = [
    { area: "Access Control & IDOR Defense", mitigation: `Every database query for ${primaryEntities[0]} enforces multi-tenant boundary predicates: WHERE id = :id AND tenant_id = :auth_tenant_id.` },
    { area: "Cryptographic Protocols", mitigation: "Enforces TLS 1.3 in transit with Perfect Forward Secrecy; sensitive field-level persistence encrypted with AES-256-GCM via KMS." },
    { area: "Input Sanitization & Injection", mitigation: "Strict type coercion and parameterization using ORM/Zod schemas on 100% of API endpoints; prevents SQL/NoSQL injection." },
    { area: "DDoS Mitigation & Rate Limiting", mitigation: "Distributed token bucket rate limiting (120 req/min per IP/API key) enforced at ingress API Gateway layer." }
  ];

  return {
    title,
    shortName,
    category: "Principal Spec-Driven Architecture",
    userPromptRaw: cleanPrompt,
    extractedKeywords: uniqueConcepts,
    primaryEntities,
    primaryActions,
    services,
    apiPrefix,
    personas,
    p0Requirements,
    p1Requirements,
    p2Requirements,
    apiEndpoints,
    securityFocus
  };
}

export function generateMockStageContent(
  stageIndex: number,
  userPrompt: string,
  techStack: TechStackPreferences,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  accumulatedContext: Record<string, string>
): string {
  const domain = extractDomainContext(userPrompt || "Enterprise Cloud Platform");

  switch (stageIndex) {
    case 0:
      return generateProjectBrief(userPrompt, techStack, domain);
    case 1:
      return generateSystemArchitecture(userPrompt, techStack, domain);
    case 2:
      return generateImplementationPlan(userPrompt, techStack, domain);
    case 3:
      return generateTestingStrategy(userPrompt, techStack, domain);
    case 4:
      return generateSecurityCompliance(userPrompt, techStack, domain);
    case 5:
      return generateDeploymentDevops(userPrompt, techStack, domain);
    default:
      return `# Specification Document\n\nGenerated for ${domain.title}.`;
  }
}

// Stage 0: 00_PROJECT_BRIEF.md
function generateProjectBrief(prompt: string, stack: TechStackPreferences, d: DomainContext): string {
  return `# 00_PROJECT_BRIEF.md: Requirements Scope & Persona Matrix

## Project Title
**${d.title}**

---

## 1. Executive Summary & Objective
This master engineering specification defines the architecture, data models, API contracts, testing matrix, security blueprint, and DevOps deployment pipeline for **${d.title}** (${d.shortName}).

The platform is designed to provide high-concurrency, enterprise-grade availability engineered according to **${stack.architecture}**, leveraging:
* **Frontend Layer:** ${stack.frontend}
* **Backend Core:** ${stack.backend}
* **Persistence & Storage:** ${stack.database}
* **Caching & Message Broker:** ${stack.caching}
* **Deployment & Orchestration:** ${stack.deployment}
* **Authentication & Identity:** ${stack.auth}

### 📋 Grounding User Requirements
> "${d.userPromptRaw}"

### 🔍 Extracted Domain Concepts
* **Primary Domain Entities:** ${d.primaryEntities.join(", ")}
* **Core Microservices:** ${d.services.join(", ")}
* **Primary Operations:** ${d.primaryActions.join("; ")}

---

## 2. Stakeholder & User Persona Matrix

| Persona Role | Target Profile | Core Functional Need | Critical Friction Mitigated |
| :--- | :--- | :--- | :--- |
${d.personas.map((p) => `| **${p.role}** | ${p.description} | ${p.coreNeed} | ${p.painPoint} |`).join("\n")}

---

## 3. Functional Requirements Matrix (P0 / P1 / P2)

### 3.1 P0 (Must Have - MVP Critical Path)
| ID | Requirement Name | Description | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
${d.p0Requirements.map((r) => `| **${r.id}** | **${r.title}** | ${r.desc} | ${r.acceptance} |`).join("\n")}

### 3.2 P1 (High Priority - Production Hardening)
| ID | Requirement Name | Description | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
${d.p1Requirements.map((r) => `| **${r.id}** | **${r.title}** | ${r.desc} | ${r.acceptance} |`).join("\n")}

### 3.3 P2 (Nice-to-Have - Future Enhancements)
| ID | Requirement Name | Description | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
${d.p2Requirements.map((r) => `| **${r.id}** | **${r.title}** | ${r.desc} | ${r.acceptance} |`).join("\n")}

---

## 4. Non-Functional Requirements & Engineering SLAs

| SLA Vector | Target Metric | Technical Enforcement & Verification |
| :--- | :--- | :--- |
| **Availability** | **99.99% Uptime** | Automated multi-region health checks, zero-downtime rolling updates. |
| **Read Latency** | **p95 < 80ms** | Multi-tier caching via ${stack.caching}, indexed database queries. |
| **Write Latency** | **p95 < 150ms** | Asynchronous queuing, database connection pooling. |
| **Throughput** | **10,000+ RPS** | Horizontal pod autoscaling on ${stack.deployment} based on CPU/Memory load. |
| **Security** | **OWASP Top 10** | Zero-trust authentication via ${stack.auth}, TLS 1.3, AES-256 at rest. |
| **Disaster Recovery** | **RTO < 5m, RPO = 0** | Continuous WAL / snapshot replication to object storage. |
`;
}

// Stage 1: 01_SYSTEM_ARCHITECTURE.md
function generateSystemArchitecture(prompt: string, stack: TechStackPreferences, d: DomainContext): string {
  const e1 = cleanPascalCase(d.primaryEntities[0] || "User");
  const e2 = cleanPascalCase(d.primaryEntities[1] || "Record");
  const e3 = cleanPascalCase(d.primaryEntities[2] || "Event");
  const e4 = cleanPascalCase(d.primaryEntities[3] || "Task");
  const e5 = cleanPascalCase(d.primaryEntities[4] || "Audit");

  return `# 01_SYSTEM_ARCHITECTURE.md: Topology & Schema Blueprint

## 1. Architectural Overview & Stack Selection

| Layer | Selected Technology | Architectural Rationale & Trade-offs |
| :--- | :--- | :--- |
| **Frontend UI** | ${stack.frontend} | Tailored for responsiveness, low bundle overhead, and native platform UX. |
| **Backend Core** | ${stack.backend} | Selected for high async throughput, strict type safety, and domain encapsulation. |
| **Database** | ${stack.database} | Relational ACID guarantees and specialized indexing for ${d.primaryEntities.join(", ")}. |
| **Cache & Bus** | ${stack.caching} | Sub-millisecond distributed caching, session state, and message brokering. |
| **Auth & Identity** | ${stack.auth} | Enforces token verification, role-based access, and cryptographic integrity. |
| **Infrastructure** | ${stack.deployment} | Declarative orchestration, automated scaling, and production reliability. |

---

## 2. Visual System Topology

\`\`\`mermaid
flowchart TD
    subgraph Clients ["Client Applications"]
        AppClient["${stack.frontend.split("+")[0].trim()}"]
    end

    subgraph Ingress ["Edge & Security Ingress Layer"]
        CDN["Global CDN / Edge Gateway"]
        WAF["Web Application Firewall (WAF)"]
        ALB["Load Balancer & SSL Termination"]
    end

    subgraph GatewayLayer ["API Gateway & Middleware"]
        APIGateway["API Gateway (${stack.auth.split("/")[0].trim()} Guard)"]
        RateLimiter["Distributed Token Bucket Rate Limiter"]
    end

    subgraph ServiceMesh ["Core Services (${stack.backend.split("/")[0].trim()})"]
        S1["${d.services[0]}"]
        S2["${d.services[1]}"]
        S3["${d.services[2]}"]
    end

    subgraph DataStorage ["Data & Cache Tier"]
        DBStore["${stack.database}"]
        CacheStore["${stack.caching}"]
    end

    AppClient --> CDN
    CDN --> WAF
    WAF --> ALB
    ALB --> APIGateway
    APIGateway --> RateLimiter
    RateLimiter --> S1
    RateLimiter --> S2
    RateLimiter --> S3
    S1 --> DBStore
    S2 --> DBStore
    S1 --> CacheStore
    S2 --> CacheStore
\`\`\`

---

## 3. Database Schema & Entity Relationship Diagram (ERD)

\`\`\`mermaid
erDiagram
    ${e1} ||--o{ ${e2} : manages
    ${e2} ||--o{ ${e3} : generates
    ${e3} ||--o{ ${e4} : updates
    ${e1} ||--o{ ${e5} : logs

    ${e1} {
        uuid id PK
        string email UK
        string full_name
        string role
        boolean is_active
        timestamp created_at
    }

    ${e2} {
        uuid id PK
        uuid owner_id FK
        string name
        string status
        jsonb metadata
        timestamp created_at
    }

    ${e3} {
        uuid id PK
        uuid parent_id FK
        string event_type
        jsonb payload
        timestamp created_at
    }

    ${e4} {
        uuid id PK
        uuid item_id FK
        string status
        timestamp updated_at
    }

    ${e5} {
        uuid id PK
        uuid actor_id FK
        string action
        timestamp created_at
    }
\`\`\`

---

## 4. RESTful API Contracts (OpenAPI 3.1)

${d.apiEndpoints.map((ep, idx) => `### 4.${idx + 1} ${ep.desc}
\`\`\`http
${ep.method} ${ep.path}
Content-Type: application/json
Authorization: Bearer <jwt_access_token>

${ep.payload}
\`\`\`

**Response (200 / 201):**
\`\`\`json
${ep.response}
\`\`\`
`).join("\n---\n\n")}
`;
}

// Stage 2: 02_IMPLEMENTATION_PLAN.md
function generateImplementationPlan(prompt: string, stack: TechStackPreferences, d: DomainContext): string {
  const isPython = stack.backend.toLowerCase().includes("python") || stack.backend.toLowerCase().includes("fastapi");
  const isRust = stack.backend.toLowerCase().includes("rust");
  const isGo = stack.backend.toLowerCase().includes("go");

  const configFile = isPython ? "pyproject.toml" : isRust ? "Cargo.toml" : isGo ? "go.mod" : "package.json";
  const mainEntry = isPython ? "app/main.py" : isRust ? "src/main.rs" : isGo ? "cmd/server/main.go" : "src/app/page.tsx";

  return `# 02_IMPLEMENTATION_PLAN.md: Engineering Roadmap & Milestones

## 1. Target Repository Monorepo Architecture

\`\`\`text
${d.shortName.toLowerCase()}-monorepo/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Lint, TypeCheck, Unit & Integration Tests
│       └── deploy.yml             # Container build and deployment pipeline
├── docker/
│   ├── Dockerfile                 # Hardened production container for ${stack.backend.split("/")[0].trim()}
│   └── docker-compose.yml         # Local stack (${stack.database.split("+")[0].trim()}, ${stack.caching.split("+")[0].trim()})
├── src/
│   ├── api/                       # REST & RPC controllers
│   │   ├── auth/                  # ${stack.auth} integration
│   │   └── ${d.primaryEntities[0].toLowerCase()}s/      # Domain endpoints
│   └── ${mainEntry}
├── tests/
│   ├── unit/                      # Unit test suites
│   ├── integration/               # API integration tests
│   └── e2e/                       # Master end-to-end test suites
├── ${configFile}
└── README.md
\`\`\`

---

## 2. Phased Engineering Milestones

### Milestone 1: Environment Setup & Data Layer (Sprint 1)
- [ ] Initialize repository with \`${configFile}\` and configured linting/formatting rules.
- [ ] Provision **${stack.database}** and establish initial database schemas for \`${d.primaryEntities.join(", ")}\`.
- [ ] Implement **${stack.auth}** security handlers with asymmetric token validation.
- [ ] Author automated database migration scripts and test fixtures.

### Milestone 2: Core Domain Logic & API Implementation (Sprint 2)
- [ ] Build high-throughput controllers under \`${d.apiPrefix}\` using **${stack.backend}**.
- [ ] Implement business logic rules for **${d.primaryActions[0]}** and **${d.primaryActions[1]}**.
- [ ] Integrate **${stack.caching}** caching and distributed locks to prevent race conditions.
- [ ] Author comprehensive OpenAPI 3.1 specifications and schema documentation.

### Milestone 3: Real-Time Telemetry & Event Subsystems (Sprint 3)
- [ ] Implement real-time streaming pipeline for live updates and notifications.
- [ ] Implement event triggers and automated handlers for **${d.primaryActions[2]}**.
- [ ] Configure distributed rate limiting (120 req/min) at the API gateway layer.
- [ ] Expose Prometheus metrics (\`/metrics\`) and health probes (\`/healthz\`, \`/ready\`).

### Milestone 4: QA, Security Hardening & Deployment (Sprint 4)
- [ ] Author test suites achieving >85% code coverage across domain services.
- [ ] Conduct vulnerability audit, container hardening, and secret scanning.
- [ ] Author declarative deployment manifests for **${stack.deployment}**.
- [ ] Configure GitHub Actions CI/CD deploying to staging and production environments.
`;
}

// Stage 3: 03_TESTING_STRATEGY.md
function generateTestingStrategy(prompt: string, stack: TechStackPreferences, d: DomainContext): string {
  const isPython = stack.backend.toLowerCase().includes("python") || stack.backend.toLowerCase().includes("fastapi");
  const isRust = stack.backend.toLowerCase().includes("rust");
  const isGo = stack.backend.toLowerCase().includes("go");

  const testFramework = isPython ? "pytest + pytest-asyncio" : isRust ? "cargo test" : isGo ? "go test ./..." : "Vitest + Playwright";

  return `# 03_TESTING_STRATEGY.md: Quality Assurance & Test Automation Matrix

## 1. Test Pyramid & Target Coverage Commitments

| Test Tier | Scope & Focus | Target Coverage | Framework & Tooling |
| :--- | :--- | :---: | :--- |
| **Unit Tests** | Domain models, business logic functions, validation schemas. | **> 85%** | ${testFramework} |
| **Integration Tests** | REST API endpoints, transactions in ${stack.database.split("+")[0].trim()}, cache operations. | **> 80%** | Integration Test Runner |
| **End-to-End (E2E)** | Critical user workflows for ${d.primaryEntities[0]}. | **100% Core** | Playwright / Headless Browser |
| **Load Testing** | Concurrency bottlenecks under peak traffic. | **10,000 RPS** | k6 / Artillery |

---

## 2. Master Test Suite Specification

\`\`\`typescript
import { test, expect } from "@playwright/test";

test.describe("${d.title} - Critical User Workflow", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to root application
    await page.goto("/");
  });

  test("TC-01: Successfully authenticate with ${stack.auth.split("/")[0].trim()}", async ({ page }) => {
    await page.fill('[data-testid="input-email"]', "admin@${d.shortName.toLowerCase()}.io");
    await page.fill('[data-testid="input-password"]', "SecurePassword123!");
    await page.click('[data-testid="btn-submit"]');

    // Expect successful login
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('[data-testid="workspace-header"]')).toBeVisible();
  });

  test("TC-02: Execute primary workflow (${d.primaryActions[0]})", async ({ page }) => {
    await page.goto("/dashboard");

    // Trigger creation action
    await page.click('[data-testid="btn-create-${d.primaryEntities[0].toLowerCase()}"]');
    await page.fill('[data-testid="input-name"]', "Test ${d.primaryEntities[0]} Production Record");
    await page.click('[data-testid="btn-save"]');

    // Verify success toast and table entry
    await expect(page.locator('[data-testid="toast-success"]')).toBeVisible();
    await expect(page.locator('[data-testid="data-table"]')).toContainText("Test ${d.primaryEntities[0]} Production Record");
  });
});
\`\`\`
`;
}

// Stage 4: 04_SECURITY_COMPLIANCE.md
function generateSecurityCompliance(prompt: string, stack: TechStackPreferences, d: DomainContext): string {
  return `# 04_SECURITY_COMPLIANCE.md: Security Architecture & OWASP Blueprint

## 1. Role-Based Access Control (RBAC) Permission Matrix

| Role | Scope | Permissions Granted |
| :--- | :--- | :--- |
| **Super Admin** | Global Organization | \`*:*\` (Full system configuration, user provisioning, billing, audit logs) |
| **${d.shortName} Manager** | Workspace Tenant | \`${d.shortName.toLowerCase()}:write\`, \`${d.shortName.toLowerCase()}:read\`, \`reports:export\` |
| **Standard Operator** | Assigned Domain | \`${d.shortName.toLowerCase()}:read\`, \`${d.shortName.toLowerCase()}:create\` |
| **Auditor / Read-Only** | Tenant Scope | \`*:read\` (Zero mutation permissions, audit logs read-only) |

---

## 2. OWASP Top 10 Mitigation Blueprint

| OWASP Vulnerability | Technical Defense-in-Depth Mitigation |
| :--- | :--- |
${d.securityFocus.map((s) => `| **${s.area}** | ${s.mitigation} |`).join("\n")}
| **Cryptographic Failures** | TLS 1.3 enforced in transit; AES-256-GCM at rest; secure token signing via ${stack.auth}. |
| **Security Misconfiguration** | Hardened container running as non-root user (\`appuser:10001\`) on ${stack.deployment}. |

---

## 3. Environment Variable Dictionary

| Variable Name | Sensitivity | Description |
| :--- | :---: | :--- |
| \`APP_ENV\` | Public | Runtime environment mode (\`production\` / \`staging\` / \`development\`). |
| \`DATABASE_URL\` | **Secret** | Connection string for ${stack.database} with TLS required. |
| \`REDIS_URL\` | **Secret** | Connection string for ${stack.caching}. |
| \`AUTH_SECRET_KEY\` | **Secret** | Cryptographic key for signing and verifying ${stack.auth} tokens. |
| \`MASTER_ENCRYPTION_KEY\` | **Secret** | 256-bit master key for field-level data encryption at rest. |
`;
}

// Stage 5: 05_DEPLOYMENT_DEVOPS.md
function generateDeploymentDevops(prompt: string, stack: TechStackPreferences, d: DomainContext): string {
  const isPython = stack.backend.toLowerCase().includes("python") || stack.backend.toLowerCase().includes("fastapi");
  const isRust = stack.backend.toLowerCase().includes("rust");
  const isGo = stack.backend.toLowerCase().includes("go");

  let dockerfileSnippet = "";
  if (isPython) {
    dockerfileSnippet = `FROM python:3.11-slim AS runner
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]`;
  } else if (isRust) {
    dockerfileSnippet = `FROM rust:1.75-alpine AS builder
WORKDIR /app
COPY Cargo.* ./
COPY src ./src
RUN cargo build --release

FROM alpine:3.19 AS runner
WORKDIR /app
COPY --from=builder /app/target/release/${d.shortName.toLowerCase()} ./app
EXPOSE 8080
CMD ["./app"]`;
  } else if (isGo) {
    dockerfileSnippet = `FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.* ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o server ./cmd/server

FROM alpine:3.19 AS runner
WORKDIR /app
COPY --from=builder /app/server ./server
EXPOSE 8080
CMD ["./server"]`;
  } else {
    dockerfileSnippet = `FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]`;
  }

  return `# 05_DEPLOYMENT_DEVOPS.md: Infrastructure, CI/CD & Operations Blueprint

## 1. Hardened Production Dockerfile

\`\`\`dockerfile
${dockerfileSnippet}
\`\`\`

---

## 2. Infrastructure & Orchestration (${stack.deployment})

\`\`\`yaml
version: "3.8"

services:
  app:
    build: .
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - APP_ENV=production
      - DATABASE_URL=postgres://user:password@db:5432/${d.shortName.toLowerCase()}
      - CACHE_URL=redis://cache:6379
    depends_on:
      - db
      - cache

  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${d.shortName.toLowerCase()}
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - pgdata:/var/lib/postgresql/data

  cache:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redisdata:/data

volumes:
  pgdata:
  redisdata:
\`\`\`

---

## 3. GitHub Actions CI/CD Pipeline (\`.github/workflows/deploy.yml\`)

\`\`\`yaml
name: Production CI/CD Pipeline

on:
  push:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Automated Test Suites
        run: echo "Running automated lint and unit test suites..."

  deploy:
    needs: validate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build & Deploy Container to ${stack.deployment}
        run: echo "Deploying ${d.shortName} to ${stack.deployment}..."
\`\`\`
`;
}
