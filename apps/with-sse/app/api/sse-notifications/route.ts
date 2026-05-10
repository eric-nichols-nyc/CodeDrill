/**
 * Server-Sent Events (SSE) API Route for Real-Time Notifications
 *
 * This endpoint streams notifications to clients using Server-Sent Events.
 * Clients can connect to this endpoint to receive real-time notifications
 * that are triggered via the POST /api/notifications endpoint.
 *
 * USAGE:
 * ------
 * const eventSource = new EventSource('/api/sse-notifications');
 * eventSource.onmessage = (event) => {
 *   const data = JSON.parse(event.data);
 *   console.log(data.message, data.type);
 * };
 */

import { notificationStore } from "@/lib/notification-store";

export function GET(request: Request) {
  // Create a readable stream for SSE
  let controllerRef: ReadableStreamDefaultController<Uint8Array> | null = null;

  const stream = new ReadableStream({
    start(controller) {
      // Store controller reference for cleanup
      controllerRef = controller;

      // Register this connection with the store
      notificationStore.addConnection(controller);
    },
    cancel() {
      // Cleanup when the stream is cancelled (client disconnected)
      if (controllerRef) {
        notificationStore.removeConnection(controllerRef);
        controllerRef = null;
      }
    },
  });

  // Handle request abort (client disconnect)
  request.signal.addEventListener("abort", () => {
    if (controllerRef) {
      notificationStore.removeConnection(controllerRef);
      controllerRef = null;
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
