/**
 * Notification Trigger API
 *
 * POST endpoint to trigger notifications that will be sent to all
 * connected SSE clients in real-time.
 *
 * USAGE:
 * ------
 * POST /api/notifications
 * Content-Type: application/json
 * {
 *   "type": "info" | "success" | "warning" | "error",
 *   "message": "Your notification message"
 * }
 */

import {
  createNotification,
  type NotificationType,
} from "@/lib/notification-service";
import { notificationStore } from "@/lib/notification-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    if (!(body.type && body.message)) {
      return Response.json(
        { error: "Missing required fields: type and message" },
        { status: 400 }
      );
    }

    const type = body.type as NotificationType;
    const message = body.message as string;

    // Validate notification type
    const validTypes: NotificationType[] = [
      "info",
      "success",
      "warning",
      "error",
    ];
    if (!validTypes.includes(type)) {
      return Response.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    // Create notification
    const notification = createNotification({ type, message });

    // Broadcast to all connected clients
    notificationStore.broadcast(notification);

    return Response.json({
      success: true,
      notification,
      connections: notificationStore.getConnectionCount(),
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    return Response.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}
