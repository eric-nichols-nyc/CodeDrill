"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Card, CardContent } from "@repo/design-system/components/ui/card";
import { useState } from "react";

/**
 * ❌ BAD: This component violates SRP
 * It handles:
 * - Displaying user data
 * - Fetching data
 * - Saving to localStorage
 * - Sending analytics
 * - Formatting dates
 */
export const BadUserProfile = () => {
  const user = {
    name: "John Doe",
    email: "john@example.com",
  };
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Saving to localStorage
    localStorage.setItem("user", JSON.stringify(user));

    // Sending analytics
    fetch("/api/analytics", {
      method: "POST",
      body: JSON.stringify({ event: "user_saved", userId: user.email }),
    });

    // Formatting and displaying
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div>
          <h3 className="font-semibold">{user.name}</h3>
          <p className="text-muted-foreground text-sm">{user.email}</p>
          <p className="mt-2 text-muted-foreground text-xs">
            Last updated: {formatDate(new Date())}
          </p>
        </div>
        <Button disabled={saved} onClick={handleSave}>
          {saved ? "Saved!" : "Save User"}
        </Button>
      </CardContent>
    </Card>
  );
};
