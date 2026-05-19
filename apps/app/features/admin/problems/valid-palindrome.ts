import type { CreateProblemBody } from "../lib/create-problem-schema";

/** Deterministic copy for local testing; slug gets a unique suffix when applied. */
export function getValidPalindromeProblem(): CreateProblemBody {
  const suffix = Date.now();

  return {
    title: "Valid Palindrome",
    slug: `valid-palindrome-${suffix}`,
    difficulty: "easy",
    description:
      "Given a string s, return true if it is a palindrome after considering only alphanumeric characters and ignoring cases. Otherwise return false.",
    constraints:
      "1 <= s.length <= 2 * 10^5. s consists of printable ASCII characters.",
    isPublished: false,
    patternSlug: "two-pointers",
    loopStructure: "two-pointer-converge",
    skillFocus:
      "Use left and right pointers; skip non-alphanumeric characters; compare lowercase letters inward.",
    tutorLevel: "beginner",
    visualizationNotes:
      "Move left forward and right backward until both point at alphanumeric chars, compare, then continue while left < right.",
    editorial: { content: "", embeds: [] },
    tags: ["string", "two-pointers"],
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: "true",
        explanation:
          "After ignoring non-alphanumeric characters, reads amanaplanacanalpanama forward and backward.",
      },
      {
        input: 's = "race a car"',
        output: "false",
        explanation: "Reads raceacar forward but racaecar backward.",
      },
    ],
    starterCode: [
      {
        language: "javascript",
        code: [
          "function isPalindrome(s) {",
          "  // Return true if s is a palindrome (alphanumeric only, case-insensitive).",
          "  return false;",
          "}",
        ].join("\n"),
        functionName: "isPalindrome",
      },
      {
        language: "typescript",
        code: [
          "function isPalindrome(s: string): boolean {",
          "  // Return true if s is a palindrome (alphanumeric only, case-insensitive).",
          "  return false;",
          "}",
        ].join("\n"),
        functionName: "isPalindrome",
      },
      {
        language: "python",
        code: [
          "def is_palindrome(s: str) -> bool:",
          "    # Return True if s is a palindrome (alphanumeric only, case-insensitive).",
          "    return False",
        ].join("\n"),
        functionName: "is_palindrome",
      },
    ],
    hints: [
      {
        title: "What counts as a character?",
        body: "Only letters and digits matter; spaces and punctuation are skipped.",
      },
      {
        title: "Two pointers from both ends",
        body: "Advance left and retreat right until each lands on an alphanumeric character, then compare in lowercase.",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: [
          "function isPalindrome(s) {",
          "  const isAlphaNum = (ch) => {",
          "    const code = ch.charCodeAt(0);",
          "    const isDigit = code >= 48 && code <= 57;",
          "    const isLower = code >= 97 && code <= 122;",
          "    const isUpper = code >= 65 && code <= 90;",
          "    return isDigit || isLower || isUpper;",
          "  };",
          "",
          "  let left = 0;",
          "  let right = s.length - 1;",
          "",
          "  while (left < right) {",
          "    while (left < right && !isAlphaNum(s[left])) {",
          "      left += 1;",
          "    }",
          "    while (left < right && !isAlphaNum(s[right])) {",
          "      right -= 1;",
          "    }",
          "    if (s[left].toLowerCase() !== s[right].toLowerCase()) {",
          "      return false;",
          "    }",
          "    left += 1;",
          "    right -= 1;",
          "  }",
          "",
          "  return true;",
          "}",
        ].join("\n"),
        explanation:
          "Converging pointers skip non-alphanumeric characters and compare lowercase letters until they cross.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
      },
    ],
    testCases: [
      {
        input: '["A man, a plan, a canal: Panama"]',
        expectedOutput: "true",
        isSample: true,
      },
      {
        input: '["race a car"]',
        expectedOutput: "false",
        isSample: true,
      },
      {
        input: '[""]',
        expectedOutput: "true",
        isSample: false,
      },
      {
        input: '["0P"]',
        expectedOutput: "false",
        isSample: false,
      },
      {
        input: '["a."]',
        expectedOutput: "true",
        isSample: false,
      },
    ],
  };
}
