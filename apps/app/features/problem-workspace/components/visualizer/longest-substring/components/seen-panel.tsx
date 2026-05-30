/**
 * [S] Displays characters currently in the sliding-window Set.
 */
export function SeenPanel({ seen }: { seen: Record<string, number> }) {
  const entries = Object.keys(seen);

  return (
    <div className="flex flex-wrap gap-2">
      {entries.length === 0 ? (
        <span className="text-muted-foreground text-sm">Set is empty</span>
      ) : (
        entries.map((char) => (
          <span
            className="rounded-xl bg-foreground px-3 py-2 font-semibold text-background text-sm"
            key={char}
          >
            {char}
          </span>
        ))
      )}
    </div>
  );
}
