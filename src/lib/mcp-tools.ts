export interface MCPToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  category: "validation" | "ingestion" | "security" | "quality";
}

export const MCP_TOOLS: MCPToolDefinition[] = [
  {
    name: "validate_mermaid_syntax",
    description: "Parses and verifies valid syntax for Mermaid flowcharts, ER diagrams, and sequence diagrams.",
    category: "validation",
    parameters: {
      type: "object",
      properties: {
        diagramType: { type: "string", enum: ["flowchart", "erDiagram", "sequenceDiagram", "gantt"] },
        content: { type: "string", description: "Raw Mermaid code block" }
      },
      required: ["diagramType", "content"]
    }
  },
  {
    name: "lint_openapi_contract",
    description: "Validates REST API endpoint schemas, parameters, and HTTP responses against OpenAPI 3.1 specifications.",
    category: "validation",
    parameters: {
      type: "object",
      properties: {
        endpoints: { type: "array", items: { type: "object" } }
      },
      required: ["endpoints"]
    }
  },
  {
    name: "check_security_cve",
    description: "Queries the Open Source Vulnerability (OSV.dev) database to check dependency versions against known CVEs.",
    category: "security",
    parameters: {
      type: "object",
      properties: {
        packages: { type: "array", items: { type: "string" } }
      },
      required: ["packages"]
    }
  },
  {
    name: "fetch_github_codebase_context",
    description: "Ingests repository trees, file contents, and schema definitions from public or authenticated GitHub repositories.",
    category: "ingestion",
    parameters: {
      type: "object",
      properties: {
        repoUrl: { type: "string" },
        targetPaths: { type: "array", items: { type: "string" } }
      },
      required: ["repoUrl"]
    }
  },
  {
    name: "evaluate_sdlc_coherence",
    description: "Audits cross-document integrity ensuring database schemas in Stage 1 match task definitions in Stage 2 and Docker configs in Stage 5.",
    category: "quality",
    parameters: {
      type: "object",
      properties: {
        stageOutputs: { type: "object" }
      },
      required: ["stageOutputs"]
    }
  }
];

export function validateMermaidSnippet(mermaidCode: string): { isValid: boolean; error?: string } {
  const code = mermaidCode.trim();
  if (!code) return { isValid: false, error: "Empty Mermaid diagram" };

  const validHeaders = ["flowchart", "graph", "erdiagram", "sequencediagram", "gantt", "classdiagram"];
  const firstLine = code.split("\n")[0].trim().toLowerCase();

  const hasValidHeader = validHeaders.some((h) => firstLine.startsWith(h));
  if (!hasValidHeader) {
    return {
      isValid: false,
      error: `Invalid diagram header: "${firstLine}". Expected one of: ${validHeaders.join(", ")}`
    };
  }

  return { isValid: true };
}
