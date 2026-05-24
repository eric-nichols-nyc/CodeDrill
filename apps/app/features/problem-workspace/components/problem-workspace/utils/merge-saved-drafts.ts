import type { StarterCodeRow } from "../types";
import type { WorkspaceCodeEntry } from "../queries/workspace-code-api";

/** Overlays saved code onto drafts by matching `StarterCodeRow.language`. */
export function mergeSavedCodeIntoDrafts(
  rows: StarterCodeRow[],
  drafts: Record<string, string>,
  entries: WorkspaceCodeEntry[]
): Record<string, string> {
  if (entries.length === 0) {
    return drafts;
  }

  const next = { ...drafts };
  for (const row of rows) {
    const saved = entries.find((entry) => entry.language === row.language);
    if (saved) {
      next[row.key] = saved.code;
    }
  }
  return next;
}
