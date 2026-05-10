/**
 * Server-Sent Events (SSE) API Route for Real-Time Loading Status
 *
 * This endpoint streams loading progress updates to clients using Server-Sent Events.
 * Clients can connect to this endpoint to receive real-time loading status updates.
 *
 * USAGE:
 * ------
 * const eventSource = new EventSource('/api/sse-loading');
 * eventSource.onmessage = (event) => {
 *   const data = JSON.parse(event.data);
 *   console.log(data.progress, data.status);
 * };
 */

function getStatus(progress: number): string {
  if (progress === 100) {
    return "complete";
  }
  if (progress < 40) {
    return "connecting";
  }
  if (progress < 70) {
    return "scraping data";
  }
  return "processing data";
}

export function GET(request: Request) {
  // Create a readable stream for SSE
  const encoder = new TextEncoder();
  let intervalId: NodeJS.Timeout | null = null;

  const stream = new ReadableStream({
    start(controller) {
      let progress = 0;
      let isComplete = false;

      const send = (data: string) => {
        try {
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        } catch {
          // Client disconnected, stop sending
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
        }
      };

      // Send loading progress updates
      intervalId = setInterval(() => {
        if (isComplete) {
          progress = 0;
          isComplete = false;
        }

        progress += 2;

        if (progress >= 100) {
          progress = 100;
          isComplete = true;
        }

        const status = getStatus(progress);

        const loadingData = JSON.stringify({
          progress,
          status,
          timestamp: new Date().toISOString(),
        });

        send(loadingData);
      }, 100);
    },
    cancel() {
      // Cleanup when the stream is cancelled (client disconnected)
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    },
  });

  // Handle request abort (client disconnect)
  request.signal.addEventListener("abort", () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  });

  // Return response with SSE headers
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // Disable buffering in nginx/proxy
    },
  });
}
