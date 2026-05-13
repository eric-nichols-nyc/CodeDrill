/**
 * Shared types for the problem workspace feature (editor rows, faux console).
 */

/** One row from `starterCode` after normalization; `key` keys the draft map. */
export type StarterCodeRow = {
  key: string;
  raw: unknown;
  language: string;
  functionName: string | null;
  code: string | null;
};

/** Single line in the workspace Console tab (submit / future run output). */
export type ConsoleEntry = {
  id: string;
  level: "info" | "success" | "error";
  message: string;
  createdAt: string;
};
