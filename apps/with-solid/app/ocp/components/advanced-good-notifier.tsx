"use client";

import { Card, CardContent } from "@repo/design-system/components/ui/card";
import { EmailNotifier } from "./notifiers/email-notifier";
import { PushNotifier } from "./notifiers/push-notifier";
import { SlackNotifier } from "./notifiers/slack-notifier";
import { SmsNotifier } from "./notifiers/sms-notifier";

/**
 * ✅ GOOD: Open for extension - can add new notifiers without modifying this
 */
type Notification = {
  type: string;
  message: string;
  recipient: string;
};

const notifiers = {
  email: EmailNotifier,
  sms: SmsNotifier,
  push: PushNotifier,
  slack: SlackNotifier,
};

export const AdvancedGoodNotifier = () => {
  const notifications: Notification[] = [
    { type: "email", message: "Welcome!", recipient: "user@example.com" },
    { type: "sms", message: "Your code is 1234", recipient: "+1234567890" },
    { type: "push", message: "New message", recipient: "device-id-123" },
    { type: "slack", message: "Deployment complete", recipient: "#dev-team" },
  ];

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <h3 className="font-semibold">Notifications</h3>
        {notifications.map((notif, idx) => {
          const NotifierComponent =
            notifiers[notif.type as keyof typeof notifiers];
          if (!NotifierComponent) return null;
          return (
            <NotifierComponent
              key={idx}
              message={notif.message}
              recipient={notif.recipient}
            />
          );
        })}
      </CardContent>
    </Card>
  );
};
