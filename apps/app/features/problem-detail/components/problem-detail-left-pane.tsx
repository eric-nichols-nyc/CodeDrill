import { ProblemDescriptionTab } from "@/features/problem-detail/components/problem-description-tab";
import { ProblemTabs } from "@/features/problem-detail/components/problem-tabs";
import type {
  ProblemRow,
  ProblemSolutionRow,
} from "@/features/problem-detail/problem-detail-types";

const SOLO_URL_RE = /^https?:\/\/\S+$/i;
const HTML_CLOSING_TAG_RE = /<\/[a-z][\w-]*>/i;

function isProbablyHtmlFragment(s: string): boolean {
  const t = s.trim();
  return t.startsWith("<") && HTML_CLOSING_TAG_RE.test(t);
}

function EditorialBody({ source }: { source: string }) {
  const trimmed = source.trim();
  if (SOLO_URL_RE.test(trimmed)) {
    return (
      <a
        className="text-primary text-sm underline-offset-4 hover:underline"
        href={trimmed}
        rel="noopener noreferrer"
        target="_blank"
      >
        Open link
      </a>
    );
  }
  if (isProbablyHtmlFragment(trimmed)) {
    return (
      <div
        className="prose prose-sm max-w-none [&_a]:text-primary [&_p]:text-foreground"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: admin-authored editorial; trusted content
        dangerouslySetInnerHTML={{ __html: trimmed }}
      />
    );
  }
  return (
    <div className="max-w-none whitespace-pre-wrap text-foreground text-sm leading-relaxed">
      {source}
    </div>
  );
}

export function ProblemDetailLeftPane({
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
  editorial: string | null;
}) {
  const editorialTab = editorial ? (
    <EditorialBody source={editorial} />
  ) : (
    <p className="text-muted-foreground text-sm">
      No editorial has been added for this problem yet.
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
            p={p}
            problem={problem}
            showConstraints={showConstraints}
            showDescription={showDescription}
            showDifficulty={showDifficulty}
          />
        }
        editorial={editorialTab}
        solutions={solutions}
      />
    </div>
  );
}
