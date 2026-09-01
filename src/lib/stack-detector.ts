import { TechStackPreferences } from "./types";

export interface StackPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  stack: TechStackPreferences;
}

export const STACK_PRESETS: StackPreset[] = [
  {
    id: "saas-web",
    name: "Modern Full-Stack SaaS",
    badge: "Next.js + Node + Postgres",
    description: "Enterprise web application with Server Components, relational ACID storage, and Redis caching.",
    stack: {
      frontend: "Next.js 14 (App Router) + Tailwind CSS + Shadcn UI",
      backend: "Node.js (TypeScript) / Express REST Microservices",
      database: "PostgreSQL 16 (Prisma ORM) + Redis Cluster",
      architecture: "Domain-Driven Microservices with Saga Orchestration",
      deployment: "Kubernetes (EKS) + Docker + Terraform IaC",
      auth: "OAuth 2.0 / JWT + RBAC Permissions",
      caching: "Redis Cluster with Cache-Aside Pattern"
    }
  },
  {
    id: "ai-ml",
    name: "AI, Agents & Machine Learning",
    badge: "FastAPI + PyTorch + Qdrant",
    description: "Autonomous agent workflows, vector embeddings, RAG search, and asynchronous model inference.",
    stack: {
      frontend: "Next.js 14 + Tailwind CSS (Interactive Agent Console)",
      backend: "FastAPI (Python 3.11) + AsyncIO + LangChain / PyTorch",
      database: "PostgreSQL 16 + Qdrant Vector Database (Cosine Index)",
      architecture: "Asynchronous Agentic Event Pipeline with Tool Sandboxes",
      deployment: "Docker + Kubernetes (GPU Node Pools) + Ray / Modal",
      auth: "OAuth 2.0 / JWT + API Key Management",
      caching: "Redis Cluster (Semantic Embeddings Cache)"
    }
  },
  {
    id: "high-perf",
    name: "High-Performance Systems",
    badge: "Rust / Go + Kafka + ScyllaDB",
    description: "Sub-millisecond latency, high-concurrency throughput, financial trading, and stream processing.",
    stack: {
      frontend: "Next.js 14 + WebSocket Live Ticker / Canvas",
      backend: "Rust (Axum + Tokio) / Go (Gin + gRPC)",
      database: "TimescaleDB / ScyllaDB + ClickHouse (OLAP Analytics)",
      architecture: "Event-Sourced CQRS with In-Memory Order Matching",
      deployment: "Bare-Metal Docker / Kubernetes + Prometheus Monitoring",
      auth: "Mutual TLS (mTLS) + JWT RS256 Asymmetric Signing",
      caching: "Apache Kafka / Redpanda + Redis Cluster"
    }
  },
  {
    id: "mobile-offline",
    name: "Mobile & Offline-First",
    badge: "React Native / Flutter + Supabase",
    description: "Cross-platform mobile apps with local SQLite storage, background sync, and push alerts.",
    stack: {
      frontend: "React Native (Expo) / Flutter 3.x",
      backend: "Go / Node.js Microservices (gRPC + REST)",
      database: "Supabase / PostgreSQL + WatermelonDB (Offline SQLite)",
      architecture: "Offline-First Sync Engine with CRDT Conflict Resolution",
      deployment: "Fastlane CI/CD + Cloud Run / AWS ECS",
      auth: "Supabase Auth / OAuth 2.0 + Biometric Secure Keyring",
      caching: "Redis Streams + Push Notification Dispatcher (APNS/FCM)"
    }
  },
  {
    id: "iot-telemetry",
    name: "IoT, Drones & Telemetry",
    badge: "MQTT + TimescaleDB + Go",
    description: "Sensor ingestion, drone fleet telemetry, real-time geofencing, and edge computing.",
    stack: {
      frontend: "Next.js 14 Dashboard + Mapbox GL / Deck.gl Live Maps",
      backend: "Go (Fiber / gRPC) + EMQX Distributed MQTT Broker",
      database: "TimescaleDB (Time-Series) + PostgreSQL 16 (Relational)",
      architecture: "Edge-to-Cloud Stream Ingestion with Spatial Geofencing",
      deployment: "Docker Swarm / K3s Edge Nodes + AWS IoT Core",
      auth: "X.509 Device Certificates (mTLS) + RBAC Operator Console",
      caching: "EMQX MQTT Broker + Redis Cluster"
    }
  },
  {
    id: "serverless-edge",
    name: "Serverless & Edge Compute",
    badge: "Cloudflare Workers + Hono",
    description: "Global edge execution with zero cold starts, distributed key-value storage, and minimal footprint.",
    stack: {
      frontend: "Next.js 14 / SvelteKit + Tailwind CSS",
      backend: "Cloudflare Workers (Hono / TypeScript)",
      database: "Cloudflare D1 (SQLite Edge) / Neon Serverless Postgres",
      architecture: "Globally Distributed Serverless Edge Microservices",
      deployment: "Cloudflare Pages + Wrangler CLI + GitHub Actions",
      auth: "JWT RS256 with Edge Verification",
      caching: "Cloudflare KV + Cache API"
    }
  }
];

export function detectOptimalTechStack(prompt: string): TechStackPreferences {
  const p = prompt.toLowerCase();

  // 1. AI / Agents / LLM / Machine Learning / Data Science / PyTorch / Vision
  if (
    p.includes("ai") ||
    p.includes("agent") ||
    p.includes("llm") ||
    p.includes("gpt") ||
    p.includes("rag") ||
    p.includes("vector") ||
    p.includes("python") ||
    p.includes("machine learning") ||
    p.includes("deep learning") ||
    p.includes("pytorch") ||
    p.includes("neural") ||
    p.includes("embedding") ||
    p.includes("vision") ||
    p.includes("nlp")
  ) {
    return STACK_PRESETS.find((s) => s.id === "ai-ml")!.stack;
  }

  // 2. High-Performance / Low Latency / Rust / Go / Trading / Crypto / Blockchain / High Frequency
  if (
    p.includes("rust") ||
    p.includes("tokio") ||
    p.includes("trading") ||
    p.includes("latency") ||
    p.includes("high-frequency") ||
    p.includes("order book") ||
    p.includes("crypto") ||
    p.includes("blockchain") ||
    p.includes("solidity") ||
    p.includes("web3") ||
    p.includes("kafka") ||
    p.includes("scylla") ||
    p.includes("fintech") ||
    p.includes("exchange")
  ) {
    return STACK_PRESETS.find((s) => s.id === "high-perf")!.stack;
  }

  // 3. IoT / Drones / Sensor / Hardware / Robotics / Telemetry / MQTT
  if (
    p.includes("drone") ||
    p.includes("iot") ||
    p.includes("sensor") ||
    p.includes("hardware") ||
    p.includes("robot") ||
    p.includes("telemetry") ||
    p.includes("mqtt") ||
    p.includes("gps") ||
    p.includes("fleet") ||
    p.includes("agriculture") ||
    p.includes("geofence")
  ) {
    return STACK_PRESETS.find((s) => s.id === "iot-telemetry")!.stack;
  }

  // 4. Mobile / iOS / Android / Flutter / React Native / Offline
  if (
    p.includes("mobile") ||
    p.includes("ios") ||
    p.includes("android") ||
    p.includes("flutter") ||
    p.includes("react native") ||
    p.includes("expo") ||
    p.includes("offline") ||
    p.includes("hiking") ||
    p.includes("app store")
  ) {
    return STACK_PRESETS.find((s) => s.id === "mobile-offline")!.stack;
  }

  // 5. Serverless / Edge / Lightweight / Workers
  if (
    p.includes("serverless") ||
    p.includes("cloudflare") ||
    p.includes("edge") ||
    p.includes("worker") ||
    p.includes("hono") ||
    p.includes("fastify")
  ) {
    return STACK_PRESETS.find((s) => s.id === "serverless-edge")!.stack;
  }

  // Default: Modern Full-Stack SaaS
  return STACK_PRESETS.find((s) => s.id === "saas-web")!.stack;
}
