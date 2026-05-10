"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/design-system/components/ui/tabs";
import { ComponentCodeLayout } from "@/components/component-code-layout";
import { SplitLayout } from "@/components/split-layout";
import { AdvancedBadNotifier } from "./components/advanced-bad-notifier";
import { AdvancedGoodNotifier } from "./components/advanced-good-notifier";
import { BadButton } from "./components/bad-button";
import {
  GoodButton,
  SuccessButton,
  WarningButton,
} from "./components/good-button";

const badCode = `"use client";

import { Button } from "@repo/design-system/components/ui/button";

/**
 * ❌ BAD: Must modify this component to add new button types
 */
type BadButtonProps = {
  type: "primary" | "secondary" | "danger";
  label: string;
  onClick: () => void;
};

export const BadButton = ({ type, label, onClick }: BadButtonProps) => {
  // Must modify this component to add new types
  const getStyles = () => {
    switch (type) {
      case "primary":
        return "bg-blue-500 hover:bg-blue-600";
      case "secondary":
        return "bg-gray-500 hover:bg-gray-600";
      case "danger":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "";
    }
  };

  return (
    <Button onClick={onClick} className={getStyles()}>
      {label}
    </Button>
  );
};`;

const goodCode = `"use client";

import { Button } from "@repo/design-system/components/ui/button";
import type { ComponentProps } from "react";

/**
 * ✅ GOOD: Open for extension via composition
 * Can extend without modifying this component
 */
type GoodButtonProps = ComponentProps<typeof Button> & {
  label: string;
};

export const GoodButton = ({ label, ...buttonProps }: GoodButtonProps) => {
  return <Button {...buttonProps}>{label}</Button>;
};

// Extended without modifying GoodButton:
export const SuccessButton = (props: Omit<GoodButtonProps, "variant">) => (
  <GoodButton {...props} variant="default" className="bg-green-600 hover:bg-green-700" />
);

export const WarningButton = (props: Omit<GoodButtonProps, "variant">) => (
  <GoodButton {...props} variant="outline" className="border-yellow-500 text-yellow-600" />
);`;

const advancedBadCode = `"use client";

import { Card, CardContent } from "@repo/design-system/components/ui/card";

type Notification = {
  type: "email" | "sms" | "push";
  message: string;
  recipient: string;
};

/**
 * ❌ BAD: Must modify this component to add new notification types
 */
export const AdvancedBadNotifier = () => {
  const sendNotification = (notification: Notification) => {
    // Must modify this function to add new types
    switch (notification.type) {
      case "email":
        console.log(\`Sending email to \${notification.recipient}: \${notification.message}\`);
        break;
      case "sms":
        console.log(\`Sending SMS to \${notification.recipient}: \${notification.message}\`);
        break;
      case "push":
        console.log(\`Sending push to \${notification.recipient}: \${notification.message}\`);
        break;
      default:
        throw new Error("Unknown notification type");
    }
  };
  // ... rest of component
};`;

const advancedGoodCode = `// Main Notifier Component (open for extension)
"use client";

import { EmailNotifier } from "./notifiers/email-notifier";
import { SmsNotifier } from "./notifiers/sms-notifier";
import { PushNotifier } from "./notifiers/push-notifier";
import { SlackNotifier } from "./notifiers/slack-notifier";

const notifiers = {
  email: EmailNotifier,
  sms: SmsNotifier,
  push: PushNotifier,
  slack: SlackNotifier, // ✅ Added without modifying existing code
};

export const AdvancedGoodNotifier = () => {
  const notifications = [
    { type: "email", message: "Welcome!", recipient: "user@example.com" },
    { type: "slack", message: "Deployment complete", recipient: "#dev-team" },
  ];

  return (
    <Card>
      {notifications.map((notif, idx) => {
        const NotifierComponent = notifiers[notif.type];
        return (
          <NotifierComponent
            key={idx}
            message={notif.message}
            recipient={notif.recipient}
          />
        );
      })}
    </Card>
  );
};

// Individual Notifier Components (closed for modification)
// notifiers/email-notifier.tsx
export function EmailNotifier({ message, recipient }) {
  const send = () => console.log(\`Sending email to \${recipient}: \${message}\`);
  return <div>...</div>;
}

// notifiers/slack-notifier.tsx - ✅ NEW: Added without modifying existing notifiers
export function SlackNotifier({ message, recipient }) {
  const send = () => console.log(\`Sending Slack to \${recipient}: \${message}\`);
  return <div>...</div>;
}`;

const OCPPage = () => (
  <div className="flex min-h-[calc(100vh-4rem)] flex-col">
    <div className="shrink-0 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Open/Closed Principle</CardTitle>
          <CardDescription>
            Software entities should be open for extension but closed for
            modification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="mb-2 font-semibold">Definition</h3>
            <p className="text-muted-foreground text-sm">
              The Open/Closed Principle states that software entities (classes,
              modules, functions, etc.) should be open for extension but closed
              for modification. This means you should be able to add new
              functionality without changing existing code.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Benefits</h3>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
              <li>Reduced risk of breaking existing functionality</li>
              <li>Easier to add new features</li>
              <li>Better code stability</li>
              <li>Promotes use of abstractions</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="flex-1 p-6 pt-0">
      <Tabs className="flex h-full flex-col" defaultValue="basic">
        <TabsList className="mb-4">
          <TabsTrigger value="basic">Basic Examples</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Examples</TabsTrigger>
        </TabsList>
        <TabsContent className="min-h-0 flex-1" value="basic">
          <SplitLayout
            left={
              <ComponentCodeLayout
                code={badCode}
                component={
                  <div className="space-y-2">
                    <BadButton
                      label="Primary"
                      onClick={() => {}}
                      type="primary"
                    />
                    <BadButton
                      label="Secondary"
                      onClick={() => {}}
                      type="secondary"
                    />
                    <BadButton
                      label="Danger"
                      onClick={() => {}}
                      type="danger"
                    />
                  </div>
                }
                description="Must modify component to add new button types"
                title="❌ Bad Component"
              />
            }
            right={
              <ComponentCodeLayout
                code={goodCode}
                component={
                  <div className="space-y-2">
                    <GoodButton label="Base Button" onClick={() => {}} />
                    <SuccessButton
                      label="Success (Extended)"
                      onClick={() => {}}
                    />
                    <WarningButton
                      label="Warning (Extended)"
                      onClick={() => {}}
                    />
                  </div>
                }
                description="Extended without modifying base component"
                title="✅ Good Component"
              />
            }
          />
        </TabsContent>
        <TabsContent className="min-h-0 flex-1" value="advanced">
          <SplitLayout
            left={
              <ComponentCodeLayout
                code={advancedBadCode}
                component={<AdvancedBadNotifier />}
                description="Must modify switch statement to add new notification types"
                title="❌ Bad Component"
              />
            }
            right={
              <ComponentCodeLayout
                code={advancedGoodCode}
                component={<AdvancedGoodNotifier />}
                description="New notifiers added by creating new components, no modification needed"
                title="✅ Good Component"
              />
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  </div>
);

export default OCPPage;
