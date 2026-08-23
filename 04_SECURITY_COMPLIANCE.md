# 04_SECURITY_COMPLIANCE.md: Security & Compliance Blueprint

## 1. Identity, Authentication & RBAC Permission Matrix

### 1.1 Authentication & Credential Architecture
SpecFlow AI uses a hybrid security model designed for both local client execution and enterprise deployments:
- **Client Mode (Zero Server State):** User API keys (OpenAI, Anthropic, Gemini, Groq) are held exclusively in browser memory and `localStorage`. Keys are sent over encrypted HTTPS headers directly to the orchestration handler and are never written to disk or logged.
- **Server / Team Mode:** When deployed to an enterprise organization, users authenticate via OAuth 2.0 / OpenID Connect (OIDC) with Okta, Azure AD, or GitHub SSO. Ephemeral JSON Web Tokens (JWT) signed via `RS256` manage session lifetimes.

### 1.2 Granular RBAC Permission Table

| Role | Specifications | Templates | API Key Settings | Export Artifacts | Admin Governance |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **LEAD_ARCHITECT** | Create, Read, Edit, Regenerate | Create, Edit, Delete | Manage Workspace Keys | Full Download (.zip/PDF) | Yes |
| **DEVELOPER** | Read, Edit In-Place, Regenerate | Read Presets | Use Configured Keys | Full Download (.zip) | No |
| **QA_AUDITOR** | Read, Add Test Cases | Read Presets | None | Full Download (.zip) | No |
| **GUEST_VIEWER** | Read-Only | Read Presets | None | Read-Only View | No |

---

## 2. OWASP Top 10 Mitigation Blueprint

```mermaid
flowchart LR
    A["OWASP Risk"] --> B["SpecFlow AI Defense Mechanism"] --> C["Secured Architecture"]

    R1["A01: Broken Access Control"] --> D1["Stateless JWT Verification & Tenant Scoping"] --> S1["Isolated Tenant Context"]
    R2["A02: Cryptographic Failures"] --> D2["TLS 1.3 Strict HTTPS & Key Masking"] --> S2["Encrypted In-Transit & At-Rest"]
    R3["A03: Injection & Prompt Injection"] --> D3["Input Sanitization & System Prompt Isolation"] --> S3["Deterministic LLM Execution"]
    R4["A07: Identification & Auth Failures"] --> D4["Token Expiry (15m) & Refresh Rotation"] --> S4["Tamper-Proof Sessions"]
    R5["A08: Software & Data Integrity"] --> D5["Dependency Scanning & JSZip Sanitization"] --> S5["Clean Export Artifacts"]
```

### 2.1 Technical Countermeasures & Implementations

#### 1. Injection & Prompt Injection Defense
- System prompts are strictly separated from user input using OpenAI/Anthropic/Gemini native `system` role parameters.
- User prompt inputs are wrapped in structured boundaries and checked against malicious directive patterns.
- Parameterized SQL queries and typed ORMs eliminate SQL Injection risks.

#### 2. Broken Access Control & IDOR Prevention
- Every data access query enforces compound WHERE clauses incorporating tenant ID: `WHERE id = :id AND tenant_id = :auth_tenant_id`.
- Granular RBAC middleware verifies role permissions before executing controller use-cases.

#### 3. Cryptographic Failures Mitigation
- In-transit encryption via TLS 1.3 with Perfect Forward Secrecy.
- At-rest database encryption via AES-256-GCM with KMS-managed customer keys.

#### 4. Insecure Design & Threat Modeling
- Defense-in-depth architecture with rate limiting, input size limits, and circuit breakers.

#### 5. Security Misconfiguration Hardening
- Hardened multi-stage Docker container executing under dedicated non-root user (`apprunner`).
- Production security headers: CSP, HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff.

#### 6. Vulnerable Components & Supply Chain Security
- Automated dependency vulnerability scanning via OSV.dev and Trivy container scanning in CI/CD.

#### 7. Security Logging and Monitoring Failures
- Structured JSON audit logging recording actor ID, IP, request ID, timestamp, and target resource.

#### 8. Server-Side Request Forgery (SSRF) Protection
- Outbound webhook and LLM URL dispatches restricted to validated HTTPS allowlists.

---

## 3. Cryptographic Standards & Secret Rotation Policy

### 3.1 Standards Matrix
- **In-Transit Encryption:** Enforced TLS 1.3 protocol with HTTP Strict Transport Security (`HSTS: max-age=63072000; includeSubDomains; preload`).
- **At-Rest Encryption:** Any cached enterprise artifacts are encrypted using AES-256-GCM.
- **Client Key Storage:** Browser `localStorage` entries for API keys are scoped to the exact origin (`https://...`) with `SameSite=Strict` cookies.

### 3.2 Automated Secret Rotation Policy
- Cloud provider API keys must follow an automated 90-day rotation cadence.
- Ephemeral signing keys for JWT authentication are automatically rotated every 30 days via HashiCorp Vault / AWS KMS.

---

## 4. Environment Variable Dictionary

| Variable Name | Environment | Sensitivity | Default / Example Value | Description |
| :--- | :--- | :---: | :--- | :--- |
| `NODE_ENV` | All | Public | `development` / `production` | Node.js execution environment. |
| `PORT` | All | Public | `3000` | Port for the Next.js web application. |
| `OPENAI_API_KEY` | Dev / Prod | **Secret** | `sk-proj-abc123xyz...` | (Optional) Server-level fallback OpenAI API key. |
| `ANTHROPIC_API_KEY` | Dev / Prod | **Secret** | `sk-ant-api03-...` | (Optional) Server-level fallback Anthropic API key. |
| `GEMINI_API_KEY` | Dev / Prod | **Secret** | `AIzaSyB...` | (Optional) Server-level fallback Google Gemini API key. |
| `GROQ_API_KEY` | Dev / Prod | **Secret** | `gsk_...` | (Optional) Server-level fallback Groq API key. |
| `OLLAMA_BASE_URL` | Dev / Prod | Public | `http://localhost:11434` | Endpoint for local Ollama LLM instance. |
| `NEXT_PUBLIC_APP_URL` | All | Public | `http://localhost:3000` | Public base URL of the SpecFlow application. |
