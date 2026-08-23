"""
SpecFlow AI: Automated Benchmark Evaluation & Quality Assurance Harness
Validates generated specification suites against benchmark datasets.
Configured for GPU/CUDA acceleration where applicable.
"""

import os
import re
import json
import torch

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def evaluate_mermaid_blocks(content: str) -> dict:
    """Extracts and verifies Mermaid syntax blocks."""
    blocks = re.findall(r"```mermaid(.*?)```", content, re.DOTALL)
    valid_count = 0
    errors = []

    valid_headers = ["flowchart", "graph", "erdiagram", "sequencediagram", "gantt", "classdiagram"]

    for b in blocks:
        lines = b.strip().split("\n")
        if not lines:
            continue
        first_line = lines[0].strip().lower()
        if any(first_line.startswith(h) for h in valid_headers):
            valid_count += 1
        else:
            errors.append(f"Invalid header: {first_line}")

    total = len(blocks)
    score = (valid_count / total) if total > 0 else 1.0
    return {"total_diagrams": total, "valid_diagrams": valid_count, "score": score, "errors": errors}

def evaluate_security_coverage(content: str) -> dict:
    """Evaluates OWASP and cryptographic compliance coverage in 04_SECURITY_COMPLIANCE.md."""
    owasp_topics = ["Injection", "Broken Access", "Cryptographic", "Insecure Design", "Misconfiguration", "Vulnerable Components", "Logging", "SSRF"]
    found_topics = [t for t in owasp_topics if re.search(t, content, re.IGNORECASE)]
    score = len(found_topics) / len(owasp_topics)
    return {"found_topics": found_topics, "total_checked": len(owasp_topics), "score": score}

def evaluate_test_matrix_coverage(content: str) -> dict:
    """Evaluates testing coverage commitments in 03_TESTING_STRATEGY.md."""
    has_target = bool(re.search(r"8\d%|9\d%|>80%", content))
    has_playwright = "playwright" in content.lower() or "cypress" in content.lower()
    has_edge_cases = "edge" in content.lower() or "concurrency" in content.lower()
    
    checks_passed = sum([has_target, has_playwright, has_edge_cases])
    return {"score": checks_passed / 3.0, "has_target_coverage": has_target, "has_e2e_code": has_playwright, "has_edge_cases": has_edge_cases}

def main():
    print("==================================================")
    print("SpecFlow AI Benchmark Evaluation Suite (Spec-Eval)")
    print(f"Device: {device}")
    print("==================================================")

    specs_dir = os.path.join(os.path.dirname(__file__), "..")
    
    spec_files = [
        "00_PROJECT_BRIEF.md",
        "01_SYSTEM_ARCHITECTURE.md",
        "02_IMPLEMENTATION_PLAN.md",
        "03_TESTING_STRATEGY.md",
        "04_SECURITY_COMPLIANCE.md",
        "05_DEPLOYMENT_DEVOPS.md"
    ]

    results = {}

    for fname in spec_files:
        fpath = os.path.join(specs_dir, fname)
        if not os.path.exists(fpath):
            print(f"[MISSING] {fname}")
            continue

        with open(fpath, "r", encoding="utf-8") as f:
            content = f.read()

        print(f"\n--- Evaluating {fname} ({len(content.splitlines())} lines) ---")
        
        if fname == "01_SYSTEM_ARCHITECTURE.md":
            m_res = evaluate_mermaid_blocks(content)
            print(f"  Mermaid Syntax Score: {m_res['score'] * 100:.1f}% ({m_res['valid_diagrams']}/{m_res['total_diagrams']} valid)")
            results["mermaid_score"] = m_res["score"]

        elif fname == "03_TESTING_STRATEGY.md":
            t_res = evaluate_test_matrix_coverage(content)
            print(f"  QA & Testing Score: {t_res['score'] * 100:.1f}% (E2E Playwright: {t_res['has_e2e_code']}, Target >80%: {t_res['has_target_coverage']})")
            results["qa_score"] = t_res["score"]

        elif fname == "04_SECURITY_COMPLIANCE.md":
            s_res = evaluate_security_coverage(content)
            print(f"  Security Compliance Score: {s_res['score'] * 100:.1f}% ({len(s_res['found_topics'])}/{s_res['total_checked']} OWASP categories covered)")
            results["security_score"] = s_res["score"]

    avg_score = sum(results.values()) / max(1, len(results))
    print(f"\n==================================================")
    print(f"Overall Spec-Eval Quality Benchmark Score: {avg_score * 100:.1f}%")
    print(f"Benchmark Status: {'PASSED (GOLD)' if avg_score >= 0.85 else 'REVIEW NEEDED'}")
    print(f"==================================================")

if __name__ == "__main__":
    main()
