import type { CreateProblemBody } from "../lib/create-problem-schema";

/** Deterministic copy for local testing; slug gets a unique suffix when applied. */
export function getDevSampleLongestSubstringTwoDistinctProblem(): CreateProblemBody {
  const suffix = Date.now();

  return {
    title: "Longest Substring with At Most Two Distinct Characters (dev sample)",
    slug: `longest-substring-at-most-two-distinct-dev-${suffix}`,
    difficulty: "medium",
    description:
      "Given a string s, return the length of the longest substring that contains at most two distinct characters. (LeetCode 159–style; see e.g. AlgoMonster problem 159.)",
    constraints:
      "1 <= s.length <= 10^5. s consists of English letters (uppercase and/or lowercase).",
    isPublished: false,

    patternSlug: "sliding-window",
    loopStructure: "for-with-inner-while",
    skillFocus:
      "Keep a sliding window and a frequency map (or small fixed counts). Expand with right; shrink from the left while the window has more than two distinct characters.",
    tutorLevel: "pattern-rep",
    visualizationNotes:
      "right adds s[right] to counts. While the number of keys with positive count exceeds two, decrement s[left] and advance left until the window is valid again, then update the best length.",
    editorial: { content: "", embeds: [] },

    tags: ["string", "hash-table", "sliding-window", "two-pointers"],

    examples: [
      {
        input: 's = "eceba"',
        output: "3",
        explanation:
          "The longest valid substring is \"ece\", which uses only the characters e and c.",
      },
      {
        input: 's = "ccaabbb"',
        output: "5",
        explanation:
          "The longest valid substring is \"aabbb\", which uses only a and b.",
      },
      {
        input: 's = "a"',
        output: "1",
        explanation: "A single character has one distinct character.",
      },
    ],

    starterCode: [
      {
        language: "javascript",
        code: [
          "function lengthOfLongestSubstringTwoDistinct(s) {",
          "  // Return the length of the longest substring with at most two distinct characters.",
          "  return 0;",
          "}",
        ].join("\n"),
        functionName: "lengthOfLongestSubstringTwoDistinct",
      },
      {
        language: "typescript",
        code: [
          "function lengthOfLongestSubstringTwoDistinct(s: string): number {",
          "  // Return the length of the longest substring with at most two distinct characters.",
          "  return 0;",
          "}",
        ].join("\n"),
        functionName: "lengthOfLongestSubstringTwoDistinct",
      },
      {
        language: "python",
        code: [
          "def length_of_longest_substring_two_distinct(s: str) -> int:",
          "    # Return the length of the longest substring with at most two distinct characters.",
          "    return 0",
        ].join("\n"),
        functionName: "length_of_longest_substring_two_distinct",
      },
    ],

    hints: [
      {
        title: "Count characters in the window",
        body: "A Map or length-128 array can store how many times each character appears in the current window.",
      },
      {
        title: "How many distinct?",
        body: "The window is valid when at most two different characters have a positive count. Track distinct count or map size after cleanup.",
      },
      {
        title: "Shrink when invalid",
        body: "When a third distinct character enters, move left forward, decrementing counts until a character drops to zero and leaves the window.",
      },
      {
        title: "Update the answer",
        body: "Whenever the window is valid, the current length is right - left + 1.",
      },
    ],

    solutions: [
      {
        language: "javascript",
        code: [
          "function lengthOfLongestSubstringTwoDistinct(s) {",
          "  let left = 0;",
          "  let best = 0;",
          "  const counts = new Map();",
          "",
          "  for (let right = 0; right < s.length; right++) {",
          "    const ch = s[right];",
          "    counts.set(ch, (counts.get(ch) ?? 0) + 1);",
          "",
          "    while (counts.size > 2) {",
          "      const leftCh = s[left];",
          "      const next = (counts.get(leftCh) ?? 0) - 1;",
          "      if (next <= 0) {",
          "        counts.delete(leftCh);",
          "      } else {",
          "        counts.set(leftCh, next);",
          "      }",
          "      left += 1;",
          "    }",
          "",
          "    best = Math.max(best, right - left + 1);",
          "  }",
          "",
          "  return best;",
          "}",
        ].join("\n"),
        explanation:
          "Slide right and add the character to a frequency map. While more than two distinct characters appear in the window, shrink from the left until one character's count hits zero and is removed from the map. Track the maximum valid window length.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
      },
    ],

    testCases: [
      {
        input: '["eceba"]',
        expectedOutput: "3",
        isSample: true,
      },
      {
        input: '["ccaabbb"]',
        expectedOutput: "5",
        isSample: true,
      },
      {
        input: '["a"]',
        expectedOutput: "1",
        isSample: true,
      },
      {
        input: '["aa"]',
        expectedOutput: "2",
        isSample: false,
      },
      {
        input: '["bbbbbb"]',
        expectedOutput: "6",
        isSample: false,
      },
      {
        input: '["babc"]',
        expectedOutput: "3",
        isSample: false,
      },
    ],
  };
}
