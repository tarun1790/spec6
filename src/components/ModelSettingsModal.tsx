"use client";

import React, { useState } from "react";
import { X, Sparkles, Key, Cpu, Thermometer, Check, Eye, EyeOff } from "lucide-react";
import { LLMConfig, LLMProvider } from "@/lib/types";

interface ModelSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: LLMConfig;
  onSave: (newConfig: LLMConfig) => void;
}

export const ModelSettingsModal: React.FC<ModelSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave
}) => {
  const [provider, setProvider] = useState<LLMProvider>(config.provider);
  const [apiKey, setApiKey] = useState(config.apiKey || "");
  const [model, setModel] = useState(config.model);
  const [temperature, setTemperature] = useState(config.temperature ?? 0.3);
  const [customBaseUrl, setCustomBaseUrl] = useState(config.customBaseUrl || "");
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  const handleProviderChange = (p: LLMProvider) => {
    setProvider(p);
    switch (p) {
      case "openai":
        setModel("gpt-4o");
        break;
      case "anthropic":
        setModel("claude-3-5-sonnet-20241022");
        break;
      case "gemini":
        setModel("gemini-2.0-flash");
        break;
      case "groq":
        setModel("llama-3.3-70b-versatile");
        break;
      case "ollama":
        setModel("llama3.2");
        setCustomBaseUrl("http://localhost:11434");
        break;
      default:
        setModel("synthesizer-v1");
        break;
    }
  };

  const handleSave = () => {
    const updated: LLMConfig = {
      provider,
      apiKey: apiKey.trim() || undefined,
      model,
      temperature,
      customBaseUrl: customBaseUrl.trim() || undefined
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">LLM Provider & Engine Configuration</h2>
              <p className="text-xs text-slate-500">Configure AI orchestration models, API keys, and creativity</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Select Provider
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: "mock", label: "Synthesizer Mode", badge: "Instant (Zero-Key)" },
                { id: "openai", label: "OpenAI", badge: "GPT-4o" },
                { id: "anthropic", label: "Anthropic", badge: "Claude 3.5" },
                { id: "gemini", label: "Google Gemini", badge: "2.0 Flash" },
                { id: "groq", label: "Groq Cloud", badge: "Llama 3.3" },
                { id: "ollama", label: "Local Ollama", badge: "Self-Hosted" }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleProviderChange(item.id as LLMProvider)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    provider === item.id
                      ? "border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold shadow-sm ring-1 ring-emerald-500"
                      : "border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  <div className="text-xs font-bold">{item.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{item.badge}</div>
                </button>
              ))}
            </div>
          </div>

          {/* API Key Input (if not mock or ollama) */}
          {provider !== "mock" && provider !== "ollama" && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{provider.toUpperCase()} API Key</span>
                </label>
                <span className="text-[10px] text-slate-400">Stored locally in browser</span>
              </div>
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={`Enter your ${provider.toUpperCase()} API key...`}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 font-mono pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          )}

          {/* Model Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-emerald-600" />
              <span>Model Identifier</span>
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 font-mono"
            />
          </div>

          {/* Custom Base URL */}
          {(provider === "ollama" || provider === "openai") && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Base URL / Custom Endpoint
              </label>
              <input
                type="text"
                value={customBaseUrl}
                onChange={(e) => setCustomBaseUrl(e.target.value)}
                placeholder={provider === "ollama" ? "http://localhost:11434" : "https://api.openai.com/v1/chat/completions"}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 font-mono"
              />
            </div>
          )}

          {/* Temperature Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Thermometer className="h-3.5 w-3.5 text-emerald-600" />
                <span>Creativity / Temperature: {temperature}</span>
              </label>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {temperature <= 0.3 ? "Strict Architecture (Recommended)" : "High Variety"}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
};
