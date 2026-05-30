/**
 * [S] Pure sliding-window step generator — no React, no I/O.
 * [O] Closed to UI changes; open to any string input via parameter.
 */

export type WindowPhase =
  | "expand"
  | "duplicate"
  | "shrink"
  | "update-best";

export type LongestSubstringStep = {
  index: number;
  left: number;
  right: number;
  currentChar: string;
  windowText: string;
  bestLength: number;
  bestText: string;
  seen: Record<string, number>;
  activeLine: number;
  explanation: string;
  phase: WindowPhase;
};

function toSeenRecord(seen: Set<string>): Record<string, number> {
  return Array.from(seen).reduce<Record<string, number>>((acc, char) => {
    acc[char] = 1;
    return acc;
  }, {});
}

export function generateLongestSubstringSteps(
  s: string
): LongestSubstringStep[] {
  const steps: LongestSubstringStep[] = [];
  const seen = new Set<string>();
  let left = 0;
  let bestLength = 0;
  let bestText = "";

  const addStep = ({
    right,
    activeLine,
    explanation,
    phase,
  }: {
    right: number;
    activeLine: number;
    explanation: string;
    phase: WindowPhase;
  }) => {
    steps.push({
      index: steps.length,
      left,
      right,
      currentChar: s[right] ?? "",
      windowText: right >= left ? s.slice(left, right + 1) : "",
      bestLength,
      bestText,
      seen: toSeenRecord(seen),
      activeLine,
      explanation,
      phase,
    });
  };

  for (let right = 0; right < s.length; right++) {
    addStep({
      right,
      activeLine: 5,
      phase: "expand",
      explanation: `Move right to index ${right}. Current character is "${s[right]}".`,
    });

    while (seen.has(s[right])) {
      addStep({
        right,
        activeLine: 6,
        phase: "duplicate",
        explanation: `"${s[right]}" is already inside the window, so the window is invalid.`,
      });

      const removedChar = s[left];
      seen.delete(removedChar);
      addStep({
        right,
        activeLine: 7,
        phase: "shrink",
        explanation: `Remove "${removedChar}" from the left side of the window.`,
      });

      left++;
      addStep({
        right,
        activeLine: 8,
        phase: "shrink",
        explanation: `Move left to index ${left}.`,
      });
    }

    seen.add(s[right]);
    addStep({
      right,
      activeLine: 10,
      phase: "expand",
      explanation: `Add "${s[right]}" to the current window.`,
    });

    const currentLength = right - left + 1;
    if (currentLength > bestLength) {
      bestLength = currentLength;
      bestText = s.slice(left, right + 1);
    }

    addStep({
      right,
      activeLine: 11,
      phase: "update-best",
      explanation: `Window "${s.slice(left, right + 1)}" has length ${currentLength}. Best length is now ${bestLength}.`,
    });
  }

  return steps;
}
