import type { Problem } from "../../lib/types";

export function difficultyTextClass(d: Problem["difficulty"]) {
  if (d === "Easy") {
    return "text-emerald-600 dark:text-emerald-400";
  }
  if (d === "Hard") {
    return "text-red-600 dark:text-red-400";
  }
  return "text-amber-600 dark:text-amber-400";
}
