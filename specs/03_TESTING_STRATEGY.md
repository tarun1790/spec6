# 03_TESTING_STRATEGY.md: Quality Assurance Matrix

## 1. Unit Testing Matrix (>80% Target Coverage)

### 1.1 Scope & Mocking Boundaries
SpecFlow AI enforces a minimum of **85% line and branch test coverage** across all core libraries and business logic modules. External API endpoints (OpenAI, Anthropic, Gemini) and browser DOM elements are mocked to ensure ultra-fast, deterministic unit test runs.

| Module / Component | Testing Objective | Mocking Strategy | Target Coverage |
| :--- | :--- | :--- | :---: |
| **`src/lib/prompts.ts`** | Verify stage prompt construction, context accumulation formatting, and stack interpolation. | None (pure function testing). | **100%** |
| **`src/lib/mock-generator.ts`** | Verify domain keyword detection, Mermaid syntax validity, and section compliance. | None (pure function testing). | **95%** |
| **`src/lib/llm-providers.ts`** | Verify API request dispatch, streaming reader parsing, and error fallback handlers. | `vi.fn()` / `fetch` interceptor. | **90%** |
| **`src/lib/zip-exporter.ts`** | Validate `.zip` folder creation, sanitized filenames, and master `README.md` index generation. | `JSZip` in-memory mock. | **90%** |
| **`src/components/MarkdownRenderer.tsx`** | Verify GFM parsing, table rendering, code block extraction, and HTML tag sanitization. | React Testing Library + JSDOM. | **85%** |
| **`src/components/MermaidViewer.tsx`** | Test SVG generation, error boundary rendering for invalid syntax, and pan/zoom state. | Mock `mermaid.render()` callback. | **85%** |

### 1.2 Example Unit Test Code (Prompt & Context Chaining Verification)

```typescript
import { describe, it, expect } from "vitest";
import { buildStagePrompt, getSystemPrompt } from "@/lib/prompts";
import { TechStackPreferences } from "@/lib/types";

describe("Stage Prompt & Context Chaining Engine", () => {
  const sampleStack: TechStackPreferences = {
    frontend: "Next.js 14 + Tailwind",
    backend: "FastAPI",
    database: "PostgreSQL",
    architecture: "Event-Driven",
    deployment: "Kubernetes",
    auth: "OAuth 2.0 / JWT",
    caching: "Redis"
  };

  it("should generate Stage 0 prompt containing all mandatory section requirements", () => {
    const prompt = buildStagePrompt(0, "Build an AI agent platform", sampleStack, {});
    
    expect(prompt).toContain("00_PROJECT_BRIEF.md");
    expect(prompt).toContain("Functional Requirements Matrix");
    expect(prompt).toContain("Non-Functional Requirements");
    expect(prompt).toContain("Selected Technology Stack:");
    expect(prompt).toContain("Next.js 14 + Tailwind");
  });

  it("should inject accumulated context into Stage 1 prompt for architectural consistency", () => {
    const mockContext = {
      "00_PROJECT_BRIEF.md": "# Brief\nEntity: User, AgentTask, MemoryRecord."
    };

    const prompt = buildStagePrompt(1, "Build an AI agent platform", sampleStack, mockContext);
    
    expect(prompt).toContain("01_SYSTEM_ARCHITECTURE.md");
    expect(prompt).toContain("--- PREVIOUS ACCUMULATED SPECIFICATIONS FOR CONSISTENCY ---");
    expect(prompt).toContain("Entity: User, AgentTask, MemoryRecord.");
    expect(prompt).toContain("Mermaid Flowchart");
    expect(prompt).toContain("Mermaid ERD");
  });

  it("should enforce clean system prompt with zero conversational filler", () => {
    const sysPrompt = getSystemPrompt();
    expect(sysPrompt).toContain("Principal Software Architect");
    expect(sysPrompt).toContain("no introductory or concluding conversational filler");
    expect(sysPrompt).toContain("valid syntax");
  });
});
```

---

## 2. API & Integration Test Suites

### 2.1 Server-Sent Events (SSE) Streaming Integration Matrix

| Test ID | Test Scenario | Request Payload | Expected SSE Event Stream |
| :--- | :--- | :--- | :--- |
| **INT-01** | Full 6-Stage Generation (Mock Provider) | Prompt: "E-Commerce Store", Provider: "mock" | Emits 6 sequential pairs of `stage_start` and `stage_complete` with intermediate `chunk` events, ending with `pipeline_complete`. |
| **INT-02** | Selective Single Stage Regeneration | TargetStage: 2, AccumulatedContext: `{ "00_...": "...", "01_...": "..." }` | Emits `stage_start` for Stage 2 only, streams chunks, and emits `stage_complete` (duration < 5s). |
| **INT-03** | Upstream Provider 401 Unauthorized | Provider: "openai", ApiKey: "invalid-key-xyz" | Emits warning chunk about fallback and seamlessly yields synthesized specification without aborting. |
| **INT-04** | Client Stream Abort (AbortSignal) | Trigger `controller.abort()` during Stage 1 | Server-side generator immediately halts token generation; no further chunks emitted. |

### 2.2 Integration Test Example (SSE Stream Verification)

```typescript
import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/generate/route";
import { NextRequest } from "next/server";

describe("API Route: /api/generate SSE Stream", () => {
  it("should return a 200 OK stream with text/event-stream content-type", async () => {
    const req = new NextRequest("http://localhost:3000/api/generate", {
      method: "POST",
      body: JSON.stringify({
        prompt: "Build an IoT Sensor Gateway",
        techStack: {
          frontend: "React",
          backend: "Node.js",
          database: "MongoDB",
          architecture: "Microservices",
          deployment: "Docker",
          auth: "JWT",
          caching: "Redis"
        },
        llmConfig: { provider: "mock", model: "synthesizer", temperature: 0.3 }
      })
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/event-stream");

    const reader = res.body?.getReader();
    expect(reader).toBeDefined();

    const decoder = new TextDecoder();
    const { value } = await reader!.read();
    const firstChunk = decoder.decode(value);

    expect(firstChunk).toContain("stage_start");
    expect(firstChunk).toContain("00_PROJECT_BRIEF.md");
  });
});
```

---

## 3. End-to-End (E2E) Test User Flows

### 3.1 Playwright E2E Master Test Specification

```typescript
import { test, expect } from "@playwright/test";

test.describe("SpecFlow AI Dashboard End-to-End User Flow", () => {
  test("User selects template, runs 6-stage generation, views Mermaid diagrams, edits document, and exports ZIP", async ({ page }) => {
    // 1. Visit Dashboard
    await page.goto("/");
    await expect(page).toHaveTitle(/SpecFlow AI/i);
    await expect(page.locator("h1")).toContainText("SpecFlow AI");

    // 2. Select E-Commerce Quick-Starter Template
    const templateBtn = page.locator('button:has-text("E-Commerce Microservices")');
    await expect(templateBtn).toBeVisible();
    await templateBtn.click();

    // 3. Verify Prompt Console populated
    const promptArea = page.locator('textarea[data-testid="prompt-input"]');
    await expect(promptArea).not.toBeEmpty();
    await expect(promptArea).toContainText("E-Commerce");

    // 4. Click Generate Specification Suite
    const generateBtn = page.locator('button[data-testid="btn-generate"]');
    await expect(generateBtn).toBeEnabled();
    await generateBtn.click();

    // 5. Verify Stage 0 starts generating
    const stage0Indicator = page.locator('[data-testid="stage-item-0"]');
    await expect(stage0Indicator).toContainText("00_PROJECT_BRIEF.md");

    // 6. Wait for all 6 stages to complete
    const stage5Complete = page.locator('[data-testid="stage-item-5"][data-status="completed"]');
    await stage5Complete.waitFor({ timeout: 60000 });

    // 7. Verify Workspace Viewer contains Markdown content
    const workspaceContent = page.locator('[data-testid="markdown-viewer"]');
    await expect(workspaceContent).toContainText("Product Scope & Requirements");

    // 8. Switch to System Architecture Tab and inspect Mermaid Diagram
    await page.click('button[data-testid="tab-01_SYSTEM_ARCHITECTURE.md"]');
    const mermaidSvg = page.locator('.mermaid-diagram-container svg');
    await expect(mermaidSvg.first()).toBeVisible({ timeout: 15000 });

    // 9. Test In-Place Editor Mode
    await page.click('button[data-testid="viewmode-editor"]');
    const codeEditor = page.locator('.monaco-editor');
    await expect(codeEditor).toBeVisible();

    // 10. Trigger ZIP Bundle Export
    const exportBtn = page.locator('button[data-testid="btn-export-zip"]');
    await expect(exportBtn).toBeEnabled();
    
    // Listen for download event
    const downloadPromise = page.waitForEvent('download');
    await exportBtn.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/.*\.zip$/);
  });
});
```

---

## 4. Edge-Case Inventory & Boundary Failure Tests

| Category | Edge Scenario | Potential Failure Mode | Mitigation & Test Assertion |
| :--- | :--- | :--- | :--- |
| **Network Loss** | Client drops internet connection during Stage 3 generation. | UI hangs indefinitely in "Generating" state. | SSE connection heartbeat timeout (15s) triggers user alert and offers "Resume / Retry Stage" button. |
| **Token Limit Overflow** | User inputs 15,000 character prompt with extreme detail. | LLM request exceeds context window. | Context accumulator intelligently truncates older stage previews to latest 3,500 characters, prioritizing structural tables. |
| **Mermaid Syntax Error** | LLM emits unescaped special characters in Mermaid node labels. | Mermaid compiler crashes and blanks the entire viewer pane. | `MermaidViewer` wraps compilation in React Error Boundary, rendering formatted fallback code block with syntax highlight. |
| **Rapid Button Mashing** | User clicks "Generate" 10 times in rapid succession. | Race conditions spawning 10 parallel SSE streams. | Generation button is atomically disabled upon click; previous stream is explicitly aborted before starting new run. |
| **Corrupted LocalStorage** | Browser `localStorage` contains malformed JSON for API settings. | White screen crash on application boot. | `try/catch` wrapper initializes state with safe defaults upon any deserialization error. |
| **Empty Prompt Submission** | User clears prompt textarea and clicks "Generate". | Backend sends empty prompt to LLM. | Client-side validation shows inline validation toast and prevents submission. |
