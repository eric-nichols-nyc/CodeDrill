import { asRecord, strField } from "@/features/problem-workspace/problem-detail-helpers";

export type ClientTestCaseResult = {
  index: number;
  passed: boolean;
  /** String form of expected value (for display / when parse failed) */
  expectedDisplay: string;
  /** String form of actual return value or empty if no run */
  actualDisplay: string;
  error?: string;
  /** `console.log` / `warn` / `error` emitted while this case was executed */
  userConsole: CapturedConsoleLine[];
};

/** Lines emitted by user code via `console.log` / `warn` / `error` during a client Run. */
export type CapturedConsoleLine = {
  level: "log" | "warn" | "error";
  message: string;
};

export type RunClientTestsOutcome = {
  /** Set when user code does not load or `functionName` is missing / not a function */
  compileError: string | null;
  /** True only when there is at least one case and every case passed */
  allPassed: boolean;
  caseResults: ClientTestCaseResult[];
  /** Calls to `console.log` / `warn` / `error` inside evaluated user code during this run */
  userConsole: CapturedConsoleLine[];
};

/** Merges identical consecutive captures (e.g. repeated lines in the global run log). */
export function collapseAdjacentCapturedConsoleLines(
  lines: CapturedConsoleLine[]
): CapturedConsoleLine[] {
  if (lines.length === 0) {
    return [];
  }

  type Accum = CapturedConsoleLine & { repeat: number };
  const out: CapturedConsoleLine[] = [];
  const head = lines[0];
  if (!head) {
    return [];
  }
  let cur: Accum = { ...head, repeat: 1 };

  const flush = (x: Accum) => {
    if (x.repeat <= 1) {
      out.push({ level: x.level, message: x.message });
      return;
    }
    out.push({
      level: x.level,
      message: `${x.message} (×${x.repeat})`,
    });
  };

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) {
      continue;
    }
    if (line.level === cur.level && line.message === cur.message) {
      cur.repeat += 1;
    } else {
      flush(cur);
      cur = { ...line, repeat: 1 };
    }
  }
  flush(cur);
  return out;
}

/** Bound natives so patching `console.log` does not break framework diagnostics */
const dbg = {
  log: console.log.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
};

function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function stringifyUnknown(value: unknown): string {
  try {
    const json = JSON.stringify(value);
    if (json !== undefined) {
      return json;
    }
  } catch {
    // fall through
  }
  return String(value);
}

function formatConsoleArgs(args: unknown[]): string {
  if (args.length === 0) {
    return "";
  }
  return args.map((a) => stringifyUnknown(a)).join(" ");
}

/**
 * Temporarily routes `console.log` / `warn` / `error` into `sink` and still forwards to the
 * real console via `dbg` (so devtools keep working and our own logging stays uncaptured).
 */
function installUserConsoleCapture(sink: CapturedConsoleLine[]): () => void {
  const prevLog = console.log;
  const prevWarn = console.warn;
  const prevError = console.error;

  const patch =
    (level: CapturedConsoleLine["level"]) =>
    (...args: unknown[]) => {
      sink.push({ level, message: formatConsoleArgs(args) });
      if (level === "log") {
        dbg.log(...args);
      } else if (level === "warn") {
        dbg.warn(...args);
      } else {
        dbg.error(...args);
      }
    };

  console.log = patch("log") as typeof console.log;
  console.warn = patch("warn") as typeof console.warn;
  console.error = patch("error") as typeof console.error;

  return () => {
    console.log = prevLog;
    console.warn = prevWarn;
    console.error = prevError;
  };
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

export type ProblemTestCaseView = {
  input: string;
  expectedOutput: string;
  isSample: boolean;
};

/**
 * Normalizes API `testCases` for display or for `runClientTests` (subset of fields).
 */
export function normalizeProblemTestCases(tests: unknown): ProblemTestCaseView[] {
  if (!Array.isArray(tests)) {
    return [];
  }
  const out: ProblemTestCaseView[] = [];
  for (const row of tests) {
    const o = asRecord(row);
    const input = strField(o, "input");
    const expectedOutput = strField(o, "expectedOutput");
    if (input !== null && expectedOutput !== null) {
      out.push({
        input,
        expectedOutput,
        isSample: o !== null && o.isSample === true,
      });
    }
  }
  return out;
}

function normalizeTestRows(tests: unknown): { input: string; expectedOutput: string }[] {
  return normalizeProblemTestCases(tests).map(({ input, expectedOutput }) => ({
    input,
    expectedOutput,
  }));
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

  dbg.log("[client-test-run] start", {
    functionName: functionName || "(empty)",
    codeLength: code.length,
    rawTestsIsArray: Array.isArray(tests),
    normalizedCaseCount: rows.length,
  });

  const emptyOutcome = (
    compileError: string | null,
    partial: Omit<Partial<RunClientTestsOutcome>, "compileError"> = {}
  ): RunClientTestsOutcome => ({
    compileError,
    allPassed: false,
    caseResults: [],
    userConsole: [],
    ...partial,
  });

  if (!functionName) {
    dbg.log("[client-test-run] abort: no function name");
    return emptyOutcome("No function name is set on starter code for this run.");
  }

  if (rows.length === 0) {
    dbg.log("[client-test-run] abort: zero test rows after normalize");
    return emptyOutcome(null);
  }

  const userConsole: CapturedConsoleLine[] = [];
  const restoreCapture = installUserConsoleCapture(userConsole);

  try {
    let fn: unknown;
    try {
      fn = new Function(`${code}\n;return ${functionName};`)();
      dbg.log("[client-test-run] evaluated code; resolved entry:", typeof fn);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not evaluate your code";
      dbg.log("[client-test-run] compile/parse error", message);
      return emptyOutcome(message, { userConsole });
    }

    if (typeof fn !== "function") {
      dbg.log("[client-test-run] not a function:", functionName, typeof fn);
      return emptyOutcome(
        `\`${functionName}\` is not a function after running your code`,
        { userConsole }
      );
    }

    const callee = fn as (...args: unknown[]) => unknown;
    const caseResults: ClientTestCaseResult[] = rows.map((row, index) => {
      const consoleStart = userConsole.length;
      const caseConsole = () => userConsole.slice(consoleStart);

      let expected: unknown;
      try {
        expected = JSON.parse(row.expectedOutput);
      } catch (error) {
        const err =
          error instanceof Error
            ? `Invalid expectedOutput JSON: ${error.message}`
            : "Invalid expectedOutput JSON";
        dbg.log(`[client-test-run] case ${index}: bad expectedOutput`, row.expectedOutput);
        return {
          index,
          passed: false,
          expectedDisplay: row.expectedOutput,
          actualDisplay: "",
          error: err,
          userConsole: caseConsole(),
        };
      }

      try {
        const args = parseCallArgs(row.input);
        const actual = callee(...args);
        const passed = deepEqual(actual, expected);
        dbg.log(`[client-test-run] case ${index}`, {
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
          userConsole: caseConsole(),
        };
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : "Runtime error";
        dbg.log(`[client-test-run] case ${index}: runtime error`, errMsg);
        return {
          index,
          passed: false,
          expectedDisplay: stringifyUnknown(expected),
          actualDisplay: "",
          error: errMsg,
          userConsole: caseConsole(),
        };
      }
    });

    const allPassed =
      caseResults.length > 0 && caseResults.every((r) => r.passed);

    const outcome: RunClientTestsOutcome = {
      compileError: null,
      allPassed,
      caseResults,
      userConsole,
    };
    dbg.log("[client-test-run] done", {
      allPassed,
      compileError: outcome.compileError,
      summaries: caseResults.map((r) => ({
        i: r.index,
        passed: r.passed,
        err: r.error,
      })),
    });

    return outcome;
  } finally {
    restoreCapture();
  }
}
