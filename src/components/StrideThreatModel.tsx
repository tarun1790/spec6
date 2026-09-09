"use client";

import React, { useState } from "react";
import { ShieldCheck, AlertOctagon, Lock, Eye, Ban, UserCheck, Play, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";
import { DomainContext } from "@/lib/mock-generator";

interface StrideThreatModelProps {
  domain: DomainContext;
}

interface StrideItem {
  category: "Spoofing" | "Tampering" | "Repudiation" | "Information Disclosure" | "Denial of Service" | "Elevation of Privilege";
  code: "S" | "T" | "R" | "I" | "D" | "E";
  threatTitle: string;
  attackVector: string;
  cvssScore: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  mitigationControl: string;
  verificationStatus: "verified" | "simulating" | "passed";
}

export const StrideThreatModel: React.FC<StrideThreatModelProps> = ({ domain }) => {
  const e1 = domain.primaryEntities[0] || "PrimaryRecord";
  const [isRunningScan, setIsRunningScan] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);

  const initialThreats: StrideItem[] = [
    {
      category: "Spoofing",
      code: "S",
      threatTitle: "Client JWT Identity Impersonation",
      attackVector: `Attacker crafts forged Bearer tokens to impersonate ${domain.personas[0]?.role || "operator"} and access ${e1} endpoints.`,
      cvssScore: 8.8,
      severity: "HIGH",
      mitigationControl: "Strict RS256 asymmetric cryptographic signature verification via OAuth 2.0 / OIDC JWKS key-set.",
      verificationStatus: "verified"
    },
    {
      category: "Tampering",
      code: "T",
      threatTitle: `In-Flight Mutation Manipulation of ${e1}`,
      attackVector: `Man-in-the-middle or malicious proxy intercepts ${domain.apiPrefix} payload and mutates pricing/state attributes.`,
      cvssScore: 8.1,
      severity: "HIGH",
      mitigationControl: "Mandatory TLS 1.3 in-transit encryption with HSTS preload and HMAC-SHA256 request payload verification.",
      verificationStatus: "verified"
    },
    {
      category: "Repudiation",
      code: "R",
      threatTitle: "Denial of Sensitive State Mutation",
      attackVector: `Actor mutates or deletes critical ${e1} record and denies having initiated the transaction.`,
      cvssScore: 6.5,
      severity: "MEDIUM",
      mitigationControl: "Append-only immutable audit trail capturing client IP, Actor ID, SHA-256 payload digest, and monotonic timestamp.",
      verificationStatus: "verified"
    },
    {
      category: "Information Disclosure",
      code: "I",
      threatTitle: "Insecure Direct Object Reference (IDOR)",
      attackVector: `Attacker enumerates UUIDs in ${domain.apiPrefix}/{id} to read sensitive tenant records outside their authorized partition.`,
      cvssScore: 9.1,
      severity: "CRITICAL",
      mitigationControl: `Enforces strict tenant boundary predicates on every database query: WHERE tenant_id = token.tenant_id AND ${e1.toLowerCase()}_id = :id.`,
      verificationStatus: "verified"
    },
    {
      category: "Denial of Service",
      code: "D",
      threatTitle: "Distributed Resource Exhaustion Surge",
      attackVector: `Botnet floods ${domain.apiPrefix} with 50,000 req/s to exhaust database connection pools and memory buffers.`,
      cvssScore: 7.5,
      severity: "HIGH",
      mitigationControl: "Edge token bucket rate limiting (1,000 req/min/IP), WAF IP reputation filtering, and circuit-breaker shed.",
      verificationStatus: "verified"
    },
    {
      category: "Elevation of Privilege",
      code: "E",
      threatTitle: "Role Boundary Escalation to Admin",
      attackVector: "Standard consumer manipulates payload attributes to grant themselves administrative permissions.",
      cvssScore: 8.9,
      severity: "HIGH",
      mitigationControl: "Strictly typed Zod/Pydantic schema validation stripping non-whitelisted attributes, enforced RBAC claims check.",
      verificationStatus: "verified"
    }
  ];

  const [threats, setThreats] = useState<StrideItem[]>(initialThreats);

  const handleSimulatePenTest = () => {
    setIsRunningScan(true);
    setScanCompleted(false);

    setTimeout(() => {
      setIsRunningScan(false);
      setScanCompleted(true);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Threat Model Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase tracking-wider">
              STRIDE Threat Modeling (OWASP / Microsoft)
            </span>
            <span className="text-xs text-slate-400">Zero-Trust Architecture</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-rose-400" />
            <span>{domain.title} Threat Surface & Attack Vectors</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Systematic threat enumeration across Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege.
          </p>
        </div>

        {/* Security Quick Stats & Pen Test Trigger */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-center min-w-[75px]">
            <div className="text-base font-bold text-emerald-400">A+</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Security Score</div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-center min-w-[75px]">
            <div className="text-base font-bold text-blue-400">0</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Open CVEs</div>
          </div>

          <button
            type="button"
            onClick={handleSimulatePenTest}
            disabled={isRunningScan}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs"
          >
            {isRunningScan ? (
              <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5 fill-white" />
            )}
            <span>{isRunningScan ? "Scanning Attack Vectors..." : "Run Pen Test Simulator"}</span>
          </button>
        </div>
      </div>

      {scanCompleted && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span>
              <strong>Penetration Test Complete:</strong> 6/6 attack vectors successfully mitigated. Zero unauthenticated access or privilege escalation detected.
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">100% Defense Verification</span>
        </div>
      )}

      {/* STRIDE Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {threats.map((t, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3 hover:border-slate-300 transition-all"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs font-mono shadow-xs">
                  {t.code}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{t.threatTitle}</h4>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">{t.category} Threat</div>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                  t.severity === "CRITICAL"
                    ? "bg-red-100 text-red-800"
                    : t.severity === "HIGH"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                CVSS {t.cvssScore} • {t.severity}
              </span>
            </div>

            <div className="text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-800">Attack Vector:</strong> {t.attackVector}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 space-y-1">
              <div className="text-[10px] font-bold uppercase text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Enforced Mitigation Control</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">{t.mitigationControl}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
