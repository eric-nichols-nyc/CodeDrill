"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { useStats } from "./hooks/use-stats";
import { useUsers } from "./hooks/use-users";
import { StatsDisplay } from "./stats-display";
import { UserList } from "./user-list";

/**
 * ✅ GOOD: Advanced example following SRP
 * Each component/hook has a single responsibility:
 * - useUsers: Data fetching and caching
 * - useStats: Statistics calculation
 * - UserList: Displaying users
 * - StatsDisplay: Displaying statistics
 * - Dashboard: Orchestration only
 */
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
