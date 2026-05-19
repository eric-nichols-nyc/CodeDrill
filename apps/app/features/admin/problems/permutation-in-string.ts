import type { CreateProblemBody } from "../lib/create-problem-schema";

/** Deterministic copy for local testing; slug gets a unique suffix when applied. */
export function getPermutationInStringProblem(): CreateProblemBody {
  const suffix = Date.now();

  return {
    title: "Permutation in String",
    slug: `permutation-in-string-${suffix}`,
    difficulty: "medium",
    description:
      "Given two strings s1 and s2, return true if s2 contains a permutation of s1. Otherwise return false. In other words, return whether some substring of s2 with length s1.length is an anagram of s1.",
    constraints:
      "1 <= s1.length, s2.length <= 10^4. s1 and s2 consist of lowercase English letters.",
    isPublished: false,
    patternSlug: "sliding-window",
    loopStructure: "fixed-window-frequency",
    skillFocus:
      "Slide a window of s1.length over s2; maintain character counts and check whether the window matches s1's frequency map.",
    tutorLevel: "pattern-rep",
    visualizationNotes:
      "Build counts for s1; slide a fixed window on s2, adding the char entering and removing the char leaving; compare matches count.",
    editorial: { content: "", embeds: [] },
    tags: ["string", "hash-table", "sliding-window"],
    examples: [
      {
        input: 's1 = "ab", s2 = "eidbaooo"',
        output: "true",
        explanation: 's2 contains "ba", a permutation of "ab".',
      },
      {
        input: 's1 = "ab", s2 = "eidboaoo"',
        output: "false",
        explanation: "No length-2 substring of s2 is an anagram of ab.",
      },
    ],
    starterCode: [
      {
        language: "javascript",
        code: [
          "function checkInclusion(s1, s2) {",
          "  // Return true if s2 contains a permutation of s1.",
          "  return false;",
          "}",
        ].join("\n"),
        functionName: "checkInclusion",
      },
      {
        language: "typescript",
        code: [
          "function checkInclusion(s1: string, s2: string): boolean {",
          "  // Return true if s2 contains a permutation of s1.",
          "  return false;",
          "}",
        ].join("\n"),
        functionName: "checkInclusion",
      },
      {
        language: "python",
        code: [
          "def check_inclusion(s1: str, s2: str) -> bool:",
          "    # Return True if s2 contains a permutation of s1.",
          "    return False",
        ].join("\n"),
        functionName: "check_inclusion",
      },
    ],
    hints: [
      {
        title: "Window size",
        body: "Only substrings with length s1.length can be permutations of s1.",
      },
      {
        title: "Frequency map",
        body: "Compare character counts in the window to counts in s1 instead of sorting every window.",
      },
      {
        title: "Slide efficiently",
        body: "Add s2[right] when the window grows; remove s2[left] when it slides forward.",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: [
          "function checkInclusion(s1, s2) {",
          "  if (s1.length > s2.length) {",
          "    return false;",
          "  }",
          "",
          "  const need = new Array(26).fill(0);",
          "  const window = new Array(26).fill(0);",
          "",
          "  for (let i = 0; i < s1.length; i += 1) {",
          "    need[s1.charCodeAt(i) - 97] += 1;",
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
          "  for (let right = 0; right < s2.length; right += 1) {",
          "    addChar(s2[right]);",
          "    const left = right - s1.length + 1;",
          "    if (left < 0) {",
          "      continue;",
          "    }",
          "    if (matches === 26) {",
          "      return true;",
          "    }",
          "    removeChar(s2[left]);",
          "  }",
          "",
          "  return false;",
          "}",
        ].join("\n"),
        explanation:
          "Track how many letter frequencies match between the window and s1; slide a fixed-length window across s2.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
      },
    ],
    testCases: [
      {
        input: '[["ab","eidbaooo"]]',
        expectedOutput: "true",
        isSample: true,
      },
      {
        input: '[["ab","eidboaoo"]]',
        expectedOutput: "false",
        isSample: true,
      },
      {
        input: '[["a","ab"]]',
        expectedOutput: "true",
        isSample: false,
      },
      {
        input: '[["adc","dcda"]]',
        expectedOutput: "true",
        isSample: false,
      },
      {
        input: '[["hello","ooolleoooleh"]]',
        expectedOutput: "false",
        isSample: false,
      },
    ],
  };
}
