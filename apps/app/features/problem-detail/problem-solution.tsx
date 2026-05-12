import { JsonFallback } from "@/features/problem-detail/json-fallback";
import type { ProblemSolutionRow } from "@/features/problem-detail/problem-detail-types";

export function ProblemSolution({ data }: { data: ProblemSolutionRow[] }) {
  return (
    <div className="space-y-4">
      <section className="space-y-2">
        <h2 className="font-medium text-muted-foreground text-sm">
          Solutions
        </h2>
        <JsonFallback data={data} />
      </section>
    </div>
  );
}
