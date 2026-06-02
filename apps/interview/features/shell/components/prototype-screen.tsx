import { cn } from "@repo/design-system/lib/utils";
import type { ReactNode } from "react";

type PrototypeScreenProps = {
  title: string;
  description: string;
  step: number;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function PrototypeScreen({
  title,
  description,
  step,
  children,
  actions,
  className,
}: PrototypeScreenProps) {
  return (
    <section
      className={cn("mx-auto flex max-w-2xl flex-col gap-6 px-4 py-12", className)}
    >
      <div className="space-y-2">
        <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
          Screen {step} · Static prototype
        </p>
        <h1 className="font-semibold text-3xl tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="rounded-lg border bg-card p-6">{children}</div>
      {actions ? (
        <div className="flex flex-wrap gap-3">{actions}</div>
      ) : null}
    </section>
  );
}
