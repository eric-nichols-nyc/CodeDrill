import type { CreateProblemBody } from "../lib/create-problem-schema";

/** Deterministic copy for local testing; slug gets a unique suffix when applied. */
export function getMergeStringsAlternatelyProblem(): CreateProblemBody {
  const suffix = Date.now();

  return {
    title: "Merge Strings Alternately",
    slug: `merge-strings-alternately-${suffix}`,
    difficulty: "easy",
    description:
      "You are given two strings word1 and word2. Merge them by adding letters in alternating order, starting with word1. If one string is longer than the other, append the remaining characters to the end of the merged string. Return the merged result.",
    constraints:
      "1 <= word1.length, word2.length <= 100. word1 and word2 consist of lowercase English letters.",
    isPublished: false,
    patternSlug: "two-pointers",
    loopStructure: "single-pass-index",
    skillFocus:
      "Walk both strings with one index; append from word1 then word2 when each index is in range.",
    tutorLevel: "beginner",
    visualizationNotes:
      "At index i, take word1[i] if it exists, then word2[i] if it exists, until both strings are exhausted.",
    editorial: { content: "", embeds: [] },
    tags: ["string", "two-pointers"],
    examples: [
      {
        input: 'word1 = "abc", word2 = "pqr"',
        output: "apbqcr",
        explanation:
          "Merge a with p, then b with q, then c with r.",
      },
      {
        input: 'word1 = "ab", word2 = "pqrs"',
        output: "apbqrs",
        explanation:
          "After alternating through ab and pq, append the remaining rs from word2.",
      },
      {
        input: 'word1 = "abcd", word2 = "pq"',
        output: "apbqcd",
        explanation:
          "After alternating through pq, append the remaining cd from word1.",
      },
    ],
    starterCode: [
      {
        language: "javascript",
        code: [
          "function mergeAlternately(word1, word2) {",
          "  // Merge characters from word1 and word2 in alternating order.",
          "  return \"\";",
          "}",
        ].join("\n"),
        functionName: "mergeAlternately",
      },
      {
        language: "typescript",
        code: [
          "function mergeAlternately(word1: string, word2: string): string {",
          "  // Merge characters from word1 and word2 in alternating order.",
          "  return \"\";",
          "}",
        ].join("\n"),
        functionName: "mergeAlternately",
      },
      {
        language: "python",
        code: [
          "def merge_alternately(word1: str, word2: str) -> str:",
          "    # Merge characters from word1 and word2 in alternating order.",
          "    return \"\"",
        ].join("\n"),
        functionName: "merge_alternately",
      },
    ],
    hints: [
      {
        title: "Loop by index",
        body: "Use one index from 0 up to the longer string length; at each step append from word1 then word2 when in range.",
      },
      {
        title: "Handle unequal lengths",
        body: "After the shorter string ends, keep appending characters from the longer string without alternating.",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: [
          "function mergeAlternately(word1, word2) {",
          "  const parts = [];",
          "  const maxLen = Math.max(word1.length, word2.length);",
          "",
          "  for (let i = 0; i < maxLen; i += 1) {",
          "    if (i < word1.length) {",
          "      parts.push(word1[i]);",
          "    }",
          "    if (i < word2.length) {",
          "      parts.push(word2[i]);",
          "    }",
          "  }",
          "",
          "  return parts.join(\"\");",
          "}",
        ].join("\n"),
        explanation:
          "For each index, append word1[i] and word2[i] when present; joining handles leftover characters automatically.",
        timeComplexity: "O(n + m)",
        spaceComplexity: "O(n + m)",
      },
    ],
    testCases: [
      {
        input: '["abc","pqr"]',
        expectedOutput: '"apbqcr"',
        isSample: true,
      },
      {
        input: '["ab","pqrs"]',
        expectedOutput: '"apbqrs"',
        isSample: true,
      },
      {
        input: '["abcd","pq"]',
        expectedOutput: '"apbqcd"',
        isSample: true,
      },
      {
        input: '["a","b"]',
        expectedOutput: '"ab"',
        isSample: false,
      },
      {
        input: '["x","yz"]',
        expectedOutput: '"xyz"',
        isSample: false,
      },
    ],
  };
}
