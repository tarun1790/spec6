import { NextResponse } from "next/server";

export async function GET() {
  const memoryUsage = process.memoryUsage();
  return NextResponse.json({
    status: "healthy",
    version: "1.0.0",
    service: "specflow-ai-dashboard",
    timestamp: new Date().toISOString(),
    uptime_seconds: Math.floor(process.uptime()),
    memory_usage: {
      heap_used_mb: Math.round((memoryUsage.heapUsed / 1024 / 1024) * 10) / 10,
      heap_total_mb: Math.round((memoryUsage.heapTotal / 1024 / 1024) * 10) / 10,
      rss_mb: Math.round((memoryUsage.rss / 1024 / 1024) * 10) / 10
    }
  });
}
