import type { CreateProblemBody } from "../lib/create-problem-schema";

/** Deterministic copy for local testing; slug gets a unique suffix when applied. */
export function getValidAnagramProblem(): CreateProblemBody {
  const suffix = Date.now();

  return {
    title: "Valid Anagram",
    slug: `valid-anagram-${suffix}`,
    difficulty: "easy",
    description:
      "Given two strings s and t, return true if t is an anagram of s. Otherwise return false. An anagram uses the same characters with the same frequencies.",
    constraints:
      "1 <= s.length, t.length <= 5 * 10^4. s and t consist of lowercase English letters.",
    isPublished: false,
    patternSlug: "hash-map",
    loopStructure: "frequency-map-compare",
    skillFocus:
      "Count characters in s; decrement counts for each character in t; any negative count means not an anagram.",
    tutorLevel: "beginner",
    visualizationNotes:
      "Build a frequency map from s, then walk t and subtract. If lengths differ, return false immediately.",
    editorial: { content: "", embeds: [] },
    tags: ["string", "hash-table"],
    examples: [
      {
        input: 's = "anagram", t = "nagaram"',
        output: "true",
        explanation: "Both strings use a, n, a, g, r, a, m with the same counts.",
      },
      {
        input: 's = "rat", t = "car"',
        output: "false",
        explanation: "Different character sets (t has c, s does not).",
      },
    ],
    starterCode: [
      {
        language: "javascript",
        code: [
          "function isAnagram(s, t) {",
          "  // Return true if t is an anagram of s.",
          "  return false;",
          "}",
        ].join("\n"),
        functionName: "isAnagram",
      },
      {
        language: "typescript",
        code: [
          "function isAnagram(s: string, t: string): boolean {",
          "  // Return true if t is an anagram of s.",
          "  return false;",
          "}",
        ].join("\n"),
        functionName: "isAnagram",
      },
      {
        language: "python",
        code: [
          "def is_anagram(s: str, t: str) -> bool:",
          "    # Return True if t is an anagram of s.",
          "    return False",
        ].join("\n"),
        functionName: "is_anagram",
      },
    ],
    hints: [
      {
        title: "Quick length check",
        body: "If s.length !== t.length, they cannot be anagrams.",
      },
      {
        title: "Frequency map",
        body: "Increment counts while scanning s; decrement while scanning t. A negative count means mismatch.",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: [
          "function isAnagram(s, t) {",
          "  if (s.length !== t.length) {",
          "    return false;",
          "  }",
          "",
          "  const counts = {};",
          "",
          "  for (let i = 0; i < s.length; i += 1) {",
          "    const ch = s[i];",
          "    counts[ch] = (counts[ch] ?? 0) + 1;",
          "  }",
          "",
          "  for (let i = 0; i < t.length; i += 1) {",
          "    const ch = t[i];",
          "    if (!counts[ch]) {",
          "      return false;",
          "    }",
          "    counts[ch] -= 1;",
          "  }",
          "",
          "  return true;",
          "}",
        ].join("\n"),
        explanation:
          "Count characters in s, then consume counts with t. Any missing or extra character in t returns false.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
      },
    ],
    testCases: [
      {
        input: '[["anagram","nagaram"]]',
        expectedOutput: "true",
        isSample: true,
      },
      {
        input: '[["rat","car"]]',
        expectedOutput: "false",
        isSample: true,
      },
      {
        input: '[["a","ab"]]',
        expectedOutput: "false",
        isSample: false,
      },
      {
        input: '[["a","a"]]',
        expectedOutput: "true",
        isSample: false,
      },
      {
        input: '[["aab","aba"]]',
        expectedOutput: "true",
        isSample: false,
      },
    ],
  };
}
