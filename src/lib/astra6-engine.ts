import { TechStackPreferences } from "./types";
import { DomainContext, extractDomainContext } from "./mock-generator";

export interface FeaturePill {
  id: string;
  label: string;
  promptSnippet: string;
  category: "realtime" | "payment" | "security" | "ai" | "scale" | "compliance";
}

export interface IdeaEnhancementResult {
  originalPrompt: string;
  enhancedPrompt: string;
  problemStatement: string;
  valueProposition: string;
  coreInnovations: string[];
  suggestedPills: FeaturePill[];
  architecturalStrategy: {
    frontendArchitecture: string;
    microservicesTopology: string;
    persistenceStrategy: string;
    concurrencyHandling: string;
    securityPosture: string;
  };
  domain: DomainContext;
}

export interface PrototypeItem {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  statusColor: string;
  badge: string;
  meta: Record<string, string | number>;
}

export interface PrototypeConfig {
  appTitle: string;
  appSubtitle: string;
  clientRole: string;
  operatorRole: string;
  primaryActionLabel: string;
  items: PrototypeItem[];
  itemNoun: string;
  workflowSteps: { step: number; title: string; desc: string; completed: boolean }[];
  liveMetricLabels: { label: string; value: string; unit: string; change: string }[];
}

/**
 * Astra 6 Idea Comprehension & Enhancement Engine
 * Deeply analyzes arbitrary user prompts, unpacks implicit architectural constraints,
 * and synthesizes enterprise-grade technical specifications.
 */
export function enhanceIdeaWithAstra6(
  prompt: string,
  techStack: TechStackPreferences
): IdeaEnhancementResult {
  const cleanPrompt = prompt.trim();
  const domain = extractDomainContext(cleanPrompt || "Distributed Cloud Platform");
  const p = cleanPrompt.toLowerCase();

  // Extract core problem & value prop
  const e1 = domain.primaryEntities[0] || "PrimaryRecord";
  const e2 = domain.primaryEntities[1] || "ActivityEvent";
  const e3 = domain.primaryEntities[2] || "WorkflowItem";

  let problemStatement = `Fragmented, manual, or high-latency management of ${e1.toLowerCase()} workflows, leading to operational bottlenecks, data inconsistencies, and poor user satisfaction.`;
  let valueProposition = `A high-throughput, low-latency distributed platform unifying ${e1} lifecycle management, real-time ${e2} event streaming, and automated ${e3} orchestration.`;
  
  const coreInnovations = [
    `Sub-80ms p95 query latency via multi-tier caching with ${techStack.caching}`,
    `Asynchronous event streaming guaranteeing zero data loss across ${domain.services[0]}`,
    `Normalized 3NF relational data integrity with optimistic locking on ${e1}`,
    `Zero-trust token verification with RBAC claims enforced at the ${techStack.auth} boundary`
  ];

  // Domain-tailored strategic enhancements
  if (p.includes("food") || p.includes("delivery") || p.includes("restaurant") || p.includes("courier")) {
    problemStatement = "High courier dispatch latency, order state mismatch between kitchens and drivers, and lack of real-time geospatial tracking during peak delivery hours.";
    valueProposition = "Hyperlocal on-demand food delivery connecting eaters, kitchens, and couriers with idempotent payments, sub-second GPS tracking, and automated ticket dispatch.";
    coreInnovations.push("Geospatial Redis GEO indexing for sub-100ms driver proximity matching");
    coreInnovations.push("Idempotent Stripe payment saga with automated rollback on kitchen rejection");
  } else if (p.includes("doctor") || p.includes("patient") || p.includes("health") || p.includes("telehealth") || p.includes("medical")) {
    problemStatement = "Siloed electronic health records (EHR), scheduling friction, and unencrypted video consult channels failing HIPAA/HITECH privacy compliance.";
    valueProposition = "A secure clinical telehealth ecosystem integrating WebRTC encrypted video visits, HL7 FHIR R4 medical history aggregation, and e-prescribing.";
    coreInnovations.push("Hardware-accelerated DTLS-SRTP end-to-end encrypted WebRTC video visits");
    coreInnovations.push("Automated EDI 270/271 insurance eligibility verification with FHIR mapping");
  } else if (p.includes("crypto") || p.includes("trade") || p.includes("trading") || p.includes("binance") || p.includes("algo")) {
    problemStatement = "Slippage on high-frequency market order execution, connection drops during volatility spikes, and lack of automated stop-loss risk guards.";
    valueProposition = "Sub-10ms quantitative algorithmic execution engine streaming exchange WebSocket orderbooks with automated MACD/RSI risk triggers.";
    coreInnovations.push("Lock-free ring buffer memory queue ingesting 100,000 orderbook ticks/sec");
    coreInnovations.push("Deterministic risk engine auto-liquidating positions within 10ms of breach");
  } else if (p.includes("ev") || p.includes("grid") || p.includes("charge") || p.includes("vehicle") || p.includes("charger")) {
    problemStatement = "Peak grid overload caused by uncoordinated EV charging surges and incompatible multi-vendor charging station telemetry protocols.";
    valueProposition = "Smart EV charging orchestrator balancing dynamic grid capacity, OpenADR demand-response pricing, and OCPP 2.0.1 DC charger connectivity.";
    coreInnovations.push("ISO 15118 Plug & Charge asymmetric PKI cryptographic vehicle handshake");
    coreInnovations.push("Dynamic real-time grid load balancing shedding non-priority circuits under peak load");
  } else if (p.includes("drone") || p.includes("flight") || p.includes("iot") || p.includes("sensor")) {
    problemStatement = "Loss of telemetry over intermittent cellular links, lack of autonomous geofencing enforcement, and manual fleet maintenance schedules.";
    valueProposition = "Autonomous drone fleet telematics engine ingesting 20Hz sensor packets over MQTT with real-time 3D flight paths and automated geofence barriers.";
    coreInnovations.push("ASTM F3411 Remote ID broadcast compliance with sub-second ADS-B avoidance");
    coreInnovations.push("Over-the-air (OTA) cryptographic A/B firmware deployment with instant rollback");
  }

  // Generate fully enhanced enterprise prompt
  const enhancedPrompt = `${cleanPrompt ? cleanPrompt + "." : `An enterprise-grade ${domain.title}.`} The architecture mandates strictly typed OpenAPI 3.1 contracts, sub-80ms p95 read latency, idempotent state mutations, horizontal autoscaling on ${techStack.deployment}, zero-trust cryptographic token verification with ${techStack.auth}, automated 3NF PostgreSQL schema normalization with ${domain.erdEntities.length} core tables (${domain.primaryEntities.slice(0, 4).join(", ")}), and continuous verification against ${domain.complianceFramework.split(",")[0]}.`;

  // Context-aware suggested pills
  const suggestedPills: FeaturePill[] = [
    {
      id: "realtime-ws",
      label: "+ Real-Time WebSockets",
      promptSnippet: "with sub-second bi-directional WebSocket status feeds and presence broadcasting",
      category: "realtime"
    },
    {
      id: "stripe-payments",
      label: "+ Stripe Idempotent Pay",
      promptSnippet: "featuring idempotent payment authorization with automated webhook signature verification and ledger receipts",
      category: "payment"
    },
    {
      id: "redis-cache",
      label: "+ Redis Geospatial & Cache",
      promptSnippet: "utilizing Redis Cluster for sub-5ms caching, geospatial geo-indexing, and distributed Redlock mutexes",
      category: "scale"
    },
    {
      id: "zero-trust",
      label: "+ Zero-Trust RS256 Auth",
      promptSnippet: "enforcing zero-trust RS256 JWT asymmetric token signing, multi-tenant row-level security, and audit trails",
      category: "security"
    },
    {
      id: "ai-copilot",
      label: "+ AI Predictive Intelligence",
      promptSnippet: "equipped with an in-database vector embeddings index for semantic search and autonomous anomaly detection",
      category: "ai"
    },
    {
      id: "kafka-streams",
      label: "+ Kafka Event Mesh",
      promptSnippet: "orchestrated over Apache Kafka distributed event topics with exactly-once delivery guarantees",
      category: "scale"
    }
  ];

  return {
    originalPrompt: cleanPrompt,
    enhancedPrompt,
    problemStatement,
    valueProposition,
    coreInnovations,
    suggestedPills,
    architecturalStrategy: {
      frontendArchitecture: `${techStack.frontend} with optimistic UI updates and server-side state hydration`,
      microservicesTopology: `${techStack.architecture} decoupled across ${domain.services.length} bounded contexts`,
      persistenceStrategy: `${techStack.database} in 3NF normalization with automated connection pooling`,
      concurrencyHandling: `Distributed token-bucket rate limiting and asynchronous worker queues via ${techStack.caching}`,
      securityPosture: `Zero-trust identity verification via ${techStack.auth} with continuous audit logging`
    },
    domain
  };
}

/**
 * Generates an interactive working app prototype configuration tailored to the user's idea.
 */
export function generatePrototypeConfig(domain: DomainContext, techStack: TechStackPreferences): PrototypeConfig {
  const p = (domain.userPromptRaw || "").toLowerCase();
  const e1 = domain.primaryEntities[0] || "Order";
  const e2 = domain.primaryEntities[1] || "Courier";

  // 1. Food Delivery
  if (p.includes("food") || p.includes("delivery") || p.includes("restaurant") || p.includes("kitchen")) {
    return {
      appTitle: "FoodFast Delivery Portal",
      appSubtitle: "Live Hyperlocal Ordering & Courier Tracking Simulator",
      clientRole: "Hungry Customer",
      operatorRole: "Kitchen & Dispatch Operator",
      primaryActionLabel: "Place Fast Delivery Order ($28.50)",
      itemNoun: "Restaurants & Orders",
      items: [
        {
          id: "ord-101",
          title: "Artisan Wood-Fired Pizza Co.",
          subtitle: "1x Truffle Mushroom Pizza, 2x San Pellegrino",
          status: "En Route (Courier 1.2 mi away)",
          statusColor: "emerald",
          badge: "GPS Active",
          meta: { ETA: "8 mins", Total: "$34.20", Driver: "Marco R. (Toyota Prius)" }
        },
        {
          id: "ord-102",
          title: "Tokyo Ramen & Dumplings",
          subtitle: "2x Spicy Tonkotsu Ramen, 6x Pork Gyoza",
          status: "Kitchen Preparing",
          statusColor: "amber",
          badge: "Ticket #412",
          meta: { ETA: "22 mins", Total: "$42.00", Chef: "Station 3" }
        },
        {
          id: "ord-103",
          title: "Green Harvest Organic Bowls",
          subtitle: "1x Mediterranean Quinoa Bowl",
          status: "Delivered",
          statusColor: "blue",
          badge: "Receipt Verified",
          meta: { DeliveredAt: "12:15 PM", Rating: "5.0 ★", DriverTip: "$5.00" }
        }
      ],
      workflowSteps: [
        { step: 1, title: "Order Placed & Paid", desc: "Idempotent payment captured via Stripe checkout", completed: true },
        { step: 2, title: "Kitchen Accepted", desc: "Kitchen display system generated digital prep ticket", completed: true },
        { step: 3, title: "Courier Dispatched", desc: "Sub-second nearest driver matched via Redis GEO", completed: true },
        { step: 4, title: "Delivered & Confirmed", desc: "Customer OTP verification on drop-off", completed: false }
      ],
      liveMetricLabels: [
        { label: "Active Deliveries", value: "48", unit: "live", change: "+12%" },
        { label: "Avg Delivery Time", value: "23.4", unit: "min", change: "-4.2m" },
        { label: "Dispatch Latency", value: "320", unit: "ms", change: "-45ms" },
        { label: "Courier Online", value: "114", unit: "drivers", change: "98% on-duty" }
      ]
    };
  }

  // 2. Telehealth / EHR
  if (p.includes("doctor") || p.includes("patient") || p.includes("telehealth") || p.includes("health") || p.includes("medical")) {
    return {
      appTitle: "MediFlow Clinical Telehealth",
      appSubtitle: "HIPAA-Compliant Patient Portal & WebRTC Video Consult",
      clientRole: "Registered Patient",
      operatorRole: "Licensed Physician (MD)",
      primaryActionLabel: "Book Immediate WebRTC Video Visit",
      itemNoun: "Appointments & Records",
      items: [
        {
          id: "apt-201",
          title: "Dr. Sarah Jenkins, MD (Cardiology)",
          subtitle: "Comprehensive Cardiovascular Follow-up & ECG Review",
          status: "Video Room Open",
          statusColor: "emerald",
          badge: "WebRTC Ready",
          meta: { Time: "Today 10:30 AM", Room: "enc-webrtc-8472", Copay: "$20.00" }
        },
        {
          id: "apt-202",
          title: "Dr. Alex Rivera, MD (Primary Care)",
          subtitle: "Annual Health Screening & Lab Panel Review",
          status: "Scheduled",
          statusColor: "blue",
          badge: "In-Person / Virtual",
          meta: { Time: "Tomorrow 2:00 PM", Clinic: "Downtown Suite 400", Verified: "EDI 270 OK" }
        },
        {
          id: "apt-203",
          title: "Electronic Prescription Refill",
          subtitle: "Atorvastatin 20mg - 90 Day Supply (Digital Signed)",
          status: "Transmitted to CVS Pharmacy",
          statusColor: "purple",
          badge: "NCPDP Script",
          meta: { PrescribedBy: "Dr. Rivera", DEA_Sig: "Verified PKI", Refills: "3 Left" }
        }
      ],
      workflowSteps: [
        { step: 1, title: "Eligibility Checked", desc: "Automated EDI 270/271 insurance verification", completed: true },
        { step: 2, title: "Encrypted Room Created", desc: "Peer-to-peer WebRTC DTLS-SRTP security keys exchanged", completed: true },
        { step: 3, title: "Consultation Conducted", desc: "Live video visit with clinical soap note recording", completed: true },
        { step: 4, title: "FHIR EHR Sync", desc: "Encounter records synced to HL7 FHIR R4 server", completed: false }
      ],
      liveMetricLabels: [
        { label: "Active Consults", value: "32", unit: "rooms", change: "100% encrypted" },
        { label: "Video Packet Loss", value: "0.04", unit: "%", change: "HD 1080p" },
        { label: "Eligibility SLA", value: "410", unit: "ms", change: "EDI 271" },
        { label: "Doctor Availability", value: "96.2", unit: "%", change: "18 on-call" }
      ]
    };
  }

  // 3. EV Smart Grid
  if (p.includes("ev") || p.includes("grid") || p.includes("charge") || p.includes("vehicle") || p.includes("charger")) {
    return {
      appTitle: "GridCharge EV Orchestrator",
      appSubtitle: "Dynamic Load Balancer & OCPP 2.0.1 DC Fast Network",
      clientRole: "EV Fleet Driver",
      operatorRole: "Grid Load Dispatcher",
      primaryActionLabel: "Initiate ISO 15118 High-Speed Charge",
      itemNoun: "Chargers & Grid Nodes",
      items: [
        {
          id: "ev-301",
          title: "Station Alpha-01 (Connector A)",
          subtitle: "CCS 350kW DC Fast Charger - Bay 4",
          status: "Charging (68% SoC)",
          statusColor: "emerald",
          badge: "350 kW Peak",
          meta: { CurrentDelivery: "248 kW", EnergyAdded: "42.8 kWh", EstFinish: "14 mins" }
        },
        {
          id: "ev-302",
          title: "Station Alpha-02 (Connector B)",
          subtitle: "NACS 250kW Supercharge - Bay 5",
          status: "Plug & Charge Authenticating",
          statusColor: "amber",
          badge: "ISO 15118 PKI",
          meta: { Vehicle: "Tesla Model 3", VIN: "5YJ3E1EB...942", Tariff: "$0.28/kWh" }
        },
        {
          id: "ev-303",
          title: "Substation Transformer Node T-4",
          subtitle: "Dynamic Demand-Response Load Shedding Guard",
          status: "Optimal Grid Balance",
          statusColor: "blue",
          badge: "OpenADR 2.0b",
          meta: { GridLoad: "74.2%", ReserveCapacity: "1.2 MW", Frequency: "60.01 Hz" }
        }
      ],
      workflowSteps: [
        { step: 1, title: "Plug & Charge Handshake", desc: "Cryptographic PKI validation over Powerline V2G", completed: true },
        { step: 2, title: "Grid Tariff Negotiation", desc: "OpenADR 2.0b dynamic rate card locked", completed: true },
        { step: 3, title: "High-Power Delivery", desc: "Active cooling loop engaged at 350kW rate", completed: true },
        { step: 4, title: "Session Settlement", desc: "Automated billing pushed to corporate fleet ledger", completed: false }
      ],
      liveMetricLabels: [
        { label: "Active Grid Throughput", value: "4.8", unit: "MW", change: "+0.6 MW" },
        { label: "Active Dispense Nodes", value: "24/26", unit: "ports", change: "92% utilized" },
        { label: "Peak Shave Efficiency", value: "99.4", unit: "%", change: "0 blackouts" },
        { label: "CO2 Offset Today", value: "14.2", unit: "tons", change: "Clean Energy" }
      ]
    };
  }

  // 4. Crypto / Trading
  if (p.includes("crypto") || p.includes("trade") || p.includes("trading") || p.includes("binance") || p.includes("algo")) {
    return {
      appTitle: "TradeBot Quant Terminal",
      appSubtitle: "Sub-10ms Algorithmic Execution & Orderbook Engine",
      clientRole: "Portfolio Trader",
      operatorRole: "Risk Arbitrage Engine",
      primaryActionLabel: "Submit Limit Market Order ($10,000 BTC)",
      itemNoun: "Trading Pairs & Orders",
      items: [
        {
          id: "trd-401",
          title: "BTC/USDT Perpetual Contract",
          subtitle: "Binance WebSocket Depth Stream (20ms feed)",
          status: "Long Position (+4.8%)",
          statusColor: "emerald",
          badge: "Cross 10x",
          meta: { Entry: "$68,420.00", Mark: "$71,704.50", PnL: "+$1,642.25" }
        },
        {
          id: "trd-402",
          title: "ETH/USDT Momentum Signal",
          subtitle: "14-Period RSI Divergence (Oversold 28.4)",
          status: "Order Filled",
          statusColor: "blue",
          badge: "Limit Buy",
          meta: { Amount: "15.0 ETH", FillPrice: "$3,842.10", Latency: "7.8ms" }
        },
        {
          id: "trd-403",
          title: "Automated Trailing Stop-Loss",
          subtitle: "Dynamic ATR volatility bracket tracking",
          status: "Monitoring (Active)",
          statusColor: "purple",
          badge: "Risk Guard",
          meta: { TriggerPrice: "$67,200.00", MaxDrawdown: "-1.5%", SLA: "10ms" }
        }
      ],
      workflowSteps: [
        { step: 1, title: "Tick Ingested via WS", desc: "Exchange WebSocket feed parsed into lock-free ring buffer", completed: true },
        { step: 2, title: "Signal Calculated", desc: "RSI and MACD momentum indicators computed in <1ms", completed: true },
        { step: 3, title: "Risk Engine Verification", desc: "Margin headroom and slippage limits verified", completed: true },
        { step: 4, title: "Exchange Execution", desc: "FIX protocol order placed on liquidity bridge", completed: false }
      ],
      liveMetricLabels: [
        { label: "Execution Latency", value: "8.4", unit: "ms", change: "p99 < 12ms" },
        { label: "Orderbook Throughput", value: "148k", unit: "ticks/s", change: "Zero drop" },
        { label: "24h PnL Benchmark", value: "+18.4", unit: "%", change: "Sharpe 2.8" },
        { label: "Active Risk Exposure", value: "$142k", unit: "capital", change: "Within limits" }
      ]
    };
  }

  // 5. Universal Custom Domain Prototype
  return {
    appTitle: `${domain.title} Studio`,
    appSubtitle: `Real-Time Interactive ${domain.category} Application Prototype`,
    clientRole: "Authorized Consumer",
    operatorRole: `${e1} System Administrator`,
    primaryActionLabel: `Create & Initialize New ${e1}`,
    itemNoun: `${e1} Records`,
    items: [
      {
        id: "rec-501",
        title: `Primary ${e1} Operational Node #01`,
        subtitle: `Core domain entity managing ${e1.toLowerCase()} workflows with optimistic locking`,
        status: "Active & Processing",
        statusColor: "emerald",
        badge: "Healthy",
        meta: { Status: "ONLINE", Throughput: "1,240 rps", Health: "99.99%" }
      },
      {
        id: "rec-502",
        title: `Real-Time ${e2} Event Pipeline`,
        subtitle: `Asynchronous stream queue processing live telemetry for ${e1}`,
        status: "Streaming Telemetry",
        statusColor: "blue",
        badge: "Kafka Event",
        meta: { Buffer: "12,400 msg", Latency: "14ms", Consumers: "4 Pods" }
      },
      {
        id: "rec-503",
        title: `Automated ${e1} Compliance & Audit Log`,
        subtitle: `Immutable access trace verifying compliance with ${domain.complianceFramework.split(",")[0]}`,
        status: "Cryptographically Verified",
        statusColor: "purple",
        badge: "Audit SHA-256",
        meta: { Standard: domain.complianceFramework.split(",")[0], Records: "1.4M", SLA: "RTO < 5m" }
      }
    ],
    workflowSteps: [
      { step: 1, title: `Ingest ${e1} Request`, desc: "Validate input payload against typed OpenAPI 3.1 schema", completed: true },
      { step: 2, title: "Enforce Zero-Trust Auth", desc: "Verify RS256 JWT claims and tenant isolation", completed: true },
      { step: 3, title: `Commit 3NF ${e1} State`, desc: "Execute atomic database transaction with write-ahead log", completed: true },
      { step: 4, title: `Broadcast ${e2} Event`, desc: "Publish state change to event bus for downstream subscribers", completed: false }
    ],
    liveMetricLabels: [
      { label: "Request Rate", value: "4,820", unit: "rps", change: "p95 38ms" },
      { label: "Uptime SLA", value: "99.99", unit: "%", change: "Multi-AZ" },
      { label: "Active Records", value: "24,800", unit: "rows", change: "3NF Indexed" },
      { label: "Security State", value: "Zero-Trust", unit: "mode", change: "Encrypted" }
    ]
  };
}
