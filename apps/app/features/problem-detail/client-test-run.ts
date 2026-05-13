import { asRecord, strField } from "@/features/problem-detail/problem-detail-helpers";

export type ClientTestCaseResult = {
  index: number;
  passed: boolean;
  /** String form of expected value (for display / when parse failed) */
  expectedDisplay: string;
  /** String form of actual return value or empty if no run */
  actualDisplay: string;
  error?: string;
};

export type RunClientTestsOutcome = {
  /** Set when user code does not load or `functionName` is missing / not a function */
  compileError: string | null;
  /** True only when there is at least one case and every case passed */
  allPassed: boolean;
  caseResults: ClientTestCaseResult[];
};

function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function stringifyUnknown(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

/**
 * `input` must be a JSON string describing the argument list:
 * - `"[[1,2,3], 6]"` → call `fn([1,2,3], 6)`
 * - `"42"` → call `fn(42)` (single non-array value)
 */
function parseCallArgs(input: string): unknown[] {
  const parsed: unknown = JSON.parse(input);
  if (Array.isArray(parsed)) {
    return parsed;
  }
  return [parsed];
}

function normalizeTestRows(tests: unknown): { input: string; expectedOutput: string }[] {
  if (!Array.isArray(tests)) {
    return [];
  }
  const out: { input: string; expectedOutput: string }[] = [];
  for (const row of tests) {
    const o = asRecord(row);
    const input = strField(o, "input");
    const expectedOutput = strField(o, "expectedOutput");
    if (input !== null && expectedOutput !== null) {
      out.push({ input, expectedOutput });
    }
  }
  return out;
}

/**
 * 1. Evaluates `code`, then reads `functionName` from the same scope.
 * 2. For each test row, parses `input` as a JSON argument list and `expectedOutput` as JSON.
 * 3. Compares return value to expected via JSON serialization (deep equality for common judge payloads).
 */
export function runClientTests(
  code: string,
  functionName: string,
  tests: unknown
): RunClientTestsOutcome {
  const rows = normalizeTestRows(tests);

  console.log("[client-test-run] start", {
    functionName: functionName || "(empty)",
    codeLength: code.length,
    rawTestsIsArray: Array.isArray(tests),
    normalizedCaseCount: rows.length,
  });

  if (!functionName) {
    console.log("[client-test-run] abort: no function name");
    return {
      compileError: "No function name is set on starter code for this run.",
      allPassed: false,
      caseResults: [],
    };
  }

  if (rows.length === 0) {
    console.log("[client-test-run] abort: zero test rows after normalize");
    return {
      compileError: null,
      allPassed: false,
      caseResults: [],
    };
  }

  let fn: unknown;
  try {
    fn = new Function(`${code}\n;return ${functionName};`)();
    console.log("[client-test-run] evaluated code; resolved entry:", typeof fn);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not evaluate your code";
    console.log("[client-test-run] compile/parse error", message);
    return {
      compileError: message,
      allPassed: false,
      caseResults: [],
    };
  }

  if (typeof fn !== "function") {
    console.log("[client-test-run] not a function:", functionName, typeof fn);
    return {
      compileError: `\`${functionName}\` is not a function after running your code`,
      allPassed: false,
      caseResults: [],
    };
  }

  const callee = fn as (...args: unknown[]) => unknown;
  const caseResults: ClientTestCaseResult[] = rows.map((row, index) => {
    let expected: unknown;
    try {
      expected = JSON.parse(row.expectedOutput);
    } catch (error) {
      const err =
        error instanceof Error
          ? `Invalid expectedOutput JSON: ${error.message}`
          : "Invalid expectedOutput JSON";
      console.log(`[client-test-run] case ${index}: bad expectedOutput`, row.expectedOutput);
      return {
        index,
        passed: false,
        expectedDisplay: row.expectedOutput,
        actualDisplay: "",
        error: err,
      };
    }

    try {
      const args = parseCallArgs(row.input);
      const actual = callee(...args);
      const passed = deepEqual(actual, expected);
      console.log(`[client-test-run] case ${index}`, {
        args,
        expected,
        actual,
        passed,
      });
      return {
        index,
        passed,
        expectedDisplay: stringifyUnknown(expected),
        actualDisplay: stringifyUnknown(actual),
      };
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Runtime error";
      console.log(`[client-test-run] case ${index}: runtime error`, errMsg);
      return {
        index,
        passed: false,
        expectedDisplay: stringifyUnknown(expected),
        actualDisplay: "",
        error: errMsg,
      };
    }
  });

  const allPassed =
    caseResults.length > 0 && caseResults.every((r) => r.passed);

  const outcome = {
    compileError: null,
    allPassed,
    caseResults,
  };
  console.log("[client-test-run] done", {
    allPassed,
    compileError: outcome.compileError,
    summaries: caseResults.map((r) => ({
      i: r.index,
      passed: r.passed,
      err: r.error,
    })),
  });

  return outcome;
}
