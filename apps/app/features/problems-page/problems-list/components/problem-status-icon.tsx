import { Check, Minus } from "lucide-react";
import type { Status } from "../../lib/types";

export function ProblemStatusIcon({ status }: { status: Status }) {
  if (status === "solved") {
    return <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
  }
  if (status === "attempted") {
    return <Minus className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
  }
  return <span aria-hidden className="inline-block h-4 w-4" />;
}
