"use client";

import React, { useState } from "react";
import { Play, Send, CheckCircle2, Clock, Server, Copy, Check, Sparkles, Terminal, Database } from "lucide-react";
import { extractDomainContext } from "@/lib/mock-generator";
import { TechStackPreferences } from "@/lib/types";

interface ApiPlaygroundProps {
  userPrompt: string;
  techStack: TechStackPreferences;
}

export const ApiPlayground: React.FC<ApiPlaygroundProps> = ({ userPrompt, techStack }) => {
  const domain = extractDomainContext(userPrompt || "Cloud Platform");
  const e1 = domain.primaryEntities[0] || "Record";

  const [selectedEndpointIndex, setSelectedEndpointIndex] = useState(0);
  const [requestBody, setRequestBody] = useState(domain.apiEndpoints[0]?.payload || "{}");
  const [isLoading, setIsLoading] = useState(false);
  const [responseOutput, setResponseOutput] = useState<string | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [curlCopied, setCurlCopied] = useState(false);
  const [selectedSpeed, setSelectedSpeed] = useState<number>(35); // simulated ms

  // Live in-memory stateful database
  const [mockStore, setMockStore] = useState<any[]>([
    {
      id: "9f3a1b2c-8d7e-4f6a-5b4c-3d2e1a0f9e8d",
      name: `Production ${e1} Primary Alpha`,
      status: "active",
      created_at: "2026-09-08T10:00:00Z"
    },
    {
      id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      name: `Production ${e1} Staging Beta`,
      status: "pending",
      created_at: "2026-09-08T10:15:00Z"
    }
  ]);

  const activeEp = domain.apiEndpoints[selectedEndpointIndex] || domain.apiEndpoints[0];

  const handleSelectEndpoint = (index: number) => {
    setSelectedEndpointIndex(index);
    const ep = domain.apiEndpoints[index];
    if (ep) {
      setRequestBody(ep.payload !== "N/A (Query Parameters: limit=20, cursor=...)" ? ep.payload : "{}");
      setResponseOutput(null);
      setResponseStatus(null);
      setLatency(null);
    }
  };

  const handleSendRequest = () => {
    setIsLoading(true);
    setResponseOutput(null);
    setResponseStatus(null);
    setLatency(null);

    const actualLatency = Math.round(selectedSpeed * (0.8 + Math.random() * 0.4));

    setTimeout(() => {
      setIsLoading(false);
      setLatency(actualLatency);

      if (activeEp?.method === "POST") {
        try {
          const parsed = JSON.parse(requestBody);
          const newId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `uuid-${Date.now().toString(36)}`;
          const newRecord = {
            id: newId,
            ...parsed,
            created_at: new Date().toISOString()
          };
          setMockStore((prev) => [newRecord, ...prev]);
          setResponseStatus(201);
          setResponseOutput(
            JSON.stringify(
              {
                status: "created",
                message: "Record successfully persisted to live in-memory database",
                record: newRecord
              },
              null,
              2
            )
          );
        } catch {
          setResponseStatus(422);
          setResponseOutput(
            JSON.stringify(
              {
                error: "Unprocessable Entity",
                details: "Malformed JSON payload. Expected valid JSON object."
              },
              null,
              2
            )
          );
        }
      } else {
        // GET Request
        setResponseStatus(200);
        setResponseOutput(
          JSON.stringify(
            {
              status: "success",
              total: mockStore.length,
              data: mockStore,
              pagination: {
                limit: 20,
                cursor: null,
                has_more: false
              }
            },
            null,
            2
          )
        );
      }
    }, Math.max(150, actualLatency));
  };

  const handleCopyResponse = () => {
    if (responseOutput) {
      navigator.clipboard.writeText(responseOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getCurlCommand = () => {
    const url = `http://localhost:8080${activeEp?.path || domain.apiPrefix}`;
    if (activeEp?.method === "POST") {
      const cleanBody = requestBody.split("\n").join(" ");
      return `curl -X POST "${url}" -H "Content-Type: application/json" -H "Authorization: Bearer jwt_rs256_token" -d '${cleanBody}'`;
    }
    return `curl -X GET "${url}" -H "Authorization: Bearer jwt_rs256_token"`;
  };

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(getCurlCommand());
    setCurlCopied(true);
    setTimeout(() => setCurlCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden rounded-xl border border-slate-200 shadow-sm">
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
            API
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span>{domain.title} • Live Mock Server Sandbox</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Stateful Memory: {mockStore.length} items
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Contract-conforming mock server powered by {techStack.backend.split("/")[0].trim()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Latency Presets */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <span className="text-[10px] text-slate-500 font-bold px-1.5 uppercase">Latency:</span>
            {[
              { label: "15ms", ms: 15 },
              { label: "50ms", ms: 50 },
              { label: "250ms", ms: 250 }
            ].map((spd) => (
              <button
                key={spd.ms}
                type="button"
                onClick={() => setSelectedSpeed(spd.ms)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all ${
                  selectedSpeed === spd.ms
                    ? "bg-white text-emerald-800 font-bold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {spd.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCopyCurl}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-xs"
            title="Copy cURL command"
          >
            {curlCopied ? <Check className="h-3 w-3 text-emerald-600" /> : <Terminal className="h-3 w-3" />}
            <span>{curlCopied ? "Copied" : "cURL"}</span>
          </button>
        </div>
      </div>

      {/* Main Sandbox Area */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        {/* Left: Endpoints List */}
        <div className="md:col-span-4 border-r border-slate-200 bg-white p-3 space-y-1.5 overflow-y-auto">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
            Available Endpoints ({domain.apiEndpoints.length})
          </div>
          {domain.apiEndpoints.map((ep, idx) => {
            const isSelected = selectedEndpointIndex === idx;
            const isPost = ep.method === "POST";

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectEndpoint(idx)}
                className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                  isSelected
                    ? "bg-emerald-50/60 border-emerald-500 shadow-xs"
                    : "bg-slate-50 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                      isPost ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-800 truncate">
                    {ep.path}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-1">{ep.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Right: Request & Response Console */}
        <div className="md:col-span-8 flex flex-col overflow-hidden bg-slate-50/50 p-4 space-y-3">
          {/* Active Route Bar */}
          <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
            <span
              className={`px-2 py-1 rounded-md text-xs font-bold font-mono ${
                activeEp?.method === "POST" ? "bg-blue-600 text-white" : "bg-emerald-600 text-white"
              }`}
            >
              {activeEp?.method}
            </span>
            <input
              type="text"
              readOnly
              value={activeEp?.path || ""}
              className="flex-1 bg-transparent font-mono text-xs text-slate-800 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSendRequest}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs"
            >
              {isLoading ? (
                <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5 fill-white" />
              )}
              <span>{isLoading ? "Executing..." : "Send"}</span>
            </button>
          </div>

          {/* Request Payload Editor (if POST/PUT) */}
          {activeEp?.method === "POST" && (
            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 uppercase">
                <span>Request Payload (JSON)</span>
                <span className="text-[10px] text-emerald-600 font-semibold font-mono">
                  State Mutation Enabled
                </span>
              </div>
              <textarea
                rows={4}
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                className="w-full font-mono text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          {/* Response Inspector */}
          <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 p-3 shadow-xs overflow-hidden">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-700 uppercase text-[11px]">Response</span>
                {responseStatus && (
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                      responseStatus < 300
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    HTTP {responseStatus}
                  </span>
                )}
                {latency !== null && (
                  <span className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span>{latency}ms</span>
                  </span>
                )}
              </div>

              {responseOutput && (
                <button
                  type="button"
                  onClick={handleCopyResponse}
                  className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors text-[11px] font-medium"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              )}
            </div>

            <div className="flex-1 overflow-auto bg-slate-950 text-emerald-400 p-3 rounded-lg font-mono text-xs leading-relaxed whitespace-pre-wrap">
              {responseOutput || (
                <span className="text-slate-500 italic">
                  Select an endpoint and click Send to test live responses with in-memory persistence.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
