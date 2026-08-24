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
  let title = "Custom Software System";
  let shortName = "AppCore";

  if (uniqueConcepts.length >= 2) {
    title = `${cleanTitle(uniqueConcepts.slice(0, 3).join(" "))} System`;
    shortName = uniqueConcepts.slice(0, 2).join("");
  } else if (uniqueConcepts.length === 1) {
    title = `${cleanTitle(uniqueConcepts[0])} Enterprise Platform`;
    shortName = `${uniqueConcepts[0]}Core`;
  } else if (cleanPrompt.length > 3) {
    title = cleanPrompt.length < 50 ? cleanTitle(cleanPrompt) : "High-Performance Cloud Application";
    shortName = "CustomApp";
  }

  // Derive domain-specific entities directly from prompt concepts
  const coreEntities: string[] = [];
  uniqueConcepts.forEach((concept) => {
    if (concept && concept.length > 2) {
      coreEntities.push(concept);
    }
  });

  // Ensure minimum 5 rich entities
  if (coreEntities.length < 5) {
    const standardAdditions = ["UserProfile", "TransactionRecord", "AuditLog", "NotificationEvent", "WorkspaceTenant", "AnalyticsMetric"];
    standardAdditions.forEach((add) => {
      if (!coreEntities.includes(add) && coreEntities.length < 6) {
        coreEntities.push(add);
      }
    });
  }

  const primaryEntities = coreEntities.slice(0, 6);

  // Synthesize domain services
  const services: string[] = [
    `${primaryEntities[0] || "Core"} Orchestration Service`,
    `${primaryEntities[1] || "Data"} Processing Service`,
    `${primaryEntities[2] || "Event"} Ingestion Gateway`,
    "Real-Time WebSocket & Push Service",
    "Telemetry & Audit Logging Engine"
  ];

  // Synthesize primary domain actions
  const primaryActions: string[] = [
    `Create and configure new ${primaryEntities[0]}`,
    `Process real-time streaming data for ${primaryEntities[1] || "events"}`,
    `Validate state transition and dispatch ${primaryEntities[2] || "notifications"}`,
    `Execute high-concurrency batch query on ${primaryEntities[0]}`,
    "Monitor telemetry, system health, and audit trail"
  ];

  // Synthesize targeted user personas based on prompt
  const personas = [
    {
      role: `Primary Operator (${primaryEntities[0]} Lead)`,
      description: `Responsible for managing day-to-day operations and configurations within the ${title}.`,
      coreNeed: `Low-latency dashboard with live status updates and instant action execution for ${primaryEntities[0]}.`,
      painPoint: `Manual workflows, synchronization lag, and lack of real-time visibility.`
    },
    {
      role: `Field User / Client Consumer`,
      description: `End-user accessing ${title} across mobile and desktop interfaces.`,
      coreNeed: `Intuitive, responsive interface with sub-100ms response times and offline reliability.`,
      painPoint: `Complex navigation, broken forms, and delayed feedback during operations.`
    },
    {
      role: `Systems Integration Developer`,
      description: `Integrates external enterprise systems, IoT sensors, and third-party APIs with ${shortName}.`,
      coreNeed: `Strictly typed REST/GraphQL APIs, idempotent webhooks, and comprehensive OpenAPI 3.1 documentation.`,
      painPoint: `Undocumented breaking schema changes and intermittent rate-limit errors.`
    },
    {
      role: `Security & Compliance Officer`,
      description: `Audits access permissions, encryption policies, and data privacy safeguards.`,
      coreNeed: `Zero-trust RBAC enforcement, automated vulnerability patching, and immutable audit logs.`,
      painPoint: `Unrestricted API endpoints, credential leaks, and non-compliant PII handling.`
    }
  ];

  // Synthesize P0 & P1 Requirements directly reflecting user prompt
  const p0Requirements = [
    {
      id: "REQ-P0-01",
      title: `Core ${primaryEntities[0]} Lifecycle & State Machine`,
      desc: `Full CRUD management, validation, and lifecycle transitions for ${primaryEntities[0]} with atomic database transactions.`,
      acceptance: `Validates payloads with Zod schemas; persists state with <50ms p95 database write latency.`
    },
    {
      id: "REQ-P0-02",
      title: `Real-Time Data Ingestion & Event Stream for ${primaryEntities[1] || "Operations"}`,
      desc: `High-throughput asynchronous event ingestion stream handling continuous updates for ${primaryEntities[1] || "records"}.`,
      acceptance: `Ingests 10,000 events/sec via Redis Streams/Kafka with zero message drops and sub-20ms processing.`
    },
    {
      id: "REQ-P0-03",
      title: `Automated Dispatch & Notification Triggers for ${primaryEntities[2] || "Events"}`,
      desc: `Event-driven webhook and push notification subsystem triggering on state anomalies or completion events.`,
      acceptance: `Dispatches notifications to subscribed clients within 500ms of trigger condition.`
    },
    {
      id: "REQ-P0-04",
      title: `Zero-Trust Authentication & RBAC Permission Layer`,
      desc: `JWT/OAuth2 access control with refresh token rotation and role-based permissions on all endpoints.`,
      acceptance: `Rejects unauthorized requests with HTTP 401/403; verifies token signatures in <2ms.`
    }
  ];

  const p1Requirements = [
    {
      id: "REQ-P1-01",
      title: `Automated Health Monitoring & Telemetry Aggregation`,
      desc: `Prometheus metrics scraping, structured JSON logs, and distributed tracing across all microservices.`,
      acceptance: `Exposes /healthz, /ready, and /metrics endpoints; alerts on error rates >0.1%.`
    },
    {
      id: "REQ-P1-02",
      title: `High-Performance Search & Batch Export`,
      desc: `Full-text multi-criteria search and asynchronous CSV/JSON export for ${primaryEntities[0]} datasets.`,
      acceptance: `Returns search results in <80ms for 1,000,000 indexed records; generates exports in <5 seconds.`
    }
  ];

  const apiPrefix = `/api/v1/${primaryEntities[0].toLowerCase()}s`;

  const apiEndpoints = [
    {
      method: "POST",
      path: apiPrefix,
      desc: `Create and initialize new ${primaryEntities[0]}`,
      payload: JSON.stringify({ name: `${primaryEntities[0]} Record`, status: "active", config: { priority: "high" } }, null, 2),
      response: JSON.stringify({ status: "success", data: { id: "9f3a1b2c-8d7e-4f6a-5b4c-3d2e1a0f9e8d", status: "active", created_at: "2026-08-24T12:00:00Z" } }, null, 2)
    },
    {
      method: "GET",
      path: `${apiPrefix}?limit=20&status=active`,
      desc: `Query paginated list of ${primaryEntities[0]} records`,
      payload: "N/A (Query Parameters: limit, cursor, status)",
      response: JSON.stringify({ status: "success", data: [], pagination: { limit: 20, has_more: false, next_cursor: null } }, null, 2)
    },
    {
      method: "POST",
      path: `${apiPrefix}/:id/action`,
      desc: `Execute primary operation on ${primaryEntities[0]}`,
      payload: JSON.stringify({ action: "execute_step", parameters: { mode: "automated" } }, null, 2),
      response: JSON.stringify({ status: "success", result: "operation_completed", timestamp: "2026-08-24T12:00:01Z" }, null, 2)
    }
  ];

  const securityFocus = [
    { area: "Access Control (RBAC & IDOR)", mitigation: `Every query for ${primaryEntities[0]} enforces tenant boundary: WHERE id = :id AND tenant_id = :auth_tenant.` },
    { area: "In-Transit & At-Rest Encryption", mitigation: "TLS 1.3 enforced for all client-to-server traffic; AES-256-GCM for sensitive fields in database." },
    { area: "Injection Defense", mitigation: "Strict ORM parameterization with Zod schema validation on 100% of ingress endpoints." },
    { area: "DDoS & Rate Limiting", mitigation: "Token bucket distributed rate limiting (120 req/min per API key/IP) via Redis." }
  ];

  return {
    title,
    shortName,
    category: "Custom Spec-Driven Software System",
    userPromptRaw: cleanPrompt,
    extractedKeywords: uniqueConcepts,
    primaryEntities,
    primaryActions,
    services,
    apiPrefix,
    personas,
    p0Requirements,
    p1Requirements,
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
  const domain = extractDomainContext(userPrompt || "Custom Cloud Platform");

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
This specification suite defines the end-to-end architecture, technical implementation roadmap, quality assurance strategy, security hardening blueprint, and DevOps deployment model for **${d.title}** (${d.shortName}).

The system is engineered according to **${stack.architecture}**, utilizing **${stack.frontend}** for user interfaces, **${stack.backend}** for business logic, **${stack.database}** for persistence, and **${stack.caching}** for caching and distributed locks.

### 📋 Grounding User Requirements
> "${d.userPromptRaw}"

### 🔍 Extracted Domain Concepts
* **Primary Entities:** ${d.primaryEntities.join(", ")}
* **Target Services:** ${d.services.join(", ")}
* **Core Actions:** ${d.primaryActions.join("; ")}

---

## 2. User Persona Matrix

| Persona Role | Target Profile | Core Need | Key Friction Mitigated |
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
| **REQ-P2-01** | **Predictive AI Insights** | Automated anomaly detection and predictive analytics for ${d.primaryEntities[0]}. | Computes predictive metrics with <200ms query latency. |
| **REQ-P2-02** | **Multi-Region Disaster Recovery** | Cross-region continuous database replication. | Regional failover completes in <30 seconds with RPO=0. |

---

## 4. Non-Functional Requirements & SLAs

| Vector | Target SLA | Technical Enforcement |
| :--- | :--- | :--- |
| **Availability** | **99.99% Uptime** | Multi-AZ Kubernetes pod spreads, active health check probes. |
| **Read Latency** | **p95 < 80ms** | Multi-tier Redis caching, indexed B-Tree database queries. |
| **Write Latency** | **p95 < 150ms** | Async message queuing, connection pooling with PgBouncer. |
| **Throughput** | **10,000+ RPS** | Horizontal Pod Autoscaler (HPA) triggering on >70% CPU/Memory. |
| **Security** | **OWASP Top 10** | Parameterized SQL queries, WAF rate limiting, JWT RBAC guards. |
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

## 1. Architectural Overview & Rationale

| Layer | Selected Tech | Design Rationale & Trade-offs |
| :--- | :--- | :--- |
| **Frontend UI** | ${stack.frontend} | Server Components reduce client JS bundle; streaming SSR delivers fast initial paint. |
| **Backend API** | ${stack.backend} | High async I/O concurrency; strict type enforcement with schema validation. |
| **Database** | ${stack.database} | ACID transactional guarantees; indexed relational modeling for ${d.primaryEntities.join(", ")}. |
| **Cache & Locks** | ${stack.caching} | Sub-millisecond distributed caching, session state, and distributed mutex locks. |
| **Deployment** | ${stack.deployment} | Containerized zero-downtime rolling updates with declarative infrastructure. |

---

## 2. Visual System Topology

\`\`\`mermaid
flowchart TD
    subgraph Clients ["Client Applications"]
        WebClient["Web Browser App"]
        MobileClient["Mobile Native App"]
    end

    subgraph Ingress ["Edge & Security Ingress"]
        CDN["Global CDN / Edge Cache"]
        WAF["Web Application Firewall (WAF)"]
        ALB["Application Load Balancer"]
    end

    subgraph GatewayLayer ["API Gateway & Middleware"]
        APIGateway["API Gateway Reverse Proxy"]
        AuthGuard["JWT / RBAC Middleware"]
        RateLimiter["Distributed Token Bucket Limiter"]
    end

    subgraph ServiceMesh ["Core Microservices"]
        S1["${d.services[0]}"]
        S2["${d.services[1]}"]
        S3["${d.services[2]}"]
    end

    subgraph DataStorage ["Data & Cache Tier"]
        DBStore["Primary Database (PostgreSQL 16)"]
        CacheStore["Distributed Cache (Redis Cluster)"]
    end

    WebClient --> CDN
    MobileClient --> CDN
    CDN --> WAF
    WAF --> ALB
    ALB --> APIGateway
    APIGateway --> AuthGuard
    AuthGuard --> RateLimiter
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
  return `# 02_IMPLEMENTATION_PLAN.md: Engineering Roadmap & Milestones

## 1. Production Repository Monorepo Structure

\`\`\`text
${d.shortName.toLowerCase()}-root/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Lint, TypeCheck, Unit Tests
│       └── deploy.yml             # Docker build and Kubernetes deployment
├── docker/
│   ├── Dockerfile.production      # Multi-stage hardened production container
│   └── docker-compose.yml         # Local stack (DB, Redis, API)
├── src/
│   ├── app/                       # Next.js 14 App Router
│   │   ├── api/                   # REST API controllers
│   │   │   └── v1/
│   │   │       ├── auth/          # Authentication handlers
│   │   │       └── ${d.primaryEntities[0].toLowerCase()}s/      # ${d.primaryEntities[0]} domain endpoints
│   │   └── page.tsx               # Primary dashboard interface
│   ├── components/                # UI component library
│   │   ├── ui/                    # Base primitives
│   │   └── domain/                # ${d.shortName} domain components
│   ├── lib/
│   │   ├── db.ts                  # Database connection pool (Prisma)
│   │   ├── redis.ts               # Redis cache & locks
│   │   └── auth.ts                # Token verification
│   └── types/
│       └── index.ts               # Domain TypeScript interfaces
├── prisma/
│   └── schema.prisma              # Schema definitions for ${d.primaryEntities.join(", ")}
├── tests/
│   ├── unit/                      # Vitest unit test suites
│   ├── integration/               # API route integration tests
│   └── e2e/                       # Playwright E2E test suites
└── package.json
\`\`\`

---

## 2. Phased Engineering Tasks

### Phase 1: Foundation & Data Modeling (Sprint 1)
- [ ] Initialize repository with TypeScript, ESLint, and Tailwind CSS.
- [ ] Setup PostgreSQL 16 database and define Prisma schemas for \`${d.primaryEntities.join(", ")}\`.
- [ ] Implement JWT/OAuth 2.0 authentication routes with token rotation.
- [ ] Author database seed scripts with mock ${d.primaryEntities[0]} data.

### Phase 2: Core Domain Logic & REST APIs (Sprint 2)
- [ ] Build CRUD controllers for \`${d.apiPrefix}\`.
- [ ] Implement business logic for **${d.primaryActions[0]}** and **${d.primaryActions[1]}**.
- [ ] Integrate Redis cache-aside layer with 5-minute TTL on queries.
- [ ] Configure distributed lock mechanics on critical mutation workflows.

### Phase 3: Real-Time Telemetry & Event Dispatch (Sprint 3)
- [ ] Implement WebSocket / SSE streaming server for live updates.
- [ ] Implement event triggers for **${d.primaryActions[2]}**.
- [ ] Setup rate limiting (120 req/min) via Redis token bucket.
- [ ] Build administrative telemetry and audit logging endpoints.

### Phase 4: Quality Assurance, Security & Deployment (Sprint 4)
- [ ] Author unit tests achieving >85% code coverage across domain services.
- [ ] Author Playwright E2E master tests for end-to-end user workflows.
- [ ] Execute OWASP vulnerability audit and harden Docker configuration.
- [ ] Configure GitHub Actions CI/CD deploying to production cluster.
`;
}

// Stage 3: 03_TESTING_STRATEGY.md
function generateTestingStrategy(prompt: string, stack: TechStackPreferences, d: DomainContext): string {
  return `# 03_TESTING_STRATEGY.md: Quality Assurance & Test Automation Matrix

## 1. Test Pyramid & Target Coverage

| Test Type | Target Scope | Target Coverage | Tooling |
| :--- | :--- | :---: | :--- |
| **Unit Tests** | Domain models, validation schemas, business logic helpers. | **> 85%** | Vitest / Jest |
| **Integration Tests** | REST API endpoints, SQL transactions, cache invalidation. | **> 80%** | Supertest / Vitest |
| **End-to-End (E2E)** | Critical user journeys for ${d.primaryEntities[0]}. | **100% Core** | Playwright (Headless Chrome) |
| **Load Testing** | Concurrency bottlenecks under high load. | **10,000 RPS** | k6 / Artillery |

---

## 2. Playwright End-to-End (E2E) Master Test Script

\`\`\`typescript
import { test, expect } from "@playwright/test";

test.describe("${d.title} - Critical User Workflow", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to root application
    await page.goto("/");
  });

  test("TC-01: Successfully authenticate and navigate to workspace", async ({ page }) => {
    // Fill credentials
    await page.fill('[data-testid="input-email"]', "admin@${d.shortName.toLowerCase()}.io");
    await page.fill('[data-testid="input-password"]', "SecurePassword123!");
    await page.click('[data-testid="btn-submit"]');

    // Expect successful login
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('[data-testid="workspace-header"]')).toBeVisible();
  });

  test("TC-02: Execute primary workflow (${d.primaryActions[0]})", async ({ page }) => {
    await page.goto("/dashboard");

    // Click creation action
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
| **Super Admin** | Global Organization | \`*:*\` (Full system configuration, user provisioning, audit logs) |
| **${d.shortName} Manager** | Workspace Tenant | \`${d.shortName.toLowerCase()}:write\`, \`${d.shortName.toLowerCase()}:read\`, \`reports:export\` |
| **Standard Operator** | Assigned Domain | \`${d.shortName.toLowerCase()}:read\`, \`${d.shortName.toLowerCase()}:create\` |
| **Auditor / Read-Only** | Tenant Scope | \`*:read\` (Zero mutation permissions, audit logs read-only) |

---

## 2. OWASP Top 10 Mitigation Blueprint

| OWASP Vulnerability | Technical Defense-in-Depth Mitigation |
| :--- | :--- |
${d.securityFocus.map((s) => `| **${s.area}** | ${s.mitigation} |`).join("\n")}
| **Cryptographic Failures** | TLS 1.3 in transit; AES-256-GCM at rest; Argon2id for password hashing. |
| **Security Misconfiguration** | Hardened multi-stage Docker running as non-root user (\`appuser:10001\`). |

---

## 3. Environment Variable Dictionary

| Variable Name | Sensitivity | Description |
| :--- | :---: | :--- |
| \`NODE_ENV\` | Public | Runtime mode (\`production\` / \`development\`). |
| \`DATABASE_URL\` | **Secret** | PostgreSQL 16 connection string with TLS required. |
| \`REDIS_URL\` | **Secret** | Redis cluster connection string. |
| \`JWT_SECRET_KEY\` | **Secret** | 256-bit cryptographic key for signing user tokens. |
| \`ENCRYPTION_KEY_AES256\` | **Secret** | Master key for AES-256 field-level data encryption. |
`;
}

// Stage 5: 05_DEPLOYMENT_DEVOPS.md
function generateDeploymentDevops(prompt: string, stack: TechStackPreferences, d: DomainContext): string {
  return `# 05_DEPLOYMENT_DEVOPS.md: Infrastructure, CI/CD & Operations Blueprint

## 1. Multi-Stage Production Hardened Dockerfile

\`\`\`dockerfile
# ----------------------------------------------------
# Stage 1: Build & Dependencies
# ----------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit

COPY . .
RUN npm run build

# ----------------------------------------------------
# Stage 2: Minimal Hardened Production Runtime
# ----------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Create non-root system user for security hardening
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER appuser
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
\`\`\`

---

## 2. GitHub Actions CI/CD Pipeline (\`.github/workflows/deploy.yml\`)

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
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm test

  deploy:
    needs: validate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Container
        run: docker build -t ${d.shortName.toLowerCase()}:latest -f docker/Dockerfile.production .
      - name: Deploy to Production Cluster
        run: echo "Deployed ${d.shortName} container to Kubernetes cluster."
\`\`\`
`;
}
