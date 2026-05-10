"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@repo/design-system/components/ui/alert";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/components/ui/select";
import { Bell, Send } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getNotificationVariant,
  type Notification,
  type NotificationType,
} from "@/lib/notification-service";

export default function TestDashboardPage() {
  const [type, setType] = useState<NotificationType>("info");
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Connect to SSE endpoint to receive notifications in real-time
  useEffect(() => {
    const eventSource = new EventSource("/api/sse-notifications");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data) as Notification;
      // Ignore system messages
      if (data.type !== "system") {
        setNotifications((prev) => [data, ...prev].slice(0, 20)); // Keep last 20
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send notification");
        return;
      }

      setSuccess(
        `Notification sent! (${data.connections} connection${data.connections !== 1 ? "s" : ""} active)`
      );
      setMessage(""); // Clear message field
    } catch (error) {
      console.error("Error sending notification:", error);
      setError("Failed to send notification. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-8">
      <div className="flex w-full max-w-4xl flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">
              Notification Test Dashboard
            </CardTitle>
            <CardDescription>
              Send notifications and see them appear in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error ? (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}

              {success ? (
                <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                  <AlertTitle className="text-green-600">Success!</AlertTitle>
                  <AlertDescription className="text-green-600">
                    {success}
                  </AlertDescription>
                </Alert>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="type">Notification Type</Label>
                <Select
                  onValueChange={(value) => setType(value as NotificationType)}
                  value={type}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Input
                  id="message"
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter notification message..."
                  required
                  type="text"
                  value={message}
                />
              </div>

              <Button className="w-full" disabled={isSubmitting} type="submit">
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? "Sending..." : "Send Notification"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Real-Time Notifications</CardTitle>
                <CardDescription>
                  {notifications.length} notification
                  {notifications.length !== 1 ? "s" : ""} received
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {notifications.length === 0 ? (
                <Alert>
                  <Bell className="h-4 w-4" />
                  <AlertTitle>Waiting for notifications</AlertTitle>
                  <AlertDescription>
                    Send a notification using the form above to see it appear
                    here in real-time.
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
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
