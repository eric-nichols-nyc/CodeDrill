import type { CreateProblemBody } from "../lib/create-problem-schema";

/** Deterministic copy for local testing; slug gets a unique suffix when applied. */
export function getLongestRepeatingCharacterReplacementProblem(): CreateProblemBody {
  const suffix = Date.now();

  return {
    title: "Longest Repeating Character Replacement",
    slug: `longest-repeating-character-replacement-${suffix}`,
    difficulty: "medium",
    description:
      "Given a string s and an integer k, return the length of the longest substring containing the same letter you can get after performing at most k character replacements.",
    constraints:
      "1 <= s.length <= 10^5. s consists of only uppercase English letters. 0 <= k <= s.length.",
    isPublished: false,
    patternSlug: "sliding-window",
    loopStructure: "for-with-inner-while",
    skillFocus:
      "Track char counts in the window and the max frequency; shrink left while window length - maxFreq > k.",
    tutorLevel: "pattern-rep",
    visualizationNotes:
      "A window is valid when replacements needed equals length - maxCharCount and is at most k.",
    editorial: { content: "", embeds: [] },
    tags: ["string", "sliding-window", "hash-table"],
    examples: [
      {
        input: 's = "ABAB", k = 2',
        output: "4",
        explanation: "Replace both A's with B's or both B's with A's to get length 4.",
      },
      {
        input: 's = "AABABBA", k = 1',
        output: "4",
        explanation: 'Replace one A in "AABAB" to get four B\'s in a row.',
      },
    ],
    starterCode: [
      {
        language: "javascript",
        code: [
          "function characterReplacement(s, k) {",
          "  // Return the longest substring length after at most k replacements.",
          "  return 0;",
          "}",
        ].join("\n"),
        functionName: "characterReplacement",
      },
      {
        language: "typescript",
        code: [
          "function characterReplacement(s: string, k: number): number {",
          "  // Return the longest substring length after at most k replacements.",
          "  return 0;",
          "}",
        ].join("\n"),
        functionName: "characterReplacement",
      },
      {
        language: "python",
        code: [
          "def character_replacement(s: str, k: int) -> int:",
          "    # Return the longest substring length after at most k replacements.",
          "    return 0",
        ].join("\n"),
        functionName: "character_replacement",
      },
    ],
    hints: [
      {
        title: "What makes a window valid?",
        body: "If window length minus the count of the most frequent char in the window is <= k, you can fix the rest with replacements.",
      },
      {
        title: "Shrink when invalid",
        body: "While (right - left + 1) - maxFreq > k, move left and update counts.",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: [
          "function characterReplacement(s, k) {",
          "  const count = {};",
          "  let left = 0;",
          "  let maxFreq = 0;",
          "  let best = 0;",
          "",
          "  for (let right = 0; right < s.length; right += 1) {",
          "    const ch = s[right];",
          "    count[ch] = (count[ch] || 0) + 1;",
          "    maxFreq = Math.max(maxFreq, count[ch]);",
          "",
          "    while (right - left + 1 - maxFreq > k) {",
          "      const leftChar = s[left];",
          "      count[leftChar] -= 1;",
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
          "Expand the window and track the dominant character count; shrink when too many replacements would be needed.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
      },
    ],
    testCases: [
      {
        input: '[["ABAB",2]]',
        expectedOutput: "4",
        isSample: true,
      },
      {
        input: '[["AABABBA",1]]',
        expectedOutput: "4",
        isSample: true,
      },
      {
        input: '[["AAAA",0]]',
        expectedOutput: "4",
        isSample: false,
      },
      {
        input: '[["ABBB",2]]',
        expectedOutput: "4",
        isSample: false,
      },
    ],
  };
}
