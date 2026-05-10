/**
 * Server-Sent Events (SSE) API Route for Real-Time Time Updates
 *
 * This endpoint streams time updates to clients using Server-Sent Events.
 * Clients can connect to this endpoint to receive real-time time updates.
 *
 * USAGE:
 * ------
 * const eventSource = new EventSource('/api/sse-time');
 * eventSource.onmessage = (event) => {
 *   const data = JSON.parse(event.data);
 *   console.log(data.time);
 * };
 */

export function GET(request: Request) {
  // Create a readable stream for SSE
  const encoder = new TextEncoder();
  let intervalId: NodeJS.Timeout | null = null;

  const stream = new ReadableStream({
    start(controller) {
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

      // Send time updates every second
      intervalId = setInterval(() => {
        const now = new Date();
        const timeData = JSON.stringify({
          time: now.toLocaleTimeString("en-US", {
            hour12: true,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          timestamp: now.toISOString(),
        });

        send(timeData);
      }, 1000);
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
