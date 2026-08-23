"""
SpecFlow AI: Synthetic Dataset Generation Pipeline
Generates paired [PRD -> 6-Stage SDLC Specification] synthetic training records.
Configured for GPU/CUDA acceleration.
"""

import os
import json
import torch

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

DOMAINS = [
    ("E-Commerce", "High-throughput store with distributed Redis locks and Kafka event bus."),
    ("Healthcare", "HIPAA-compliant telemedicine portal with WebRTC and FHIR EHR records."),
    ("Fintech", "Double-entry multi-currency ledger with real-time fraud scoring."),
    ("AI Agents", "Autonomous multi-agent DAG workflow engine with vector memory."),
    ("IoT Mesh", "Industrial IoT sensor mesh with MQTT and TimescaleDB."),
    ("Cybersecurity", "Enterprise SIEM log correlation and SOAR automated playbook."),
    ("Video CDN", "Adaptive bitrate live streaming with HLS/DASH and distributed DRM.")
]

def synthesize_training_sample(domain_name: str, description: str, sample_id: int) -> dict:
    return {
        "id": f"sdlc-synth-{sample_id:04d}",
        "domain": domain_name,
        "prompt": f"Architect a production-grade {domain_name} platform: {description}",
        "target_stages": {
            "00_PROJECT_BRIEF.md": f"# 00_PROJECT_BRIEF.md\n\n## 1. Executive Summary\nProduction {domain_name} system for {description}\n\n## 2. Requirements Matrix\n| ID | Feature | Priority | Acceptance Criteria |\n| :--- | :--- | :---: | :--- |\n| FR-01 | Core Engine | P0 | Verified functionality |",
            "01_SYSTEM_ARCHITECTURE.md": f"# 01_SYSTEM_ARCHITECTURE.md\n\n```mermaid\nflowchart TD\nClient --> Gateway\nGateway --> {domain_name.replace(' ', '')}Service\n```",
            "02_IMPLEMENTATION_PLAN.md": f"# 02_IMPLEMENTATION_PLAN.md\n\n- [ ] **TASK-101**: Scaffold {domain_name} core domain logic.",
            "03_TESTING_STRATEGY.md": f"# 03_TESTING_STRATEGY.md\n\n- Target Coverage >80% with Playwright E2E verification.",
            "04_SECURITY_COMPLIANCE.md": f"# 04_SECURITY_COMPLIANCE.md\n\n- RBAC matrix, TLS 1.3 encryption, and OWASP Top 10 defenses.",
            "05_DEPLOYMENT_DEVOPS.md": f"# 05_DEPLOYMENT_DEVOPS.md\n\n- Multi-stage Dockerfile and GitHub Actions deploy.yml."
        }
    }

def main():
    print("==================================================")
    print("SpecFlow AI Synthetic Dataset Synthesizer")
    print(f"Device: {device}")
    print("==================================================")

    output_dir = os.path.join(os.path.dirname(__file__), "..", "datasets")
    os.makedirs(output_dir, exist_ok=True)
    out_file = os.path.join(output_dir, "synthetic_sdlc_corpus.jsonl")

    samples = []
    sample_count = 0

    for i in range(10):
        for domain, desc in DOMAINS:
            sample_count += 1
            samples.append(synthesize_training_sample(domain, desc, sample_count))

    with open(out_file, "w", encoding="utf-8") as f:
        for s in samples:
            f.write(json.dumps(s) + "\n")

    print(f"Successfully generated {len(samples)} synthetic training samples in {out_file}")

if __name__ == "__main__":
    main()
