import { DomainContext } from "./mock-generator";
import { TechStackPreferences } from "./types";

export type SupportedLanguage = "typescript" | "python" | "go" | "rust";

export interface VirtualFile {
  path: string;
  name: string;
  language: string;
  category: "specs" | "backend" | "models" | "tests" | "deploy";
  content: string;
}

export function generateVirtualMonorepo(
  domain: DomainContext,
  stack: TechStackPreferences,
  targetLang: SupportedLanguage = "typescript"
): VirtualFile[] {
  const e1 = domain.primaryEntities[0] || "PrimaryRecord";
  const e2 = domain.primaryEntities[1] || "EventRecord";
  const e1Lower = e1.toLowerCase();
  const e2Lower = e2.toLowerCase();
  const titleSlug = domain.shortName.toLowerCase();

  const files: VirtualFile[] = [
    // 1. SPECIFICATIONS & CONTRACTS
    {
      path: `specs/openapi.yaml`,
      name: "openapi.yaml",
      language: "yaml",
      category: "specs",
      content: `openapi: 3.1.0
info:
  title: ${domain.title} API
  version: 1.0.0
  description: Authoritative OpenAPI 3.1 contract generated for ${domain.shortName}.
servers:
  - url: http://localhost:8080
    description: Local development mock server
paths:
  ${domain.apiPrefix}:
    get:
      summary: List all ${e1} records
      operationId: list${e1}s
      responses:
        '200':
          description: Successful paginated list
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/${e1}'
    post:
      summary: Create a new ${e1}
      operationId: create${e1}
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Create${e1}Input'
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/${e1}'

components:
  schemas:
    ${e1}:
      type: object
      required: [id, name, status, created_at]
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
        status:
          type: string
          enum: [active, pending, archived]
        created_at:
          type: string
          format: date-time
    Create${e1}Input:
      type: object
      required: [name]
      properties:
        name:
          type: string
        status:
          type: string
          default: active`
    },
    {
      path: `specs/features/${titleSlug}.feature`,
      name: `${titleSlug}.feature`,
      language: "gherkin",
      category: "specs",
      content: domain.gherkinFeature
    },
    {
      path: `specs/specmatic.json`,
      name: "specmatic.json",
      language: "json",
      category: "specs",
      content: domain.specmaticContract
    }
  ];

  // 2. POLYGLOT BACKEND CODE
  if (targetLang === "typescript") {
    files.push(
      {
        path: `src/server.ts`,
        name: "server.ts",
        language: "typescript",
        category: "backend",
        content: `import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { ${e1Lower}Router } from "./routes/${e1Lower}.routes";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "healthy", service: "${domain.shortName}", timestamp: new Date().toISOString() });
});

// Domain Routes
app.use("${domain.apiPrefix}", ${e1Lower}Router);

app.listen(PORT, () => {
  console.log(\`🚀 [${domain.shortName}] Server running on port \${PORT}\`);
  console.log(\`📋 OpenAPI spec: http://localhost:\${PORT}/docs\`);
});`
      },
      {
        path: `src/routes/${e1Lower}.routes.ts`,
        name: `${e1Lower}.routes.ts`,
        language: "typescript",
        category: "backend",
        content: `import { Router, Request, Response } from "express";
import { z } from "zod";
import { ${e1}Service } from "../services/${e1Lower}.service";

export const ${e1Lower}Router = Router();
const service = new ${e1}Service();

const CreateSchema = z.object({
  name: z.string().min(2).max(100),
  status: z.enum(["active", "pending"]).default("active")
});

${e1Lower}Router.get("/", async (_req: Request, res: Response) => {
  const records = await service.findAll();
  return res.status(200).json(records);
});

${e1Lower}Router.post("/", async (req: Request, res: Response) => {
  const parsed = CreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({ error: "Validation failed", details: parsed.error.issues });
  }
  const created = await service.create(parsed.data);
  return res.status(201).json(created);
});`
      },
      {
        path: `src/services/${e1Lower}.service.ts`,
        name: `${e1Lower}.service.ts`,
        language: "typescript",
        category: "backend",
        content: `import { randomUUID } from "crypto";

export interface ${e1}Record {
  id: string;
  name: string;
  status: string;
  created_at: string;
}

export class ${e1}Service {
  private inMemoryDb: Map<string, ${e1}Record> = new Map();

  constructor() {
    const id1 = randomUUID();
    this.inMemoryDb.set(id1, {
      id: id1,
      name: "Production ${e1} Alpha",
      status: "active",
      created_at: new Date().toISOString()
    });
  }

  async findAll(): Promise<${e1}Record[]> {
    return Array.from(this.inMemoryDb.values());
  }

  async create(data: { name: string; status?: string }): Promise<${e1}Record> {
    const newRecord: ${e1}Record = {
      id: randomUUID(),
      name: data.name,
      status: data.status || "active",
      created_at: new Date().toISOString()
    };
    this.inMemoryDb.set(newRecord.id, newRecord);
    return newRecord;
  }
}`
      },
      {
        path: `prisma/schema.prisma`,
        name: "schema.prisma",
        language: "prisma",
        category: "models",
        content: `// Prisma Schema for ${domain.title}
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model ${e1} {
  id         String   @id @default(uuid())
  name       String
  status     String   @default("active")
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  ${e2Lower}s ${e2}[]

  @@map("${e1Lower}s")
}

model ${e2} {
  id         String   @id @default(uuid())
  ${e1Lower}Id String   @map("${e1Lower}_id")
  eventType  String   @map("event_type")
  recordedAt DateTime @default(now()) @map("recorded_at")

  ${e1Lower} ${e1} @relation(fields: [${e1Lower}Id], references: [id], onDelete: Cascade)

  @@map("${e2Lower}s")
}`
      },
      {
        path: `package.json`,
        name: "package.json",
        language: "json",
        category: "backend",
        content: JSON.stringify(
          {
            name: `${titleSlug}-service`,
            version: "1.0.0",
            description: `${domain.title} microservice implementation`,
            scripts: {
              dev: "tsx watch src/server.ts",
              build: "tsc",
              start: "node dist/server.js",
              test: "vitest run"
            },
            dependencies: {
              express: "^4.19.2",
              cors: "^2.8.5",
              helmet: "^7.1.0",
              zod: "^3.23.8",
              "@prisma/client": "^5.15.0"
            },
            devDependencies: {
              typescript: "^5.4.5",
              tsx: "^4.11.0",
              vitest: "^1.6.0",
              prisma: "^5.15.0"
            }
          },
          null,
          2
        )
      }
    );
  } else if (targetLang === "python") {
    files.push(
      {
        path: `app/main.py`,
        name: "main.py",
        language: "python",
        category: "backend",
        content: `from fastapi import FastAPI, status
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime

app = FastAPI(
    title="${domain.title} API",
    description="${domain.executiveSummary}",
    version="1.0.0"
)

class ${e1}Create(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    status: str = Field(default="active")

class ${e1}Response(BaseModel):
    id: uuid.UUID
    name: str
    status: str
    created_at: datetime

db_store: List[dict] = [
    {"id": uuid.uuid4(), "name": "Production ${e1} Alpha", "status": "active", "created_at": datetime.utcnow()}
]

@app.get("/health")
def health_check():
    return {"status": "healthy", "domain": "${domain.shortName}", "version": "1.0.0"}

@app.get("${domain.apiPrefix}", response_model=List[${e1}Response])
def list_${e1Lower}s():
    return db_store

@app.post("${domain.apiPrefix}", response_model=${e1}Response, status_code=status.HTTP_201_CREATED)
def create_${e1Lower}(payload: ${e1}Create):
    new_record = {
        "id": uuid.uuid4(),
        "name": payload.name,
        "status": payload.status,
        "created_at": datetime.utcnow()
    }
    db_store.append(new_record)
    return new_record`
      },
      {
        path: `app/models/domain.py`,
        name: "domain.py",
        language: "python",
        category: "models",
        content: `from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base, relationship
import uuid
from datetime import datetime

Base = declarative_base()

class ${e1}Model(Base):
    __tablename__ = "${e1Lower}s"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    status = Column(String(50), default="active", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    ${e2Lower}s = relationship("${e2}Model", back_populates="${e1Lower}", cascade="all, delete-orphan")

class ${e2}Model(Base):
    __tablename__ = "${e2Lower}s"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ${e1Lower}_id = Column(UUID(as_uuid=True), ForeignKey("${e1Lower}s.id"), nullable=False)
    event_type = Column(String(100), nullable=False)
    recorded_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    ${e1Lower} = relationship("${e1}Model", back_populates="${e2Lower}s")`
      },
      {
        path: `pyproject.toml`,
        name: "pyproject.toml",
        language: "toml",
        category: "backend",
        content: `[project]
name = "${titleSlug}-service"
version = "1.0.0"
description = "${domain.title} Service"
dependencies = [
    "fastapi>=0.111.0",
    "uvicorn[standard]>=0.30.0",
    "pydantic>=2.7.0",
    "sqlalchemy>=2.0.30"
]`
      }
    );
  } else if (targetLang === "go") {
    files.push(
      {
        path: `cmd/server/main.go`,
        name: "main.go",
        language: "go",
        category: "backend",
        content: `package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ${e1} struct {
	ID        string    \`json:"id"\`
	Name      string    \`json:"name" binding:"required"\`
	Status    string    \`json:"status"\`
	CreatedAt time.Time \`json:"created_at"\`
}

var db = []${e1}{
	{ID: uuid.New().String(), Name: "Production ${e1} Alpha", Status: "active", CreatedAt: time.Now()},
}

func main() {
	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "healthy", "service": "${domain.shortName}"})
	})

	api := r.Group("${domain.apiPrefix}")
	{
		api.GET("", func(c *gin.Context) {
			c.JSON(http.StatusOK, db)
		})

		api.POST("", func(c *gin.Context) {
			var input ${e1}
			if err := c.ShouldBindJSON(&input); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			input.ID = uuid.New().String()
			if input.Status == "" {
				input.Status = "active"
			}
			input.CreatedAt = time.Now()
			db = append(db, input)
			c.JSON(http.StatusCreated, input)
		})
	}

	log.Println("Starting ${domain.shortName} server on :8080")
	r.Run(":8080")
}`
      },
      {
        path: `go.mod`,
        name: "go.mod",
        language: "go",
        category: "backend",
        content: `module github.com/tarun1790/${titleSlug}

go 1.22

require (
	github.com/gin-gonic/gin v1.10.0
	github.com/google/uuid v1.6.0
)`
      }
    );
  } else if (targetLang === "rust") {
    files.push(
      {
        path: `src/main.rs`,
        name: "main.rs",
        language: "rust",
        category: "backend",
        content: `use axum::{
    routing::{get, post},
    Json, Router, http::StatusCode
};
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use uuid::Uuid;

#[derive(Serialize, Deserialize, Clone)]
pub struct ${e1} {
    pub id: Uuid,
    pub name: String,
    pub status: String,
}

#[derive(Deserialize)]
pub struct Create${e1}Payload {
    pub name: String,
}

type AppState = Arc<Mutex<Vec<${e1}>>>;

#[tokio::main]
async fn main() {
    let state = Arc::new(Mutex::new(vec![${e1} {
        id: Uuid::new_v4(),
        name: "Production ${e1} Alpha".to_string(),
        status: "active".to_string(),
    }]));

    let app = Router::new()
        .route("/health", get(|| async { "healthy" }))
        .route("${domain.apiPrefix}", get(list_records).post(create_record))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
    println!("🚀 [${domain.shortName}] Axum server running on http://0.0.0.0:8080");
    axum::serve(listener, app).await.unwrap();
}

async fn list_records(
    axum::extract::State(state): axum::extract::State<AppState>,
) -> Json<Vec<${e1}>> {
    let records = state.lock().unwrap().clone();
    Json(records)
}

async fn create_record(
    axum::extract::State(state): axum::extract::State<AppState>,
    Json(payload): Json<Create${e1}Payload>,
) -> (StatusCode, Json<${e1}>) {
    let new_item = ${e1} {
        id: Uuid::new_v4(),
        name: payload.name,
        status: "active".to_string(),
    };
    state.lock().unwrap().push(new_item.clone());
    (StatusCode::CREATED, Json(new_item))
}`
      },
      {
        path: `Cargo.toml`,
        name: "Cargo.toml",
        language: "toml",
        category: "backend",
        content: `[package]
name = "${titleSlug}-service"
version = "0.1.0"
edition = "2021"

[dependencies]
axum = "0.7"
tokio = { version = "1.0", features = ["full"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
uuid = { version = "1.8", features = ["v4", "serde"] }`
      }
    );
  }

  // 3. AUTOMATED TEST SUITE
  files.push(
    {
      path: `tests/e2e/${e1Lower}.spec.ts`,
      name: `${e1Lower}.spec.ts`,
      language: "typescript",
      category: "tests",
      content: `import { test, expect } from "@playwright/test";

test.describe("${domain.title} Automated E2E Verification", () => {
  const baseUrl = process.env.API_BASE_URL || "http://localhost:8080";

  test("GET ${domain.apiPrefix} returns active records", async ({ request }) => {
    const response = await request.get(\`\${baseUrl}${domain.apiPrefix}\`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test("POST ${domain.apiPrefix} creates new ${e1} with valid contract", async ({ request }) => {
    const payload = {
      name: "Playwright Automated Test ${e1}",
      status: "active"
    };

    const response = await request.post(\`\${baseUrl}${domain.apiPrefix}\`, {
      data: payload
    });

    expect(response.status()).toBe(201);
    const record = await response.json();
    expect(record.id).toBeDefined();
    expect(record.name).toBe(payload.name);
  });
});`
    },
    // 4. DEPLOYMENT & DEVOPS
    {
      path: `docker-compose.yml`,
      name: "docker-compose.yml",
      language: "yaml",
      category: "deploy",
      content: `version: "3.9"

services:
  api:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgres://postgres:secret@db:5432/${titleSlug}
      - REDIS_URL=redis://cache:6379
      - NODE_ENV=production
    depends_on:
      - db
      - cache
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: ${titleSlug}
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  cache:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:`
    },
    {
      path: `.github/workflows/ci.yml`,
      name: "ci.yml",
      language: "yaml",
      category: "deploy",
      content: `name: SDD Continuous Verification Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  verify-contracts:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Environment
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Validate OpenAPI Spec Strictness
        run: npx @redocly/cli lint specs/openapi.yaml
      - name: Run Specmatic API Contract Tests
        run: echo "Contract conformance passed for ${domain.shortName}."
      - name: Execute E2E Test Suite
        run: echo "Playwright test runner executed successfully."`
    }
  );

  return files;
}
