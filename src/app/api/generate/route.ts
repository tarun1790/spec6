import { NextRequest } from "next/server";
import { GenerationRequest, STAGES } from "@/lib/types";
import { streamStageContent } from "@/lib/llm-providers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: GenerationRequest;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const { prompt, techStack, llmConfig, targetStage, accumulatedContext = {} } = body;

  if (!prompt || !prompt.trim()) {
    return new Response(JSON.stringify({ error: "Prompt is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const encoder = new TextEncoder();
  const abortController = new AbortController();

  req.signal.addEventListener("abort", () => {
    abortController.abort();
  });

  const stream = new ReadableStream({
    async start(controller) {
      const startTime = Date.now();
      let totalTokens = 0;
      const currentContext: Record<string, string> = { ...accumulatedContext };

      const sendEvent = (eventData: unknown) => {
        const payload = `data: ${JSON.stringify(eventData)}\n\n`;
        controller.enqueue(encoder.encode(payload));
      };

      try {
        const stagesToRun = targetStage !== undefined && targetStage !== null
          ? [STAGES[targetStage]]
          : STAGES;

        for (const stageDef of stagesToRun) {
          if (abortController.signal.aborted) break;

          const stageStartTime = Date.now();
          sendEvent({
            event: "stage_start",
            stage_index: stageDef.index,
            file_name: stageDef.fileName,
            message: `Synthesizing ${stageDef.fileName}: ${stageDef.title}...`
          });

          let stageContent = "";
          let stageTokens = 0;

          try {
            const generator = streamStageContent(
              stageDef.index,
              prompt,
              techStack,
              llmConfig,
              currentContext,
              abortController.signal
            );

            for await (const chunk of generator) {
              if (abortController.signal.aborted) break;
              stageContent += chunk;
              stageTokens += Math.max(1, Math.ceil(chunk.length / 4));
              totalTokens += Math.max(1, Math.ceil(chunk.length / 4));

              sendEvent({
                event: "chunk",
                stage_index: stageDef.index,
                file_name: stageDef.fileName,
                content: chunk
              });
            }

            if (!abortController.signal.aborted) {
              currentContext[stageDef.fileName] = stageContent;

              sendEvent({
                event: "stage_complete",
                stage_index: stageDef.index,
                file_name: stageDef.fileName,
                tokens_generated: stageTokens,
                duration_ms: Date.now() - stageStartTime
              });
            }
          } catch (stageErr) {
            sendEvent({
              event: "error",
              stage_index: stageDef.index,
              file_name: stageDef.fileName,
              error_message: stageErr instanceof Error ? stageErr.message : String(stageErr)
            });
          }
        }

        if (!abortController.signal.aborted) {
          sendEvent({
            event: "pipeline_complete",
            total_tokens: totalTokens,
            duration_ms: Date.now() - startTime
          });
        }
      } catch (err) {
        sendEvent({
          event: "error",
          stage_index: 0,
          error_message: err instanceof Error ? err.message : String(err)
        });
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive"
    }
  });
}
