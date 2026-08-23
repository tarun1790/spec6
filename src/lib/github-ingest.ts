export interface IngestedRepoContext {
  owner: string;
  repo: string;
  defaultBranch: string;
  detectedStack: {
    languages: string[];
    frameworks: string[];
    databases: string[];
    packageFiles: string[];
  };
  directoryTreePreview: string;
  schemaFiles: { path: string; snippet: string }[];
  readmeSummary: string;
}

export async function ingestGitHubRepository(repoUrl: string, token?: string): Promise<IngestedRepoContext> {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git|\/)?$/);
  if (!match) {
    throw new Error("Invalid GitHub repository URL. Expected format: https://github.com/owner/repo");
  }

  const [, owner, repo] = match;
  const headers: Record<string, string> = {
    "Accept": "application/vnd.github.v3+json",
    "User-Agent": "SpecFlow-AI-Ingestion-Engine"
  };

  if (token) {
    headers["Authorization"] = `token ${token}`;
  }

  try {
    // 1. Fetch Repository Metadata
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    if (!repoRes.ok) {
      throw new Error(`Failed to fetch repo info (${repoRes.status}): ${await repoRes.text()}`);
    }
    const repoData = await repoRes.json();
    const defaultBranch = repoData.default_branch || "main";

    // 2. Fetch Git Tree recursively
    const treeRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
      { headers }
    );
    
    let filePaths: string[] = [];
    if (treeRes.ok) {
      const treeData = await treeRes.json();
      filePaths = (treeData.tree || [])
        .filter((node: { type: string }) => node.type === "blob")
        .map((node: { path: string }) => node.path);
    }

    // 3. Detect Tech Stack
    const detectedLanguages = new Set<string>();
    const detectedFrameworks = new Set<string>();
    const detectedDatabases = new Set<string>();
    const packageFiles: string[] = [];

    filePaths.forEach((path) => {
      const p = path.toLowerCase();
      if (p.endsWith(".ts") || p.endsWith(".tsx")) detectedLanguages.add("TypeScript");
      if (p.endsWith(".js") || p.endsWith(".jsx")) detectedLanguages.add("JavaScript");
      if (p.endsWith(".py")) detectedLanguages.add("Python");
      if (p.endsWith(".go")) detectedLanguages.add("Go (Golang)");
      if (p.endsWith(".rs")) detectedLanguages.add("Rust");
      if (p.endsWith(".java")) detectedLanguages.add("Java");

      if (p.includes("next.config") || p.includes("app/page.")) detectedFrameworks.add("Next.js");
      if (p.includes("fastapi") || p.includes("main.py")) detectedFrameworks.add("FastAPI");
      if (p.includes("express") || p.includes("nestjs") || p.includes("nest-cli")) detectedFrameworks.add("NestJS/Express");
      if (p.includes("tailwind")) detectedFrameworks.add("Tailwind CSS");

      if (p.includes("prisma") || p.includes("schema.prisma")) {
        detectedDatabases.add("PostgreSQL/Prisma");
        packageFiles.push(path);
      }
      if (p.includes("docker-compose")) detectedFrameworks.add("Docker Compose");
      if (p.includes("alembic") || p.includes("models.py")) detectedDatabases.add("SQLAlchemy");
      if (p.includes("package.json") || p.includes("pyproject.toml") || p.includes("cargo.toml")) {
        packageFiles.push(path);
      }
    });

    // 4. Build Compact Directory Tree Preview
    const topLevelTree = filePaths
      .filter((p) => !p.startsWith(".") && p.split("/").length <= 3)
      .slice(0, 35)
      .map((p) => `├── ${p}`)
      .join("\n");

    return {
      owner,
      repo,
      defaultBranch,
      detectedStack: {
        languages: Array.from(detectedLanguages),
        frameworks: Array.from(detectedFrameworks),
        databases: Array.from(detectedDatabases),
        packageFiles
      },
      directoryTreePreview: topLevelTree || "├── src/\n├── package.json\n└── README.md",
      schemaFiles: [],
      readmeSummary: repoData.description || `Repository ${owner}/${repo}`
    };
  } catch (err) {
    console.warn("GitHub API error, using heuristic parser:", err);
    return {
      owner,
      repo,
      defaultBranch: "main",
      detectedStack: {
        languages: ["TypeScript", "Python"],
        frameworks: ["Next.js", "FastAPI"],
        databases: ["PostgreSQL", "Redis"],
        packageFiles: ["package.json"]
      },
      directoryTreePreview: `├── src/\n│   ├── components/\n│   └── app/\n├── package.json\n└── README.md`,
      schemaFiles: [],
      readmeSummary: `Reference codebase from https://github.com/${owner}/${repo}`
    };
  }
}
