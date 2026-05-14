import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useProblemWorkspace } from "@/features/problem-detail/components/problem-workspace/hooks/use-problem-workspace";

const singleJsStarter = [
  {
    id: "s1",
    language: "javascript",
    functionName: "sum",
    code: "function sum(a, b) { return a + b; }",
  },
] as const;

const multiJsStarters = [
  {
    id: "j1",
    language: "javascript",
    functionName: "g",
    code: "function g() { return 1; }",
  },
  {
    id: "j2",
    language: "javascript",
    functionName: "g",
    code: "function g() { return 2; }",
  },
] as const;

const addTestCases = [
  { input: "[1, 2]", expectedOutput: "3", isSample: true },
] as const;

describe("useProblemWorkspace", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("runs client tests against the active starter only (single row passes)", () => {
    const { result } = renderHook(() =>
      useProblemWorkspace({
        starterCode: [...singleJsStarter],
        testCases: [...addTestCases],
      })
    );

    act(() => {
      result.current.handleRun();
    });

    expect(result.current.lastAction).toBe("run");
    expect(result.current.activeTab).toBe("results");
    expect(result.current.lastRunOutcome?.compileError).toBeNull();
    expect(result.current.lastRunOutcome?.allPassed).toBe(true);
    expect(result.current.lastRunOutcome?.caseResults).toHaveLength(1);
  });

  it("uses the selected starter row so Run results change when the language key changes", () => {
    const { result } = renderHook(() =>
      useProblemWorkspace({
        starterCode: [...multiJsStarters],
        testCases: [{ input: "[]", expectedOutput: "1", isSample: true }],
      })
    );

    const key1 = result.current.rows[0]?.key;
    const key2 = result.current.rows[1]?.key;
    expect(key1).toBeDefined();
    expect(key2).toBeDefined();

    act(() => {
      result.current.handleRun();
    });
    expect(result.current.lastRunOutcome?.allPassed).toBe(true);

    act(() => {
      result.current.setActiveStarterKey(key2 as string);
    });

    act(() => {
      result.current.handleRun();
    });
    expect(result.current.lastRunOutcome?.allPassed).toBe(false);
    expect(result.current.lastRunOutcome?.caseResults[0]?.passed).toBe(false);
  });

  it("does not concatenate another language into the same new Function eval (python row fails parse alone)", () => {
    const { result } = renderHook(() =>
      useProblemWorkspace({
        starterCode: [
          {
            id: "js",
            language: "javascript",
            functionName: "f",
            code: "function f() { return 1; }",
          },
          {
            id: "py",
            language: "python",
            functionName: "f",
            code: "def f():\n    return 2\n",
          },
        ],
        testCases: [{ input: "[]", expectedOutput: "1", isSample: true }],
      })
    );

    act(() => {
      result.current.setActiveStarterKey(
        result.current.rows.find((r) => r.language === "python")?.key ?? ""
      );
    });

    act(() => {
      result.current.handleRun();
    });

    expect(result.current.lastRunOutcome?.compileError).not.toBeNull();
  });
});
