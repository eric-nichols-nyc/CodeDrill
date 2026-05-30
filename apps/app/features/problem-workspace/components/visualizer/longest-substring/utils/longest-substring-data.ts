/**
 * [S] Static demo data for the Longest Substring visualizer only.
 */

export const LONGEST_SUBSTRING_INPUT = "abcabcbb";

export const LONGEST_SUBSTRING_CODE_LINES: string[] = [
  "function lengthOfLongestSubstring(s) {",
  "  let left = 0;",
  "  let best = 0;",
  "  const seen = new Set();",
  "  for (let right = 0; right < s.length; right++) {",
  "    while (seen.has(s[right])) {",
  "      seen.delete(s[left]);",
  "      left++;",
  "    }",
  "    seen.add(s[right]);",
  "    best = Math.max(best, right - left + 1);",
  "  }",
  "  return best;",
  "}",
];
