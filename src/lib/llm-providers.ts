import { LLMConfig, TechStackPreferences } from "./types";
import { buildStagePrompt, getSystemPrompt } from "./prompts";
import { generateMockStageContent } from "./mock-generator";

export async function* streamStageContent(
  stageIndex: number,
  userPrompt: string,
  techStack: TechStackPreferences,
  llmConfig: LLMConfig,
  accumulatedContext: Record<string, string>,
  abortSignal?: AbortSignal
): AsyncGenerator<string, void, unknown> {
  const provider = llmConfig.provider || "mock";
  const apiKey = llmConfig.apiKey || process.env[`${provider.toUpperCase()}_API_KEY`];

  // If mock mode is explicitly chosen or no API key is provided for cloud LLMs, use high-fidelity synthesis
  if (provider === "mock" || (!apiKey && provider !== "ollama")) {
    yield* streamMockContent(stageIndex, userPrompt, techStack, accumulatedContext, abortSignal);
    return;
  }

  const systemPrompt = getSystemPrompt();
  const userMessage = buildStagePrompt(stageIndex, userPrompt, techStack, accumulatedContext);

  try {
    if (provider === "openai" || provider === "groq") {
      const baseUrl = provider === "groq"
        ? "https://api.groq.com/openai/v1/chat/completions"
        : (llmConfig.customBaseUrl || "https://api.openai.com/v1/chat/completions");

      const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: llmConfig.model || (provider === "groq" ? "llama-3.3-70b-versatile" : "gpt-4o"),
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ],
          temperature: llmConfig.temperature ?? 0.3,
          stream: true
        }),
        signal: abortSignal
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${provider.toUpperCase()} API error (${response.status}): ${errorText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No readable stream response from provider");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        if (abortSignal?.aborted) return;
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;
          const dataStr = trimmed.slice(6);
          if (dataStr === "[DONE]") return;

          try {
            const parsed = JSON.parse(dataStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) yield delta;
          } catch {
            // Ignore parse errors on partial chunks
          }
        }
      }
    } else if (provider === "anthropic") {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey || "",
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: llmConfig.model || "claude-3-5-sonnet-20241022",
          system: systemPrompt,
          messages: [{ role: "user", content: userMessage }],
          max_tokens: 4096,
          temperature: llmConfig.temperature ?? 0.3,
          stream: true
        }),
        signal: abortSignal
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Anthropic API error (${response.status}): ${errorText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No readable stream from Anthropic");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        if (abortSignal?.aborted) return;
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;
          const dataStr = trimmed.slice(6);

          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.type === "content_block_delta" && parsed.delta?.text) {
              yield parsed.delta.text;
            }
          } catch {
            // Ignore parse errors
          }
        }
      }
    } else if (provider === "gemini") {
      const model = llmConfig.model || "gemini-2.0-flash";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemPrompt}\n\n${userMessage}` }]
            }
          ],
          generationConfig: {
            temperature: llmConfig.temperature ?? 0.3,
            maxOutputTokens: 8192
          }
        }),
        signal: abortSignal
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Gemini API error (${response.status}): ${err}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No readable stream from Gemini");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        if (abortSignal?.aborted) return;
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;
          try {
            const parsed = JSON.parse(trimmed.slice(6));
            const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) yield text;
          } catch {
            // Ignore
          }
        }
      }
    } else if (provider === "ollama") {
      const baseUrl = llmConfig.customBaseUrl || "http://localhost:11434";
      const response = await fetch(`${baseUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: llmConfig.model || "llama3.2",
          prompt: `${systemPrompt}\n\n${userMessage}`,
          stream: true
        }),
        signal: abortSignal
      });

      if (!response.ok) {
        throw new Error(`Ollama connection error (${response.status}) at ${baseUrl}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No readable stream from Ollama");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        if (abortSignal?.aborted) return;
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const parsed = JSON.parse(line);
            if (parsed.response) yield parsed.response;
          } catch {
            // Ignore
          }
        }
      }
    }
  } catch (error) {
    // If external call fails due to invalid key or network, fallback gracefully or report error
    if (abortSignal?.aborted) return;
    console.warn(`Provider error (${provider}):`, error);
    yield `\n\n> [!WARNING]\n> External LLM provider (${provider}) encountered an issue: ${error instanceof Error ? error.message : String(error)}.\n> Continuing with High-Fidelity Synthesizer Engine...\n\n`;
    yield* streamMockContent(stageIndex, userPrompt, techStack, accumulatedContext, abortSignal);
  }
}

async function* streamMockContent(
  stageIndex: number,
  userPrompt: string,
  techStack: TechStackPreferences,
  accumulatedContext: Record<string, string>,
  abortSignal?: AbortSignal
): AsyncGenerator<string, void, unknown> {
  const fullContent = generateMockStageContent(stageIndex, userPrompt, techStack, accumulatedContext);
  
  // Stream in realistic token-sized chunks (5-30 characters) with ultra-smooth pacing
  let offset = 0;
  const totalLength = fullContent.length;

  while (offset < totalLength) {
    if (abortSignal?.aborted) return;
    
    // Vary chunk sizes dynamically for realistic streaming feel
    const chunkSize = Math.floor(Math.random() * 25) + 15;
    const chunk = fullContent.slice(offset, offset + chunkSize);
    offset += chunkSize;

    yield chunk;

    // Small micro-delay to simulate high-speed streaming
    await new Promise((resolve) => setTimeout(resolve, 12));
  }
}
