import { cn } from "@repo/design-system/lib/utils";

const pillClassName =
  "max-w-[9rem] truncate rounded-md bg-muted px-2 py-0.5 text-muted-foreground text-xs font-normal";

const TAG_LABEL_SPLIT = /[-_\s]+/;

function formatTagLabel(tag: string): string {
  return tag
    .split(TAG_LABEL_SPLIT)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export type ProblemListTagPillsProps = {
  tags: string[];
  className?: string;
};

export function ProblemListTagPills({ tags, className }: ProblemListTagPillsProps) {
  if (tags.length === 0) {
    return null;
  }

  const visible = tags.slice(0, 2);
  const extra = tags.length - visible.length;

  return (
    <div className={cn("flex min-w-0 flex-wrap items-center gap-1.5", className)}>
      {visible.map((tag) => (
        <span className={pillClassName} key={tag} title={tag}>
          {formatTagLabel(tag)}
        </span>
      ))}
      {extra > 0 ? (
        <span className="shrink-0 text-muted-foreground text-xs">+{extra}</span>
      ) : null}
    </div>
  );
}
