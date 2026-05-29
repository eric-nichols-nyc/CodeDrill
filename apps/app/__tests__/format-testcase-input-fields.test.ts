import { describe, expect, it } from "vitest";
import { formatTestcaseInputFields } from "@/features/problem-workspace/components/editor-panel/utils/format-testcase-input-fields";

describe("formatTestcaseInputFields", () => {
  it("parses LeetCode-style named inputs", () => {
    expect(
      formatTestcaseInputFields("nums = [2,7,11,15], target = 9")
    ).toEqual([
      { label: "nums", value: "[2,7,11,15]" },
      { label: "target", value: "9" },
    ]);
  });

  it("parses JSON argument lists", () => {
    expect(formatTestcaseInputFields("[1, 2]")).toEqual([
      { label: "param 1", value: "1" },
      { label: "param 2", value: "2" },
    ]);
  });

  it("parses a single JSON scalar", () => {
    expect(formatTestcaseInputFields("42")).toEqual([
      { label: "input", value: "42" },
    ]);
  });
});
