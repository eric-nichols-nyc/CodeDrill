import { cn } from "@repo/design-system/lib/utils";

type MatrixGridProps = {
  matrix: number[][];
  currentRow: number;
  currentCol: number;
  visited: boolean[][];
};

function cellClassName(isCurrent: boolean, isVisited: boolean) {
  if (isCurrent) {
    return "scale-105 border-primary bg-primary/15 text-foreground shadow-lg ring-2 ring-primary";
  }
  if (isVisited) {
    return "border-success/50 bg-success/10 text-foreground";
  }
  return "border-border bg-card text-card-foreground";
}

/**
 * [S] Renders the matrix grid for the current step.
 * [I] Receives display slices only — not SpiralStep.
 */
export function MatrixGrid({
  matrix,
  currentRow,
  currentCol,
  visited,
}: MatrixGridProps) {
  const cols = matrix[0]?.length ?? 0;

  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {matrix.flatMap((row, rowIndex) =>
        row.map((value, colIndex) => {
          const isCurrent =
            currentRow === rowIndex && currentCol === colIndex;
          const isVisited = visited[rowIndex][colIndex];

          return (
            <div
              className={cn(
                "flex h-20 w-20 items-center justify-center rounded-xl border font-bold text-2xl transition-all",
                cellClassName(isCurrent, isVisited)
              )}
              key={`cell-${rowIndex}-${colIndex}`}
            >
              {value}
            </div>
          );
        })
      )}
    </div>
  );
}
