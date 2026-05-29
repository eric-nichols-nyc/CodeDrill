import { DescriptionTab } from "./description-tab";
import { DirectionsTabs } from "./directions-tabs";
import { EditorialTab } from "./editorial-tab";
import type {
  ProblemEditorial,
  ProblemRow,
  ProblemSolutionRow,
  ProblemTag,
} from "../lib/problem-detail-types";

export function DirectionsContent({
  p,
  problem,
  examples,
  hints,
  solutions,
  exampleList,
  hintList,
  showDescription,
  showConstraints,
  showDifficulty,
  editorial,
  tags = [],
}: {
  p: ProblemRow;
  problem: unknown;
  examples: unknown;
  hints: unknown;
  solutions: ProblemSolutionRow[];
  exampleList: unknown[];
  hintList: unknown[];
  showDescription: boolean;
  showConstraints: boolean;
  showDifficulty: boolean;
  editorial: ProblemEditorial | null;
  tags?: ProblemTag[];
}) {
  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden p-2">
      <DirectionsTabs
        className="min-h-0 flex-1"
        description={
          <DescriptionTab
            exampleList={exampleList}
            examples={examples}
            hintList={hintList}
            hints={hints}
            p={p}
            problem={problem}
            showConstraints={showConstraints}
            showDescription={showDescription}
            showDifficulty={showDifficulty}
            tags={tags}
          />
        }
        editorial={<EditorialTab editorial={editorial} />}
        hasVisualizer={p.hasVisualizer === true}
        slug={p.slug ?? ""}
        solutions={solutions}
      />
    </div>
  );
}
