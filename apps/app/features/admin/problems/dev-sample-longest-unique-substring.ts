import type { CreateProblemBody } from "../lib/create-problem-schema";

/** Deterministic copy for local testing; slug gets a unique suffix when applied. */
export function getDevSampleLongestUniqueSubstringProblem(): CreateProblemBody {
  const suffix = Date.now();

  return {
    title: "Longest Unique Substring (dev sample)",
    slug: `longest-unique-substring-dev-${suffix}`,
    difficulty: "easy",
    description:
      "Given a string, return the length of the longest substring that contains no repeated characters.",
    constraints:
      "0 <= str.length <= 5 * 10^4. str may contain letters, numbers, spaces, or symbols.",
    isPublished: false,

    patternSlug: "sliding-window",
    loopStructure: "for-with-inner-while",
    skillFocus:
      "Use a Set to track the current window. Expand with right, shrink with left when a duplicate appears.",
    tutorLevel: "pattern-rep",
    visualizationNotes:
      "right is the reader/expander. left is the shrinker/cleaner. Grow the window until a duplicate appears, then shrink from the left until the duplicate is removed.",
    editorial: "",

    tags: ["string", "set", "sliding-window", "two-pointers"],

    examples: [
      {
        input: 'str = "abcabcbb"',
        output: "3",
        explanation:
          'The longest substring without repeating characters is "abc".',
      },
      {
        input: 'str = "bbbbb"',
        output: "1",
        explanation:
          'The longest substring without repeating characters is "b".',
      },
      {
        input: 'str = "pwwkew"',
        output: "3",
        explanation:
          'The longest substring without repeating characters is "wke".',
      },
    ],

    starterCode: [
      {
        language: "javascript",
        code: [
          "function longestUnique(str) {",
          "  // Return the length of the longest substring with no repeated characters.",
          "}",
        ].join("\n"),
        functionName: "longestUnique",
      },
      {
        language: "typescript",
        code: [
          "function longestUnique(str: string): number {",
          "  // Return the length of the longest substring with no repeated characters.",
          "  return 0;",
          "}",
        ].join("\n"),
        functionName: "longestUnique",
      },
      {
        language: "python",
        code: [
          "def longest_unique(s: str) -> int:",
          "    # Return the length of the longest substring with no repeated characters.",
          "    return 0",
        ].join("\n"),
        functionName: "longest_unique",
      },
    ],

    hints: [
      {
        title: "Use a Set",
        body: "The Set should contain only the characters currently inside the window.",
      },
      {
        title: "right expands",
        body: "Use a for loop for right. Each step tries to add str[right] to the window.",
      },
      {
        title: "left shrinks",
        body: "If the Set already has str[right], the window is invalid. Delete str[left] and move left until the duplicate is gone.",
      },
      {
        title: "Measure the window",
        body: "After the window is valid, update longest with right - left + 1.",
      },
      {
        title: "Common mistake",
        body: "A Set is not indexed. Use set.delete(str[left]), not set.delete(set[left]).",
      },
    ],

    solutions: [
      {
        language: "javascript",
        code: [
          "function longestUnique(str) {",
          "  let left = 0;",
          "  let longest = 0;",
          "  const set = new Set();",
          "",
          "  for (let right = 0; right < str.length; right++) {",
          "    while (set.has(str[right])) {",
          "      set.delete(str[left]);",
          "      left++;",
          "    }",
          "",
          "    set.add(str[right]);",
          "    longest = Math.max(longest, right - left + 1);",
          "  }",
          "",
          "  return longest;",
          "}",
        ].join("\n"),
        explanation:
          "Use a sliding window. The right pointer expands the window by reading new characters. If the new character is already in the Set, shrink from the left until that duplicate is removed. Once the window is valid, update the longest length using right - left + 1.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
      },
    ],

    testCases: [
      {
        input: '["abcabcbb"]',
        expectedOutput: "3",
        isSample: true,
      },
      {
        input: '["bbbbb"]',
        expectedOutput: "1",
        isSample: true,
      },
      {
        input: '["pwwkew"]',
        expectedOutput: "3",
        isSample: true,
      },
      {
        input: '[""]',
        expectedOutput: "0",
        isSample: false,
      },
      {
        input: '["abcdef"]',
        expectedOutput: "6",
        isSample: false,
      },
      {
        input: '["abba"]',
        expectedOutput: "2",
        isSample: false,
      },
    ],
  };
}
