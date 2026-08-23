# SpecFlow AI: Automated Spec-Driven Development Dashboard & Artifact Generator

[![GitHub Pages Deployment](https://img.shields.io/badge/Live%20Demo-tarun1790.github.io%2Fspec6-emerald?style=for-the-badge&logo=github)](https://tarun1790.github.io/spec6/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Next.js 14](https://img.shields.io/badge/Framework-Next.js%2014-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Spec-Eval Benchmark](https://img.shields.io/badge/Spec--Eval-100%25%20GOLD-emerald?style=for-the-badge)](./07_EVALUATION_BENCHMARK_MATRIX.md)

> **SpecFlow AI** transforms high-level natural language application descriptions and GitHub repositories into an end-to-end, production-ready software specification suite structured into 8 sequential, industry-standard Markdown files with real-time SSE streaming, live Mermaid.js diagram compilation, Monaco editor, datasets, and multi-format export.

🌐 **Live Web Application (GitHub Pages):** [**https://tarun1790.github.io/spec6/**](https://tarun1790.github.io/spec6/)  
📂 **Source Code Repository:** [**https://github.com/tarun1790/spec6**](https://github.com/tarun1790/spec6)

---

## 📑 Complete SDLC & Pipeline Specification Suite

| Stage | Document | Purpose & Scope | Key Artifacts Included |
| :---: | :--- | :--- | :--- |
| **00** | [**`00_PROJECT_BRIEF.md`**](./00_PROJECT_BRIEF.md) | Product Scope & Requirements | 4 Personas, P0/P1/P2 Matrix, Non-Functional SLAs (99.99%, sub-50ms p95), In/Out Scope Boundaries |
| **01** | [**`01_SYSTEM_ARCHITECTURE.md`**](./01_SYSTEM_ARCHITECTURE.md) | System Design & Contracts | Tech Stack Rationale, Mermaid Topology, Mermaid ERD Schemas, REST/SSE API Contracts, Event Sequence Flow |
| **02** | [**`02_IMPLEMENTATION_PLAN.md`**](./02_IMPLEMENTATION_PLAN.md) | Engineering Breakdown | Repository Tree, 4-Phase Gantt Milestones, 20+ Dependency-Chained Tasks (`- [ ]`), Local CLI Setup |
| **03** | [**`03_TESTING_STRATEGY.md`**](./03_TESTING_STRATEGY.md) | Quality Assurance & Testing | Unit Matrix (>80% Target), API Mock Test Suites, Playwright E2E Master Test Script, Edge-Case Inventory |
| **04** | [**`04_SECURITY_COMPLIANCE.md`**](./04_SECURITY_COMPLIANCE.md) | Security & Hardening | Identity & RBAC Matrix, OWASP Top 10 Mitigation Blueprint, TLS 1.3 / AES-256 Crypto, Env Var Dictionary |
| **05** | [**`05_DEPLOYMENT_DEVOPS.md`**](./05_DEPLOYMENT_DEVOPS.md) | Infrastructure & Operations | Multi-stage Dockerfile, docker-compose.yml, GitHub Actions CI/CD (`deploy.yml`), Terraform IaC, `/api/health` |
| **06** | [**`06_DATASET_TRAINING_PIPELINE.md`**](./06_DATASET_TRAINING_PIPELINE.md) | Dataset & Fine-Tuning Spec | Corpus Taxonomy (50,000 pairs), QLoRA Hyperparameters, PyTorch CUDA Training Recipe |
| **07** | [**`07_EVALUATION_BENCHMARK_MATRIX.md`**](./07_EVALUATION_BENCHMARK_MATRIX.md) | Spec-Eval Benchmark Matrix | 100.0% Gold Quality Score, Automated CI/CD Regression Gates, Metric Harmonic Mean Formula |

---

## 📊 Datasets & Training Scripts Included

- **`datasets/train_sdlc_specs.jsonl`**: High-fidelity instruction tuning dataset for end-to-end SDLC generation.
- **`datasets/test_sdlc_specs.jsonl`**: Ground-truth test dataset for evaluating out-of-distribution prompts.
- **`datasets/eval_benchmarks.jsonl`**: Spec-Eval quality benchmark test suite.
- **`datasets/synthetic_sdlc_corpus.jsonl`**: Synthetic domain specification corpus.
- **`scripts/train_qlora.py`**: GPU/CUDA accelerated QLoRA fine-tuning script with Unsloth & PyTorch.
- **`scripts/evaluate_specs.py`**: Automated QA benchmark harness verifying diagram syntax, schemas, and OWASP defenses.
- **`scripts/generate_synthetic_dataset.py`**: Scalable multi-agent synthetic data synthesizer.

---

## 🚀 Running Local Evaluation & Development

```bash
# 1. Clone the repository
git clone https://github.com/tarun1790/spec6.git
cd spec6

# 2. Run automated Spec-Eval Benchmark (GPU / CUDA accelerated)
python scripts/evaluate_specs.py

# 3. Start Next.js Development Dashboard
npm install
npm run dev
# Open http://localhost:3000 in your browser
```
