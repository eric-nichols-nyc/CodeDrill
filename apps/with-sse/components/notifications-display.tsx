"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@repo/design-system/components/ui/alert";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getNotificationVariant,
  type Notification,
} from "@/lib/notification-service";

export const NotificationsDisplay = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Connect to the SSE endpoint
    const eventSource = new EventSource("/api/sse-notifications");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data) as Notification;
      setNotifications((prev) => [data, ...prev].slice(0, 10)); // Keep last 10
    };

    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
      eventSource.close();
    };

    // Cleanup: close the connection when component unmounts
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Bell className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-lg">Real-Time Notifications</h2>
          <p className="text-muted-foreground text-sm">
            {notifications.length} notification
            {notifications.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {notifications.length === 0 ? (
          <Alert>
            <Bell className="h-4 w-4" />
            <AlertTitle>Waiting for notifications</AlertTitle>
            <AlertDescription>
              Notifications will appear here in real-time.
            </AlertDescription>
          </Alert>
        ) : (
          notifications.map((notification) => (
            <Alert
              key={notification.id}
              variant={getNotificationVariant(notification.type)}
            >
              <Bell className="h-4 w-4" />
              <AlertTitle className="capitalize">
                {notification.type}
              </AlertTitle>
              <AlertDescription>{notification.message}</AlertDescription>
            </Alert>
          ))
        )}
      </div>
    </div>
  );
};
