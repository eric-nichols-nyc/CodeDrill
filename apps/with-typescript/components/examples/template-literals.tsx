"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";

type Event = `on${"Click" | "Hover" | "Focus"}`;
type ApiRoute = `/api/${string}/${string}`;

export const TemplateLiteralsExamples = () => {
  const events: Event[] = ["onClick", "onHover", "onFocus"];
  const routes: ApiRoute[] = [
    "/api/users/123",
    "/api/products/456",
    "/api/orders/789",
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Event Handlers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="mb-2 font-semibold text-xs">
              Type: `on${"Click" | "Hover" | "Focus"}`
            </p>
            <div className="space-y-1">
              {events.map((event) => (
                <p className="font-mono text-sm" key={event}>
                  {event}
                </p>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>API Routes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="mb-2 font-semibold text-xs">
              Type: `/api/${string}/${string}`
            </p>
            <div className="space-y-1">
              {routes.map((route) => (
                <p className="font-mono text-sm" key={route}>
                  {route}
                </p>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
