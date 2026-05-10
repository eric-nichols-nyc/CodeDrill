type User = {
  id: string;
  isActive?: boolean;
};

/**
 * Hook responsible ONLY for calculating statistics
 */
export function useStats(users: User[]) {
  const total = users.length;
  const active = users.filter((u) => u.isActive).length;

  return { total, active };
}
