import { useEffect, useState } from "react";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  displayName?: string;
  isActive?: boolean;
};

/**
 * Hook responsible ONLY for fetching and caching user data
 */
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cache, setCache] = useState<{
    data: User[];
    timestamp: number;
  } | null>(null);

  const fetchUsers = async () => {
    try {
      // Check cache
      if (cache && Date.now() - cache.timestamp < 30_000) {
        setUsers(cache.data);
        setLoading(false);
        return;
      }

      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();

      const transformed = data.map((user: any) => ({
        ...user,
        displayName: `${user.firstName} ${user.lastName}`,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { users, loading, error, refresh: fetchUsers };
}
