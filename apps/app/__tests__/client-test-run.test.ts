import { describe, expect, it } from "vitest";
import { runClientTests } from "@/features/problem-workspace/lib/client-test-run";

describe("runClientTests", () => {
  it("scopes userConsole to each case, not the full run", () => {
    const code = `
function lengthOfLongestSubstring(s) {
  console.log("Hello");
  return 0;
}
`;
    const tests = [
      { input: '"a"', expectedOutput: "1" },
      { input: '"ab"', expectedOutput: "2" },
      { input: '"abc"', expectedOutput: "3" },
    ];

    const outcome = runClientTests(code, "lengthOfLongestSubstring", tests);

    expect(outcome.compileError).toBeNull();
    expect(outcome.caseResults).toHaveLength(3);
    for (const row of outcome.caseResults) {
      expect(row.userConsole).toHaveLength(1);
      expect(row.userConsole[0]?.message).toBe('"Hello"');
    }
    expect(outcome.userConsole).toHaveLength(3);
  });
});
