/**
 * Notification Store
 *
 * In-memory store for managing notifications and SSE connections.
 * This allows the trigger API to send notifications to active SSE connections.
 */

import type { Notification } from "./notification-service";

type SSEController = ReadableStreamDefaultController<Uint8Array>;

class NotificationStore {
  private connections: Set<SSEController> = new Set();

  /**
   * Add an SSE connection to broadcast to
   */
  addConnection(controller: SSEController): void {
    this.connections.add(controller);
  }

  /**
   * Remove an SSE connection
   */
  removeConnection(controller: SSEController): void {
    this.connections.delete(controller);
  }

  /**
   * Broadcast a notification to all active connections
   */
  broadcast(notification: Notification): void {
    const data = JSON.stringify(notification);
    const encoder = new TextEncoder();
    const message = encoder.encode(`data: ${data}\n\n`);

    // Remove dead connections while broadcasting
    const deadConnections: SSEController[] = [];

    for (const controller of this.connections) {
      try {
        controller.enqueue(message);
      } catch {
        // Connection is dead, mark for removal
        deadConnections.push(controller);
      }
    }

    // Clean up dead connections
    for (const controller of deadConnections) {
      this.connections.delete(controller);
    }
  }

  /**
   * Get the number of active connections
   */
  getConnectionCount(): number {
    return this.connections.size;
  }
}

// Singleton instance - shared across all API routes
export const notificationStore = new NotificationStore();
