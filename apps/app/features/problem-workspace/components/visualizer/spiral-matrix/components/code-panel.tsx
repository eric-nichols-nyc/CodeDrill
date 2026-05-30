import { cn } from "@repo/design-system/lib/utils";

type CodePanelProps = {
  lines: string[];
  activeLine: number;
};

/**
 * [S] Code trace with active-line highlight.
 * [I] Decoupled from SpiralStep — lines and activeLine only.
 */
export function CodePanel({ lines, activeLine }: CodePanelProps) {
  return (
    <pre className="overflow-x-auto rounded-xl bg-muted p-4 font-mono text-foreground text-xs leading-tight shadow-inner">
      {lines.map((line, index) => {
        const lineNumber = index + 1;
        const isActive = lineNumber === activeLine;

        return (
          <div
            className={cn(
              "px-2 py-0",
              isActive ? "rounded bg-primary text-primary-foreground" : ""
            )}
            key={`line-${lineNumber}`}
          >
            <span className="mr-4 inline-block w-5 select-none text-right text-muted-foreground">
              {lineNumber}
            </span>
            {line}
          </div>
        );
      })}
    </pre>
  );
}
