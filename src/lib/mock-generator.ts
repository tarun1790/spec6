import { TechStackPreferences } from "./types";

export interface ErdField {
  name: string;
  type: string;
  key?: "PK" | "FK" | "UK";
  comment?: string;
}

export interface ErdEntity {
  name: string;
  description: string;
  fields: ErdField[];
}

export interface ErdRelation {
  from: string;
  to: string;
  cardinality: string;
  label: string;
}

export interface DomainContext {
  title: string;
  shortName: string;
  category: string;
  userPromptRaw: string;
  executiveSummary: string;
  extractedKeywords: string[];
  primaryEntities: string[];
  erdEntities: ErdEntity[];
  erdRelations: ErdRelation[];
  sequenceFlow: string;
  services: string[];
  apiPrefix: string;
  personas: { role: string; description: string; coreNeed: string; painPoint: string }[];
  p0Requirements: { id: string; title: string; desc: string; acceptance: string }[];
  p1Requirements: { id: string; title: string; desc: string; acceptance: string }[];
  p2Requirements: { id: string; title: string; desc: string; acceptance: string }[];
  apiEndpoints: { method: string; path: string; desc: string; payload: string; response: string }[];
  playwrightTests: { testCaseId: string; name: string; code: string }[];
  securityFocus: { area: string; mitigation: string }[];
  complianceFramework: string;
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

export function extractDomainContext(prompt: string): DomainContext {
  const p = prompt.toLowerCase();

  // 1. HEALTHCARE / TELEHEALTH / CLINICAL
  if (p.includes("doctor") || p.includes("patient") || p.includes("medical") || p.includes("telehealth") || p.includes("clinic") || p.includes("health") || p.includes("prescription") || p.includes("hospital")) {
    return {
      title: "Telehealth, Clinical EHR & Prescription Platform",
      shortName: "MediFlow",
      category: "Healthcare & Life Sciences",
      userPromptRaw: prompt,
      executiveSummary: "A HIPAA-compliant clinical care orchestration platform facilitating encrypted WebRTC video visits, HL7 FHIR R4 medical history aggregation, electronic DEA-compliant e-prescribing, and automated EDI 270/271 insurance eligibility verification.",
      extractedKeywords: ["Telehealth", "PatientEHR", "Prescription", "WebRTC", "HIPAA", "InsuranceVerification"],
      primaryEntities: ["Patient", "Physician", "AppointmentSlot", "TelehealthRoom", "PrescriptionOrder", "InsuranceClaim"],
      erdEntities: [
        {
          name: "Patient",
          description: "Registered healthcare recipient with encrypted PHI records.",
          fields: [
            { name: "id", type: "uuid", key: "PK" },
            { name: "mrn_number", type: "string", key: "UK" },
            { name: "legal_name_encrypted", type: "string" },
            { name: "date_of_birth", type: "date" },
            { name: "insurance_policy_id", type: "string" },
            { name: "blood_type", type: "string" },
            { name: "created_at", type: "timestamp" }
          ]
        },
        {
          name: "Physician",
          description: "Licensed medical provider with NPI license credentials.",
          fields: [
            { name: "id", type: "uuid", key: "PK" },
            { name: "npi_number", type: "string", key: "UK" },
            { name: "full_name", type: "string" },
            { name: "medical_specialty", type: "string" },
            { name: "license_state", type: "string" },
            { name: "consultation_rate_usd", type: "decimal" }
          ]
        },
        {
          name: "AppointmentSlot",
          description: "Scheduled consultation slot linking patient and physician.",
          fields: [
            { name: "id", type: "uuid", key: "PK" },
            { name: "patient_id", type: "uuid", key: "FK" },
            { name: "physician_id", type: "uuid", key: "FK" },
            { name: "scheduled_start", type: "timestamp" },
            { name: "status", type: "string" },
            { name: "intake_notes_encrypted", type: "text" }
          ]
        },
        {
          name: "TelehealthRoom",
          description: "Encrypted WebRTC signaling room for audio/video consultation.",
          fields: [
            { name: "id", type: "uuid", key: "PK" },
            { name: "appointment_id", type: "uuid", key: "FK" },
            { name: "webrtc_session_hash", type: "string", key: "UK" },
            { name: "session_token", type: "string" },
            { name: "duration_seconds", type: "integer" }
          ]
        },
        {
          name: "PrescriptionOrder",
          description: "Digitally signed DEA-compliant electronic prescription.",
          fields: [
            { name: "id", type: "uuid", key: "PK" },
            { name: "appointment_id", type: "uuid", key: "FK" },
            { name: "medication_name", type: "string" },
            { name: "dosage_instructions", type: "string" },
            { name: "refills_allowed", type: "integer" },
            { name: "pharmacy_ncpdp_id", type: "string" },
            { name: "physician_signature_sha256", type: "string" }
          ]
        },
        {
          name: "InsuranceClaim",
          description: "EDI 270/271 real-time eligibility and claim submission.",
          fields: [
            { name: "id", type: "uuid", key: "PK" },
            { name: "patient_id", type: "uuid", key: "FK" },
            { name: "payer_code", type: "string" },
            { name: "copay_amount_cents", type: "integer" },
            { name: "eligibility_status", type: "string" }
          ]
        }
      ],
      erdRelations: [
        { from: "Patient", to: "AppointmentSlot", cardinality: "||--o{", label: "books" },
        { from: "Physician", to: "AppointmentSlot", cardinality: "||--o{", label: "hosts" },
        { from: "AppointmentSlot", to: "TelehealthRoom", cardinality: "||--||", label: "provisions" },
        { from: "AppointmentSlot", to: "PrescriptionOrder", cardinality: "||--o{", label: "issues" },
        { from: "Patient", to: "InsuranceClaim", cardinality: "||--o{", label: "submits" }
      ],
      sequenceFlow: `sequenceDiagram
    autonumber
    actor Patient as Patient Client
    actor Doctor as Physician Client
    participant GW as API & Ingress Gateway
    participant ApptSvc as Appointment Engine
    participant MediaSvc as WebRTC Signaling Server
    participant RxSvc as e-Prescription Service
    participant DB as Encrypted Database (HIPAA)

    Patient->>GW: POST /api/v1/appointments/schedule (Doctor, Time, Insurance)
    GW->>ApptSvc: Validate Doctor Availability & Insurance EDI 270
    ApptSvc->>DB: Persist Appointment Slot (status: CONFIRMED)
    ApptSvc->>MediaSvc: Provision Encrypted WebRTC Channel
    MediaSvc-->>Patient: Return Session Token & STUN/TURN ICE Servers
    
    Doctor->>MediaSvc: Connect Physician Video Feed (DTLS-SRTP)
    Patient->>MediaSvc: Connect Patient Video Feed (DTLS-SRTP)
    Note over Patient,Doctor: HIPAA-compliant peer-to-peer 1080p stream

    Doctor->>GW: POST /api/v1/prescriptions/e-sign (Rx Payload + SHA256 Signature)
    GW->>RxSvc: Verify Physician NPI & Digital Signature
    RxSvc->>DB: Store Prescription & Dispatch SCRIPT Standard to Pharmacy
    RxSvc-->>Doctor: Prescription Dispatched (HTTP 201 Created)`,
      services: [
        "Patient Identity & HL7 FHIR EHR Ingestion Service",
        "Physician Scheduling & Real-time Availability Engine",
        "Encrypted WebRTC Audio/Video Signaling Gateway",
        "e-Prescription & Pharmacy NCPDP Dispatch Worker",
        "Insurance Clearinghouse EDI 270/271 Gateway"
      ],
      apiPrefix: "/api/v1/clinical",
      personas: [
        {
          role: "Attending Physician / Specialist",
          description: "Licensed healthcare provider performing telehealth consultations and managing prescription renewals.",
          coreNeed: "Frictionless WebRTC audio/video connections with sub-100ms latency and instant 1-click chart review.",
          painPoint: "Software dropouts during video visits, complex prescription signing flows, and EHR latency."
        },
        {
          role: "Patient / Care Seeker",
          description: "End consumer booking clinical visits and accessing lab history and active medications.",
          coreNeed: "Single-tap visit entry from mobile or web without downloading third-party plugins.",
          painPoint: "Complicated intake questionnaires, unclear copay billing, and delayed physician notifications."
        },
        {
          role: "Clinical Compliance & Privacy Auditor",
          description: "Healthcare officer reviewing audit logs for HIPAA Omnibus compliance and DEA Title 21 auditability.",
          coreNeed: "Immutable append-only access audit logs for every PHI read and prescription issuance.",
          painPoint: "Fragmented logs, unencrypted database snapshots, and lack of field-level access tracing."
        }
      ],
      p0Requirements: [
        {
          id: "REQ-MED-01",
          title: "End-to-End Encrypted WebRTC Video Consultation",
          desc: "Multi-peer WebRTC video/audio sessions using DTLS-SRTP encryption with automated fallback to TURN relay servers.",
          acceptance: "Initiates media peer connections in <800ms; sustains 720p/1080p video at 30fps under 20% packet loss."
        },
        {
          id: "REQ-MED-02",
          title: "HL7 FHIR R4 Patient EHR Synchronization",
          desc: "Standardized patient intake, medical history, allergies, and lab results represented in FHIR R4 JSON schemas.",
          acceptance: "Passes HL7 FHIR validator test suites; supports atomic query filtering on Patient, Condition, and Observation resources."
        },
        {
          id: "REQ-MED-03",
          title: "DEA-Compliant Digital e-Prescription Engine",
          desc: "Electronic prescription dispatch to pharmacy networks with cryptographic physician signature verification (RSA-2048/ECDSA).",
          acceptance: "Dispatches NCPDP SCRIPT standard messages; rejects unsigned mutations; generates tamper-evident audit receipt."
        },
        {
          id: "REQ-MED-04",
          title: "Real-Time Insurance Eligibility Verification (EDI 270/271)",
          desc: "Automated insurance verification gateway parsing EDI 270 requests and validating 271 eligibility response data.",
          acceptance: "Completes clearinghouse eligibility queries in <2.5 seconds; calculates exact patient copay obligations."
        }
      ],
      p1Requirements: [
        {
          id: "REQ-MED-05",
          title: "Automated SMS & Push Appointment Reminders",
          desc: "Scheduled notification worker sending SMS reminders at T-24h and T-15m with magic join links.",
          acceptance: "Dispatches SMS via Twilio/SNS within 5 seconds of trigger; achieves >99.5% delivery success."
        }
      ],
      p2Requirements: [
        {
          id: "REQ-MED-06",
          title: "AI Clinical Note Summarization (Ambient Scribe)",
          desc: "Speech-to-text transcription engine converting doctor-patient audio into structured SOAP clinical notes.",
          acceptance: "Generates SOAP notes with >95% clinical entity accuracy; requires doctor confirmation before EHR commit."
        }
      ],
      apiEndpoints: [
        {
          method: "POST",
          path: "/api/v1/clinical/appointments/schedule",
          desc: "Schedule a telehealth consultation with real-time slot locking",
          payload: JSON.stringify({
            physician_id: "dr_9921_smith",
            patient_id: "pat_8812_johnson",
            scheduled_start: "2026-09-10T14:30:00Z",
            chief_complaint: "Persistent seasonal allergies and mild sinusitis",
            insurance_policy_id: "BCBS-9912048"
          }, null, 2),
          response: JSON.stringify({
            status: "confirmed",
            appointment_id: "appt_2026_0910_8812",
            scheduled_start: "2026-09-10T14:30:00Z",
            copay_amount_cents: 2000,
            webrtc_session_hash: "room_sec_77af01_99b"
          }, null, 2)
        },
        {
          method: "POST",
          path: "/api/v1/clinical/telehealth/session/token",
          desc: "Generate short-lived JWT credentials to enter WebRTC video room",
          payload: JSON.stringify({
            appointment_id: "appt_2026_0910_8812",
            role: "patient"
          }, null, 2),
          response: JSON.stringify({
            status: "active",
            session_token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
            ice_servers: [
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "turn:turn.mediflow.internal:3478", username: "usr_99", credential: "pwd" }
            ],
            expires_at: "2026-09-10T15:30:00Z"
          }, null, 2)
        },
        {
          method: "POST",
          path: "/api/v1/clinical/prescriptions/issue",
          desc: "Issue cryptographically signed e-prescription to pharmacy network",
          payload: JSON.stringify({
            appointment_id: "appt_2026_0910_8812",
            medication_name: "Amoxicillin 500mg Oral Capsule",
            ndc_code: "00781-2613-05",
            dosage_instructions: "Take 1 capsule by mouth every 8 hours for 10 days",
            refills: 0,
            pharmacy_ncpdp_id: "3910284",
            physician_signature_token: "sig_rsa2048_99fa1b"
          }, null, 2),
          response: JSON.stringify({
            status: "dispatched",
            prescription_id: "rx_2026_001928",
            dea_audit_receipt: "dea_rec_sha256_88bc21",
            estimated_fill_time: "2026-09-10T16:00:00Z"
          }, null, 2)
        }
      ],
      playwrightTests: [
        {
          testCaseId: "TC-MED-01",
          name: "Schedule Appointment and Receive WebRTC Join Token",
          code: `test("Patient successfully books consultation and receives encrypted WebRTC room", async ({ page, request }) => {
    // 1. Create authenticated patient session
    const response = await request.post("/api/v1/clinical/appointments/schedule", {
      data: {
        physician_id: "dr_9921_smith",
        patient_id: "pat_test_01",
        scheduled_start: "2026-09-15T10:00:00Z",
        chief_complaint: "Follow-up consultation",
        insurance_policy_id: "INS-TEST-001"
      }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe("confirmed");
    expect(body.appointment_id).toBeDefined();

    // 2. Request WebRTC Session Token
    const tokenRes = await request.post("/api/v1/clinical/telehealth/session/token", {
      data: { appointment_id: body.appointment_id, role: "patient" }
    });
    expect(tokenRes.status()).toBe(200);
    const tokenBody = await tokenRes.json();
    expect(tokenBody.session_token).toContain("ey");
    expect(tokenBody.ice_servers.length).toBeGreaterThan(0);
  });`
        }
      ],
      securityFocus: [
        { area: "HIPAA Security Rule & PHI Encryption", mitigation: "All Patient identifiers, intake records, and prescriptions are stored encrypted at rest using AES-256-GCM with customer-managed AWS KMS keys." },
        { area: "WebRTC Video Privacy & Zero Recording Leakage", mitigation: "DTLS 1.2/1.3 and SRTP (AES-128-GCM) secure all audio/video packets in transit. Media streams are never saved to disk unless explicit dual-party consent is cryptographically recorded." },
        { area: "Tamper-Evident Audit Logging", mitigation: "Every PHI read, export, and write generates an immutable audit record ingested into an append-only S3 Glacier Vault." }
      ],
      complianceFramework: "HIPAA Omnibus Rule, HL7 FHIR R4, DEA EPCS (21 CFR Part 1311)"
    };
  }

  // 2. FINTECH / CRYPTO / ALGORITHMIC TRADING / PAYMENTS
  if (p.includes("crypto") || p.includes("trading") || p.includes("bot") || p.includes("exchange") || p.includes("orderbook") || p.includes("binance") || p.includes("coinbase") || p.includes("stock") || p.includes("portfolio") || p.includes("rsi") || p.includes("macd") || p.includes("payment") || p.includes("stripe") || p.includes("ledger") || p.includes("wallet")) {
    return {
      title: "Algorithmic Crypto Trading & Execution Engine",
      shortName: "CryptoPulse",
      category: "Fintech & Quantitative Trading",
      userPromptRaw: prompt,
      executiveSummary: "A sub-millisecond algorithmic trading and portfolio execution system featuring multi-exchange WebSocket orderbook ingestion (Binance, Coinbase, Kraken), real-time technical indicator computation (RSI, MACD, Bollinger Bands), risk-enforced stop-loss order dispatch, and automated Telegram trade execution alerts.",
      extractedKeywords: ["CryptoTrading", "Orderbook", "RSI", "MACD", "StopLoss", "BinanceAPI", "TelegramAlerts"],
      primaryEntities: ["TradingAccount", "ExchangeCredential", "MarketOrder", "CandleStick", "PortfolioPosition", "RiskRule"],
      erdEntities: [
        {
          name: "TradingAccount",
          description: "Master trader balance, equity, and margin tracking.",
          fields: [
            { name: "id", type: "uuid", key: "PK" },
            { name: "account_number", type: "string", key: "UK" },
            { name: "equity_balance_usd", type: "decimal" },
            { name: "available_margin_usd", type: "decimal" },
            { name: "max_leverage", type: "integer" },
            { name: "is_kill_switch_active", type: "boolean" }
          ]
        },
        {
          name: "ExchangeCredential",
          description: "Encrypted API keys for external exchanges (Binance, Coinbase).",
          fields: [
            { name: "id", type: "uuid", key: "PK" },
            { name: "account_id", type: "uuid", key: "FK" },
            { name: "exchange_name", type: "string" },
            { name: "api_key_public", type: "string" },
            { name: "api_secret_encrypted_kms", type: "string" },
            { name: "ip_whitelist_cidr", type: "string" }
          ]
        },
        {
          name: "MarketOrder",
          description: "Dispatched limit, market, or stop-loss trade orders.",
          fields: [
            { name: "id", type: "uuid", key: "PK" },
            { name: "account_id", type: "uuid", key: "FK" },
            { name: "symbol", type: "string" },
            { name: "order_side", type: "string" },
            { name: "order_type", type: "string" },
            { name: "quantity", type: "decimal" },
            { name: "limit_price", type: "decimal" },
            { name: "stop_trigger_price", type: "decimal" },
            { name: "exchange_order_id", type: "string" },
            { name: "status", type: "string" },
            { name: "fill_latency_ms", type: "integer" }
          ]
        },
        {
          name: "CandleStick",
          description: "1m/5m/1h OHLCV time-series candlestick data.",
          fields: [
            { name: "id", type: "uuid", key: "PK" },
            { name: "symbol", type: "string" },
            { name: "time_interval", type: "string" },
            { name: "open_time", type: "timestamp" },
            { name: "open_price", type: "decimal" },
            { name: "high_price", type: "decimal" },
            { name: "low_price", type: "decimal" },
            { name: "close_price", type: "decimal" },
            { name: "volume_base", type: "decimal" }
          ]
        },
        {
          name: "PortfolioPosition",
          description: "Live open position with real-time unrealized PnL.",
          fields: [
            { name: "id", type: "uuid", key: "PK" },
            { name: "account_id", type: "uuid", key: "FK" },
            { name: "symbol", type: "string" },
            { name: "net_position_units", type: "decimal" },
            { name: "avg_entry_price", type: "decimal" },
            { name: "liquidation_price", type: "decimal" },
            { name: "unrealized_pnl_usd", type: "decimal" }
          ]
        },
        {
          name: "RiskRule",
          description: "Automated risk limits preventing catastrophic portfolio drawdown.",
          fields: [
            { name: "id", type: "uuid", key: "PK" },
            { name: "account_id", type: "uuid", key: "FK" },
            { name: "max_single_trade_usd", type: "decimal" },
            { name: "max_daily_drawdown_pct", type: "decimal" },
            { name: "auto_stop_loss_pct", type: "decimal" }
          ]
        }
      ],
      erdRelations: [
        { from: "TradingAccount", to: "ExchangeCredential", cardinality: "||--o{", label: "connects" },
        { from: "TradingAccount", to: "MarketOrder", cardinality: "||--o{", label: "places" },
        { from: "TradingAccount", to: "PortfolioPosition", cardinality: "||--o{", label: "holds" },
        { from: "TradingAccount", to: "RiskRule", cardinality: "||--||", label: "enforces" }
      ],
      sequenceFlow: `sequenceDiagram
    autonumber
    participant Binance as Binance / Coinbase WS
    participant Ingest as Orderbook Ingestion Gateway
    participant Analytics as Indicator Engine (RSI / MACD)
    participant Risk as Real-Time Risk Manager
    participant Router as Smart Order Execution Router
    participant Telegram as Telegram Bot Webhook Worker

    Binance->>Ingest: Stream L2 Depth Tick (BTC/USDT @ $64,250)
    Ingest->>Analytics: Push price tick to circular ring buffer
    Analytics->>Analytics: Compute 14-period RSI (RSI: 28.4 - Oversold)
    Analytics->>Risk: Signal BUY 0.5 BTC (Check margin & drawdown limits)
    Risk->>Router: Risk checks PASSED. Execute LIMIT BUY @ $64,245
    Router->>Binance: Signed HMAC-SHA256 Order Dispatch
    Binance-->>Router: Order FILLED in 18ms
    Router->>Telegram: Emit Trade Execution Summary
    Telegram-->>Telegram: Send Markdown alert to User Chat ID`,
      services: [
        "WebSocket L2 Orderbook & Ticker Ingestion Gateway",
        "Sub-Millisecond Technical Analysis & Indicator Worker",
        "Autonomous Risk Enforcer & Portfolio Margin Manager",
        "Exchange Gateway & Smart Order Router",
        "Historical Backtesting & Strategy Benchmark Engine"
      ],
      apiPrefix: "/api/v1/trading",
      personas: [
        {
          role: "Quantitative Algo Trader",
          description: "Designs automated trading strategies using momentum, mean reversion, and market making algorithms.",
          coreNeed: "Sub-20ms execution latency, deterministic order fills, and high-frequency WebSocket tickers.",
          painPoint: "Exchange API rate-limit bans, slip during high volatility, and unexpected API schema changes."
        },
        {
          role: "Risk & Portfolio Controller",
          description: "Supervises overall trading desk margin, drawdown thresholds, and emergency liquidations.",
          coreNeed: "Instant 1-click global kill switch and automated stop-loss enforcement on all accounts.",
          painPoint: "Unmonitored runaway trading bots accumulating catastrophic margin calls."
        }
      ],
      p0Requirements: [
        {
          id: "REQ-TRD-01",
          title: "Low-Latency WebSocket Market Data Ingestion",
          desc: "Full-duplex WebSocket connection to Binance, Coinbase, and Kraken streaming L2 book updates and 1m candlesticks.",
          acceptance: "Processes >50,000 market ticks/sec with <5ms parsing latency; automatically reconnects with exponential backoff on socket drop."
        },
        {
          id: "REQ-TRD-02",
          title: "Real-Time Technical Indicator Calculation (RSI, MACD)",
          desc: "Vectorized calculation of 14-period Relative Strength Index and 12/26/9 MACD on moving candlestick windows.",
          acceptance: "Calculates updated indicator values in <2ms upon candle close; generates buy/sell threshold signal events."
        },
        {
          id: "REQ-TRD-03",
          title: "Automated Risk Management & Stop-Loss Dispatch",
          desc: "Hardware-accelerated risk gate checking portfolio drawdown, max position size, and executing stop-loss market orders.",
          acceptance: "Executes emergency market stop-loss order within 10ms of price threshold breach; halts new order creation if daily drawdown >5%."
        },
        {
          id: "REQ-TRD-04",
          title: "Encrypted API Key Management & HMAC Signing",
          desc: "Exchange API secrets stored in AWS KMS / HashiCorp Vault; signatures generated in memory with zero secret leakage.",
          acceptance: "Generates HMAC-SHA256 signature in <1ms; strictly prohibits secrets appearing in logs or error traces."
        }
      ],
      p1Requirements: [
        {
          id: "REQ-TRD-05",
          title: "Telegram & Discord Execution Alerts",
          desc: "Asynchronous webhook worker pushing instant trade execution receipts, PnL summaries, and margin warnings to Telegram.",
          acceptance: "Delivers Telegram message within 250ms of order fill with formatted entry price, quantity, and stop-loss levels."
        }
      ],
      p2Requirements: [
        {
          id: "REQ-TRD-06",
          title: "Historical Strategy Backtesting Simulator",
          desc: "Replays 3+ years of historical 1-minute OHLCV tick data to simulate slippage, fees, and strategy Sharpe ratios.",
          acceptance: "Executes 100,000 candle backtest in <4 seconds; exports visual equity curves and drawdown metrics."
        }
      ],
      apiEndpoints: [
        {
          method: "POST",
          path: "/api/v1/trading/orders/place",
          desc: "Place a signed market, limit, or stop-loss trade order",
          payload: JSON.stringify({
            symbol: "BTCUSDT",
            exchange: "binance",
            side: "BUY",
            type: "LIMIT",
            quantity: 0.25,
            price: 64250.00,
            stop_loss: 62900.00,
            take_profit: 67500.00
          }, null, 2),
          response: JSON.stringify({
            status: "filled",
            order_id: "ord_binance_99218",
            symbol: "BTCUSDT",
            executed_price: 64248.50,
            fill_quantity: 0.25,
            fee_amount_usd: 1.60,
            latency_ms: 18
          }, null, 2)
        },
        {
          method: "GET",
          path: "/api/v1/trading/positions/live",
          desc: "Retrieve active portfolio positions and live unrealized PnL",
          payload: "N/A (Query parameters: account_id=acc_01)",
          response: JSON.stringify({
            account_id: "acc_01",
            total_equity_usd: 128450.00,
            unrealized_pnl_usd: 3420.50,
            positions: [
              { symbol: "BTCUSDT", units: 1.5, entry_price: 63100.00, current_price: 64250.00, pnl: 1725.00 },
              { symbol: "ETHUSDT", units: 12.0, entry_price: 3350.00, current_price: 3491.00, pnl: 1692.00 }
            ]
          }, null, 2)
        }
      ],
      playwrightTests: [
        {
          testCaseId: "TC-TRD-01",
          name: "Execute Order with Automated Stop Loss Protection",
          code: `test("Algo trader places limit buy order with automated stop-loss", async ({ request }) => {
    const orderRes = await request.post("/api/v1/trading/orders/place", {
      data: {
        symbol: "BTCUSDT",
        exchange: "binance",
        side: "BUY",
        type: "LIMIT",
        quantity: 0.1,
        price: 64000.00,
        stop_loss: 62500.00
      }
    });
    expect(orderRes.status()).toBe(200);
    const body = await orderRes.json();
    expect(body.status).toBe("filled");
    expect(body.order_id).toBeDefined();
    expect(body.latency_ms).toBeLessThan(50);
  });`
        }
      ],
      securityFocus: [
        { area: "Exchange Secret Cryptographic Storage", mitigation: "API Secrets are stored encrypted with AES-256-GCM via AWS KMS. Private keys are never decrypted in persistent storage or log files." },
        { area: "IP Whitelisting & Mutex Execution", mitigation: "All outbound exchange requests originate from static elastic IP addresses whitelisted on the exchange. Distributed Redis Redlock prevents duplicate double-spends." },
        { area: "Global Hardware Kill-Switch", mitigation: "Provides immediate authenticated command to cancel 100% of open orders and flatten positions to USDT within 500ms." }
      ],
      complianceFramework: "SOC 2 Type II, Financial Industry Automated Trading Standards"
    };
  }

  // 3. IOT / DRONES / ROBOTICS / TELEMETRY
  if (p.includes("drone") || p.includes("iot") || p.includes("sensor") || p.includes("telemetry") || p.includes("robot") || p.includes("hardware") || p.includes("gps") || p.includes("mqtt") || p.includes("altitude") || p.includes("flight") || p.includes("beekeeping")) {
    return {
      title: "Autonomous Drone Fleet & IoT Sensor Telemetry Suite",
      shortName: "AeroFleet",
      category: "IoT, Robotics & Spatial Telemetry",
      userPromptRaw: prompt,
      executiveSummary: "A mission-critical autonomous fleet and spatial telemetry system ingesting high-frequency sensor packets (GPS coordinates, altitude, airspeed, battery health) over EMQX MQTT, providing real-time 3D flight path visualization, automated geofence boundary enforcement, and over-the-air (OTA) firmware deployment.",
      extractedKeywords: ["DroneFleet", "MQTT", "Telemetry", "Geofence", "GPSCoords", "Waypoints", "FirmwareOTA"],
      primaryEntities: ["DroneDevice", "TelemetryPacket", "FlightMission", "WaypointCoord", "GeofenceZone", "FirmwareOTA"],
      erdEntities: [
        {
          name: "DroneDevice",
          description: "Registered drone hardware unit with telemetry modem.",
          fields: [
            { name: "id", type: "uuid", key: "PK" },
            { name: "faa_serial_number", type: "string", key: "UK" },
            { name: "model_hardware_revision", type: "string" },
            { name: "battery_cycles_count", type: "integer" },
            { name: "current_status", type: "string" },
            { name: "last_heartbeat_at", type: "timestamp" }
          ]
        },
        {
          name: "TelemetryPacket",
          description: "High-frequency 20Hz sensor packet emitted during mission.",
          fields: [
            { name: "id", type: "uuid", key: "PK" },
            { name: "drone_id", type: "uuid", key: "FK" },
            { name: "gps_latitude", type: "decimal" },
            { name: "gps_longitude", type: "decimal" },
            { name: "altitude_agl_meters", type: "decimal" },
            { name: "ground_speed_mps", type: "decimal" },
            { name: "battery_remaining_pct", type: "integer" },
            { name: "signal_rssi_dbm", type: "integer" },
            { name: "recorded_at", type: "timestamp" }
          ]
        },
        {
          name: "FlightMission",
          description: "Autonomous flight path or survey mission assigned to drone.",
          fields: [
            { name: "id", type: "uuid", key: "PK" },
            { name: "drone_id", type: "uuid", key: "FK" },
            { name: "mission_name", type: "string" },
            { name: "mission_type", type: "string" },
            { name: "planned_distance_meters", type: "decimal" },
            { name: "status", type: "string" }
          ]
        },
        {
          name: "WaypointCoord",
          description: "3D GPS waypoint coordinate for autonomous navigation.",
          fields: [
            { name: "id", type: "uuid", key: "PK" },
            { name: "mission_id", type: "uuid", key: "FK" },
            { name: "sequence_index", type: "integer" },
            { name: "target_lat", type: "decimal" },
            { name: "target_lon", type: "decimal" },
            { name: "target_alt_meters", type: "decimal" },
            { name: "hover_time_seconds", type: "integer" }
          ]
        },
        {
          name: "GeofenceZone",
          description: "Virtual spatial perimeter enforcing no-fly boundary limits.",
          fields: [
            { name: "id", type: "uuid", key: "PK" },
            { name: "zone_name", type: "string" },
            { name: "zone_type", type: "string" },
            { name: "boundary_geojson", type: "json" },
            { name: "max_ceiling_altitude_m", type: "decimal" }
          ]
        },
        {
          name: "FirmwareOTA",
          description: "Cryptographically signed firmware payload for remote OTA update.",
          fields: [
            { name: "id", type: "uuid", key: "PK" },
            { name: "version_tag", type: "string" },
            { name: "binary_sha256", type: "string" },
            { name: "min_battery_required_pct", type: "integer" }
          ]
        }
      ],
      erdRelations: [
        { from: "DroneDevice", to: "TelemetryPacket", cardinality: "||--o{", label: "emits" },
        { from: "DroneDevice", to: "FlightMission", cardinality: "||--o{", label: "executes" },
        { from: "FlightMission", to: "WaypointCoord", cardinality: "||--o{", label: "follows" },
        { from: "DroneDevice", to: "FirmwareOTA", cardinality: "||--o{", label: "installs" }
      ],
      sequenceFlow: `sequenceDiagram
    autonumber
    participant Drone as Autonomous Drone Hardware
    participant MQTT as EMQX MQTT Cluster (TLS mTLS)
    participant Ingest as Telemetry TimescaleDB Worker
    participant Geofence as Spatial Geofence Guard
    participant Console as Mission Operations Dashboard

    Drone->>MQTT: Publish telemetry on /drones/{id}/telemetry (20Hz)
    MQTT->>Ingest: Stream sensor batch into TimescaleDB Hypertable
    Ingest->>Geofence: Validate coordinates against polygon perimeter
    alt Drone breaches geofence or battery < 15%
        Geofence->>MQTT: Publish COMMAND_RTH (Return To Home) on /drones/{id}/cmd
        MQTT-->>Drone: Drone executes emergency auto-landing
    else Normal mission flight
        Ingest->>Console: WebSocket live 3D path coordinates update
    end`,
      services: [
        "EMQX Distributed MQTT Broker & Telemetry Gateway",
        "TimescaleDB Time-Series Telemetry Ingestion Worker",
        "Spatial Geofence Collision & Boundary Monitoring Engine",
        "Mission Planning & 3D Waypoint Path Optimizer",
        "Cryptographic Over-the-Air (OTA) Firmware Dispatcher"
      ],
      apiPrefix: "/api/v1/fleet",
      personas: [
        {
          role: "Flight Operations Commander",
          description: "Oversees simultaneous autonomous missions across dozens of airborne units.",
          coreNeed: "Real-time 3D flight maps with sub-second position latency and instant emergency controls.",
          painPoint: "Loss of telemetry signal, undetected geofence drift, and battery state discrepancies."
        },
        {
          role: "Hardware & Avionics Maintenance Tech",
          description: "Manages battery cycle health, sensor calibration, and firmware version rollout.",
          coreNeed: "Automated alert flags for rotor vibration anomalies and failed sensor diagnostics.",
          painPoint: "Bricked units during OTA updates and unrecorded hardware maintenance logs."
        }
      ],
      p0Requirements: [
        {
          id: "REQ-IOT-01",
          title: "High-Frequency MQTT Telemetry Stream Processing",
          desc: "Ingests 20Hz telemetry packets (GPS, Altitude, Speed, Battery) per drone across 1,000 concurrent devices over TLS 1.3 mTLS.",
          acceptance: "Ingests 20,000 packets/sec into TimescaleDB hypertables with <10ms buffer latency; zero packet drops."
        },
        {
          id: "REQ-IOT-02",
          title: "Automated Spatial Geofencing & Boundary Enforcement",
          desc: "Evaluates current drone GPS coordinates against PostGIS spatial boundary polygons in real time.",
          acceptance: "Detects geofence breach in <50ms; triggers automated COMMAND_RETURN_TO_HOME MQTT payload."
        },
        {
          id: "REQ-IOT-03",
          title: "Autonomous Mission & Waypoint Navigation Dispatch",
          desc: "Generates ordered 3D waypoints with altitude constraints and uploads mission plans to drone flight controllers.",
          acceptance: "Uploads mission plan with SHA256 checksum verification; confirms flight controller validation."
        }
      ],
      p1Requirements: [
        {
          id: "REQ-IOT-04",
          title: "Cryptographic Over-the-Air (OTA) Firmware Rollout",
          desc: "Staged canary firmware distribution enforcing battery >50% check and SHA-256 digital signature validation.",
          acceptance: "Aborts update if battery <50% or checksum mismatch; maintains dual-bank firmware rollback."
        }
      ],
      p2Requirements: [
        {
          id: "REQ-IOT-05",
          title: "Battery Degradation & Rotor Anomaly Forecasting",
          desc: "Machine learning model analyzing internal resistance and motor current draw to forecast rotor failure.",
          acceptance: "Flags failing motors >5 flight hours prior to mechanical seizure."
        }
      ],
      apiEndpoints: [
        {
          method: "POST",
          path: "/api/v1/fleet/missions/dispatch",
          desc: "Dispatch an autonomous 3D waypoint mission to a designated drone",
          payload: JSON.stringify({
            drone_id: "drone_alpha_092",
            mission_name: "Agricultural Survey Sector B",
            waypoints: [
              { sequence: 1, lat: 37.7749, lon: -122.4194, alt_m: 50.0, hover_s: 0 },
              { sequence: 2, lat: 37.7760, lon: -122.4180, alt_m: 50.0, hover_s: 10 }
            ],
            geofence_id: "geo_sector_b_poly"
          }, null, 2),
          response: JSON.stringify({
            status: "accepted",
            mission_id: "mis_2026_0911_44",
            drone_id: "drone_alpha_092",
            checksum_sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            upload_latency_ms: 32
          }, null, 2)
        },
        {
          method: "GET",
          path: "/api/v1/fleet/drones/drone_alpha_092/telemetry",
          desc: "Fetch latest live telemetry snapshot and battery status",
          payload: "N/A (GET query)",
          response: JSON.stringify({
            drone_id: "drone_alpha_092",
            status: "in_flight",
            gps: { lat: 37.7751, lon: -122.4191, alt_agl_m: 49.8 },
            battery: { pct: 84, voltage_mv: 22400 },
            speed_mps: 12.4,
            rssi_dbm: -64
          }, null, 2)
        }
      ],
      playwrightTests: [
        {
          testCaseId: "TC-IOT-01",
          name: "Upload Waypoint Mission and Receive Controller Ack",
          code: `test("Operator uploads 3D waypoint mission and verifies controller state", async ({ request }) => {
    const res = await request.post("/api/v1/fleet/missions/dispatch", {
      data: {
        drone_id: "drone_test_01",
        mission_name: "Test Survey",
        waypoints: [{ sequence: 1, lat: 37.7, lon: -122.4, alt_m: 30, hover_s: 0 }]
      }
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("accepted");
    expect(body.checksum_sha256).toBeDefined();
  });`
        }
      ],
      securityFocus: [
        { area: "mTLS Device Certificate Identity", mitigation: "Every hardware drone embeds an immutable hardware security module (HSM) holding a private key for mutual TLS (mTLS) to the MQTT broker." },
        { area: "Command Anti-Replay Guard", mitigation: "All control commands incorporate monotonically increasing nonces and cryptographic HMAC signatures to prevent spoofing or replay attacks." }
      ],
      complianceFramework: "FAA Part 107 Autonomous Operations, Remote ID Standards"
    };
  }

  // 4. E-COMMERCE / FOOD DELIVERY / MARKETPLACE
  if (p.includes("ecommerce") || p.includes("shop") || p.includes("store") || p.includes("food") || p.includes("delivery") || p.includes("restaurant") || p.includes("cart") || p.includes("checkout") || p.includes("courier") || p.includes("menu")) {
    return {
      title: "On-Demand Food Delivery & Merchant Marketplace",
      shortName: "QuickBite",
      category: "E-Commerce & On-Demand Delivery",
      userPromptRaw: prompt,
      executiveSummary: "A high-throughput multi-sided marketplace connecting customers, restaurant kitchens, and delivery couriers. Features real-time cart checkout with idempotent Stripe payments, live GPS courier tracking with sub-second WebSocket updates, automated kitchen ticket dispatch, and dynamic delivery fee estimation.",
      extractedKeywords: ["FoodDelivery", "MerchantKitchen", "CourierTracking", "StripeCheckout", "CartManager", "LiveMap"],
      primaryEntities: ["CustomerAccount", "MerchantStore", "MenuItem", "CustomerOrder", "DeliveryCourier", "CourierLocation"],
      erdEntities: [
        {
          name: "CustomerAccount",
          description: "Registered consumer placing food delivery orders.",
          fields: [
            { name: "id", type: "uuid", key: "PK" },
            { name: "email", type: "string", key: "UK" },
            { name: "full_name", type: "string" },
            { name: "phone_number", type: "string" },
            { name: "default_address_geojson", type: "json" }
          ]
        },
        {
          name: "MerchantStore",
          description: "Partner restaurant or merchant kitchen preparing orders.",
          fields: [
            { name: "id", type: "uuid", key: "PK" },
            { name: "store_name", type: "string" },
            { name: "cuisine_type", type: "string" },
            { name: "geo_location", type: "point" },
            { name: "is_accepting_orders", type: "boolean" },
            { name: "avg_prep_time_minutes", type: "integer" }
          ]
        },
        {
          name: "MenuItem",
          description: "Food dish or product listing available for purchase.",
          fields: [
            { name: "id", type: "uuid", key: "PK" },
            { name: "merchant_id", type: "uuid", key: "FK" },
            { name: "item_name", type: "string" },
            { name: "price_cents", type: "integer" },
            { name: "is_in_stock", type: "boolean" }
          ]
        },
        {
          name: "CustomerOrder",
          description: "Primary checkout order connecting customer, store, and courier.",
          fields: [
            { name: "id", type: "uuid", key: "PK" },
            { name: "customer_id", type: "uuid", key: "FK" },
            { name: "merchant_id", type: "uuid", key: "FK" },
            { name: "courier_id", type: "uuid", key: "FK" },
            { name: "subtotal_cents", type: "integer" },
            { name: "delivery_fee_cents", type: "integer" },
            { name: "order_status", type: "string" },
            { name: "payment_intent_id", type: "string", key: "UK" }
          ]
        },
        {
          name: "DeliveryCourier",
          description: "Active delivery driver fulfilling orders.",
          fields: [
            { name: "id", type: "uuid", key: "PK" },
            { name: "driver_name", type: "string" },
            { name: "vehicle_type", type: "string" },
            { name: "current_status", type: "string" },
            { name: "rating_avg", type: "decimal" }
          ]
        },
        {
          name: "CourierLocation",
          description: "Live GPS coordinates broadcasted by active courier.",
          fields: [
            { name: "id", type: "uuid", key: "PK" },
            { name: "courier_id", type: "uuid", key: "FK" },
            { name: "latitude", type: "decimal" },
            { name: "longitude", type: "decimal" },
            { name: "bearing_degrees", type: "decimal" },
            { name: "recorded_at", type: "timestamp" }
          ]
        }
      ],
      erdRelations: [
        { from: "MerchantStore", to: "MenuItem", cardinality: "||--o{", label: "offers" },
        { from: "CustomerAccount", to: "CustomerOrder", cardinality: "||--o{", label: "places" },
        { from: "MerchantStore", to: "CustomerOrder", cardinality: "||--o{", label: "prepares" },
        { from: "DeliveryCourier", to: "CustomerOrder", cardinality: "||--o{", label: "delivers" },
        { from: "DeliveryCourier", to: "CourierLocation", cardinality: "||--o{", label: "broadcasts" }
      ],
      sequenceFlow: `sequenceDiagram
    autonumber
    actor Customer as Mobile Customer
    actor Kitchen as Restaurant Merchant
    actor Courier as Delivery Driver
    participant Gateway as API Gateway
    participant OrderSvc as Order & Checkout Engine
    participant Payment as Stripe Payment Gateway
    participant Dispatch as Courier Dispatch Engine
    participant Tracking as WebSocket Location Stream

    Customer->>Gateway: POST /api/v1/orders/checkout (Items, Address, PaymentMethod)
    Gateway->>OrderSvc: Create Pending Order & Lock Inventory
    OrderSvc->>Payment: Authorize PaymentIntent with Idempotency Key
    Payment-->>OrderSvc: Payment Authorized (201 Created)
    OrderSvc->>Kitchen: Push order to Kitchen Display System (KDS)
    Kitchen-->>OrderSvc: Food PREPARING (ETA 15 mins)
    OrderSvc->>Dispatch: Match Nearest Online Courier (Geohash Query)
    Dispatch-->>Courier: Accept Delivery Notification (Payout + Distance)
    Courier->>Tracking: Broadcast live GPS coordinates (1Hz)
    Tracking-->>Customer: Live Map Pin Updates with real-time ETA`,
      services: [
        "Merchant Catalog & Dynamic Inventory Service",
        "Cart, Checkout & Idempotent Payment Processor",
        "Automated Kitchen Display & Order Dispatch Worker",
        "Geohash Courier Matching & Routing Engine",
        "Real-Time WebSocket GPS Location Streaming Service"
      ],
      apiPrefix: "/api/v1/marketplace",
      personas: [
        {
          role: "Hungry Consumer",
          description: "Orders meals via mobile app expecting accurate ETA and live driver map tracking.",
          coreNeed: "Frictionless 1-click Apple Pay checkout and real-time courier GPS visualization.",
          painPoint: "Stale food status, incorrect delivery estimates, and missing order items."
        },
        {
          role: "Restaurant Kitchen Manager",
          description: "Receives kitchen order tickets during high-volume rush periods.",
          coreNeed: "Reliable ticket printing, kitchen prep timers, and 1-click 86-ing of sold-out items.",
          painPoint: "Driver arriving before food is cooked or orders dropping during internet hiccups."
        }
      ],
      p0Requirements: [
        {
          id: "REQ-ECOM-01",
          title: "Atomic Cart Checkout & Idempotent Payment",
          desc: "Two-phase checkout transaction reserving inventory and executing Stripe PaymentIntent with idempotency keys.",
          acceptance: "Guarantees zero duplicate charges; rejects double-submissions within 24h window."
        },
        {
          id: "REQ-ECOM-02",
          title: "Real-Time Courier Geohash Dispatch",
          desc: "Matches order with closest available driver within 3km using Redis GEOADD and GEORADIUS commands.",
          acceptance: "Dispatches offer to nearest driver in <300ms; falls back to secondary tier if unaccepted in 45s."
        },
        {
          id: "REQ-ECOM-03",
          title: "Live GPS Courier Location Stream",
          desc: "WebSocket and Server-Sent Events stream updating customer mobile map with driver coordinates at 1Hz.",
          acceptance: "Pushes driver location with <150ms network latency; animates smooth map marker movement."
        }
      ],
      p1Requirements: [
        {
          id: "REQ-ECOM-04",
          title: "Automated Push & SMS Order Lifecycle Alerts",
          desc: "Sends real-time updates at order placed, kitchen preparing, out for delivery, and delivered stages.",
          acceptance: "Dispatches push notification within 2 seconds of state transition."
        }
      ],
      p2Requirements: [
        {
          id: "REQ-ECOM-05",
          title: "Dynamic Surge Pricing & Prep Time Prediction",
          desc: "Machine learning regression forecasting kitchen cooking time and adjusting delivery fee based on rain and demand.",
          acceptance: "Reduces order ETA variance by 40% compared to static estimates."
        }
      ],
      apiEndpoints: [
        {
          method: "POST",
          path: "/api/v1/marketplace/orders/checkout",
          desc: "Execute atomic cart checkout and initiate payment hold",
          payload: JSON.stringify({
            merchant_id: "rest_burger_joint_01",
            items: [
              { item_id: "item_truffle_burger", quantity: 2, price_cents: 1450 },
              { item_id: "item_sweet_potato_fries", quantity: 1, price_cents: 550 }
            ],
            delivery_address: { street: "742 Evergreen Terrace", lat: 37.7749, lon: -122.4194 },
            tip_cents: 400
          }, null, 2),
          response: JSON.stringify({
            status: "authorized",
            order_id: "ord_deliv_88192",
            subtotal_cents: 3450,
            delivery_fee_cents: 399,
            total_cents: 4249,
            estimated_delivery_time: "2026-09-10T19:45:00Z"
          }, null, 2)
        }
      ],
      playwrightTests: [
        {
          testCaseId: "TC-ECOM-01",
          name: "Complete Order Checkout with Inventory Lock",
          code: `test("Customer checks out food order and receives confirmation receipt", async ({ request }) => {
    const res = await request.post("/api/v1/marketplace/orders/checkout", {
      data: {
        merchant_id: "rest_01",
        items: [{ item_id: "burger_01", quantity: 1, price_cents: 1200 }]
      }
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("authorized");
    expect(body.order_id).toBeDefined();
  });`
        }
      ],
      securityFocus: [
        { area: "PCI-DSS Level 1 Payment Isolation", mitigation: "Zero raw credit card numbers touch application servers. All payments utilize client-side Stripe Elements tokens." },
        { area: "Location Spoofing Guard", mitigation: "Driver GPS updates are cross-referenced with cellular cell tower latency and speed plausibility checks (rejects teleportation >150km/h)." }
      ],
      complianceFramework: "PCI-DSS Level 1, SOC 2 Type II"
    };
  }

  // 5. UNIVERSAL INTELLIGENT DECOMPILER (ANY OTHER CUSTOM TOPIC)
  // Extracts actual prompt nouns and verbs to produce a 100% custom specification!
  const rawWords = prompt.replace(/[.,/#!$%^&*;:{}=\-_`~()?"'<>]/g, " ").split(/\s+/).filter(Boolean);
  const meaningfulWords = rawWords.filter((w) => w.length > 2 && !STOP_WORDS.has(w.toLowerCase()));
  const concepts = Array.from(new Set(meaningfulWords.map(cleanPascalCase))).filter((c) => c.length > 2);

  const entity1 = concepts[0] || "PrimaryRecord";
  const entity2 = concepts[1] || "ActivityEvent";
  const entity3 = concepts[2] || "WorkflowItem";
  const entity4 = concepts[3] || "ConfigurationSetting";
  const entity5 = concepts[4] || "AuditLog";

  const derivedTitle = concepts.slice(0, 3).join(" ") || "Custom Cloud Architecture";

  return {
    title: `${cleanTitle(derivedTitle)} Platform`,
    shortName: `${entity1}Core`,
    category: "Specialized Systems Architecture",
    userPromptRaw: prompt,
    executiveSummary: `A purpose-built distributed software platform engineered to fulfill: "${prompt}". Decoupled around high-throughput persistence, event streaming, strictly typed domain models, and zero-trust authentication.`,
    extractedKeywords: concepts.slice(0, 6),
    primaryEntities: [entity1, entity2, entity3, entity4, entity5],
    erdEntities: [
      {
        name: entity1,
        description: `Primary operational entity directly modeling core requirements for ${entity1}.`,
        fields: [
          { name: "id", type: "uuid", key: "PK" },
          { name: "identifier_code", type: "string", key: "UK" },
          { name: "status_state", type: "string" },
          { name: "payload_data", type: "json" },
          { name: "created_at", type: "timestamp" }
        ]
      },
      {
        name: entity2,
        description: `Real-time transactional and event telemetry record for ${entity2}.`,
        fields: [
          { name: "id", type: "uuid", key: "PK" },
          { name: `${entity1.toLowerCase()}_id`, type: "uuid", key: "FK" },
          { name: "event_type", type: "string" },
          { name: "metric_value", type: "decimal" },
          { name: "recorded_at", type: "timestamp" }
        ]
      },
      {
        name: entity3,
        description: `State machine transition and operational task record for ${entity3}.`,
        fields: [
          { name: "id", type: "uuid", key: "PK" },
          { name: `${entity1.toLowerCase()}_id`, type: "uuid", key: "FK" },
          { name: "task_priority", type: "string" },
          { name: "execution_result", type: "string" }
        ]
      },
      {
        name: entity4,
        description: `Tenant configuration, policy rules, and thresholds for ${entity4}.`,
        fields: [
          { name: "id", type: "uuid", key: "PK" },
          { name: "config_key", type: "string", key: "UK" },
          { name: "config_value", type: "json" }
        ]
      },
      {
        name: entity5,
        description: `Immutable audit trace capturing access and mutation history.`,
        fields: [
          { name: "id", type: "uuid", key: "PK" },
          { name: "actor_id", type: "uuid" },
          { name: "action_name", type: "string" },
          { name: "timestamp", type: "timestamp" }
        ]
      }
    ],
    erdRelations: [
      { from: entity1, to: entity2, cardinality: "||--o{", label: "emits" },
      { from: entity1, to: entity3, cardinality: "||--o{", label: "processes" },
      { from: entity4, to: entity1, cardinality: "||--o{", label: "governs" },
      { from: entity1, to: entity5, cardinality: "||--o{", label: "logs" }
    ],
    sequenceFlow: `sequenceDiagram
    autonumber
    actor User as User Client
    participant GW as Ingress API Gateway
    participant Core as ${entity1} Orchestrator
    participant Event as ${entity2} Stream Ingestion
    participant DB as Distributed Database

    User->>GW: POST /api/v1/${entity1.toLowerCase()}s (Create & Trigger)
    GW->>Core: Validate schema & enforce zero-trust policies
    Core->>DB: Atomic mutation commit (<40ms)
    Core->>Event: Publish domain event to Message Bus
    Event-->>User: Operation Confirmed (HTTP 201 Created)`,
    services: [
      `${entity1} Domain Orchestration & Lifecycle Service`,
      `${entity2} High-Throughput Stream Ingestion Engine`,
      `${entity3} Task Scheduler & Automated Trigger Worker`,
      "Zero-Trust Identity, RBAC & Policy Gateway",
      "Telemetry, Observability & Immutable Audit Cluster"
    ],
    apiPrefix: `/api/v1/${entity1.toLowerCase()}`,
    personas: [
      {
        role: `Lead Operator / Administrator (${entity1} Lead)`,
        description: `Responsible for managing workflows and reviewing state transitions across ${entity1}.`,
        coreNeed: `Real-time management dashboard with sub-second queries and automated anomaly warnings.`,
        painPoint: `Manual spreadsheet reconciliation and synchronization lag across microservices.`
      },
      {
        role: "API Integration Developer",
        description: `External developer integrating third-party software with the platform.`,
        coreNeed: `Typed OpenAPI 3.1 contracts, clear idempotency keys, and sub-100ms response times.`,
        painPoint: `Undocumented schema changes and unhandled rate limiting.`
      }
    ],
    p0Requirements: [
      {
        id: "REQ-GEN-01",
        title: `${entity1} Core State Machine & Mutation Lifecycle`,
        desc: `Full CRUD management, schema validation, and lifecycle state transitions for ${entity1}.`,
        acceptance: `Validates payloads with typed schemas; commits state with <50ms p95 latency; enforces unique constraint on identity fields.`
      },
      {
        id: "REQ-GEN-02",
        title: `High-Throughput Stream Ingestion for ${entity2}`,
        desc: `Asynchronous event stream processing for continuous updates to ${entity2} using distributed message brokers.`,
        acceptance: `Ingests 10,000 events/sec with zero message loss; delivers payloads to subscribers in <20ms.`
      },
      {
        id: "REQ-GEN-03",
        title: `Automated Task Dispatch for ${entity3}`,
        desc: `Event-driven background worker executing on state anomalies, SLA thresholds, or completion events.`,
        acceptance: `Dispatches signed webhooks and notifications within 300ms of trigger condition; implements exponential backoff.`
      }
    ],
    p1Requirements: [
      {
        id: "REQ-GEN-04",
        title: "Observability, Prometheus Metrics & Distributed Tracing",
        desc: "Structured JSON logging, Prometheus metric scraping (/metrics), and OpenTelemetry tracing.",
        acceptance: "Records p50/p95/p99 request duration; alerts on error rates >0.1%."
      }
    ],
    p2Requirements: [
      {
        id: "REQ-GEN-05",
        title: "AI Predictive Analytics & Forecasting",
        desc: `Machine learning anomaly detection pipeline forecasting operational anomalies for ${entity1}.`,
        acceptance: "Executes sub-200ms vector inference queries; delivers automated recommendations."
      }
    ],
    apiEndpoints: [
      {
        method: "POST",
        path: `/api/v1/${entity1.toLowerCase()}s`,
        desc: `Create and initialize a new ${entity1} record`,
        payload: JSON.stringify({
          name: `Sample ${entity1}`,
          status: "active",
          priority: "high"
        }, null, 2),
        response: JSON.stringify({
          status: "created",
          id: "9f3a1b2c-8d7e-4f6a-5b4c-3d2e1a0f9e8d",
          created_at: "2026-09-01T10:00:00Z"
        }, null, 2)
      },
      {
        method: "GET",
        path: `/api/v1/${entity1.toLowerCase()}s`,
        desc: `Query ${entity1} records with indexed pagination and filtering`,
        payload: "N/A (Query Parameters: limit=20, cursor=...) ",
        response: JSON.stringify({
          status: "success",
          data: [{ id: "uuid-1", name: `Sample ${entity1}`, status: "active" }]
        }, null, 2)
      }
    ],
    playwrightTests: [
      {
        testCaseId: "TC-GEN-01",
        name: `Create and Verify ${entity1} Lifecycle`,
        code: `test("User creates new ${entity1} and validates state", async ({ request }) => {
    const res = await request.post("/api/v1/${entity1.toLowerCase()}s", {
      data: { name: "Test Record", status: "active" }
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("created");
    expect(body.id).toBeDefined();
  });`
      }
    ],
    securityFocus: [
      { area: "Access Control & IDOR Defense", mitigation: `Every database query for ${entity1} enforces multi-tenant boundary predicates.` },
      { area: "Cryptographic Protocols", mitigation: "Enforces TLS 1.3 in transit and AES-256-GCM at rest with automated key rotation." }
    ],
    complianceFramework: "SOC 2 Type II, ISO 27001, OWASP Top 10"
  };
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
${d.executiveSummary}

The platform is designed to provide high-concurrency, enterprise-grade availability engineered according to **${stack.architecture}**, leveraging:
* **Frontend Layer:** ${stack.frontend}
* **Backend Core:** ${stack.backend}
* **Persistence & Storage:** ${stack.database}
* **Caching & Message Broker:** ${stack.caching}
* **Deployment & Orchestration:** ${stack.deployment}
* **Authentication & Identity:** ${stack.auth}

### 📋 Grounding Requirements
\`\`\`text
${d.userPromptRaw}
\`\`\`

### 🔍 Extracted Domain Concepts
* **Primary Domain Entities:** ${d.primaryEntities.join(", ")}
* **Core Microservices:** ${d.services.join("; ")}

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
| **Compliance** | **${d.complianceFramework}** | Strictly verified against statutory and industry requirements. |
| **Security** | **Zero-Trust Hardened** | Token validation via ${stack.auth}, TLS 1.3 in transit, AES-256 at rest. |
| **Disaster Recovery** | **RTO < 5m, RPO = 0** | Continuous WAL / snapshot replication to object storage. |
`;
}

// Stage 1: 01_SYSTEM_ARCHITECTURE.md
function generateSystemArchitecture(prompt: string, stack: TechStackPreferences, d: DomainContext): string {
  // Build Mermaid ERD
  const erdRelationsString = d.erdRelations.map((r) => `    ${r.from} ${r.cardinality} ${r.to} : "${r.label}"`).join("\n");
  const erdEntitiesString = d.erdEntities.map((e) => {
    const fields = e.fields.map((f) => `        ${f.type} ${f.name}${f.key ? " " + f.key : ""}`).join("\n");
    return `    ${e.name} {\n${fields}\n    }`;
  }).join("\n\n");

  return `# 01_SYSTEM_ARCHITECTURE.md: Topology & Schema Blueprint

## 1. Architectural Overview & Stack Selection

| Layer | Selected Technology | Architectural Rationale & Trade-offs |
| :--- | :--- | :--- |
| **Frontend UI** | ${stack.frontend} | Selected for performance, platform accessibility, and responsiveness. |
| **Backend Core** | ${stack.backend} | Selected for async throughput, strict type safety, and domain decoupling. |
| **Database** | ${stack.database} | Specialized persistence for ${d.primaryEntities.join(", ")}. |
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

## 3. End-to-End Workflow & Sequence Flow

\`\`\`mermaid
${d.sequenceFlow}
\`\`\`

---

## 4. Database Schema & Entity Relationship Diagram (ERD)

\`\`\`mermaid
erDiagram
${erdRelationsString}

${erdEntitiesString}
\`\`\`

---

## 5. Production API Contracts (OpenAPI 3.1)

${d.apiEndpoints.map((ep) => `### \`${ep.method} ${ep.path}\`
* **Description:** ${ep.desc}
* **Security:** Bearer Token (JWT RS256)

#### Request Payload
\`\`\`json
${ep.payload}
\`\`\`

#### Response Payload (HTTP 200/201)
\`\`\`json
${ep.response}
\`\`\`
`).join("\n")}
`;
}

// Stage 2: 02_IMPLEMENTATION_PLAN.md
function generateImplementationPlan(prompt: string, stack: TechStackPreferences, d: DomainContext): string {
  const backendStr = stack.backend.toLowerCase();
  const isPython = backendStr.includes("python") || backendStr.includes("fastapi");
  const isRust = backendStr.includes("rust");
  const isGo = backendStr.includes("go");

  const repoTree = isPython
    ? `├── pyproject.toml
├── requirements.txt
├── app/
│   ├── main.py
│   ├── config.py
│   ├── api/
│   │   ├── ${d.primaryEntities[0].toLowerCase()}s.py
│   │   └── ${d.primaryEntities[1].toLowerCase()}s.py
│   ├── models/
│   │   └── domain.py
│   └── services/
│       └── orchestrator.py
└── tests/
    └── test_workflows.py`
    : isRust
    ? `├── Cargo.toml
├── src/
│   ├── main.rs
│   ├── api/
│   │   ├── mod.rs
│   │   └── handlers.rs
│   ├── models/
│   │   └── schema.rs
│   └── service.rs
└── tests/
    └── integration_test.rs`
    : isGo
    ? `├── go.mod
├── go.sum
├── cmd/
│   └── server/
│       └── main.go
├── internal/
│   ├── handler/
│   ├── model/
│   └── service/
└── tests/
    └── workflow_test.go`
    : `├── package.json
├── tsconfig.json
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   └── api/
│   ├── components/
│   └── lib/
└── tests/
    └── e2e/`;

  return `# 02_IMPLEMENTATION_PLAN.md: Engineering Milestones & Sprint Roadmap

## 1. Monorepo Structure & Code Organization

\`\`\`text
${repoTree}
\`\`\`

---

## 2. Phased Engineering Sprint Roadmap

### 🏁 Phase 1: Core Domain Models & Storage Layer (Sprint 1)
* **Goal:** Initialize schema migrations, connection pooling, and models for **${d.primaryEntities.join(", ")}**.
* **Key Deliverables:**
  * Schema migrations committed for ${d.erdEntities.map((e) => `\`${e.name}\``).join(", ")}.
  * Connection pool configuration with automatic retry and health ping.
  * Seed data scripts simulating production volume.

### ⚡ Phase 2: Business Logic & API Layer (Sprint 2)
* **Goal:** Implement core microservices and expose typed REST/gRPC endpoints.
* **Key Deliverables:**
  * Implement \`${d.apiEndpoints[0]?.method} ${d.apiEndpoints[0]?.path}\`.
  * Validate request inputs with strict schema validators (Zod/Pydantic).
  * Unit test coverage >85% on core domain calculations and mutations.

### 🔄 Phase 3: Real-Time Telemetry & Message Bus Integration (Sprint 3)
* **Goal:** Connect **${stack.caching}** for sub-millisecond pub/sub streaming.
* **Key Deliverables:**
  * Event publishers and consumer workers running on message queue.
  * WebSocket / Server-Sent Events gateway broadcasting state updates to clients.
  * Distributed locking (Redis Redlock) preventing race conditions.

### 🛡️ Phase 4: Security Hardening & Pre-Production Sign-Off (Sprint 4)
* **Goal:** Complete penetration testing, compliance verification, and performance profiling.
* **Key Deliverables:**
  * Zero-trust token authentication active across 100% of endpoints.
  * Verified compliance with **${d.complianceFramework}**.
  * k6 load test sign-off sustaining 10,000+ RPS at p95 < 80ms.
`;
}

// Stage 3: 03_TESTING_STRATEGY.md
function generateTestingStrategy(prompt: string, stack: TechStackPreferences, d: DomainContext): string {
  const backendStr = stack.backend.toLowerCase();
  const isPython = backendStr.includes("python") || backendStr.includes("fastapi");
  const isRust = backendStr.includes("rust");

  const testSnippet = isPython
    ? `import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_${d.primaryEntities[0].toLowerCase()}_workflow():
    async with AsyncClient(app=app, base_url="http://test") as client:
        res = await client.post("${d.apiEndpoints[0]?.path}", json=${d.apiEndpoints[0]?.payload || "{}"})
        assert res.status_code in [200, 201]
        data = res.json()
        assert data["status"] in ["confirmed", "accepted", "filled", "created", "success"]
`
    : isRust
    ? `#[tokio::test]
async fn test_${d.primaryEntities[0].toLowerCase()}_mutation() {
    let client = reqwest::Client::new();
    let res = client.post("http://localhost:8080${d.apiEndpoints[0]?.path}")
        .json(&serde_json::json!(${d.apiEndpoints[0]?.payload || "{}"}))
        .send()
        .await
        .unwrap();
    assert!(res.status().is_success());
}
`
    : `import { test, expect } from "@playwright/test";

${d.playwrightTests.map((t) => t.code).join("\n\n")}
`;

  return `# 03_TESTING_STRATEGY.md: Quality Assurance & Automation Suite

## 1. Testing Pyramid & Automation Coverage Targets

| Test Tier | Target Coverage | Tooling Framework | Execution Trigger |
| :--- | :--- | :--- | :--- |
| **Unit Tests** | **>85% Code Coverage** | ${isPython ? "pytest + pytest-asyncio" : isRust ? "cargo test" : "Vitest + React Testing Library"} | Every pull request commit |
| **Integration Tests** | **100% API Contracts** | Supertest / httpx with Testcontainers | Pre-merge CI pipeline |
| **End-to-End (E2E)** | **Critical User Journeys** | Playwright Automation Suite | Staging deployment gate |
| **Stress & Load** | **10,000+ RPS Sustained** | k6 Distributed Load Generator | Nightly performance cron |

---

## 2. Production Automation Test Suite

\`\`\`${isPython ? "python" : isRust ? "rust" : "typescript"}
${testSnippet}
\`\`\`

---

## 3. High-Throughput Load Testing Script (k6)

\`\`\`javascript
import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 2000 },
    { duration: "1m", target: 10000 },
    { duration: "30s", target: 0 }
  ],
  thresholds: {
    http_req_duration: ["p(95)<80"],
    http_req_failed: ["rate<0.001"]
  }
};

export default function () {
  const res = http.get("http://localhost:3000${d.apiEndpoints[0]?.path}");
  check(res, { "status is 200/201": (r) => r.status === 200 || r.status === 201 });
  sleep(0.05);
}
\`\`\`
`;
}

// Stage 4: 04_SECURITY_COMPLIANCE.md
function generateSecurityCompliance(prompt: string, stack: TechStackPreferences, d: DomainContext): string {
  return `# 04_SECURITY_COMPLIANCE.md: Threat Model & Regulatory Blueprint

## 1. Security Architecture & Threat Matrix

| Threat Vector | STRIDE Category | Impact Level | Architectural Mitigation & Enforcement |
| :--- | :--- | :--- | :--- |
| **Unauthenticated Ingress** | Spoofing | **Critical** | Zero-trust token validation enforced at ${stack.auth.split("/")[0].trim()} API gateway. |
| **SQL / ORM Injection** | Tampering | **Critical** | 100% parameterized queries via ORM; strict schema validation on all inputs. |
| **Data Breach at Rest** | Information Disclosure | **High** | Sensitive fields encrypted via AES-256-GCM using AWS KMS envelope encryption. |
| **Replay & Race Conditions** | Repudiation | **High** | Idempotency keys tracked in Redis cluster with distributed Redlock mutex. |
| **DDoS API Flooding** | Denial of Service | **High** | Distributed token-bucket rate limiting (120 req/min per IP/API key). |

---

## 2. Regulatory Compliance Blueprint: ${d.complianceFramework}

### Core Statutory Mandates
${d.securityFocus.map((s) => `* **${s.area}:** ${s.mitigation}`).join("\n")}

### Key Management & Cryptographic Hygiene
* **In-Transit:** TLS 1.3 enforced on all public and internal ingress endpoints with HSTS (max-age=31536000).
* **At-Rest:** Storage volumes, database tables, and object stores encrypted using AES-256.
* **Secret Storage:** Zero secrets checked into source control; fetched dynamically from HashiCorp Vault or AWS Secrets Manager.
`;
}

// Stage 5: 05_DEPLOYMENT_DEVOPS.md
function generateDeploymentDevops(prompt: string, stack: TechStackPreferences, d: DomainContext): string {
  const backendStr = stack.backend.toLowerCase();
  const isPython = backendStr.includes("python") || backendStr.includes("fastapi");
  const isRust = backendStr.includes("rust");
  const isGo = backendStr.includes("go");

  const dockerfile = isPython
    ? `FROM python:3.11-slim AS runner
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]`
    : isRust
    ? `FROM rust:1.75-alpine AS builder
WORKDIR /app
COPY Cargo.* ./
COPY src ./src
RUN cargo build --release

FROM alpine:3.19
WORKDIR /app
COPY --from=builder /app/target/release/${d.shortName.toLowerCase()} ./app
EXPOSE 8080
CMD ["./app"]`
    : isGo
    ? `FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.* ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o server ./cmd/server

FROM alpine:3.19
WORKDIR /app
COPY --from=builder /app/server ./server
EXPOSE 8080
CMD ["./server"]`
    : `FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]`;

  return `# 05_DEPLOYMENT_DEVOPS.md: Containerization & Infrastructure Pipeline

## 1. Production Multi-Stage Dockerfile

\`\`\`dockerfile
${dockerfile}
\`\`\`

---

## 2. Docker Compose Local Staging Topology

\`\`\`yaml
version: "3.8"

services:
  app:
    build: .
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
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

## 3. GitHub Actions CI/CD Deployment Workflow

\`\`\`yaml
name: Production Deployment Pipeline

on:
  push:
    branches: [main]

jobs:
  test-and-verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Test Suite
        run: echo "Running Automated Test Matrix..."
      - name: Build and Push Docker Container
        run: echo "Building container for ${d.shortName}..."
      - name: Deploy to Kubernetes Cluster
        run: echo "Executing zero-downtime rolling update on ${stack.deployment}..."
\`\`\`
`;
}
