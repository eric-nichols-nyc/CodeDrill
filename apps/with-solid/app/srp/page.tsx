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
import { PageWrapper } from "@/components/page-wrapper";
import { SplitLayout } from "@/components/split-layout";
import { buildPageContext } from "@/lib/page-context";
import { AdvancedBadDashboard } from "./components/advanced-bad-dashboard";
import { AdvancedGoodDashboard } from "./components/advanced-good-dashboard";
import { BadUserProfile } from "./components/bad-user-profile";
import { UserProfile } from "./components/good-user-profile";

const badCode = `"use client";

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
};`;

const goodCode = `"use client";

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
export const UserProfile = ({ user, onSave, isSaving }: UserProfileProps) => {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div>
          <h3 className="font-semibold">{user.name}</h3>
          <p className="text-muted-foreground text-sm">{user.email}</p>
          <p className="text-muted-foreground text-xs mt-2">
            Last updated: {user.lastUpdated.toLocaleDateString()}
          </p>
        </div>
        {onSave && (
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save User"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};`;

const advancedBadCode = `"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/design-system/components/ui/card";
import { useState, useEffect } from "react";

/**
 * ❌ BAD: Advanced example violating SRP
 * This component handles:
 * - Data fetching
 * - Data transformation
 * - Caching logic
 * - Error handling
 * - Analytics tracking
 * - UI rendering
 * - State management
 */
export const AdvancedBadDashboard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cache, setCache] = useState<{ data: any[]; timestamp: number } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (cache && Date.now() - cache.timestamp < 30000) {
          setUsers(cache.data);
          setLoading(false);
          return;
        }

        const response = await fetch("/api/users");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();

        const transformed = data.map((user: any) => ({
          ...user,
          displayName: \`\${user.firstName} \${user.lastName}\`,
          isActive: user.status === "active",
        }));

        setCache({ data: transformed, timestamp: Date.now() });
        setUsers(transformed);

        const total = transformed.length;
        const active = transformed.filter((u: any) => u.isActive).length;
        setStats({ total, active });

        fetch("/api/analytics", {
          method: "POST",
          body: JSON.stringify({
            event: "dashboard_loaded",
            userCount: total,
          }),
        });

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      }
    };

    fetchData();
  }, [cache]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Dashboard</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Active Users</p>
            <p className="text-2xl font-bold">{stats.active}</p>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Users</h3>
          {users.map((user) => (
            <div key={user.id} className="p-2 border rounded">
              <p className="font-medium">{user.displayName}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          ))}
        </div>
        <Button onClick={() => window.location.reload()}>Refresh</Button>
      </CardContent>
    </Card>
  );
};`;

const advancedGoodCode = `// Dashboard Component (orchestration only)
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/design-system/components/ui/card";
import { Button } from "@repo/design-system/components/ui/button";
import { useUsers } from "./hooks/use-users";
import { useStats } from "./hooks/use-stats";
import { UserList } from "./user-list";
import { StatsDisplay } from "./stats-display";

export const AdvancedGoodDashboard = () => {
  const { users, loading, error, refresh } = useUsers();
  const stats = useStats(users);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Dashboard</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <StatsDisplay stats={stats} />
        <UserList users={users} />
        <Button onClick={refresh}>Refresh</Button>
      </CardContent>
    </Card>
  );
};

// hooks/use-users.ts - Data fetching ONLY
import { useState, useEffect } from "react";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cache, setCache] = useState<{ data: User[]; timestamp: number } | null>(null);

  const fetchUsers = async () => {
    try {
      if (cache && Date.now() - cache.timestamp < 30000) {
        setUsers(cache.data);
        setLoading(false);
        return;
      }

      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();

      const transformed = data.map((user: any) => ({
        ...user,
        displayName: \`\${user.firstName} \${user.lastName}\`,
        isActive: user.status === "active",
      }));

      setCache({ data: transformed, timestamp: Date.now() });
      setUsers(transformed);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [cache]);

  return { users, loading, error, refresh: fetchUsers };
}

// hooks/use-stats.ts - Statistics calculation ONLY
export function useStats(users: User[]) {
  const total = users.length;
  const active = users.filter((u) => u.isActive).length;
  return { total, active };
}

// user-list.tsx - Display users ONLY
export function UserList({ users }: UserListProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Users</h3>
      {users.map((user) => (
        <div key={user.id} className="p-2 border rounded">
          <p className="font-medium">{user.displayName}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      ))}
    </div>
  );
}

// stats-display.tsx - Display statistics ONLY
export function StatsDisplay({ stats }: StatsDisplayProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-muted-foreground">Total Users</p>
        <p className="text-2xl font-bold">{stats.total}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Active Users</p>
        <p className="text-2xl font-bold">{stats.active}</p>
      </div>
    </div>
  );
}`;

// Build the page context for the chatbot
const pageContext = buildPageContext({
  principle: "Single Responsibility Principle (SRP)",
  description: "A class should have only one reason to change",
  definition:
    "The Single Responsibility Principle states that a class or module should have only one reason to change, meaning it should have only one job or responsibility.",
  benefits: [
    "Easier to understand and maintain",
    "Reduced coupling between components",
    "Improved testability",
    "Better code organization",
  ],
  badCode,
  goodCode,
  badDescription:
    "Component handles display, storage, analytics, and formatting",
  goodDescription:
    "Component only displays data. Logic handled by parent/hooks",
});

const SRPPage = () => (
  <PageWrapper context={pageContext}>
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <div className="shrink-0 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Single Responsibility Principle</CardTitle>
            <CardDescription>
              A class should have only one reason to change
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-2 font-semibold">Definition</h3>
              <p className="text-muted-foreground text-sm">
                The Single Responsibility Principle states that a class or
                module should have only one reason to change, meaning it should
                have only one job or responsibility.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Benefits</h3>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
                <li>Easier to understand and maintain</li>
                <li>Reduced coupling between components</li>
                <li>Improved testability</li>
                <li>Better code organization</li>
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
                  component={<BadUserProfile />}
                  description="Component handles display, storage, analytics, and formatting"
                  title="❌ Bad Component"
                />
              }
              right={
                <ComponentCodeLayout
                  code={goodCode}
                  component={
                    <UserProfile
                      onSave={() => {
                        console.log("Save logic handled externally");
                      }}
                      user={{
                        name: "Jane Doe",
                        email: "jane@example.com",
                        lastUpdated: new Date(),
                      }}
                    />
                  }
                  description="Component only displays data. Logic handled by parent/hooks"
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
                  component={<AdvancedBadDashboard />}
                  description="Monolithic component handling data fetching, transformation, caching, analytics, and rendering"
                  title="❌ Bad Component"
                />
              }
              right={
                <ComponentCodeLayout
                  code={advancedGoodCode}
                  component={<AdvancedGoodDashboard />}
                  description="Separated concerns: custom hooks for data/calculations, components for display, orchestration only"
                  title="✅ Good Component"
                />
              }
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  </PageWrapper>
);

export default SRPPage;
