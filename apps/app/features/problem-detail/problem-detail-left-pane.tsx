import { JsonFallback } from "@/features/problem-detail/json-fallback";
import { ProblemDescriptionTab } from "@/features/problem-detail/problem-description-tab";
import type { ProblemRow } from "@/features/problem-detail/problem-detail-types";
import { ProblemTabs } from "@/features/problem-detail/problem-tabs";

export function ProblemDetailLeftPane({
  p,
  problem,
  examples,
  hints,
  learningNotes,
  solutions,
  exampleList,
  hintList,
  showDescription,
  showConstraints,
  showDifficulty,
  editorial,
}: {
  p: ProblemRow;
  problem: unknown;
  examples: unknown;
  hints: unknown;
  learningNotes: unknown;
  solutions: unknown;
  exampleList: unknown[];
  hintList: unknown[];
  showDescription: boolean;
  showConstraints: boolean;
  showDifficulty: boolean;
  editorial: string | null;
}) {
  const editorialTab = editorial ? (
    <div className="space-y-2">
      <a
        className="text-primary text-sm underline-offset-4 hover:underline"
        href={editorial}
        rel="noopener noreferrer"
        target="_blank"
      >
        Watch on YouTube
      </a>
    </div>
  ) : (
    <p className="text-muted-foreground text-sm">
      No editorial is linked for this problem yet.
    </p>
  );

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden p-4 pr-3">
      <ProblemTabs
        className="min-h-0 flex-1"
        description={
          <ProblemDescriptionTab
            exampleList={exampleList}
            examples={examples}
            hintList={hintList}
            hints={hints}
            learningNotes={learningNotes}
            p={p}
            problem={problem}
            showConstraints={showConstraints}
            showDescription={showDescription}
            showDifficulty={showDifficulty}
          />
        }
        editorial={editorialTab}
        solutions={<JsonFallback data={solutions} />}
      />
    </div>
  );
}
