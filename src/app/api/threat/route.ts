import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// ── Config ────────────────────────────────────────────────────────────────────
// URL pulled from server-only env var so it can be rotated without a code change.
const FEED_URL =
  process.env.CHECKPOINT_FEED_URL ??
  "https://threatmap.checkpoint.com/ThreatMap/api/feed";

// Abort the upstream fetch after this many ms of silence (prevents hung edge fns).
// 90 s gives the Check Point feed plenty of time between bursts.
const UPSTREAM_TIMEOUT_MS = 90_000;

// ── Route handler ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // Abort the upstream fetch when either:
      //   a) the client disconnects, or
      //   b) the upstream is silent for UPSTREAM_TIMEOUT_MS
      const timeoutCtrl = new AbortController();
      let timer = setTimeout(() => timeoutCtrl.abort(), UPSTREAM_TIMEOUT_MS);

      const abortHandler = () => timeoutCtrl.abort();
      req.signal.addEventListener("abort", abortHandler);

      try {
        const response = await fetch(FEED_URL, {
          signal: timeoutCtrl.signal,
          // Prevent Next.js edge runtime from attempting to cache this stream
          cache: "no-store",
          headers: {
            Accept: "text/event-stream",
            "Accept-Encoding": "identity", // prevent compression that can break chunking
            Referer: "https://threatmap.checkpoint.com/",
            "User-Agent":
              "Mozilla/5.0 (compatible; portfolio-threatmap-proxy/1.0)",
          },
        });

        if (!response.ok || !response.body) {
          console.error(
            `[threat/route] upstream error: ${response.status} ${response.statusText}`
          );
          controller.close();
          return;
        }

        const reader = response.body.getReader();

        while (true) {
          if (req.signal.aborted) break;

          const { done, value } = await reader.read();
          if (done) break;

          // Reset silence timer on each received chunk
          clearTimeout(timer);
          timer = setTimeout(() => timeoutCtrl.abort(), UPSTREAM_TIMEOUT_MS);

          try {
            controller.enqueue(value);
          } catch {
            break; // client closed the connection mid-stream
          }
        }
      } catch (err: unknown) {
        // Treat AbortError AND upstream TCP/TLS termination as non-fatal
        const isAbort =
          err instanceof Error &&
          (err.name === "AbortError" ||
            (err as NodeJS.ErrnoException).message === "terminated");
        if (!isAbort) {
          console.error("[threat/route] stream error:", err);
        }
      } finally {
        clearTimeout(timer);
        req.signal.removeEventListener("abort", abortHandler);
        try { controller.close(); } catch { /* already closed */ }
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-store, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no", // disable nginx/proxy buffering
    },
  });
}

// Explicitly reject all other HTTP methods
export function POST() { return new NextResponse("Method Not Allowed", { status: 405 }); }
export function PUT()  { return new NextResponse("Method Not Allowed", { status: 405 }); }
export function DELETE() { return new NextResponse("Method Not Allowed", { status: 405 }); }
