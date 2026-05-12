import {
  CodeBlock,
  CodeBlockCopyButton,
} from "@repo/design-system/components/ai-elements/code-block";
import { Badge } from "@repo/design-system/components/ui/badge";
import type { ComponentProps } from "react";
import type { ProblemSolutionRow } from "@/features/problem-detail/problem-detail-types";

type ShikiLanguage = ComponentProps<typeof CodeBlock>["language"];

function solutionHighlightLanguage(lang: string): ShikiLanguage {
  switch (lang.trim().toLowerCase()) {
    case "javascript":
    case "js":
      return "javascript";
    case "typescript":
    case "ts":
      return "typescript";
    case "tsx":
      return "tsx";
    case "jsx":
      return "jsx";
    case "python":
    case "py":
      return "python";
    case "java":
      return "java";
    case "cpp":
    case "c++":
      return "cpp";
    case "c":
      return "c";
    case "csharp":
    case "c#":
    case "cs":
      return "csharp";
    case "go":
    case "golang":
      return "go";
    case "rust":
    case "rs":
      return "rust";
    case "sql":
      return "sql";
    case "yaml":
    case "yml":
      return "yaml";
    case "json":
      return "json";
    default:
      return "typescript";
  }
}

export function ProblemSolution({ data }: { data: ProblemSolutionRow[] }) {
  if (data.length === 0) {
    return (
      <div className="space-y-4">
        <section className="space-y-2">
          <h2 className="font-medium text-muted-foreground text-sm">
            Solutions
          </h2>
          <p className="text-muted-foreground text-sm">
            No reference solutions are published for this problem yet.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="space-y-2">
        <h2 className="font-medium text-muted-foreground text-sm">Solutions</h2>
        <ul className="space-y-4">
          {data.map((row) => (
            <li
              className="overflow-hidden rounded-lg border border-border bg-card shadow-sm"
              key={row.id}
            >
              <div className="flex flex-wrap items-center gap-2 border-border border-b bg-muted/40 px-3 py-2">
                <Badge variant="outline">{row.language}</Badge>
                {row.timeComplexity ? (
                  <span className="text-muted-foreground text-xs">
                    Time {row.timeComplexity}
                  </span>
                ) : null}
                {row.spaceComplexity ? (
                  <span className="text-muted-foreground text-xs">
                    Space {row.spaceComplexity}
                  </span>
                ) : null}
              </div>
              <div className="p-2">
                <CodeBlock
                  className="text-xs shadow-none"
                  code={row.code}
                  language={solutionHighlightLanguage(row.language)}
                >
                  <CodeBlockCopyButton />
                </CodeBlock>
              </div>
              {row.explanation ? (
                <p className="whitespace-pre-wrap border-border border-t px-3 py-2 text-muted-foreground text-xs leading-relaxed">
                  {row.explanation}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
