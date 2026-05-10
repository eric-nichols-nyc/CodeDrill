"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Card, CardContent } from "@repo/design-system/components/ui/card";

type User = {
  name: string;
  email: string;
  lastUpdated: Date;
};

type UserProfileProps = {
  user: User;
  onSave?: () => void;
  isSaving?: boolean;
};

/**
 * ✅ GOOD: Single Responsibility - Only displays user data
 */
export const UserProfile = ({ user, onSave, isSaving }: UserProfileProps) => (
  <Card>
    <CardContent className="space-y-4 pt-6">
      <div>
        <h3 className="font-semibold">{user.name}</h3>
        <p className="text-muted-foreground text-sm">{user.email}</p>
        <p className="mt-2 text-muted-foreground text-xs">
          Last updated: {user.lastUpdated.toLocaleDateString()}
        </p>
      </div>
      {onSave && (
        <Button disabled={isSaving} onClick={onSave}>
          {isSaving ? "Saving..." : "Save User"}
        </Button>
      )}
    </CardContent>
  </Card>
);
