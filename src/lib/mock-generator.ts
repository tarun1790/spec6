import { TechStackPreferences } from "./types";

export interface DomainContext {
  title: string;
  shortName: string;
  category: string;
  primaryEntities: string[];
  primaryActions: string[];
  services: string[];
  apiPrefix: string;
  personas: { role: string; description: string; coreNeed: string; painPoint: string }[];
  p0Requirements: { title: string; desc: string; acceptance: string }[];
  p1Requirements: { title: string; desc: string; acceptance: string }[];
}

function cleanPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");
}

export function extractDomainContext(prompt: string): DomainContext {
  const p = prompt.toLowerCase();

  // 1. Travel / Flight / Hotel
  if (p.includes("flight") || p.includes("travel") || p.includes("hotel") || p.includes("ticket") || p.includes("booking") || p.includes("airline")) {
    return {
      title: "Global Travel & Flight Reservation Platform",
      shortName: "AeroReserve",
      category: "Travel & Hospitality Tech",
      primaryEntities: ["Passenger", "FlightSchedule", "SeatBooking", "AirportTerminal", "TicketReceipt", "BaggageTag", "PaymentRecord"],
      primaryActions: ["Search Flights", "Reserve Cabin Seat", "Process Ticket Payment", "Issue Digital Boarding Pass", "Track Baggage Barcode"],
      services: ["Flight Search Service", "Seat Allocation Engine", "Ticketing & Payments Service", "Airport Integration Gateway", "Notification Dispatcher"],
      apiPrefix: "/api/v1/flights",
      personas: [
        { role: "Frequent Traveler", description: "Business traveler booking last-minute flights with seat selection.", coreNeed: "Sub-second flight search and instant boarding pass generation.", painPoint: "Slow checkout and seat conflict errors." },
        { role: "Airline Operations Lead", description: "Monitors seat availability, flight delays, and gate changes.", coreNeed: "Real-time dispatch dashboard with telemetry feeds.", painPoint: "Stale data synchronization across airport terminals." },
        { role: "Customer Support Agent", description: "Handles booking modifications, cancellations, and refunds.", coreNeed: "Fast booking lookup and 1-click refund workflow.", painPoint: "Complex multi-system reconciliation." },
        { role: "System Administrator", description: "Manages GDS (Global Distribution System) API integrations.", coreNeed: "High availability, zero rate-limit drops, and SLA observability.", painPoint: "Third-party airline API latency spikes." }
      ],
      p0Requirements: [
        { title: "Real-Time Flight Search", desc: "Filter by departure, arrival, date, cabin class, and price with sub-200ms p95 latency.", acceptance: "Returns sorted multi-carrier itineraries with live seat counts." },
        { title: "Seat Reservation & Lock", desc: "Distributed lock mechanism holding seat selection for 10 minutes during checkout.", acceptance: "Guarantees zero double-booking under 5,000 req/sec concurrency." },
        { title: "Payment & Boarding Pass Issuance", desc: "PCI-compliant payment capture with instant signed PDF and Apple Wallet PKPass.", acceptance: "Emits encrypted PKPass barcode within 800ms of payment authorization." }
      ],
      p1Requirements: [
        { title: "Automated Flight Delay Alerts", desc: "Push notification and SMS webhook dispatch on gate changes and delays.", acceptance: "Delivers notifications within 5 seconds of airport feed update." },
        { title: "Frequent Flyer Rewards Engine", desc: "Calculates tier points and miles accrued per segment.", acceptance: "Accrues points immediately upon ticket issuance." }
      ]
    };
  }

  // 2. Food Delivery / Restaurant
  if (p.includes("food") || p.includes("restaurant") || p.includes("meal") || p.includes("delivery") || p.includes("menu") || p.includes("grocer")) {
    return {
      title: "On-Demand Food Delivery & Kitchen Dispatch Platform",
      shortName: "QuickBite",
      category: "Food & Logistics Tech",
      primaryEntities: ["Customer", "Restaurant", "MenuItem", "OrderDelivery", "CourierDriver", "KitchenTicket", "PaymentReceipt"],
      primaryActions: ["Browse Restaurant Menu", "Customize Meal Item", "Dispatch Courier", "Track GPS Location", "Rate Delivery Experience"],
      services: ["Catalog & Menu Service", "Order Dispatch Engine", "Driver Geolocation Cluster", "Payment Gateway Orchestrator", "Push Notification Service"],
      apiPrefix: "/api/v1/orders",
      personas: [
        { role: "Hungry Customer", description: "Orders meals from nearby restaurants with real-time tracking.", coreNeed: "Fast menu browsing and live GPS courier map.", painPoint: "Inaccurate ETA and missing order items." },
        { role: "Restaurant Manager", description: "Manages kitchen prep queue and 86'd out-of-stock items.", coreNeed: "Real-time POS kitchen display system (KDS).", painPoint: "Order surges overwhelming kitchen capacity." },
        { role: "Delivery Courier", description: "Accepts delivery requests and navigates route turn-by-turn.", coreNeed: "Optimized route batching and quick payouts.", painPoint: "Battery drain from continuous GPS pings." },
        { role: "Platform Operations Lead", description: "Monitors city-wide supply/demand balance and surge pricing.", coreNeed: "Heatmap analytics and automated dispatch rules.", painPoint: "Driver shortages during peak dinner hours." }
      ],
      p0Requirements: [
        { title: "Real-Time Menu & Cart Customizer", desc: "Dynamic item modifiers, dietary tags, and live kitchen inventory status.", acceptance: "Cart updates in under 50ms with instant price recalculation." },
        { title: "Live GPS Courier Dispatch", desc: "WebSocket streaming of courier coordinates every 3 seconds to customer map.", acceptance: "Maintains smooth map marker animation with sub-100ms WebSocket latency." },
        { title: "Split Settlement & Payouts", desc: "Splits order gross value into restaurant payout, courier fee, and platform commission.", acceptance: "Executes atomic double-entry ledger postings per order." }
      ],
      p1Requirements: [
        { title: "Dynamic Surge Pricing", desc: "Calculates multiplier based on weather, active couriers, and order velocity.", acceptance: "Updates zone multipliers every 60 seconds." },
        { title: "Scheduled Meal Pre-Orders", desc: "Allows advance ordering with automated kitchen release timers.", acceptance: "Injects order into kitchen queue exactly N minutes before target delivery." }
      ]
    };
  }

  // 3. Streaming / Music / Video / Podcasts
  if (p.includes("music") || p.includes("stream") || p.includes("video") || p.includes("podcast") || p.includes("spotify") || p.includes("netflix") || p.includes("audio")) {
    return {
      title: "Adaptive Bitrate Media Streaming & Discovery Platform",
      shortName: "StreamFlow",
      category: "Media & Entertainment Tech",
      primaryEntities: ["User", "MediaTrack", "Playlist", "PlaybackSession", "ArtistCreator", "SubscriptionPlan", "StreamMetrics"],
      primaryActions: ["Stream HLS Media", "Create Playlist", "Recommend Similar Tracks", "Download Offline Chunk", "Track Playback Telemetry"],
      services: ["Media Ingestion & Transcoding Service", "Adaptive HLS/DASH Streaming Edge", "Discovery & Recommendation Engine", "Subscription Billing Service", "Telemetry Aggregator"],
      apiPrefix: "/api/v1/media",
      personas: [
        { role: "Active Listener", description: "Streams high-res audio and video across mobile and desktop devices.", coreNeed: "Instant bufferless playback and personalized mix playlists.", painPoint: "Audio stutter and slow search indexing." },
        { role: "Content Creator / Artist", description: "Uploads raw media stems, manages release schedules, and views royalty analytics.", coreNeed: "Lossless transcoding and transparent listener metrics.", painPoint: "Delayed revenue reporting and copyright friction." },
        { role: "Curator", description: "Builds public editorial playlists and discovers trending tracks.", coreNeed: "Fast batch playlist editing and collaborative curation.", painPoint: "Lack of granular track sequencing tools." },
        { role: "Infrastructure SRE", description: "Monitors CDN edge cache hit ratios and origin egress bandwidth.", coreNeed: ">95% CDN cache hit ratio and sub-50ms Time-To-First-Byte (TTFB).", painPoint: "High cloud egress bandwidth costs." }
      ],
      p0Requirements: [
        { title: "Adaptive Bitrate Streaming (HLS/DASH)", desc: "Transcodes media into multi-bitrate chunks (64k to 320k audio / 1080p60 video).", acceptance: "Starts audio/video playback with <250ms initial buffering." },
        { title: "Real-Time Telemetry & Progress Sync", desc: "Persists playback position across devices every 5 seconds.", acceptance: "Allows seamless device handoff with 0 second timestamp discrepancy." },
        { title: "Granular DRM & Token Authorization", desc: "Signs ephemeral playback tokens with 15-minute expiration.", acceptance: "Blocks unauthorized hotlinking and stream scraping." }
      ],
      p1Requirements: [
        { title: "Vector-Based Recommendation Feed", desc: "Generates collaborative filtering and audio embedding similarities.", acceptance: "Computes personalized 50-track mix in <150ms." },
        { title: "Offline Storage Encrypted Cache", desc: "Encrypts downloaded chunks on device using AES-128.", acceptance: "Plays offline without network connectivity." }
      ]
    };
  }

  // 4. Social Media / Community / Feed
  if (p.includes("social") || p.includes("feed") || p.includes("twitter") || p.includes("instagram") || p.includes("community") || p.includes("post") || p.includes("follow")) {
    return {
      title: "Real-Time Social Graph & Algorithmic Feed Platform",
      shortName: "PulseNet",
      category: "Social & Community Tech",
      primaryEntities: ["UserProfile", "SocialPost", "ReactionLike", "FollowRelationship", "CommentThread", "ActivityFeed", "NotificationEvent"],
      primaryActions: ["Publish Media Post", "Follow User", "Query Ranked Feed", "React & Comment", "Broadcast Live Activity"],
      services: ["Social Graph Service", "Fan-out Feed Aggregator", "Content Moderation AI", "Real-Time Notification Worker", "Media Upload Service"],
      apiPrefix: "/api/v1/posts",
      personas: [
        { role: "Content Consumer", description: "Scrolls infinite chronological and algorithmic feeds.", coreNeed: "Fast, jitter-free feed loading with instant optimistic likes.", painPoint: "Repetitive content and laggy video autoplay." },
        { role: "Verified Creator", description: "Publishes rich text, images, and short clips to followers.", coreNeed: "Detailed audience reach graphs and comment moderation.", painPoint: "Trolling, spam bots, and delayed notifications." },
        { role: "Community Moderator", description: "Reviews reported content against safety guidelines.", coreNeed: "Automated toxicity scoring and 1-click ban actions.", painPoint: "High volume of manual review tickets." },
        { role: "Data Engineer", description: "Tunes fan-out on write vs fan-out on read feed algorithms.", coreNeed: "Efficient Redis Sorted Set memory usage for high-follower accounts.", painPoint: "Write amplification when mega-influencers post." }
      ],
      p0Requirements: [
        { title: "Hybrid Fan-Out Feed Architecture", desc: "Fan-out on write for standard users (<5,000 followers) and fan-out on read for celebrity accounts.", acceptance: "Delivers new posts to follower timelines in <500ms." },
        { title: "Optimistic Interaction UI", desc: "Instantly updates like counts and bookmark states on client with background retry.", acceptance: "Zero UI flicker on network latency spikes." },
        { title: "Automated Safety & Text Moderation", desc: "Scans uploaded text and media for prohibited content before public indexation.", acceptance: "Completes toxicity classification within 120ms." }
      ],
      p1Requirements: [
        { title: "Full-Text Hashtag & Mention Indexing", desc: "Elasticsearch indexing of hashtags and username tags.", acceptance: "Autocompletes search queries in <40ms." },
        { title: "Direct Messaging End-to-End Encryption", desc: "Signal protocol Double Ratchet ratchet for private DMs.", acceptance: "Guarantees zero plaintext stored on servers." }
      ]
    };
  }

  // 5. Crypto / Web3 / Fintech
  if (p.includes("crypto") || p.includes("wallet") || p.includes("fintech") || p.includes("ledger") || p.includes("bank") || p.includes("payment") || p.includes("token")) {
    return {
      title: "Institutional Multi-Asset Ledger & Settlement Engine",
      shortName: "LedgerNexus",
      category: "Fintech & Web3 Infrastructure",
      primaryEntities: ["Account", "Wallet", "JournalEntry", "LedgerPosting", "FXRate", "PaymentIntent", "AuditProof"],
      primaryActions: ["Post Double-Entry Transaction", "Exchange FX Currency", "Hold Escrow Balance", "Evaluate Fraud Velocity", "Reconcile Settlement"],
      services: ["Ledger Core Service", "Settlement & FX Engine", "Payment Gateway Orchestrator", "Real-Time Fraud Engine", "Compliance & Vault Service"],
      apiPrefix: "/api/v1/ledger",
      personas: [
        { role: "Treasury Manager", description: "Oversees multi-currency liquidity and settlement balances.", coreNeed: "Real-time gross settlement (RTGS) reconciliation.", painPoint: "Manual spreadsheets and currency slippage." },
        { role: "Compliance Officer", description: "Monitors AML/KYC thresholds and suspicious transaction velocity.", coreNeed: "Automated SAR (Suspicious Activity Report) flagging.", painPoint: "High false-positive fraud alerts." },
        { role: "API Developer", description: "Integrates programmatic wallet transfers and payments.", coreNeed: "Idempotent payment APIs with strict signature verification.", painPoint: "Duplicate payment processing on network retries." },
        { role: "Security Auditor", description: "Verifies cryptographic proof-of-reserves and key custody.", coreNeed: "Immutable append-only audit trail.", painPoint: "Untracked database schema migrations." }
      ],
      p0Requirements: [
        { title: "Strict Double-Entry Ledger Invariant", desc: "Every transaction requires balanced debits and credits: `SUM(debits) - SUM(credits) === 0`.", acceptance: "Enforces database-level constraint preventing negative balances." },
        { title: "Idempotent Payment Intents", desc: "Requires unique `Idempotency-Key` header with 24-hour deduplication cache in Redis.", acceptance: "Repeated API calls return identical original response without re-executing transfer." },
        { title: "Hardware Security Module (HSM) Vault", desc: "Encrypts private keys with AES-256-GCM using multi-sig authorization.", acceptance: "Zero plaintext private keys exist in application memory." }
      ],
      p1Requirements: [
        { title: "Real-Time FX Rate Stream", desc: "Connects to institutional liquidity feeds for sub-second currency conversion.", acceptance: "Locks quoted exchange rate for 30 seconds." },
        { title: "Automated Fraud Velocity Rules", desc: "Blocks accounts exceeding >3 transactions per second or velocity anomalies.", acceptance: "Evaluates fraud rule engine in <15ms." }
      ]
    };
  }

  // 6. Generic Intelligent NLP Fallback (Extracts entities directly from prompt)
  const words = prompt
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .filter((w) => w.length > 3);

  const rawShortName = words[0] ? cleanPascalCase(words[0]) : "SystemCore";
  const title = prompt.length > 5 && prompt.length < 60 ? prompt : `${rawShortName} Enterprise Platform`;
  const shortName = rawShortName || "AppPlatform";

  // Formulate dynamic entities from words in prompt
  const baseEntities = ["User", "Workspace", "ActivityLog", "AuditRecord", "SubscriptionPlan"];
  const dynamicEntities = words.slice(0, 4).map((w) => cleanPascalCase(w));
  const primaryEntities = Array.from(new Set([...dynamicEntities, ...baseEntities])).slice(0, 7);

  return {
    title,
    shortName,
    category: "Cloud Native Software System",
    primaryEntities,
    primaryActions: [
      `Create ${primaryEntities[0]}`,
      `Update ${primaryEntities[1] || "Record"}`,
      `Query ${primaryEntities[0]} List`,
      "Authenticate User Session",
      "Export Data Analytics"
    ],
    services: [
      `${primaryEntities[0]} Core Service`,
      "Identity & Access Management (IAM)",
      "Async Event Processing Worker",
      "Real-Time WebSocket Gateway",
      "Telemetry & Analytics Aggregator"
    ],
    apiPrefix: `/api/v1/${primaryEntities[0].toLowerCase()}s`,
    personas: [
      { role: "Primary End User", description: "Interacts with the web and mobile applications daily.", coreNeed: "Fast, intuitive user experience and reliable data sync.", painPoint: "Complicated workflows and slow page loads." },
      { role: "Operations Lead", description: "Manages day-to-day organizational workflows and resources.", coreNeed: "Comprehensive administrative dashboard and audit logs.", painPoint: "Lack of centralized reporting tools." },
      { role: "Integration Developer", description: "Connects external services and automated scripts via REST/GraphQL APIs.", coreNeed: "Well-documented OpenAPI specs, webhook reliability, and SDKs.", painPoint: "Undocumented breaking changes and rate limits." },
      { role: "Security & DevOps Engineer", description: "Maintains infrastructure security, compliance, and uptime SLAs.", coreNeed: "99.99% uptime, automated CI/CD pipelines, and zero CVEs.", painPoint: "Manual server provisioning and configuration drift." }
    ],
    p0Requirements: [
      { title: `Core ${primaryEntities[0]} Management`, desc: `Full CRUD lifecycle management for ${primaryEntities[0]} with input validation.`, acceptance: "Validates request payloads against strict Zod/Pydantic schemas with <100ms response." },
      { title: "Zero-Trust Role-Based Access Control (RBAC)", desc: "Enforces granular permission checks on every API endpoint and data access layer.", acceptance: "Blocks unauthorized requests with HTTP 403 Forbidden." },
      { title: "Real-Time Event Notification", desc: `Publishes domain events to message bus upon state changes of ${primaryEntities[0]}.`, acceptance: "Delivers event payloads to subscribers in <50ms." }
    ],
    p1Requirements: [
      { title: "Comprehensive Audit Trail Logging", desc: "Logs all administrative changes with actor ID, timestamp, and before/after diff.", acceptance: "Writes immutable audit entries with 100% durability." },
      { title: "High-Throughput Batch Export", desc: "Asynchronously exports data in CSV, JSON, and Parquet formats.", acceptance: "Generates downloadable signed URL within 10 seconds for 100,000 records." }
    ]
  };
}

export function generateMockStageContent(
  stageIndex: number,
  userPrompt: string,
  techStack: TechStackPreferences,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  accumulatedContext: Record<string, string>
): string {
  const domain = extractDomainContext(userPrompt || "Enterprise Cloud System");

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
This specification suite defines the end-to-end architecture, implementation roadmap, quality assurance strategy, security posture, and deployment configuration for **${d.title}** (${d.shortName}).

The primary objective is to deliver a cloud-native, high-throughput software system engineered with **${stack.architecture}**, leveraging **${stack.frontend}** for the client interface, **${stack.backend}** for business logic execution, **${stack.database}** for transactional integrity, and **${stack.caching}** for distributed performance.

### Core User Prompt
> "${prompt.trim() || "Design an enterprise-grade high-performance cloud platform."}"

---

## 2. User Persona Matrix

| Persona Role | Target Audience Profile | Core Functional Need | Critical Pain Point Mitigated |
| :--- | :--- | :--- | :--- |
${d.personas.map((p) => `| **${p.role}** | ${p.description} | ${p.coreNeed} | ${p.painPoint} |`).join("\n")}

---

## 3. Functional Requirements Matrix (P0 / P1 / P2)

### 3.1 P0 (Must Have - MVP Critical Path)
| ID | Requirement Name | Description | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
${d.p0Requirements.map((r, i) => `| **REQ-P0-0${i + 1}** | **${r.title}** | ${r.desc} | ${r.acceptance} |`).join("\n")}
| **REQ-P0-04** | **Identity & RBAC Access** | Secure authentication supporting ${stack.auth} with refresh token rotation. | Issues signed JWT tokens with 15-minute expiration and automated refresh. |

### 3.2 P1 (High Priority - Production Hardening)
| ID | Requirement Name | Description | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
${d.p1Requirements.map((r, i) => `| **REQ-P1-0${i + 1}** | **${r.title}** | ${r.desc} | ${r.acceptance} |`).join("\n")}

### 3.3 P2 (Nice-to-Have - Future Milestones)
| ID | Requirement Name | Description | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **REQ-P2-01** | **Advanced AI Copilot** | Natural language query interface for analytics and automated workflows. | Generates accurate SQL/JSON queries with human-in-the-loop review. |
| **REQ-P2-02** | **Multi-Region Active-Active** | Cross-region data replication for global disaster recovery. | Failover completes in <30 seconds with zero data loss (RPO=0). |

---

## 4. Non-Functional Requirements & SLA Commitments

| SLA Vector | Target Metric | Engineering Enforcement Mechanism |
| :--- | :--- | :--- |
| **Availability** | **99.99% Uptime** | Multi-AZ Kubernetes pod replica spreads, health checks, and automated pod restarts. |
| **API Latency** | **p95 < 120ms** | Multi-tier Redis caching, connection pooling, and indexed SQL query optimization. |
| **Concurrency** | **10,000+ RPS** | Horizontal Pod Autoscaling (HPA) triggered at >70% CPU/Memory utilization. |
| **Security** | **OWASP Top 10 Defenses** | WAF filtering, parameterized SQL, strict CSP headers, and RBAC token middleware. |
| **Disaster Recovery** | **RTO < 5 min, RPO = 0** | Continuous WAL archiving to S3, automated point-in-time recovery (PITR). |
`;
}

// Stage 1: 01_SYSTEM_ARCHITECTURE.md
function generateSystemArchitecture(prompt: string, stack: TechStackPreferences, d: DomainContext): string {
  const e1 = cleanPascalCase(d.primaryEntities[0] || "User");
  const e2 = cleanPascalCase(d.primaryEntities[1] || "Record");
  const e3 = cleanPascalCase(d.primaryEntities[2] || "Project");
  const e4 = cleanPascalCase(d.primaryEntities[3] || "Task");
  const e5 = cleanPascalCase(d.primaryEntities[4] || "Payment");

  return `# 01_SYSTEM_ARCHITECTURE.md: Topology & Schema Blueprint

## 1. Architectural Overview & Design Rationales

| Layer | Selected Technology | Rationale & Architectural Trade-offs |
| :--- | :--- | :--- |
| **Frontend** | ${stack.frontend} | Server Components minimize client bundle size; App Router enables streaming hydration. |
| **Backend** | ${stack.backend} | High async I/O concurrency, strict type enforcement, built-in validation schemas. |
| **Database** | ${stack.database} | ACID compliance for transactional data integrity; robust B-Tree indexing. |
| **Caching** | ${stack.caching} | Sub-millisecond latency for session caching, distributed locks, and pub/sub. |
| **Deployment** | ${stack.deployment} | Infrastructure-as-Code automation, zero-downtime rolling deploys, auto-scaling. |

---

## 2. Visual System Topology

\`\`\`mermaid
flowchart TD
    subgraph Clients ["Client Layer"]
        WebClient["Desktop & Mobile Web App"]
        MobileClient["Mobile Native App"]
    end

    subgraph Ingress ["Edge & Ingress Layer"]
        CDN["Cloud CDN / Edge Cache"]
        WAF["Web Application Firewall"]
        LoadBalancer["Application Load Balancer"]
    end

    subgraph AppGateway ["API Gateway & Security"]
        Gateway["API Gateway Proxy"]
        AuthMid["JWT / RBAC Middleware"]
        RateLim["Distributed Rate Limiter"]
    end

    subgraph Services ["Core Microservices"]
        S1["${d.services[0]}"]
        S2["${d.services[1] || "Core Service"}"]
        S3["${d.services[2] || "Worker Service"}"]
    end

    subgraph DataTier ["Data & Caching Tier"]
        DBStore["Primary Database (PostgreSQL 16)"]
        CacheStore["Distributed Cache (Redis)"]
    end

    WebClient --> CDN
    MobileClient --> CDN
    CDN --> WAF
    WAF --> LoadBalancer
    LoadBalancer --> Gateway
    Gateway --> AuthMid
    AuthMid --> RateLim
    RateLim --> S1
    RateLim --> S2
    RateLim --> S3
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
    ${e2} ||--o{ ${e3} : contains
    ${e3} ||--o{ ${e4} : tracks
    ${e1} ||--o{ ${e5} : records

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
        timestamp created_at
    }

    ${e3} {
        uuid id PK
        uuid parent_id FK
        string title
        decimal value
        timestamp created_at
    }

    ${e4} {
        uuid id PK
        uuid item_id FK
        string state
        timestamp updated_at
    }

    ${e5} {
        uuid id PK
        uuid user_id FK
        decimal amount
        string status
        timestamp created_at
    }
\`\`\`

---

## 4. RESTful API Contracts (OpenAPI 3.1)

### 4.1 Create ${e1}
\`\`\`http
POST ${d.apiPrefix}
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "name": "${d.shortName} Master Record",
  "status": "active",
  "metadata": {
    "tier": "enterprise"
  }
}
\`\`\`

**Response (201 Created):**
\`\`\`json
{
  "status": "success",
  "data": {
    "id": "e4b2d3c1-7a8f-4f9e-9d2a-1b2c3d4e5f6a",
    "name": "${d.shortName} Master Record",
    "status": "active",
    "created_at": "2026-08-23T20:00:00Z"
  }
}
\`\`\`

### 4.2 Query ${e1} List
\`\`\`http
GET ${d.apiPrefix}?limit=20&cursor=eyJpZCI6MTAwfQ==
Authorization: Bearer <jwt_token>
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "status": "success",
  "data": [],
  "pagination": {
    "has_more": false,
    "next_cursor": null,
    "total_count": 0
  }
}
\`\`\`
`;
}

// Stage 2: 02_IMPLEMENTATION_PLAN.md
function generateImplementationPlan(prompt: string, stack: TechStackPreferences, d: DomainContext): string {
  return `# 02_IMPLEMENTATION_PLAN.md: Engineering Roadmap & Milestones

## 1. Production Repository Directory Structure

\`\`\`text
${d.shortName.toLowerCase()}-monorepo/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Lint, TypeCheck, Unit Tests
│       └── deploy.yml             # Container build and EKS deployment
├── docker/
│   ├── Dockerfile.production      # Multi-stage production container
│   └── docker-compose.yml         # Local orchestration (DB, Redis, App)
├── src/
│   ├── app/                       # Next.js 14 App Router (Layouts & Pages)
│   │   ├── api/                   # Route handlers & REST API endpoints
│   │   │   └── v1/
│   │   │       ├── auth/          # Authentication & Token routes
│   │   │       └── ${d.primaryEntities[0].toLowerCase()}s/      # ${d.primaryEntities[0]} domain controllers
│   │   └── layout.tsx             # Root layout & providers
│   ├── components/                # Reusable UI component library
│   │   ├── ui/                    # Base design system primitives
│   │   └── domain/                # ${d.shortName} business components
│   ├── lib/
│   │   ├── db.ts                  # Database client pool
│   │   ├── redis.ts               # Redis cache & distributed locks
│   │   └── auth.ts                # JWT verification & RBAC guards
│   └── types/
│       └── index.ts               # Domain TypeScript interfaces
├── prisma/
│   └── schema.prisma              # PostgreSQL ORM schema definitions
├── tests/
│   ├── unit/                      # Vitest unit test suites
│   ├── integration/               # API route integration tests
│   └── e2e/                       # Playwright end-to-end master specs
└── package.json
\`\`\`

---

## 2. Phased Engineering Milestones

### Milestone 1: Data Modeling, Auth & Core API (Weeks 1 - 2)
- [ ] Initialize repository with TypeScript, Tailwind CSS, and ESLint configs.
- [ ] Provision PostgreSQL 16 and apply initial Prisma migrations for \`${d.primaryEntities.join(", ")}\`.
- [ ] Implement JWT/OAuth2 authentication middleware with refresh token rotation.
- [ ] Build CRUD REST endpoints under \`${d.apiPrefix}\` with Zod input validation schemas.

### Milestone 2: Business Logic & Real-time Integration (Weeks 3 - 4)
- [ ] Implement core business logic for **${d.primaryActions[0]}** and **${d.primaryActions[1] || "Processing"}**.
- [ ] Integrate Redis cache-aside patterns and distributed locks on critical mutations.
- [ ] Establish WebSocket / SSE streaming cluster for live user updates.
- [ ] Implement rate limiting (100 req/min per IP) via token bucket algorithm.

### Milestone 3: Testing, Quality Assurance & Security Hardening (Weeks 5 - 6)
- [ ] Author unit tests achieving >80% code coverage across domain services.
- [ ] Implement integration tests verifying all HTTP error codes (\`400\`, \`401\`, \`403\`, \`404\`, \`422\`, \`500\`).
- [ ] Configure Playwright E2E test suites for primary user journeys.
- [ ] Run OWASP ZAP vulnerability scan and fix all high/medium security issues.

### Milestone 4: CI/CD, Containerization & Production Launch (Weeks 7 - 8)
- [ ] Author multi-stage Dockerfile with non-root security context.
- [ ] Configure GitHub Actions CI/CD pipeline deploying to Kubernetes (EKS).
- [ ] Implement Prometheus metrics endpoint (\`/metrics\`) and OpenTelemetry tracing.
- [ ] Execute load testing at 10,000 RPS and verify SLA latency commitments.
`;
}

// Stage 3: 03_TESTING_STRATEGY.md
function generateTestingStrategy(prompt: string, stack: TechStackPreferences, d: DomainContext): string {
  return `# 03_TESTING_STRATEGY.md: Quality Assurance & Test Automation Matrix

## 1. Testing Pyramid & Target Coverage Commitments

| Test Tier | Scope & Focus | Target Coverage | Framework & Tooling |
| :--- | :--- | :---: | :--- |
| **Unit Tests** | Pure business logic, entity helpers, validation schemas. | **> 85%** | Vitest / Jest |
| **Integration Tests** | API route handlers, SQL transactions, Redis lock mechanics. | **> 80%** | Supertest / Vitest |
| **End-to-End (E2E)** | Critical user journeys, authentication flows, checkout/booking. | **100% Core** | Playwright (Headless Chrome) |
| **Load / Performance** | Concurrency bottlenecks, DB connection pooling, rate limits. | **10,000 RPS** | k6 / Artillery |

---

## 2. Playwright End-to-End (E2E) Master Test Suite

\`\`\`typescript
import { test, expect } from "@playwright/test";

test.describe("${d.title} - Critical Path User Journey", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to application base URL
    await page.goto("/");
  });

  test("TC-01: Successfully authenticate and access dashboard", async ({ page }) => {
    // Click Sign In
    await page.click('[data-testid="btn-login"]');
    
    // Fill credentials
    await page.fill('[data-testid="input-email"]', "test.user@${d.shortName.toLowerCase()}.io");
    await page.fill('[data-testid="input-password"]', "SecurePassword123!");
    await page.click('[data-testid="btn-submit-login"]');

    // Verify successful redirection to workspace
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('[data-testid="user-greeting"]')).toBeVisible();
  });

  test("TC-02: Execute primary action (${d.primaryActions[0]})", async ({ page }) => {
    await page.goto("/dashboard");

    // Trigger primary creation workflow
    await page.click('[data-testid="btn-primary-action"]');
    await page.fill('[data-testid="input-name"]', "Automated E2E Test Record");
    await page.click('[data-testid="btn-confirm-save"]');

    // Verify toast notification and table update
    await expect(page.locator('[data-testid="toast-success"]')).toContainText("Successfully saved");
    await expect(page.locator('[data-testid="record-table"]')).toContainText("Automated E2E Test Record");
  });
});
\`\`\`
`;
}

// Stage 4: 04_SECURITY_COMPLIANCE.md
function generateSecurityCompliance(prompt: string, stack: TechStackPreferences, d: DomainContext): string {
  return `# 04_SECURITY_COMPLIANCE.md: Security Architecture & OWASP Matrix

## 1. Role-Based Access Control (RBAC) Permission Matrix

| Role | Scope | Permissions Granted |
| :--- | :--- | :--- |
| **Super Admin** | Global Tenant | \`*:*\` (Full system configuration, user provisioning, billing, audit logs) |
| **Organization Manager** | Tenant Boundary | \`${d.shortName.toLowerCase()}:write\`, \`${d.shortName.toLowerCase()}:read\`, \`users:invite\`, \`reports:export\` |
| **Standard User** | Own Resources | \`${d.shortName.toLowerCase()}:read\`, \`${d.shortName.toLowerCase()}:create\`, \`profile:update\` |
| **Read-Only Auditor** | Tenant Boundary | \`*:read\` (Zero mutation permissions, audit logs read-only) |

---

## 2. OWASP Top 10 Mitigation Blueprint

| OWASP Vulnerability | Technical Countermeasure & Defense-in-Depth |
| :--- | :--- |
| **A01: Broken Access Control** | Enforce compound tenant queries (\`WHERE id = :id AND tenant_id = :auth_tenant\`). Strict RBAC token verification. |
| **A02: Cryptographic Failures** | TLS 1.3 enforced in transit. AES-256-GCM encryption at rest via AWS KMS. Passwords hashed with Argon2id. |
| **A03: Injection (SQL / XSS)** | Parameterized queries via typed ORM. DOMPurify sanitization. Strict Content Security Policy (CSP). |
| **A04: Insecure Design** | Threat modeling per service. Distributed token-bucket rate limiting (100 req/min). |
| **A05: Security Misconfiguration** | Hardened multi-stage Docker container running as non-root user (\`appuser:10001\`). |

---

## 3. Environment Variable Dictionary

| Variable Name | Sensitivity | Description |
| :--- | :---: | :--- |
| \`NODE_ENV\` | Public | Runtime environment mode (\`production\` / \`staging\`). |
| \`DATABASE_URL\` | **Secret** | PostgreSQL connection string with SSL mode required. |
| \`REDIS_URL\` | **Secret** | Redis cluster connection string with TLS enabled. |
| \`JWT_SECRET_KEY\` | **Secret** | 256-bit secret key for signing authentication tokens. |
| \`ENCRYPTION_KEY_AES256\` | **Secret** | 32-byte master key for AES-256-GCM database field encryption. |
`;
}

// Stage 5: 05_DEPLOYMENT_DEVOPS.md
function generateDeploymentDevops(prompt: string, stack: TechStackPreferences, d: DomainContext): string {
  return `# 05_DEPLOYMENT_DEVOPS.md: Infrastructure, CI/CD & Operations Blueprint

## 1. Multi-Stage Production Dockerfile

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
# Stage 2: Minimal Production Runtime
# ----------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user for security hardening
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

## 2. GitHub Actions CI/CD Workflow (\`.github/workflows/deploy.yml\`)

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

  build-and-deploy:
    needs: validate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker Image
        run: docker build -t ${d.shortName.toLowerCase()}:latest -f docker/Dockerfile.production .
      - name: Deploy to Kubernetes Cluster
        run: echo "Deployed ${d.shortName} to production cluster."
\`\`\`
`;
}
