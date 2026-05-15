import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useProblemWorkspace } from "@/features/problem-detail/components/problem-workspace/hooks/use-problem-workspace";

vi.mock(
  "@/features/problem-detail/components/problem-workspace/queries/use-workspace-code-query",
  () => ({
    useWorkspaceCodeQuery: () => ({
      data: [],
      isLoading: false,
      error: null,
    }),
  })
);

vi.mock(
  "@/features/problem-detail/components/problem-workspace/queries/use-save-workspace-code-mutation",
  () => ({
    useSaveWorkspaceCodeMutation: () => ({
      mutate: vi.fn(),
      isPending: false,
      error: null,
      reset: vi.fn(),
    }),
  })
);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

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

const jsAndPythonStarters = [
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
] as const;

const emptyInputTestCase = [
  { input: "[]", expectedOutput: "1", isSample: true },
] as const;

describe("useProblemWorkspace", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      })
    );
  });

  it("runs client tests against the active starter only (single row passes)", () => {
    const { result } = renderHook(
      () =>
        useProblemWorkspace({
          starterCode: singleJsStarter,
          testCases: addTestCases,
        }),
      { wrapper: createWrapper() }
    );

    act(() => {
      result.current.handleRun();
    });

    expect(result.current.lastAction).toBe("run");
    expect(result.current.activeTab).toBe("test-result");
    expect(result.current.lastRunOutcome?.compileError).toBeNull();
    expect(result.current.lastRunOutcome?.allPassed).toBe(true);
    expect(result.current.lastRunOutcome?.caseResults).toHaveLength(1);
  });

  it("uses the selected starter row so Run results change when the language key changes", () => {
    const { result } = renderHook(
      () =>
        useProblemWorkspace({
          starterCode: multiJsStarters,
          testCases: emptyInputTestCase,
        }),
      { wrapper: createWrapper() }
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
    const { result } = renderHook(
      () =>
        useProblemWorkspace({
          starterCode: jsAndPythonStarters,
          testCases: emptyInputTestCase,
        }),
      { wrapper: createWrapper() }
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
