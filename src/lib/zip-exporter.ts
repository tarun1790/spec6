import JSZip from "jszip";
import { saveAs } from "file-saver";
import { StageState, STAGES, TechStackPreferences } from "./types";
import { extractDomainContext } from "./mock-generator";

export async function exportSpecificationZip(
  projectName: string,
  stages: StageState[],
  userPrompt: string,
  techStack?: TechStackPreferences
) {
  const zip = new JSZip();
  const domain = extractDomainContext(userPrompt || "Enterprise Cloud Application");
  const sanitizedProjectName = projectName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || `${domain.shortName.toLowerCase()}-specs`;

  const backendStr = techStack?.backend?.toLowerCase() || "node";
  const isPython = backendStr.includes("python") || backendStr.includes("fastapi");
  const isRust = backendStr.includes("rust");
  const isGo = backendStr.includes("go");

  // 1. Create .specs folder inside zip
  const specsFolder = zip.folder(".specs") || zip;

  // Build master README.md index
  let readmeIndex = `# ${domain.title || projectName || "Project Specifications"}\n\n`;
  readmeIndex += `> Generated with **SpecFlow AI** Spec-Driven Development Suite on ${new Date().toISOString().split("T")[0]}.\n\n`;

  if (userPrompt) {
    readmeIndex += `## 📋 Requirements Prompt\n\n\`\`\`text\n${userPrompt.trim()}\n\`\`\`\n\n`;
  }

  if (techStack) {
    readmeIndex += `## 🛠️ Architecture & Tech Stack\n\n`;
    readmeIndex += `* **Frontend:** ${techStack.frontend}\n`;
    readmeIndex += `* **Backend:** ${techStack.backend}\n`;
    readmeIndex += `* **Database:** ${techStack.database}\n`;
    readmeIndex += `* **Caching & Broker:** ${techStack.caching}\n`;
    readmeIndex += `* **Deployment:** ${techStack.deployment}\n`;
    readmeIndex += `* **Authentication:** ${techStack.auth}\n\n`;
  }

  readmeIndex += `## 📑 Specification Suite Index\n\n`;
  readmeIndex += `| Stage | Document | Description |\n`;
  readmeIndex += `| :---: | :--- | :--- |\n`;

  // Add each stage file to .specs and the index
  STAGES.forEach((stageDef) => {
    const stageState = stages.find((s) => s.index === stageDef.index);
    const content = stageState?.content || `# ${stageDef.fileName}\n\n*Pending generation.*`;
    
    // Add file to .specs folder
    specsFolder.file(stageDef.fileName, content);

    // Add entry to root README.md index
    readmeIndex += `| **${stageDef.index.toString().padStart(2, "0")}** | [\`${stageDef.fileName}\`](./.specs/${stageDef.fileName}) | ${stageDef.shortDescription} |\n`;
  });

  // Add root README.md
  zip.file("README.md", readmeIndex);

  // 2. Generate Stack Scaffolding Files
  if (isPython) {
    // Python Requirements
    const reqTxt = `fastapi>=0.110.0
uvicorn[standard]>=0.28.0
pydantic>=2.6.0
sqlalchemy>=2.0.0
asyncpg>=0.29.0
redis>=5.0.0
pytest>=8.0.0
httpx>=0.27.0
pytest-asyncio>=0.23.0
`;
    zip.file("requirements.txt", reqTxt);

    const mainPy = `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI(title="${domain.title}", version="1.0.0")

class ${domain.primaryEntities[0]}Create(BaseModel):
    name: str
    status: Optional[str] = "active"

@app.get("/healthz")
async def health_check():
    return {"status": "healthy", "service": "${domain.shortName}"}

@app.get("${domain.apiPrefix}")
async def list_${domain.primaryEntities[0].toLowerCase()}s():
    return {"status": "success", "data": []}

@app.post("${domain.apiPrefix}")
async def create_${domain.primaryEntities[0].toLowerCase()}(payload: ${domain.primaryEntities[0]}Create):
    return {"status": "success", "data": {"id": "test-uuid-123", "name": payload.name, "status": payload.status}}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
`;
    zip.file("app/main.py", mainPy);

    const dockerfile = `FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
`;
    zip.file("Dockerfile", dockerfile);
  } else if (isRust) {
    const cargoToml = `[package]
name = "${domain.shortName.toLowerCase()}"
version = "0.1.0"
edition = "2021"

[dependencies]
tokio = { version = "1.0", features = ["full"] }
axum = "0.7"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
tracing = "0.1"
tracing-subscriber = "0.3"
`;
    zip.file("Cargo.toml", cargoToml);

    const mainRs = `use axum::{routing::get, Json, Router};
use serde_json::{json, Value};
use std::net::SocketPort;

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/healthz", get(|| async { Json(json!({"status": "healthy"})) }))
        .route("${domain.apiPrefix}", get(|| async { Json(json!({"status": "success", "data": []})) }));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
    println!("Server running on port 8080");
    axum::serve(listener, app).await.unwrap();
}
`;
    zip.file("src/main.rs", mainRs);

    const dockerfile = `FROM rust:1.75-alpine AS builder
WORKDIR /app
COPY Cargo.* ./
COPY src ./src
RUN cargo build --release

FROM alpine:3.19
WORKDIR /app
COPY --from=builder /app/target/release/${domain.shortName.toLowerCase()} ./app
EXPOSE 8080
CMD ["./app"]
`;
    zip.file("Dockerfile", dockerfile);
  } else if (isGo) {
    const goMod = `module ${domain.shortName.toLowerCase()}

go 1.22

require (
    github.com/gofiber/fiber/v2 v2.52.0
)
`;
    zip.file("go.mod", goMod);

    const mainGo = `package main

import (
    "github.com/gofiber/fiber/v2"
)

func main() {
    app := fiber.New()

    app.Get("/healthz", func(c *fiber.Ctx) error {
        return c.JSON(fiber.Map{"status": "healthy"})
    })

    app.Get("${domain.apiPrefix}", func(c *fiber.Ctx) error {
        return c.JSON(fiber.Map{"status": "success", "data": []string{}})
    })

    app.Listen(":8080")
}
`;
    zip.file("cmd/server/main.go", mainGo);

    const dockerfile = `FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.* ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o server ./cmd/server

FROM alpine:3.19
WORKDIR /app
COPY --from=builder /app/server ./server
EXPOSE 8080
CMD ["./server"]
`;
    zip.file("Dockerfile", dockerfile);
  } else {
    // Default TypeScript / Prisma
    const prismaSchema = `// Prisma Schema generated by SpecFlow AI
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String    @map("password_hash")
  fullName      String?   @map("full_name")
  role          String    @default("operator")
  isActive      Boolean   @default(true) @map("is_active")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  @@map("users")
}

${domain.primaryEntities.map((ent) => `model ${ent} {
  id          String    @id @default(uuid())
  name        String
  status      String    @default("active")
  metadata    Json?
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  @@map("${ent.toLowerCase()}s")
}`).join("\n\n")}
`;
    zip.file("prisma/schema.prisma", prismaSchema);

    const dockerfile = `FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
`;
    zip.file("Dockerfile", dockerfile);
  }

  // 3. Generate OpenAPI 3.1 Contract (openapi.json)
  const openApiSpec = {
    openapi: "3.1.0",
    info: {
      title: `${domain.title} API`,
      version: "1.0.0",
      description: `Production API contract for ${domain.title} generated by SpecFlow AI.`
    },
    paths: {
      [domain.apiPrefix]: {
        get: {
          summary: `List ${domain.primaryEntities[0]} records`,
          responses: {
            "200": {
              description: "Successful query",
              content: { "application/json": { schema: { type: "object" } } }
            }
          }
        },
        post: {
          summary: `Create a new ${domain.primaryEntities[0]}`,
          requestBody: {
            required: true,
            content: { "application/json": { schema: { type: "object" } } }
          },
          responses: {
            "201": { description: "Resource created successfully" }
          }
        }
      }
    }
  };
  zip.file("openapi.json", JSON.stringify(openApiSpec, null, 2));

  // 4. Generate Production docker-compose.yml
  const dockerCompose = `version: "3.8"

services:
  app:
    build: .
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://user:password@db:5432/${domain.shortName.toLowerCase()}
      - CACHE_URL=redis://cache:6379
    depends_on:
      - db
      - cache

  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${domain.shortName.toLowerCase()}
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
`;
  zip.file("docker-compose.yml", dockerCompose);

  // 5. Generate Playwright E2E Master Test
  const playwrightTest = `import { test, expect } from "@playwright/test";

test.describe("${domain.title} - E2E Master Workflow", () => {
  test("TC-01: End-to-end user journey verification", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/.*${domain.shortName}.*/i);
  });
});
`;
  zip.file("tests/e2e/workflow.spec.ts", playwrightTest);

  // 6. Generate Quickstart Setup Script
  const quickstartScript = `#!/usr/bin/env bash
echo "=========================================="
echo " ${domain.title} Scaffold Suite"
echo "=========================================="
echo "Generated specifications and runnable scaffolds in .specs/:"
ls -la .specs/
`;
  zip.file("quickstart.sh", quickstartScript);

  // Generate zip blob and trigger browser download
  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${sanitizedProjectName}.zip`);
}
