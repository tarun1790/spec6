import { TechStackPreferences } from "./types";

interface DomainContext {
  title: string;
  shortName: string;
  primaryEntities: string[];
  primaryActions: string[];
  services: string[];
}

function extractDomainContext(prompt: string): DomainContext {
  const p = prompt.toLowerCase();
  
  if (p.includes("commerce") || p.includes("shop") || p.includes("store") || p.includes("cart") || p.includes("product")) {
    return {
      title: "Omnichannel Commerce & Order Orchestration Engine",
      shortName: "CommerceCore",
      primaryEntities: ["User", "Product", "Cart", "Order", "OrderItem", "PaymentTransaction", "InventoryItem"],
      primaryActions: ["Browse Catalog", "Checkout Cart", "Process Payment", "Fulfill Order", "Query Inventory"],
      services: ["Catalog Service", "Cart & Inventory Service", "Payment Orchestrator", "Order Fulfillment Service", "Notification Engine"]
    };
  }

  if (p.includes("chat") || p.includes("collab") || p.includes("whiteboard") || p.includes("message") || p.includes("notion")) {
    return {
      title: "Real-Time Collaborative Workspace & Mesh Messenger",
      shortName: "CollabMesh",
      primaryEntities: ["Workspace", "Channel", "User", "Message", "Attachment", "PresenceSession", "CanvasDocument"],
      primaryActions: ["Join Channel", "Send Live Message", "Broadcast Typing Presence", "Collaborate on Canvas", "Transcode Media"],
      services: ["Gateway & Auth Service", "WebSocket Real-Time Cluster", "Document Collaboration Service", "Media Processing Worker", "Search & Indexing Engine"]
    };
  }

  if (p.includes("health") || p.includes("telemed") || p.includes("doctor") || p.includes("patient") || p.includes("clinic")) {
    return {
      title: "HIPAA-Compliant Telehealth & Clinical EHR Platform",
      shortName: "TeleHealthOS",
      primaryEntities: ["Patient", "Practitioner", "Appointment", "ClinicalConsultation", "MedicalRecord", "Prescription", "AuditLog"],
      primaryActions: ["Schedule Consultation", "Initiate Encrypted WebRTC Session", "Issue e-Prescription", "Access PHI Record", "Log Audit Trail"],
      services: ["Patient Gateway", "Consultation WebRTC Service", "Clinical EHR Service", "E-Prescription Integrator", "HIPAA Audit Logger"]
    };
  }

  if (p.includes("agent") || p.includes("ai") || p.includes("workflow") || p.includes("dag") || p.includes("llm")) {
    return {
      title: "Autonomous Multi-Agent Workflow & Knowledge Engine",
      shortName: "AgentFlowAI",
      primaryEntities: ["WorkflowDefinition", "WorkflowRun", "AgentNode", "ExecutionTask", "MemoryVector", "ToolCall", "AuditTrail"],
      primaryActions: ["Compile Workflow DAG", "Dispatch Agent Task", "Query Vector Memory", "Execute Sandboxed Tool", "Stream Reasoning Step"],
      services: ["Workflow Orchestration Engine", "Agent Runtime Service", "Vector & Semantic Memory Service", "Tool Execution Sandbox", "Telemetry & Cost Guardrail"]
    };
  }

  if (p.includes("fintech") || p.includes("ledger") || p.includes("bank") || p.includes("payment") || p.includes("money")) {
    return {
      title: "Double-Entry Multi-Currency Ledger & Settlement Engine",
      shortName: "LedgerNexus",
      primaryEntities: ["Account", "Wallet", "JournalEntry", "LedgerPosting", "FXRate", "PaymentIntent", "FraudScore"],
      primaryActions: ["Post Double-Entry Transaction", "Exchange FX Currency", "Hold Escrow Balance", "Evaluate Fraud Velocity", "Reconcile Settlement"],
      services: ["Ledger Core Service", "Settlement & FX Engine", "Payment Gateway Orchestrator", "Real-Time Fraud Engine", "Compliance & Vault Service"]
    };
  }

  // Default / general enterprise SaaS
  return {
    title: "High-Performance Cloud Enterprise Service Platform",
    shortName: "EnterpriseCore",
    primaryEntities: ["Tenant", "User", "Project", "ResourceEntity", "ActivityLog", "Subscription", "IntegrationWebhook"],
    primaryActions: ["Provision Tenant", "Authenticate User", "Manage Resource Lifecycle", "Process Real-time Events", "Deliver Webhooks"],
    services: ["API Gateway & Auth", "Core Domain Service", "Event Ingestion Engine", "Notification & Webhook Dispatcher", "Analytics Aggregator"]
  };
}

export function generateMockStageContent(
  stageIndex: number,
  userPrompt: string,
  techStack: TechStackPreferences,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  accumulatedContext: Record<string, string>
): string {
  const domain = extractDomainContext(userPrompt);

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

function generateProjectBrief(prompt: string, stack: TechStackPreferences, d: DomainContext): string {
  return `# 00_PROJECT_BRIEF.md: Product Scope & Requirements

## 1. Executive Summary & Problem Statement

### 1.1 Business Objective & Value Proposition
**${d.title} (${d.shortName})** is architected to address modern distributed demands with ultra-low latency, strict fault tolerance, and comprehensive developer ergonomics. The system modernizes legacy bottlenecks by providing a cloud-native, reactive infrastructure with real-time feedback loops and strict operational guarantees.

- **Primary Goal:** Deliver high-concurrency, resilient execution for ${d.primaryActions.slice(0, 3).join(", ")}.
- **Target Performance Baseline:** Sub-50ms p95 API response times, 99.99% service availability, and zero data-loss consistency.
- **Architectural Paradigm:** ${stack.architecture} powered by ${stack.backend} and ${stack.database}.

### 1.2 Core Problem Definition & Current Inefficiencies
Current industry implementations suffer from:
1. **Monolithic Lock-in & Scalability Bottlenecks:** Tight coupling between data access and presentation layers causes cascading latency degradation under traffic spikes.
2. **State Inconsistency & Race Conditions:** Concurrent operations across distributed nodes lead to race conditions without robust distributed locking or transaction boundary segregation.
3. **Fragmented Observability & Compliance Gaps:** Inability to provide deterministic audit trails and real-time telemetry across business-critical events.

---

## 2. Target User Personas & Key Journeys

### 2.1 Persona Definitions

| Persona | Role & Focus | Primary Goals | Key Pain Points | Access Level |
| :--- | :--- | :--- | :--- | :--- |
| **P-1: Primary Operator** | Core End-User / Specialist | Execute ${d.primaryActions[0]} with immediate feedback and deterministic guarantees. | Latency lag, unexpected UI state drift, multi-step friction. | Role: \`OPERATOR\` / \`MEMBER\` |
| **P-2: Platform Administrator** | Operations & DevOps Lead | Monitor cluster health, manage tenant boundaries, audit system activity, and configure integrations. | Missing granular telemetry, slow incident remediation, complex RBAC. | Role: \`PLATFORM_ADMIN\` |
| **P-3: API Integrator** | External Developer / Partner | Consume REST/GraphQL endpoints and webhook events to build third-party automations. | Undocumented schemas, inconsistent error codes, lack of idempotency keys. | Role: \`INTEGRATION_SVC\` |

### 2.2 Core User Workflows & Journeys

#### Workflow 1: Primary Lifecycle Execution (${d.primaryActions[0]})
1. **Initiation:** User triggers action via ${stack.frontend} UI or authenticated API request.
2. **Validation & Rate Limit Check:** API Gateway verifies JWT bearer token, checks tenant rate limits via ${stack.caching}, and deserializes payload against Zod/Pydantic schema.
3. **Execution & State Commit:** Domain service acquires distributed mutex (if applicable), executes business logic, and commits state transactionally to ${stack.database}.
4. **Asynchronous Broadcast:** State transition event is emitted to event bus for downstream telemetry and real-time WebSocket subscriber updates.
5. **Confirmation:** Client receives HTTP 201 Created with JSON envelope and deterministic entity identifier.

#### Workflow 2: Administrative Governance & Audit Reporting
1. Admin logs in with MFA/SSO (${stack.auth}).
2. Admin queries filtered activity logs over specified time window.
3. Query executes with partition pruning and returns aggregated telemetry with p99 metrics.

---

## 3. Functional Requirements Matrix

| Requirement ID | Module / Area | Feature Description | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :---: | :--- |
| **FR-101** | Identity & Auth | Multi-tenant authentication with JWT access tokens, refresh token rotation, and RBAC enforcement. | **P0** | Access token expires in 15 mins; refresh token rotation invalidates compromised tokens upon reuse. |
| **FR-102** | Core Domain | ${d.primaryActions[0]} with distributed idempotency validation. | **P0** | Duplicate requests with identical \`Idempotency-Key\` return cached response within 10ms without double execution. |
| **FR-103** | Data Model | Full persistence for ${d.primaryEntities.slice(0, 4).join(", ")} entities with foreign key constraints. | **P0** | Zero orphaned records; foreign key cascades or soft-deletes strictly enforced. |
| **FR-104** | Real-Time Sync | Live status updates pushed to connected clients via WebSockets / SSE. | **P0** | Client UI updates within <100ms of backend event publish. |
| **FR-105** | Search & Indexing | Sub-string and faceted search across active domain entities. | **P1** | Search query p95 latency <45ms over 1,000,000 indexed records. |
| **FR-106** | Bulk Operations | Batch creation and updates for up to 500 items per request. | **P1** | Atomic execution: entire batch succeeds or rolls back completely with explicit item-level error reporting. |
| **FR-107** | Export Engine | Export data snapshots to encrypted JSON, CSV, and zipped archive formats. | **P1** | Exports completed asynchronously in background worker; download link signed with 1-hour expiration. |
| **FR-108** | Audit Trail | Immutable audit logging for all mutating administrative and data modifications. | **P1** | Log record captures Actor ID, IP Address, Timestamp, Before/After Diff, and Request ID. |
| **FR-109** | Webhook Dispatch | Outbound webhook notification system with exponential backoff retries. | **P2** | Failed webhook deliveries retried up to 5 times (1m, 5m, 15m, 1h, 6h) with HMAC-SHA256 signature header. |
| **FR-110** | Custom Dashboards | Configurable dashboard widgets and saved analytical query views. | **P2** | User can save, edit, and share custom visualization tiles per workspace. |

---

## 4. Non-Functional Requirements & SLA Commitments

### 4.1 Latency & Performance Targets
- **Read Latency:** p50 < 15ms, p95 < 50ms, p99 < 120ms (cached read endpoints).
- **Write / Mutate Latency:** p95 < 150ms for transactional database commits.
- **Throughput Capacity:** Scalable from 1,000 RPS baseline to 25,000 RPS peak during surge load.
- **Frontend Core Web Vitals:** Largest Contentful Paint (LCP) < 1.2s, Cumulative Layout Shift (CLS) < 0.05, Interaction to Next Paint (INP) < 100ms.

### 4.2 Availability & Resilience (99.99% SLA)
- **Uptime Commitment:** 99.99% availability (maximum allowable unplanned downtime: ~4.38 minutes/month).
- **Recovery Point Objective (RPO):** < 1 minute (continuous WAL replication to secondary cloud region).
- **Recovery Time Objective (RTO):** < 5 minutes (automated container failover and DNS health routing).
- **Circuit Breakers:** Upstream service integrations wrapped with circuit breakers (50% failure threshold trips breaker for 30s).

### 4.3 Data Sovereignty, Privacy & Compliance
- **Data Encryption:** TLS 1.3 enforced for all ingress and inter-service communication; AES-256-GCM for storage at rest.
- **Regulatory Frameworks:** Compliant with SOC 2 Type II, GDPR Article 32, and CCPA privacy standards.
- **Data Retention Policy:** Hot operational data retained for 90 days; cold historical partitions moved to encrypted object storage for 7 years.

---

## 5. Scope Boundaries

### 5.1 Explicitly In-Scope for Phase 1 / MVP
- Complete core backend services for ${d.primaryEntities.slice(0, 4).join(", ")}.
- Responsive frontend interface built with ${stack.frontend}.
- Standard JWT and RBAC authentication system with secure session handling.
- Real-time event streaming and live UI status updates.
- Automated CI/CD pipeline, containerization, and local development harness.

### 5.2 Explicitly Out-of-Scope (Deferred to Phase 2+)
- Multi-region active-active database clustering (Phase 1 uses Primary + Read Replica).
- Native iOS and Android mobile applications (Phase 1 delivers mobile-optimized PWA).
- Custom AI-driven anomaly detection models (Phase 1 utilizes threshold-based heuristics).
- Legacy on-premises enterprise mainframe connectors.

### 5.3 Technical Assumptions & External Dependencies
- Modern evergreen browser support (Chrome 110+, Safari 16+, Firefox 115+, Edge).
- Cloud hosting platform supporting managed container orchestration (${stack.deployment}).
- External DNS and CDN edge terminating TLS certificates with automated Let's Encrypt / ACM renewal.`;
}

function generateSystemArchitecture(prompt: string, stack: TechStackPreferences, d: DomainContext): string {
  const e1 = d.primaryEntities[0] || "User";
  const e2 = d.primaryEntities[1] || "Workspace";
  const e3 = d.primaryEntities[2] || "Project";
  const e4 = d.primaryEntities[3] || "Task";
  const e5 = d.primaryEntities[4] || "AuditLog";

  return `# 01_SYSTEM_ARCHITECTURE.md: System Design & Contracts

## 1. Technology Stack Selection & Architectural Rationale

| Layer | Chosen Technology | Architectural Rationale & Justification |
| :--- | :--- | :--- |
| **Frontend Tier** | ${stack.frontend} | Server-Side Rendering (SSR) for optimal initial load, atomic component architecture, and high-performance reactive state. |
| **Backend Tier** | ${stack.backend} | High async concurrency, strict type enforcement, built-in validation schemas, and enterprise maintainability. |
| **Database Tier** | ${stack.database} | ACID compliance for transactional data integrity, JSONB support for semi-structured metadata, and robust indexing. |
| **Caching & State** | ${stack.caching} | Sub-millisecond latency for session caching, distributed locks, rate limiting, and ephemeral pub/sub subscriptions. |
| **Architecture Style** | ${stack.architecture} | Domain boundary isolation, independent service scalability, and fault containment. |
| **Deployment Target** | ${stack.deployment} | Infrastructure-as-code automation, zero-downtime rolling deploys, and horizontal auto-scaling based on CPU/RAM metrics. |
| **Authentication** | ${stack.auth} | Secure identity token verification, OAuth2/OIDC interoperability, and granular RBAC claims. |

---

## 2. Visual System Topology

\`\`\`mermaid
flowchart TD
    subgraph Clients ["Client Applications"]
        WebClient["Desktop & Mobile Web (SPA / SSR)"]
        MobileApp["Mobile Client App"]
        CLIClient["Developer CLI & SDK"]
    end

    subgraph Edge ["Edge & Ingress Layer"]
        CDN["Cloud Edge CDN / Cloudflare"]
        WAF["Web Application Firewall (WAF)"]
        LoadBalancer["Application Load Balancer (ALB / NGINX)"]
    end

    subgraph Gateway ["API Gateway & Security"]
        APIGateway["API Gateway & Reverse Proxy"]
        AuthMiddleware["JWT / RBAC Auth Middleware"]
        RateLimiter["Token Bucket Rate Limiter"]
    end

    subgraph CoreServices ["Microservices / Application Services"]
        AuthService["Auth & Identity Service"]
        DomainService["Core Domain Service"]
        WorkerService["Background Async Worker"]
        RealtimeGateway["WebSocket / SSE Push Service"]
    end

    subgraph DataTier ["Data & Caching Tier"]
        PrimaryDB[("Primary Database (PostgreSQL)")]
        ReadReplica[("Read Replica Database")]
        RedisCache[("Redis Distributed Cache & Locks")]
        MessageBroker["Message Broker (Kafka / Redis Streams)"]
    end

    subgraph ExternalTier ["Third-Party & External Services"]
        StorageBucket["S3 / Blob Storage (Encrypted)"]
        NotificationAPI["Push / Email / SMS Gateway"]
        PaymentProcessor["Payment / Billing Gateway"]
    end

    WebClient --> CDN
    MobileApp --> CDN
    CLIClient --> CDN
    CDN --> WAF
    WAF --> LoadBalancer
    LoadBalancer --> APIGateway

    APIGateway --> AuthMiddleware
    AuthMiddleware --> RateLimiter
    RateLimiter --> AuthService
    RateLimiter --> DomainService
    RateLimiter --> RealtimeGateway

    DomainService --> PrimaryDB
    DomainService --> ReadReplica
    DomainService --> RedisCache
    DomainService --> MessageBroker

    RealtimeGateway --> RedisCache
    MessageBroker --> WorkerService
    WorkerService --> StorageBucket
    WorkerService --> NotificationAPI
    DomainService --> PaymentProcessor
\`\`\`

---

## 3. Database Schema & Entity Relationship Diagram (ERD)

\`\`\`mermaid
erDiagram
    ${e1} ||--o{ ${e2} : owns
    ${e2} ||--o{ ${e3} : contains
    ${e3} ||--o{ ${e4} : manages
    ${e1} ||--o{ ${e5} : generates

    ${e1} {
        uuid id PK
        string email UK
        string password_hash
        string full_name
        string role
        boolean is_active
        jsonb metadata
        timestamp created_at
        timestamp updated_at
    }

    ${e2} {
        uuid id PK
        uuid owner_id FK
        string name
        string slug UK
        string tier
        boolean is_suspended
        timestamp created_at
        timestamp updated_at
    }

    ${e3} {
        uuid id PK
        uuid workspace_id FK
        string title
        string status
        decimal budget
        jsonb config
        timestamp created_at
        timestamp updated_at
    }

    ${e4} {
        uuid id PK
        uuid project_id FK
        uuid assignee_id FK
        string name
        string priority
        string state
        timestamp due_date
        timestamp created_at
    }

    ${e5} {
        uuid id PK
        uuid actor_id FK
        string action
        string target_resource
        string ip_address
        jsonb diff_payload
        timestamp created_at
    }
\`\`\`

### 3.1 Relational Data Tables Specification

#### Table: \`users\` (Identity & Core Account)
- **\`id\`**: \`UUID\` (Primary Key, default: \`gen_random_uuid()\`)
- **\`email\`**: \`VARCHAR(255)\` (NOT NULL, UNIQUE, Indexed via B-Tree)
- **\`password_hash\`**: \`VARCHAR(255)\` (NOT NULL, Argon2id)
- **\`role\`**: \`VARCHAR(50)\` (NOT NULL, default: \`'MEMBER'\`)
- **\`created_at\`**: \`TIMESTAMPTZ\` (NOT NULL, default: \`CURRENT_TIMESTAMP\`)

#### Table: \`workspaces\` (Multi-Tenant Isolation)
- **\`id\`**: \`UUID\` (Primary Key)
- **\`owner_id\`**: \`UUID\` (NOT NULL, Foreign Key -> \`users.id\` ON DELETE RESTRICT)
- **\`name\`**: \`VARCHAR(100)\` (NOT NULL)
- **\`slug\`**: \`VARCHAR(100)\` (NOT NULL, UNIQUE, Indexed)
- **\`tier\`**: \`VARCHAR(30)\` (default: \`'STARTER'\`)

---

## 4. RESTful & Real-time API Contracts

### 4.1 Endpoint: User Authentication
\`\`\`http
POST /api/v1/auth/login
Content-Type: application/json
\`\`\`

#### Request Payload:
\`\`\`json
{
  "email": "developer@enterprise.io",
  "password": "SecurePassword123!",
  "device_id": "dev-node-99a"
}
\`\`\`

#### Success Response (\`200 OK\`):
\`\`\`json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 900,
    "refresh_token": "d8f37a1c-9b4e-4f21-86a0-2f94b4e31102",
    "user": {
      "id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      "email": "developer@enterprise.io",
      "role": "ADMIN"
    }
  }
}
\`\`\`

### 4.2 Endpoint: Create Domain Resource (${d.primaryEntities[2]})
\`\`\`http
POST /api/v1/workspaces/{workspace_id}/resources
Authorization: Bearer <access_token>
Idempotency-Key: 7b84c2a1-062e-4cb8-bdf1-3e4b77f98e10
Content-Type: application/json
\`\`\`

#### Request Payload:
\`\`\`json
{
  "title": "Production Deployment Pipeline",
  "priority": "HIGH",
  "tags": ["cloud", "automation", "core"],
  "metadata": {
    "auto_retry": true,
    "timeout_seconds": 3600
  }
}
\`\`\`

#### Success Response (\`201 Created\`):
\`\`\`json
{
  "status": "success",
  "data": {
    "id": "c1f7b84e-3d2a-4f51-9e12-88b0a1d99432",
    "workspace_id": "e4d3c2b1-0000-4000-8000-000000000001",
    "title": "Production Deployment Pipeline",
    "priority": "HIGH",
    "state": "INITIALIZED",
    "created_at": "2026-08-23T21:20:00.000Z"
  }
}
\`\`\`

---

## 5. Data Flow & Event Bus Architecture

\`\`\`mermaid
sequenceDiagram
    autonumber
    actor Client as Web/Mobile Client
    participant GW as API Gateway & Auth
    participant Core as Core Domain Service
    participant Cache as Redis Cache
    participant DB as Primary PostgreSQL
    participant EventBus as Message Broker (Kafka)
    participant Worker as Background Worker

    Client->>GW: POST /api/v1/resources (with JWT & Idempotency-Key)
    GW->>GW: Validate JWT signature & Rate Limit
    GW->>Core: Forward verified request
    Core->>Cache: Check Idempotency-Key
    alt Key already exists (Duplicate Request)
        Cache-->>Core: Return cached JSON payload
        Core-->>Client: HTTP 200 (Replay cached response)
    else Key does not exist (New Request)
        Core->>DB: BEGIN TRANSACTION
        Core->>DB: INSERT INTO resources ...
        Core->>DB: COMMIT TRANSACTION
        Core->>Cache: SET Idempotency-Key (TTL = 24h)
        Core->>EventBus: PUBLISH "resource.created" event
        Core-->>Client: HTTP 201 Created (JSON payload)
        EventBus->>Worker: Consume "resource.created" event
        Worker->>Worker: Execute asynchronous task & audit log
    end
\`\`\``;
}

function generateImplementationPlan(prompt: string, stack: TechStackPreferences, d: DomainContext): string {
  return `# 02_IMPLEMENTATION_PLAN.md: Engineering Breakdown

## 1. Repository Directory Tree Structure

\`\`\`text
${d.shortName.toLowerCase()}-monorepo/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                 # Lint, unit test, build matrix
│   │   ├── deploy.yml             # Container build, security scan, deployment
│   │   └── security-audit.yml     # Weekly Trivy & dependency scanning
├── apps/
│   ├── web/                       # ${stack.frontend} application
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── app/               # Routes, pages, layouts
│   │   │   ├── components/        # UI design system & layout components
│   │   │   ├── hooks/             # Custom state & WebSocket hooks
│   │   │   ├── lib/               # API clients, auth utilities, types
│   │   │   └── styles/            # Tailwind CSS globals
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── api/                       # ${stack.backend} service
│       ├── src/
│       │   ├── domain/            # Domain entities, business logic, aggregates
│       │   ├── application/       # Use cases, DTOs, service orchestrators
│       │   ├── infrastructure/    # DB repositories, cache clients, external APIs
│       │   ├── presentation/      # HTTP controllers, route handlers, middleware
│       │   └── main.py / server.ts
│       ├── tests/
│       │   ├── unit/
│       │   ├── integration/
│       │   └── e2e/
│       └── Dockerfile
├── packages/
│   ├── types/                     # Shared TypeScript data models & Zod schemas
│   ├── config/                    # Shared ESLint, Prettier, Tailwind presets
│   └── logger/                    # Structured JSON logging library
├── infrastructure/
│   ├── terraform/
│   │   ├── main.tf                # VPC, Cloud cluster, RDS database, S3
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── docker/
│       ├── docker-compose.yml     # Local multi-container development environment
│       └── docker-compose.prod.yml
├── .env.example
├── Makefile                       # Unified developer CLI commands
├── package.json
└── README.md
\`\`\`

---

## 2. Sequential Milestone Breakdown

\`\`\`mermaid
gantt
    title 4-Phase Implementation Timeline
    dateFormat  YYYY-MM-DD
    section Phase 1: Foundation
    Scaffolding & Tooling          :p1_1, 2026-09-01, 7d
    DB Migrations & Schemas        :p1_2, after p1_1, 7d
    section Phase 2: Core Domain
    Domain Logic & Repositories    :p2_1, after p1_2, 10d
    Auth, RBAC & API Gateway       :p2_2, after p2_1, 8d
    section Phase 3: Integration & UI
    Frontend UI Components         :p3_1, after p2_2, 10d
    Real-Time Sockets & Events     :p3_2, after p3_1, 7d
    section Phase 4: Hardening
    E2E Testing & Security Audit   :p4_1, after p3_2, 7d
    Load Testing & Production Go-Live :p4_2, after p4_1, 5d
\`\`\`

---

## 3. Granular Task Checklist with Dependency Chains

### Phase 1: Foundation & Base Tooling
- [ ] **TASK-101**: Initialize repository monorepo with strict TypeScript, ESLint, Prettier, and Git pre-commit hooks. [Depends on: None] [Owner: DevOps]
- [ ] **TASK-102**: Configure database migrations for primary tables (\`users\`, \`workspaces\`, \`${d.primaryEntities[0].toLowerCase()}\`, \`${d.primaryEntities[1].toLowerCase()}\`). [Depends on: TASK-101] [Owner: Backend]
- [ ] **TASK-103**: Setup Docker Compose harness with PostgreSQL 16, Redis 7, and LocalStack/MinIO. [Depends on: TASK-101] [Owner: DevOps]
- [ ] **TASK-104**: Create base database connection pooling, retry logic, and health check probes. [Depends on: TASK-102] [Owner: Backend]

### Phase 2: Core Domain Services & Data Access
- [ ] **TASK-201**: Implement JWT authentication module with Argon2id password hashing and refresh token rotation. [Depends on: TASK-104] [Owner: Security/Backend]
- [ ] **TASK-202**: Implement RBAC middleware with permission checking for Operator, Admin, and Integrator roles. [Depends on: TASK-201] [Owner: Backend]
- [ ] **TASK-203**: Develop domain CRUD repositories with distributed idempotency checking via Redis. [Depends on: TASK-104] [Owner: Backend]
- [ ] **TASK-204**: Build core business logic engine for ${d.primaryActions[0]}. [Depends on: TASK-203] [Owner: Backend]
- [ ] **TASK-205**: Implement event publisher publishing messages to Redis Streams/Kafka. [Depends on: TASK-204] [Owner: Backend]

### Phase 3: Integration, Real-Time Gateway & UI
- [ ] **TASK-301**: Scaffold ${stack.frontend} application with layout, navigation, and theme provider. [Depends on: TASK-101] [Owner: Frontend]
- [ ] **TASK-302**: Implement client API SDK with auto-refresh token interceptors and typed error handlers. [Depends on: TASK-201, TASK-301] [Owner: Frontend]
- [ ] **TASK-303**: Build interactive workspace view and primary data management tables. [Depends on: TASK-302] [Owner: Frontend]
- [ ] **TASK-304**: Implement WebSocket client for live state synchronization and notification popups. [Depends on: TASK-205, TASK-303] [Owner: Fullstack]
- [ ] **TASK-305**: Build administrative dashboard with audit log viewer and tenant management. [Depends on: TASK-303] [Owner: Frontend]

### Phase 4: Production Hardening & Launch
- [ ] **TASK-401**: Write comprehensive unit test suite (>80% line and branch coverage). [Depends on: TASK-204] [Owner: QA/Backend]
- [ ] **TASK-402**: Implement Playwright end-to-end test suite for critical user paths. [Depends on: TASK-304] [Owner: QA]
- [ ] **TASK-403**: Execute k6 load testing to validate 10,000 RPS concurrency with sub-100ms latency. [Depends on: TASK-401] [Owner: DevOps]
- [ ] **TASK-404**: Configure GitHub Actions CI/CD pipeline with Trivy container vulnerability scanning. [Depends on: TASK-403] [Owner: DevOps]
- [ ] **TASK-405**: Execute pre-launch security penetration testing and secret rotation check. [Depends on: TASK-404] [Owner: Security]

---

## 4. Local Development Setup & CLI Run Commands

### 4.1 Prerequisites
- Node.js \`>= 20.0.0\`
- Docker & Docker Compose \`v2.20+\`
- Make / Bash CLI environment

### 4.2 Step-by-Step Setup Commands

\`\`\`bash
# 1. Clone repository
git clone https://github.com/org/${d.shortName.toLowerCase()}.git
cd ${d.shortName.toLowerCase()}

# 2. Setup environment variables
cp .env.example .env

# 3. Install dependencies
npm install

# 4. Start local infrastructure services (PostgreSQL, Redis, Storage)
docker compose up -d

# 5. Run database migrations & seed initial demo data
npm run db:migrate
npm run db:seed

# 6. Start fullstack application in development mode
npm run dev
\`\`\`

### 4.3 Key Makefile CLI Targets
\`\`\`makefile
.PHONY: dev build test lint db-migrate clean

dev:
\t@npm run dev

build:
\t@npm run build

test:
\t@npm run test:unit && npm run test:e2e

lint:
\t@npm run lint && npm run format:check

db-migrate:
\t@npm run db:migrate:up

clean:
\t@docker compose down -v && rm -rf node_modules .next dist
\`\`\``;
}

function generateTestingStrategy(prompt: string, stack: TechStackPreferences, d: DomainContext): string {
  return `# 03_TESTING_STRATEGY.md: Quality Assurance Matrix

## 1. Unit Testing Matrix (>80% Target Coverage)

### 1.1 Scope & Mocking Boundaries
All core business domain modules must enforce strict >80% line and branch test coverage. External dependencies (Databases, Redis, HTTP third parties, and Message Brokers) must be isolated using test doubles and mocks.

| Module Layer | Testing Objective | Mocking Strategy | Target Coverage |
| :--- | :--- | :--- | :---: |
| **Domain Entities & Aggregates** | Pure business rules, invariant validations, and state transitions. | Zero mocks (pure functions). | **95%** |
| **Application Services & Use Cases** | Orchestration, authorization checks, and transaction boundaries. | Mock repositories & event publishers. | **90%** |
| **Data Repositories** | Query syntax, schema constraints, and mapping functions. | In-memory SQLite / pg-mem or test container. | **85%** |
| **HTTP Controllers & Middleware** | Request validation, status codes, and error formatting. | Supertest / Mock HTTP Request context. | **85%** |

### 1.2 Example Unit Test Code (Domain Invariant Verification)

\`\`\`typescript
import { describe, it, expect, beforeEach, vi } from "vitest";
import { CreateResourceUseCase } from "@/domain/use-cases/create-resource";
import { IResourceRepository } from "@/domain/interfaces/resource-repo";

describe("CreateResourceUseCase", () => {
  let mockRepo: IResourceRepository;
  let useCase: CreateResourceUseCase;

  beforeEach(() => {
    mockRepo = {
      create: vi.fn().mockResolvedValue({ id: "res-123", title: "Test Resource", status: "ACTIVE" }),
      findByTitle: vi.fn().mockResolvedValue(null),
    };
    useCase = new CreateResourceUseCase(mockRepo);
  });

  it("should successfully create a new resource with valid parameters", async () => {
    const result = await useCase.execute({
      title: "Production Cluster",
      workspaceId: "ws-99",
      priority: "HIGH"
    });

    expect(result.success).toBe(true);
    expect(result.data?.id).toBe("res-123");
    expect(mockRepo.create).toHaveBeenCalledTimes(1);
  });

  it("should throw validation error when title is empty", async () => {
    await expect(
      useCase.execute({ title: "", workspaceId: "ws-99", priority: "HIGH" })
    ).rejects.toThrowError("Resource title cannot be empty");
    expect(mockRepo.create).not.toHaveBeenCalled();
  });
});
\`\`\`

---

## 2. API & Integration Test Suites

### 2.1 API Endpoint Test Matrix

| Test ID | Endpoint | Method | Scenario Description | Expected HTTP Status | Expected JSON Body Match |
| :--- | :--- | :---: | :--- | :---: | :--- |
| **API-01** | \`/api/v1/auth/login\` | POST | Valid credentials login | \`200 OK\` | \`{"status": "success", "data": {"access_token": /.+/}}\` |
| **API-02** | \`/api/v1/auth/login\` | POST | Invalid password attempt | \`401 Unauthorized\` | \`{"status": "error", "code": "INVALID_CREDENTIALS"}\` |
| **API-03** | \`/api/v1/resources\` | POST | Create resource with missing required field | \`422 Unprocessable\` | \`{"status": "fail", "errors": [{"field": "title"}]}\` |
| **API-04** | \`/api/v1/resources\` | POST | Duplicate request with identical Idempotency-Key | \`200 OK\` | \`{"status": "success", "idempotent_replay": true}\` |
| **API-05** | \`/api/v1/resources/:id\` | GET | Fetch non-existent entity ID | \`404 Not Found\` | \`{"status": "error", "code": "ENTITY_NOT_FOUND"}\` |

---

## 3. End-to-End (E2E) Test User Flows

### 3.1 Playwright Critical Path Test Specification

\`\`\`typescript
import { test, expect } from "@playwright/test";

test.describe("Critical User Journey: Authentication & Lifecycle Execution", () => {
  test("User logs in, creates a new resource, and verifies real-time UI synchronization", async ({ page }) => {
    // 1. Navigate to login page
    await page.goto("/login");
    await page.fill('input[name="email"]', "lead-engineer@enterprise.io");
    await page.fill('input[name="password"]', "SuperSecret2026!");
    await page.click('button[type="submit"]');

    // 2. Verify redirect to main dashboard
    await expect(page).toHaveURL("/dashboard");
    await expect(page.locator("h1")).toContainText("Dashboard");

    // 3. Open Create Modal
    await page.click('[data-testid="btn-create-resource"]');
    await page.fill('input[name="title"]', "Automated E2E Test Cluster");
    await page.selectOption('select[name="priority"]', "HIGH");
    await page.click('[data-testid="btn-submit-create"]');

    // 4. Verify toast notification and table entry
    const toast = page.locator('[data-testid="toast-success"]');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText("Resource created successfully");

    const tableRow = page.locator('tr:has-text("Automated E2E Test Cluster")');
    await expect(tableRow).toBeVisible();
    await expect(tableRow.locator(".badge-status")).toContainText("ACTIVE");

    // 5. Cleanup session
    await page.click('[data-testid="btn-user-avatar"]');
    await page.click('[data-testid="btn-logout"]');
    await expect(page).toHaveURL("/login");
  });
});
\`\`\`

---

## 4. Edge-Case Inventory & Boundary Failure Tests

| Category | Edge Scenario | Potential Failure Mode | Mitigation & Test Assertion |
| :--- | :--- | :--- | :--- |
| **Concurrency** | 50 simultaneous requests attempting to update the same single record. | Lost updates, race condition state corruption. | Optimistic concurrency control using \`version\` column; exactly 1 update succeeds, 49 return 409 Conflict. |
| **Network Degradation** | Upstream database latency spikes to 10 seconds. | Connection pool exhaustion causing cascading thread death. | Connection timeout capped at 3s; fast-fail circuit breaker trips and serves cached fallback. |
| **Malicious Input** | 10MB nested JSON payload submitted to API. | Memory spike / Node.js event loop block (ReDoS). | Strict body parser payload limit (512KB max) and Zod schema recursion depth cap. |
| **Rate Limit Surge** | Single IP sends 2,000 requests/sec. | Resource starvation for legitimate tenants. | Token bucket rate limiter returns HTTP 429 with \`Retry-After: 60\` header within <2ms. |
| **Boundary Values** | Unicode zero-width spaces or SQL escape sequences in entity names. | Rendering glitches or database query syntax breaking. | Input sanitization pipeline strips illegal control characters and parameterizes all SQL queries. |`;
}

function generateSecurityCompliance(prompt: string, stack: TechStackPreferences, d: DomainContext): string {
  return `# 04_SECURITY_COMPLIANCE.md: Security & Compliance Blueprint

## 1. Identity, Authentication & RBAC Permission Matrix

### 1.1 Authentication Framework
- **Token Format:** RFC 7519 JSON Web Tokens (JWT) signed with asymmetric \`RS256\` (RSA 4096-bit) or \`EdDSA\` keys.
- **Access Token Lifetime:** 15 minutes (ephemeral).
- **Refresh Token Lifetime:** 7 days stored in \`HttpOnly\`, \`Secure\`, \`SameSite=Strict\` cookie with automatic one-time rotation.
- **Revocation:** Token Blacklist maintained in ${stack.caching} using JWT \`jti\` claim with TTL matching remaining token lifetime.

### 1.2 Granular RBAC / ABAC Permission Table

| Role | Target Resource | Create | Read | Update | Delete | Admin / Config | Attribute Constraints |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **PLATFORM_ADMIN** | All System Entities | Yes | Yes | Yes | Yes | Yes | Unrestricted across all tenants. |
| **WORKSPACE_OWNER** | Workspace & Resources | Yes | Yes | Yes | Yes | Yes | Limited to owned \`workspace_id\`. |
| **MEMBER / OPERATOR** | Domain Resources | Yes | Yes | Yes | No | No | Must belong to active team project. |
| **READONLY_AUDITOR** | Reports & Logs | No | Yes | No | No | No | Read-only access; PII fields masked. |
| **INTEGRATION_BOT** | Webhooks & API Keys | Yes | Yes | Yes | No | No | Scoped strictly to provisioned API permissions. |

---

## 2. OWASP Top 10 Mitigation Blueprint

\`\`\`mermaid
flowchart LR
    Threat["OWASP Threat Vector"] --> Defense["Defense-in-Depth Layer"] --> Outcome["Verified Security Posture"]

    A["A01: Broken Access Control"] --> M1["RBAC Middleware & UUID Validation"] --> R1["Zero IDOR Vulnerabilities"]
    B["A02: Cryptographic Failures"] --> M2["TLS 1.3 & AES-256-GCM Encryption"] --> R2["Encrypted Data-in-Transit & At-Rest"]
    C["A03: Injection (SQL / XSS)"] --> M3["Parameterized Queries & Strict CSP"] --> R3["Zero Query or Script Injection"]
    D["A04: Insecure Design"] --> M4["Threat Modeling & Rate Limiting"] --> R4["DoS & Abuse Prevention"]
    E["A05: Security Misconfig"] --> M5["Hardened Docker & Non-Root User"] --> R5["Minimal Attack Surface"]
\`\`\`

### 2.1 Specific Technical Countermeasures
1. **A01 Broken Access Control (IDOR):** Every data access query enforces compound WHERE clauses incorporating the authenticated tenant ID: \`WHERE id = :id AND tenant_id = :auth_tenant_id\`.
2. **A02 Cryptographic Failures:** Passwords hashed with Argon2id (\`time_cost=3, memory_cost=65536, parallelism=4\`). Sensitive credentials encrypted via AES-256-GCM with unique initialization vectors (IV).
3. **A03 Injection:** 100% of database interactions leverage typed ORMs or parameterized query templates. Direct string concatenation in SQL queries is strictly prohibited by CI linter rules.
4. **A05 Security Misconfiguration:** Production HTTP security headers enforced via reverse proxy:
   - \`Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none';\`
   - \`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload\`
   - \`X-Frame-Options: DENY\`
   - \`X-Content-Type-Options: nosniff\`
   - \`Referrer-Policy: strict-origin-when-cross-origin\`

---

## 3. Cryptographic Standards & Secret Rotation Policy

### 3.1 Standards Summary
- **In-Transit Security:** TLS 1.3 enforced. Minimum permitted protocol: TLS 1.2 with PFS (Perfect Forward Secrecy) cipher suites (\`ECDHE-ECDSA-AES256-GCM-SHA384\`).
- **At-Rest Security:** AWS KMS / HashiCorp Vault managed customer-managed keys (CMK) with automated 90-day rotation.
- **Application Secrets:** Zero plaintext secrets in code or git. Injected at container runtime via secure secret managers.

---

## 4. Environment Variable Dictionary

| Variable Name | Required In | Sensitivity | Example / Default Value | Description |
| :--- | :--- | :---: | :--- | :--- |
| \`NODE_ENV\` | All | Public | \`production\` | Runtime environment mode. |
| \`PORT\` | All | Public | \`8080\` | Ingress HTTP listener port. |
| \`DATABASE_URL\` | Staging / Prod | **Secret** | \`postgresql://app_usr:***@db.internal:5432/${d.shortName.toLowerCase()}\` | Primary PostgreSQL connection string with SSL mode \`require\`. |
| \`REDIS_URL\` | Staging / Prod | **Secret** | \`rediss://:***@redis.internal:6379/0\` | Encrypted TLS Redis connection string. |
| \`JWT_PRIVATE_KEY\` | Staging / Prod | **Secret** | \`-----BEGIN RSA PRIVATE KEY-----\\n...\` | 4096-bit RSA key for signing access tokens. |
| \`JWT_PUBLIC_KEY\` | Staging / Prod | Public | \`-----BEGIN PUBLIC KEY-----\\n...\` | Public key for token verification across services. |
| \`ENCRYPTION_KEY_AES256\` | Staging / Prod | **Secret** | \`64-hex-character-secret-key-string\` | 256-bit AES master key for field-level PII encryption. |
| \`CORS_ALLOWED_ORIGINS\` | All | Public | \`https://app.${d.shortName.toLowerCase()}.com\` | Comma-separated list of allowed CORS origins. |
| \`LOG_LEVEL\` | All | Public | \`info\` | Structured logging threshold (\`debug\`, \`info\`, \`warn\`, \`error\`). |`;
}

function generateDeploymentDevops(prompt: string, stack: TechStackPreferences, d: DomainContext): string {
  return `# 05_DEPLOYMENT_DEVOPS.md: Infrastructure & Operations

## 1. Production Multi-Stage Dockerfile & docker-compose.yml

### 1.1 Multi-Stage Dockerfile
\`\`\`dockerfile
# ----------------------------------------------------
# Stage 1: Build & Dependency Resolution
# ----------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache libc6-compat

COPY package*.json ./
RUN npm ci --frozen-lockfile

COPY . .
ENV NODE_ENV=production
RUN npm run build

# ----------------------------------------------------
# Stage 2: Production Minimal Runtime
# ----------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Create dedicated non-root user and group
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 apprunner

# Copy artifacts from builder with correct permissions
COPY --from=builder --chown=apprunner:nodejs /app/dist ./dist
COPY --from=builder --chown=apprunner:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=apprunner:nodejs /app/package.json ./package.json

USER apprunner

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/healthz || exit 1

CMD ["node", "dist/main.js"]
\`\`\`

### 1.2 Production-Grade \`docker-compose.yml\`
\`\`\`yaml
version: "3.9"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: ${d.shortName.toLowerCase()}-app
    restart: unless-stopped
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - PORT=8080
      - DATABASE_URL=postgresql://app_user:SuperSecureSecret2026@postgres:5432/${d.shortName.toLowerCase()}?sslmode=disable
      - REDIS_URL=redis://redis:6379/0
      - LOG_LEVEL=info
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - internal-mesh

  postgres:
    image: postgres:16-alpine
    container_name: ${d.shortName.toLowerCase()}-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${d.shortName.toLowerCase()}
      POSTGRES_USER: app_user
      POSTGRES_PASSWORD: SuperSecureSecret2026
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app_user -d ${d.shortName.toLowerCase()}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - internal-mesh

  redis:
    image: redis:7.2-alpine
    container_name: ${d.shortName.toLowerCase()}-redis
    restart: unless-stopped
    command: redis-server --appendonly yes --requirepass RedisSecureAuth2026
    volumes:
      - redisdata:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - internal-mesh

networks:
  internal-mesh:
    driver: bridge

volumes:
  pgdata:
  redisdata:
\`\`\`

---

## 2. Production CI/CD Workflow (.github/workflows/deploy.yml)

\`\`\`yaml
name: Production CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  lint-and-test:
    name: Code Quality & Test Matrix
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run Linters & Type Checks
        run: |
          npm run lint
          npm run typecheck

      - name: Execute Unit & Integration Tests
        run: npm run test:coverage

      - name: Upload Test Coverage
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/

  security-scan:
    name: Container Security Scanning
    needs: lint-and-test
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Build Local Image for Scan
        run: docker build -t ${d.shortName.toLowerCase()}:test .

      - name: Run Trivy Vulnerability Scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: '${d.shortName.toLowerCase()}:test'
          format: 'table'
          exit-code: '1'
          ignore-unfixed: true
          severity: 'CRITICAL,HIGH'

  build-and-deploy:
    name: Build, Push & Deploy to Production
    needs: [ lint-and-test, security-scan ]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Configure Cloud Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build, Tag, and Push Docker Image
        env:
          ECR_REGISTRY: \${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: ${d.shortName.toLowerCase()}
          IMAGE_TAG: \${{ github.sha }}
        run: |
          docker build -t \$ECR_REGISTRY/\$ECR_REPOSITORY:\$IMAGE_TAG -t \$ECR_REGISTRY/\$ECR_REPOSITORY:latest .
          docker push \$ECR_REGISTRY/\$ECR_REPOSITORY:\$IMAGE_TAG
          docker push \$ECR_REGISTRY/\$ECR_REPOSITORY:latest

      - name: Deploy Amazon ECS Task Definition (Rolling Update)
        run: |
          aws ecs update-service --cluster ${d.shortName.toLowerCase()}-prod --service ${d.shortName.toLowerCase()}-service --force-new-deployment
\`\`\`

---

## 3. Infrastructure-as-Code (Terraform Spec)

\`\`\`hcl
# main.tf: Cloud Infrastructure Definition
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# 1. Dedicated VPC & Subnets
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "${d.shortName.toLowerCase()}-vpc"
    Environment = "production"
  }
}

# 2. Managed PostgreSQL RDS Instance (Multi-AZ)
resource "aws_db_instance" "postgres" {
  identifier             = "${d.shortName.toLowerCase()}-db"
  engine                 = "postgres"
  engine_version         = "16.1"
  instance_class         = "db.t4g.large"
  allocated_storage      = 50
  max_allocated_storage  = 500
  storage_encrypted      = true
  multi_az               = true
  db_name                = "${d.shortName.toLowerCase()}"
  username               = "app_admin"
  password               = var.db_password
  skip_final_snapshot    = false
  final_snapshot_identifier = "${d.shortName.toLowerCase()}-final-snapshot"
}

# 3. ECS Fargate Cluster
resource "aws_ecs_cluster" "cluster" {
  name = "${d.shortName.toLowerCase()}-prod-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}
\`\`\`

---

## 4. Observability, Health Endpoints & Metrics

### 4.1 Health Check Endpoints
- **Liveness Probe (\`GET /healthz\`):** Returns HTTP 200 immediately if process event loop is active.
- **Readiness Probe (\`GET /ready\`):** Queries PostgreSQL (\`SELECT 1\`) and Redis (\`PING\`). Returns HTTP 200 if all dependent storage engines are responsive; returns HTTP 503 Service Unavailable if any dependency fails.

### 4.2 Structured JSON Logging Format
\`\`\`json
{
  "timestamp": "2026-08-23T21:22:15.892Z",
  "level": "info",
  "service": "${d.shortName.toLowerCase()}-api",
  "trace_id": "8f3e1a90c42b7d12",
  "span_id": "04b12f6e",
  "event": "http_request_completed",
  "method": "POST",
  "path": "/api/v1/resources",
  "status_code": 201,
  "duration_ms": 18.4,
  "tenant_id": "ws-99a",
  "user_id": "usr-01"
}
\`\`\`

### 4.3 Prometheus Metric Hooks
- \`http_requests_total{method="POST", status="201", handler="/api/v1/resources"}\`
- \`http_request_duration_seconds_bucket{le="0.05"}\`
- \`db_connection_pool_active_connections\`
- \`redis_connected_clients\`
- \`event_bus_lag_seconds\``;
}
