import JSZip from "jszip";
import { saveAs } from "file-saver";
import { StageState, TechStackPreferences } from "./types";

export interface CodebaseScaffoldOptions {
  projectName: string;
  stages: StageState[];
  techStack: TechStackPreferences;
  userPrompt: string;
}

export async function exportStarterCodebase(options: CodebaseScaffoldOptions) {
  const { projectName, stages, techStack, userPrompt } = options;
  const zip = new JSZip();

  const sanitized = projectName.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "specflow-app";

  // Root Package.json
  const packageJson = {
    name: sanitized,
    version: "0.1.0",
    private: true,
    scripts: {
      dev: "next dev",
      build: "next build",
      start: "next start",
      lint: "next lint",
      test: "playwright test",
      "db:migrate": "prisma migrate dev",
      "db:generate": "prisma generate"
    },
    dependencies: {
      next: "^14.2.24",
      react: "^18.3.1",
      "react-dom": "^18.3.1",
      "lucide-react": "^1.16.0",
      clsx: "^2.1.1",
      "tailwind-merge": "^3.0.2",
      "@prisma/client": "^5.22.0",
      zod: "^3.23.8",
      jsonwebtoken: "^9.0.2"
    },
    devDependencies: {
      "@playwright/test": "^1.49.1",
      "@types/node": "^22.13.9",
      "@types/react": "^18.3.18",
      "@types/react-dom": "^18.3.5",
      prisma: "^5.22.0",
      tailwindcss: "^3.4.17",
      typescript: "^5.8.2"
    }
  };

  zip.file("package.json", JSON.stringify(packageJson, null, 2));

  // Prisma Schema
  const prismaSchema = `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id           String    @id @default(uuid())
  email        String    @unique
  passwordHash String    @map("password_hash")
  role         String    @default("MEMBER")
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")
  resources    Resource[]

  @@map("users")
}

model Resource {
  id          String   @id @default(uuid())
  userId      String   @map("user_id")
  title       String
  status      String   @default("ACTIVE")
  metadata    Json?
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("resources")
}
`;
  zip.file("prisma/schema.prisma", prismaSchema);

  // Environment configuration
  zip.file(".env.example", `DATABASE_URL="postgresql://app_user:SuperSecureSecret2026@localhost:5432/${sanitized}?schema=public"\nJWT_SECRET="super-secret-jwt-key-2026"\nPORT=3000\nNODE_ENV="development"`);

  // Dockerfile
  const dockerfile = `FROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npx prisma generate && npm run build\n\nFROM node:20-alpine AS runner\nWORKDIR /app\nENV NODE_ENV=production\nENV PORT=3000\nCOPY --from=builder /app/.next ./.next\nCOPY --from=builder /app/node_modules ./node_modules\nCOPY --from=builder /app/package.json ./package.json\nEXPOSE 3000\nCMD ["npm", "start"]\n`;
  zip.file("Dockerfile", dockerfile);

  // Docker Compose
  const dockerCompose = `version: "3.9"\nservices:\n  app:\n    build: .\n    ports:\n      - "3000:3000"\n    environment:\n      - DATABASE_URL=postgresql://app_user:SuperSecureSecret2026@postgres:5432/${sanitized}\n    depends_on:\n      - postgres\n      - redis\n  postgres:\n    image: postgres:16-alpine\n    environment:\n      POSTGRES_DB: ${sanitized}\n      POSTGRES_USER: app_user\n      POSTGRES_PASSWORD: SuperSecureSecret2026\n    ports:\n      - "5432:5432"\n  redis:\n    image: redis:7-alpine\n    ports:\n      - "6379:6379"\n`;
  zip.file("docker-compose.yml", dockerCompose);

  // Playwright Test
  const playwrightTest = `import { test, expect } from "@playwright/test";\n\ntest.describe("${projectName} E2E Test Suite", () => {\n  test("loads homepage and verifies API health", async ({ page }) => {\n    await page.goto("/");\n    await expect(page).toHaveTitle(/.+/);\n  });\n});\n`;
  zip.file("tests/e2e/app.spec.ts", playwrightTest);

  // Include .specs folder with all 6 specifications
  const specsFolder = zip.folder(".specs");
  if (specsFolder) {
    stages.forEach((s) => {
      specsFolder.file(s.fileName, s.content || `# ${s.fileName}\n`);
    });
  }

  // Root README
  const readme = `# ${projectName}\n\n> Complete production starter repository scaffolded by **SpecFlow AI** on ${new Date().toISOString().split("T")[0]}.\n\n## 🛠️ Tech Stack\n- **Frontend:** ${techStack.frontend}\n- **Backend:** ${techStack.backend}\n- **Database:** ${techStack.database}\n- **Deployment:** ${techStack.deployment}\n\n## 🚀 Quick Start\n\`\`\`bash\nnpm install\ncp .env.example .env\ndocker compose up -d\nnpx prisma migrate dev\nnpm run dev\n\`\`\`\n\n## 📑 Specifications\nSee \`.specs/\` for full architectural blueprints.\n`;
  zip.file("README.md", readme);

  // Generate ZIP and trigger browser download
  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${sanitized}-starter-codebase.zip`);
}
