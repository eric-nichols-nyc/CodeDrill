import { Badge } from "@repo/design-system/components/ui/badge";
import { cn } from "@repo/design-system/lib/utils";
import type { LongestSubstringStep } from "../utils/generate-longest-substring-steps";

type StringWindowProps = {
  input: string;
  step: LongestSubstringStep;
};

function cellClassName(isRight: boolean, isInWindow: boolean) {
  if (isRight) {
    return "scale-105 border-primary bg-primary/15 text-foreground shadow-lg ring-2 ring-primary";
  }
  if (isInWindow) {
    return "border-success/50 bg-success/10 text-foreground";
  }
  return "border-border bg-card text-card-foreground";
}

/**
 * [S] Renders the input string with left/right pointers for the current step.
 */
export function StringWindow({ input, step }: StringWindowProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {input.split("").map((char, index) => {
        const isInWindow = index >= step.left && index <= step.right;
        const isLeft = index === step.left;
        const isRight = index === step.right;

        return (
          <div
            className="flex flex-col items-center gap-2"
            key={`char-${index}`}
          >
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-xl border font-bold text-2xl transition-all",
                cellClassName(isRight, isInWindow)
              )}
            >
              {char}
            </div>
            <div className="flex h-10 flex-col items-center text-center text-muted-foreground text-xs font-semibold">
              <div>{index}</div>
              <div className="flex gap-1">
                {isLeft ? (
                  <Badge className="px-1 text-[10px]" variant="outline">
                    L
                  </Badge>
                ) : null}
                {isRight ? (
                  <Badge className="px-1 text-[10px]" variant="secondary">
                    R
                  </Badge>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
