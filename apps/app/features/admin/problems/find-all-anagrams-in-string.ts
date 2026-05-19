import type { CreateProblemBody } from "../lib/create-problem-schema";

/** Deterministic copy for local testing; slug gets a unique suffix when applied. */
export function getFindAllAnagramsInStringProblem(): CreateProblemBody {
  const suffix = Date.now();

  return {
    title: "Find All Anagrams in a String",
    slug: `find-all-anagrams-in-string-${suffix}`,
    difficulty: "medium",
    description:
      "Given two strings s and p, return an array of all the start indices of p's anagrams in s. You may return the answer in any order.",
    constraints:
      "1 <= s.length, p.length <= 3 * 10^4. s and p consist of lowercase English letters.",
    isPublished: false,
    patternSlug: "sliding-window",
    loopStructure: "fixed-window-frequency",
    skillFocus:
      "Slide a window of p.length over s; when character frequencies match p, record the window start index.",
    tutorLevel: "pattern-rep",
    visualizationNotes:
      "Same fixed-window frequency pattern as permutation in string; collect start indices instead of returning true.",
    editorial: { content: "", embeds: [] },
    tags: ["string", "hash-table", "sliding-window"],
    examples: [
      {
        input: 's = "cbaebabacd", p = "abc"',
        output: "[0,6]",
        explanation: 'Anagrams of "abc" start at index 0 ("cba") and index 6 ("bac").',
      },
      {
        input: 's = "abab", p = "ab"',
        output: "[0,1,2]",
        explanation: 'Anagrams of "ab" start at indices 0, 1, and 2.',
      },
    ],
    starterCode: [
      {
        language: "javascript",
        code: [
          "function findAnagrams(s, p) {",
          "  // Return start indices of all anagrams of p in s.",
          "  return [];",
          "}",
        ].join("\n"),
        functionName: "findAnagrams",
      },
      {
        language: "typescript",
        code: [
          "function findAnagrams(s: string, p: string): number[] {",
          "  // Return start indices of all anagrams of p in s.",
          "  return [];",
          "}",
        ].join("\n"),
        functionName: "findAnagrams",
      },
      {
        language: "python",
        code: [
          "def find_anagrams(s: str, p: str) -> list[int]:",
          "    # Return start indices of all anagrams of p in s.",
          "    return []",
        ].join("\n"),
        functionName: "find_anagrams",
      },
    ],
    hints: [
      {
        title: "Fixed window size",
        body: "Only substrings with length p.length can be anagrams of p.",
      },
      {
        title: "Reuse permutation logic",
        body: "Track frequency matches as the window slides; push the left index when all counts match.",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: [
          "function findAnagrams(s, p) {",
          "  if (p.length > s.length) {",
          "    return [];",
          "  }",
          "",
          "  const result = [];",
          "  const need = new Array(26).fill(0);",
          "  const window = new Array(26).fill(0);",
          "",
          "  for (let i = 0; i < p.length; i += 1) {",
          "    need[p.charCodeAt(i) - 97] += 1;",
          "  }",
          "",
          "  let matches = 0;",
          "  for (let i = 0; i < 26; i += 1) {",
          "    if (need[i] === 0) {",
          "      matches += 1;",
          "    }",
          "  }",
          "",
          "  const addChar = (ch) => {",
          "    const idx = ch.charCodeAt(0) - 97;",
          "    window[idx] += 1;",
          "    if (window[idx] === need[idx]) {",
          "      matches += 1;",
          "    } else if (window[idx] === need[idx] + 1) {",
          "      matches -= 1;",
          "    }",
          "  };",
          "",
          "  const removeChar = (ch) => {",
          "    const idx = ch.charCodeAt(0) - 97;",
          "    window[idx] -= 1;",
          "    if (window[idx] === need[idx]) {",
          "      matches += 1;",
          "    } else if (window[idx] === need[idx] - 1) {",
          "      matches -= 1;",
          "    }",
          "  };",
          "",
          "  for (let right = 0; right < s.length; right += 1) {",
          "    addChar(s[right]);",
          "    const left = right - p.length + 1;",
          "    if (left < 0) {",
          "      continue;",
          "    }",
          "    if (matches === 26) {",
          "      result.push(left);",
          "    }",
          "    removeChar(s[left]);",
          "  }",
          "",
          "  return result;",
          "}",
        ].join("\n"),
        explanation:
          "Slide a fixed-length window and record each start index where letter frequencies match p.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
      },
    ],
    testCases: [
      {
        input: '[["cbaebabacd","abc"]]',
        expectedOutput: "[0,6]",
        isSample: true,
      },
      {
        input: '[["abab","ab"]]',
        expectedOutput: "[0,1,2]",
        isSample: true,
      },
      {
        input: '[["baa","aa"]]',
        expectedOutput: "[1]",
        isSample: false,
      },
      {
        input: '[["aaaaaaa","aaa"]]',
        expectedOutput: "[0,1,2,3,4]",
        isSample: false,
      },
    ],
  };
}
