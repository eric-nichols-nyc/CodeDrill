type StatsDisplayProps = {
  stats: { total: number; active: number };
};

/**
 * Component responsible ONLY for displaying statistics
 */
export function StatsDisplay({ stats }: StatsDisplayProps) {
  return (
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
  );
}
