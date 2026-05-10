/**
 * Notification Service
 *
 * Abstract logic for generating and managing notifications.
 */

export type NotificationType = "info" | "success" | "warning" | "error";

export type Notification = {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string;
};

export const NOTIFICATION_TYPES: readonly NotificationType[] = [
  "info",
  "success",
  "warning",
  "error",
] as const;

export const NOTIFICATION_MESSAGES: readonly string[] = [
  "New user registered",
  "Payment processed successfully",
  "System maintenance scheduled",
  "Data backup completed",
  "Security alert detected",
  "Order confirmed",
  "Inventory updated",
  "Report generated",
  "Email sent",
  "Profile updated",
] as const;

/**
 * Generate a random notification
 */
export function generateNotification(): Omit<Notification, "id" | "timestamp"> {
  const type =
    NOTIFICATION_TYPES[Math.floor(Math.random() * NOTIFICATION_TYPES.length)];
  const message =
    NOTIFICATION_MESSAGES[
      Math.floor(Math.random() * NOTIFICATION_MESSAGES.length)
    ];
  return { type, message };
}

/**
 * Create a complete notification with ID and timestamp
 */
export function createNotification(
  notification?: Omit<Notification, "id" | "timestamp">
): Notification {
  const baseNotification = notification ?? generateNotification();
  return {
    ...baseNotification,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Get notification variant for UI components
 */
export function getNotificationVariant(
  type: NotificationType
): "default" | "destructive" {
  return type === "error" ? "destructive" : "default";
}
