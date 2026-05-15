export type TestcaseInputField = {
  label: string;
  value: string;
};

/**
 * Splits a testcase `input` string into labeled rows for the Testcase tab UI.
 * Supports LeetCode-style (`nums = [1,2], target = 3`) and JSON argument lists.
 */
export function formatTestcaseInputFields(input: string): TestcaseInputField[] {
  console.log("formatTestcaseInputFields", input);
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return [];
  }

  const leetcodeFields = parseLeetCodeStyleInput(trimmed);
  if (leetcodeFields.length > 0) {
    return leetcodeFields;
  }

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.map((value, index) => ({
        label: `param ${index + 1}`,
        value: formatInputFieldValue(value),
      }));
    }
    return [{ label: "input", value: formatInputFieldValue(parsed) }];
  } catch {
    return [{ label: "input", value: trimmed }];
  }
}

function parseLeetCodeStyleInput(input: string): TestcaseInputField[] {
  const matches = [...input.matchAll(/(\w+)\s*=\s*/g)];
  if (matches.length === 0) {
    return [];
  }

  const fields: TestcaseInputField[] = [];
  for (let i = 0; i < matches.length; i += 1) {
    const match = matches[i];
    const label = match[1];
    if (label === undefined) {
      continue;
    }
    const valueStart = match.index! + match[0].length;
    const valueEnd =
      i + 1 < matches.length ? matches[i + 1].index! : input.length;
    let value = input.slice(valueStart, valueEnd).trim();
    if (value.endsWith(",")) {
      value = value.slice(0, -1).trim();
    }
    fields.push({ label, value });
  }

  return fields;
}

function formatInputFieldValue(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }
  return JSON.stringify(value);
}
