import { describe, expect, it } from "vitest";
import type { StarterCodeRow } from "@/features/problem-workspace/components/problem-workspace/types";
import {
  entryFunctionNameForRun,
  resolveRunStarterRow,
  runSourceForStarterRow,
} from "@/features/problem-workspace/components/problem-workspace/utils/run-target";

function starter(partial: Partial<StarterCodeRow> & Pick<StarterCodeRow, "key">): StarterCodeRow {
  return {
    raw: {},
    language: "javascript",
    functionName: "fn",
    code: "//",
    ...partial,
  };
}

describe("run-target helpers", () => {
  describe("resolveRunStarterRow", () => {
    it("returns null when there are no rows", () => {
      expect(resolveRunStarterRow([], "x")).toBeNull();
    });

    it("falls back to the first row when the key is unknown", () => {
      const rows = [starter({ key: "a" }), starter({ key: "b", functionName: "g" })];
      expect(resolveRunStarterRow(rows, "missing")?.key).toBe("a");
    });

    it("returns the row matching activeStarterKey", () => {
      const rows = [
        starter({ key: "a", functionName: "fa" }),
        starter({ key: "b", functionName: "fb" }),
      ];
      expect(resolveRunStarterRow(rows, "b")?.functionName).toBe("fb");
    });
  });

  describe("runSourceForStarterRow", () => {
    it("returns the draft slice for that row key", () => {
      expect(
        runSourceForStarterRow(starter({ key: "k1" }), { k1: "console.log(1)", k2: "x" })
      ).toBe("console.log(1)");
    });

    it("returns an empty string for a null row", () => {
      expect(runSourceForStarterRow(null, { k: "x" })).toBe("");
    });
  });

  describe("entryFunctionNameForRun", () => {
    it("prefers the active row’s functionName when set", () => {
      const rows = [
        starter({ key: "a", functionName: "first" }),
        starter({ key: "b", functionName: "second" }),
      ];
      expect(entryFunctionNameForRun(rows[1] ?? null, rows)).toBe("second");
    });

    it("falls back to the first named starter in the problem when the row lacks a name", () => {
      const rows = [
        starter({ key: "a", functionName: "alpha" }),
        starter({ key: "b", functionName: null }),
      ];
      expect(entryFunctionNameForRun(rows[1] ?? null, rows)).toBe("alpha");
    });
  });
});
