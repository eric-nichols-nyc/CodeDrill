"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { useEffect, useState } from "react";

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
  const [cache, setCache] = useState<{ data: any[]; timestamp: number } | null>(
    null
  );

  // Data fetching logic
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check cache first
        if (cache && Date.now() - cache.timestamp < 30_000) {
          setUsers(cache.data);
          setLoading(false);
          return;
        }

        // Fetch from API
        const response = await fetch("/api/users");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();

        // Transform data
        const transformed = data.map((user: any) => ({
          ...user,
          displayName: `${user.firstName} ${user.lastName}`,
          isActive: user.status === "active",
        }));

        // Update cache
        setCache({ data: transformed, timestamp: Date.now() });
        setUsers(transformed);

        // Calculate stats
        const total = transformed.length;
        const active = transformed.filter((u: any) => u.isActive).length;
        setStats({ total, active });

        // Track analytics
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
            <p className="text-muted-foreground text-sm">Total Users</p>
            <p className="font-bold text-2xl">{stats.total}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Active Users</p>
            <p className="font-bold text-2xl">{stats.active}</p>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Users</h3>
          {users.map((user) => (
            <div className="rounded border p-2" key={user.id}>
              <p className="font-medium">{user.displayName}</p>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </div>
          ))}
        </div>
        <Button onClick={() => window.location.reload()}>Refresh</Button>
      </CardContent>
    </Card>
  );
};
