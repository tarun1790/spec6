import { TechStackPreferences } from "./types";

export interface ProjectTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  prompt: string;
  defaultTechStack: TechStackPreferences;
}

export const TEMPLATES: ProjectTemplate[] = [
  {
    id: "ecommerce-microservices",
    name: "E-Commerce Microservices",
    category: "Retail & Cloud",
    description: "High-throughput event-driven store with inventory, payment gateway, and cart microservices.",
    prompt: `Design an enterprise-grade, high-throughput E-Commerce Microservices Platform.
The system needs to support high concurrency during flash sales (up to 50,000 requests/sec), featuring:
1. Product Catalog Service with elastic faceted search and real-time inventory level tracking.
2. Shopping Cart & Checkout Service with distributed locks (Redis Redlock) to prevent inventory overselling.
3. Order Management & Payment Processing Orchestrator supporting Stripe, PayPal, and idempotent webhook callbacks with automated compensation sagas.
4. User Identity & Multi-factor Auth with Customer vs Merchant RBAC.
5. Asynchronous Event-Driven Messaging using Apache Kafka / RabbitMQ for order fulfillment, invoice generation, and real-time notifications.
6. Real-time Admin Analytics Dashboard for GMV, conversion funnels, and inventory low-stock alerts.`,
    defaultTechStack: {
      frontend: "Next.js 14 (App Router) + Tailwind CSS + Zustand",
      backend: "FastAPI & Node.js Microservices (gRPC + REST)",
      database: "PostgreSQL (Prisma/SQLAlchemy) + Redis + DynamoDB",
      architecture: "Event-Driven Microservices with Kafka & Saga Orchestration",
      deployment: "Kubernetes (EKS) + Docker + Terraform + AWS CloudFront",
      auth: "OAuth 2.0 / JWT with Refresh Token Rotation & RBAC",
      caching: "Redis Cluster with Cache-Aside & Write-Behind strategy"
    }
  },
  {
    id: "realtime-chat-collab",
    name: "Real-Time Collab & Chat",
    category: "Productivity & WebSockets",
    description: "Multi-workspace team messenger with channels, voice rooms, CRDT document collaboration.",
    prompt: `Architect a next-generation real-time team collaboration platform combining Discord-style channels and Notion-style collaborative live canvas.
Core capabilities:
1. Multi-tenant workspaces with granular team channels (Public, Private, Direct Messages) and thread hierarchies.
2. Ultra-low latency WebSocket & WebRTC communication cluster supporting presence, typing indicators, read receipts, and ephemeral reactions.
3. Conflict-Free Replicated Data Types (Yjs / CRDTs) powered live document editing engine supporting concurrent multi-cursor edits.
4. Rich media pipeline: Image/video transcoding, S3 presigned direct uploads, and full-text vector search across chat history and document attachments.
5. Granular permission matrix (Owner, Admin, Moderator, Member, Guest) with SSO (SAML/Okta) enterprise integration.`,
    defaultTechStack: {
      frontend: "React 18 + Vite + Tailwind CSS + TipTap / Yjs",
      backend: "Node.js (Fastify) + Go WebSocket Gateway",
      database: "PostgreSQL + Redis Streams + ClickHouse for audit logs",
      architecture: "Hybrid Modular Monolith + Real-time Socket Cluster",
      deployment: "Docker Compose / AWS ECS Fargate + Cloudflare CDN",
      auth: "Supabase Auth / NextAuth with Enterprise SAML SSO",
      caching: "Redis Pub/Sub & Memory Cache for Presence"
    }
  },
  {
    id: "healthcare-telemedicine",
    name: "Telemedicine & HIPAA Portal",
    category: "Healthcare & Compliance",
    description: "HIPAA-compliant virtual clinic with encrypted video consultations, EHR, and e-prescriptions.",
    prompt: `Engineer a strictly compliant, secure Telemedicine and Electronic Health Record (EHR) Platform meeting HIPAA, HITECH, and GDPR regulatory requirements.
Key components:
1. Patient & Provider Portals: Biometric MFA login, self-service appointment booking with timezone-aware calendar synchronization.
2. End-to-End Encrypted WebRTC Video Consultation Rooms with automated ephemeral recording storage and digital waiting rooms.
3. FHIR (Fast Healthcare Interoperability Resources) compliant Clinical Data Repository for medical histories, allergies, vitals, and lab results.
4. E-Prescription & Pharmacy Network Integration with digital signature verification (PKI) and automated drug-drug interaction warning engines.
5. Immutable audit logging tracking every PHI (Protected Health Information) data read/write operation for compliance reporting.`,
    defaultTechStack: {
      frontend: "Next.js 14 + Shadcn UI + WebRTC SDK",
      backend: "Python FastAPI (FHIR Rest API) + Celery workers",
      database: "PostgreSQL with Row-Level Security (RLS) + AWS KMS encryption",
      architecture: "Secure Service-Oriented Architecture with Zero-Trust VPC",
      deployment: "AWS GovCloud / HIPAA-Compliant ECS + Terraform",
      auth: "OpenID Connect + Multi-Factor WebAuthn / TOTP + ABAC",
      caching: "Encrypted Redis Cluster with strict TTL"
    }
  },
  {
    id: "ai-multiagent-workflow",
    name: "AI Multi-Agent Orchestrator",
    category: "Artificial Intelligence",
    description: "Autonomous multi-agent execution pipeline with memory graphs, tool calling, and human-in-the-loop.",
    prompt: `Design an autonomous AI Multi-Agent Workflow Engine for complex enterprise operations.
Core Requirements:
1. Visual DAG (Directed Acyclic Graph) Workflow Builder allowing users to chain specialized agents (Researcher, Coder, Critic, Verifier).
2. Agent Runtime Engine supporting asynchronous task delegation, tool execution sandboxes (Python code runner, web crawler, SQL executor), and state checkpointing.
3. Dual-tier Memory Layer: Episodic memory (Vector DB with semantic hybrid search) and Long-term semantic knowledge graph (Neo4j).
4. Human-In-The-Loop (HITL) approval gates with real-time SSE streaming of agent thoughts, intermediate reasoning, and confidence metrics.
5. Rate limiting, budget guardrails, token consumption auditing, and model fallback cascades (Claude 3.5 Sonnet -> GPT-4o -> Local Ollama).`,
    defaultTechStack: {
      frontend: "React Flow + Next.js + Tailwind CSS",
      backend: "Python 3.11+ (FastAPI + LangGraph + AsyncIO)",
      database: "PostgreSQL (pgvector) + Neo4j + Redis",
      architecture: "Asynchronous Event-Driven Micro-Agent Architecture",
      deployment: "Docker + Kubernetes with GPU Node Pools + GCP Cloud Run",
      auth: "Clerk / JWT with Organization API Keys & Role RBAC",
      caching: "Redis Semantic Cache for LLM embeddings & responses"
    }
  },
  {
    id: "fintech-ledger-payments",
    name: "Fintech Ledger & Payments",
    category: "Financial Services",
    description: "Double-entry multi-currency ledger with sub-millisecond settlement and real-time fraud scoring.",
    prompt: `Architect a bank-grade, immutable Double-Entry Multi-Currency Ledger and Payment Orchestration Engine.
Requirements:
1. Strict double-entry bookkeeping engine ensuring zero fractional penny drift, ACID compliance, and idempotency across all transactions.
2. Multi-currency wallet balances supporting real-time FX spot conversion, automated ledger rebalancing, and escrow hold-and-settle mechanics.
3. Payment Gateway Router with smart fallback routing across Adyen, Stripe, Plaid ACH, and SEPA rails.
4. Real-time Fraud Detection & AML (Anti-Money Laundering) scoring pipeline analyzing velocity, geo-anomalies, and device fingerprinting.
5. PCI-DSS Level 1 compliant tokenization vault for sensitive credit card and banking PAN storage.`,
    defaultTechStack: {
      frontend: "Next.js + Tailwind CSS + Recharts Financial Suite",
      backend: "Go (Golang) High-Performance Engine + Node.js API Gateway",
      database: "CockroachDB (Distributed SQL) + TigerGraph + Redis",
      architecture: "CQRS + Event Sourcing with Apache Kafka",
      deployment: "AWS Multi-AZ Private Subnets + Terraform + HashiCorp Vault",
      auth: "mTLS + OAuth 2.0 with Hardware Security Module (HSM) signing",
      caching: "Redis Enterprise Active-Active Geo-Replication"
    }
  },
  {
    id: "saas-analytics-platform",
    name: "B2B SaaS Analytics",
    category: "Enterprise Software",
    description: "High-volume telemetry ingestion, real-time funnel charts, tenant isolation, and custom alert webhooks.",
    prompt: `Build a modern, high-throughput B2B SaaS Product Analytics and Telemetry Platform (similar to Mixpanel + Datadog).
Key Requirements:
1. High-throughput event ingestion endpoint capable of handling 100M+ daily events via lightweight SDKs (JS, Python, iOS, Android).
2. Real-time analytical query engine for interactive Funnel Analysis, Cohort Retention Curves, User Session Replay metadata, and Segmentation.
3. Multi-tenant database architecture with strict tenant isolation, schema-per-tenant or row-level tenant security, and data export compliance (GDPR/CCPA).
4. Custom Alert Engine with threshold triggers and webhooks (Slack, Discord, PagerDuty, Email).
5. Subscription Billing Engine integrating Stripe Customer Portal with usage-based metered billing tiers.`,
    defaultTechStack: {
      frontend: "Next.js 14 + Tremor / Tailwind + ECharts",
      backend: "Node.js (NestJS) + Go Ingestion Worker",
      database: "ClickHouse (OLAP) + PostgreSQL (OLTP) + Redis",
      architecture: "Lambda Architecture (Stream Ingest + Batch OLAP)",
      deployment: "Docker Compose / Kubernetes + AWS NLB + Cloudflare",
      auth: "Auth0 / WorkOS Enterprise SSO with Org-level RBAC",
      caching: "Redis for Session & Dashboard Tile Cache"
    }
  },
  {
    id: "iot-edge-telemetry",
    name: "IoT Edge & Telemetry Mesh",
    category: "IoT & Embedded",
    description: "MQTT mesh ingestion, timeseries aggregation, edge device firmware OTA updates.",
    prompt: `Architect a scalable Industrial IoT (IIoT) Edge Device Management and High-Velocity Sensor Telemetry Mesh.
Requirements:
1. Ingest 500,000 sensor telemetry messages/sec over MQTT (EMQX) and CoAP with TLS mutual authentication.
2. Time-series data store with automated downsampling, continuous rollups, and retention policies.
3. Over-The-Air (OTA) firmware update manager with canary rollouts, checksum validation, and automated rollback upon sensor bricking.
4. Edge AI inference engine dispatcher pushing lightweight ONNX models to remote gateways.
5. Real-time geospatial asset tracking map with geofencing anomaly alerts.`,
    defaultTechStack: {
      frontend: "Next.js + Mapbox GL + Tailwind CSS",
      backend: "Rust (Actix-Web) Ingestion Broker + Python Analytics Service",
      database: "TimescaleDB / InfluxDB + Redis TimeSeries + PostgreSQL",
      architecture: "Edge-to-Cloud Distributed Mesh Architecture",
      deployment: "Kubernetes (K3s on Edge, EKS in Cloud) + Terraform",
      auth: "X.509 Device Certificates + JWT Token Auth",
      caching: "Redis Edge Cache"
    }
  },
  {
    id: "video-streaming-cdn",
    name: "Video CDN & Live Transcoding",
    category: "Media & WebRTC",
    description: "HLS/DASH adaptive bitrate streaming, low-latency live broadcast, distributed edge caching.",
    prompt: `Design a global Video-On-Demand (VOD) and Ultra-Low Latency Live Streaming Platform (similar to Twitch + Netflix).
Requirements:
1. Multi-bitrate live video ingestion via RTMP and SRT with automated FFmpeg / GPU transcoding into HLS / LL-HLS / MPEG-DASH renditions (1080p60, 720p60, 480p, 360p).
2. Distributed Edge CDN caching hierarchy with token authentication and anti-leeching signed URLs.
3. Real-time synchronized live chat cluster handling 100,000 concurrent viewers per stream channel.
4. Digital Rights Management (DRM) integration supporting Widevine, FairPlay, and PlayReady.
5. Automated VOD archive packaging with thumbnail sprites, AI audio transcription, and content moderation.`,
    defaultTechStack: {
      frontend: "Next.js + Video.js / Shaka Player + Tailwind",
      backend: "Go (Golang) Transcoding Orchestrator + Node.js API Gateway",
      database: "PostgreSQL + ScyllaDB (High-write Chat) + S3 Storage",
      architecture: "Microservices with Distributed GPU Transcoding Workers",
      deployment: "AWS ECS with GPU Instances + Cloudflare Stream + Terraform",
      auth: "OAuth 2.0 / OpenID Connect + Signed HLS Tokens",
      caching: "Redis Cluster & Edge Anycast CDN"
    }
  },
  {
    id: "web3-smart-contract-vault",
    name: "Web3 Vault & Decentralized Escrow",
    category: "Blockchain & DeFi",
    description: "Multi-sig treasury vault, automated smart contract escrow, cross-chain bridge indexer.",
    prompt: `Architect an institutional Web3 Multi-Signature Treasury Vault and Automated Escrow Platform.
Requirements:
1. Multi-chain smart contract integration (Ethereum EVM, Solana, Arbitrum, Polygon) with Gas Station network relayer for gasless user execution.
2. Multi-party computation (MPC) and threshold signature scheme (TSS) vault management with time-locks and emergency circuit breakers.
3. Real-time on-chain transaction indexer with WebSocket event broadcast and mempool transaction monitoring.
4. Automated smart contract verification and static security analysis pipeline (Slither, Mythril) before deployment.
5. Institutional compliance module with automated chainalysis risk scoring and Travel Rule compliance.`,
    defaultTechStack: {
      frontend: "Next.js + Wagmi / Viem + Tailwind CSS",
      backend: "Node.js (NestJS) + Go Chain Indexer",
      database: "PostgreSQL + Redis + IPFS / Arweave for metadata",
      architecture: "Hybrid Web2-Web3 Event-Driven Architecture",
      deployment: "Docker Compose + AWS Private Cluster + Alchemy / Infura",
      auth: "Sign-In with Ethereum (SIWE / ERC-4361) + Session JWTs",
      caching: "Redis for Mempool & Gas Price Estimations"
    }
  },
  {
    id: "cyber-siem-threat-intel",
    name: "Cyber SIEM & Threat Hunting",
    category: "Cybersecurity & SecOps",
    description: "Security information & event management, Sigma rule detection engine, automated SOAR playbooks.",
    prompt: `Build an enterprise Security Information and Event Management (SIEM) and Security Orchestration, Automation, and Response (SOAR) Platform.
Key Requirements:
1. High-speed log ingestion from Syslog, Windows Event Forwarding, AWS CloudTrail, and Kubernetes audit logs at 200,000 EPS (events/sec).
2. Real-time Sigma and YARA-L rule detection engine with sub-second threat correlation.
3. Automated incident response playbooks (SOAR) with automated IP quarantine, user session termination, and firewall rule updates.
4. MITRE ATT&CK matrix visualization mapping active enterprise vulnerabilities and detected adversary tactics.
5. Immutable WORM (Write Once, Read Many) compliance log storage for forensic audit trails.`,
    defaultTechStack: {
      frontend: "Next.js + React Flow + Tailwind CSS",
      backend: "Go (Golang) Rule Engine + Python SOAR Workers",
      database: "Elasticsearch / OpenSearch + ClickHouse + PostgreSQL",
      architecture: "High-Throughput Stream-Processing Architecture",
      deployment: "Kubernetes + Apache Kafka + Terraform",
      auth: "SAML 2.0 / Okta SSO + FIDO2 Hardware Keys + Strict RBAC",
      caching: "Redis for Active Threat IP Blacklists"
    }
  }
];
