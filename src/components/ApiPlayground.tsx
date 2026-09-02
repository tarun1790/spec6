"use client";

import React, { useState } from "react";
import { Play, Send, CheckCircle2, Clock, Server, Copy, Check, Sparkles } from "lucide-react";
import { extractDomainContext } from "@/lib/mock-generator";
import { TechStackPreferences } from "@/lib/types";

interface ApiPlaygroundProps {
  userPrompt: string;
  techStack: TechStackPreferences;
}

export const ApiPlayground: React.FC<ApiPlaygroundProps> = ({ userPrompt, techStack }) => {
  const domain = extractDomainContext(userPrompt || "Cloud Platform");
  const [selectedEndpointIndex, setSelectedEndpointIndex] = useState(0);
  const [requestBody, setRequestBody] = useState(domain.apiEndpoints[0]?.payload || "{}");
  const [isLoading, setIsLoading] = useState(false);
  const [responseOutput, setResponseOutput] = useState<string | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const activeEp = domain.apiEndpoints[selectedEndpointIndex] || domain.apiEndpoints[0];

  const handleSelectEndpoint = (index: number) => {
    setSelectedEndpointIndex(index);
    const ep = domain.apiEndpoints[index];
    if (ep) {
      setRequestBody(ep.payload !== "N/A (Query Parameters: limit, cursor, status)" ? ep.payload : "{}");
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

    const simulatedLatency = Math.floor(Math.random() * 45) + 18; // 18ms - 62ms

    setTimeout(() => {
      setIsLoading(false);
      setLatency(simulatedLatency);
      setResponseStatus(activeEp?.method === "POST" ? 201 : 200);
      setResponseOutput(activeEp?.response || JSON.stringify({ status: "success", data: {} }, null, 2));
    }, 400);
  };

  const handleCopyResponse = () => {
    if (responseOutput) {
      navigator.clipboard.writeText(responseOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden rounded-xl border border-slate-200">
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
            API
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {domain.title} • Interactive OpenAPI 3.1 Simulator
            </h3>
            <p className="text-[11px] text-slate-500">
              Live mock sandbox powered by {techStack.backend.split("/")[0].trim()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
            Base: https://api.{domain.shortName.toLowerCase()}.internal
          </span>
        </div>
      </div>

      {/* Main Sandbox Area */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        {/* Left: Endpoints List */}
        <div className="md:col-span-4 border-r border-slate-200 bg-white p-3 space-y-1.5 overflow-y-auto">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
            Synthesized Endpoints ({domain.apiEndpoints.length})
          </div>
          {domain.apiEndpoints.map((ep, idx) => {
            const isSelected = selectedEndpointIndex === idx;
            const isGet = ep.method === "GET";
            const isPost = ep.method === "POST";
            const isPut = ep.method === "PUT";

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectEndpoint(idx)}
                className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2 ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50/70 shadow-xs"
                    : "border-slate-100 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700"
                }`}
              >
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                    isGet
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : isPost
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : isPut
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : "bg-red-100 text-red-700 border border-red-200"
                  }`}
                >
                  {ep.method}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono font-semibold text-slate-800 truncate">
                    {ep.path}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">
                    {ep.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Request & Response Workbench */}
        <div className="md:col-span-8 flex flex-col bg-slate-50 overflow-hidden">
          {/* URL & Send Bar */}
          <div className="p-3 bg-white border-b border-slate-200 flex items-center gap-2">
            <span
              className={`text-xs font-mono font-bold px-2.5 py-1.5 rounded uppercase ${
                activeEp?.method === "GET"
                  ? "bg-blue-100 text-blue-800"
                  : activeEp?.method === "POST"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {activeEp?.method}
            </span>
            <div className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-mono text-xs text-slate-800 truncate">
              {activeEp?.path}
            </div>
            <button
              type="button"
              onClick={handleSendRequest}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
            >
              {isLoading ? (
                <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              <span>{isLoading ? "Executing..." : "Send Request"}</span>
            </button>
          </div>

          {/* Request / Response Split */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden p-3 gap-3">
            {/* Request Payload Editor */}
            <div className="flex flex-col rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
              <div className="px-3 py-2 border-b border-slate-100 bg-slate-50 flex items-center justify-between text-[11px] font-bold text-slate-600">
                <span>Request Body (application/json)</span>
                <span className="font-mono text-[10px] text-slate-400">Bearer &lt;JWT&gt;</span>
              </div>
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                className="flex-1 p-3 font-mono text-xs text-slate-800 bg-transparent focus:outline-none resize-none leading-relaxed"
                placeholder="Enter JSON request body..."
              />
            </div>

            {/* Response Output */}
            <div className="flex flex-col rounded-xl border border-slate-200 bg-slate-900 text-slate-100 overflow-hidden shadow-xs">
              <div className="px-3 py-2 border-b border-slate-800 bg-slate-950 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-300">HTTP Response</span>
                  {responseStatus && (
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {responseStatus} {responseStatus === 201 ? "Created" : "OK"}
                    </span>
                  )}
                  {latency && (
                    <span className="font-mono text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {latency}ms
                    </span>
                  )}
                </div>
                {responseOutput && (
                  <button
                    type="button"
                    onClick={handleCopyResponse}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                )}
              </div>

              <div className="flex-1 p-3 font-mono text-xs overflow-auto">
                {responseOutput ? (
                  <pre className="text-emerald-400 whitespace-pre-wrap">{responseOutput}</pre>
                ) : isLoading ? (
                  <div className="h-full flex items-center justify-center text-slate-500 gap-2">
                    <div className="h-4 w-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <span>Executing live mock handler...</span>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-600 text-center px-4">
                    Click &quot;Send Request&quot; above to simulate an actual API call against the {techStack.backend.split("/")[0].trim()} microservice.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
