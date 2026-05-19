import type { CreateProblemBody } from "../lib/create-problem-schema";

/** Deterministic copy for local testing; slug gets a unique suffix when applied. */
export function getReverseVowelsProblem(): CreateProblemBody {
  const suffix = Date.now();

  return {
    title: "Reverse Vowels of a String",
    slug: `reverse-vowels-${suffix}`,
    difficulty: "easy",
    description:
      "Given a string s, reverse only the vowels in the string and return the result. The vowels are a, e, i, o, and u, and they may appear in either lowercase or uppercase. All other characters stay in place.",
    constraints:
      "1 <= s.length <= 3 * 10^5. s consists of printable ASCII characters.",
    isPublished: false,
    patternSlug: "two-pointers",
    loopStructure: "two-pointer-converge",
    skillFocus:
      "Scan from both ends with left and right pointers; swap vowels when both pointers land on vowels.",
    tutorLevel: "beginner",
    visualizationNotes:
      "Move left forward and right backward until each hits a vowel, swap them, then continue inward until the pointers meet.",
    editorial: { content: "", embeds: [] },
    tags: ["string", "two-pointers"],
    examples: [
      {
        input: 's = "hello"',
        output: '"holle"',
        explanation:
          "The vowels in hello are e and o. Reversing them gives holle.",
      },
      {
        input: 's = "leetcode"',
        output: '"leotcede"',
        explanation:
          "The vowels are e, e, o, and e. Reversing their order gives leotcede.",
      },
    ],
    starterCode: [
      {
        language: "javascript",
        code: [
          "function reverseVowels(s) {",
          "  // Reverse only the vowels in s and return the result.",
          "  return \"\";",
          "}",
        ].join("\n"),
        functionName: "reverseVowels",
      },
      {
        language: "typescript",
        code: [
          "function reverseVowels(s: string): string {",
          "  // Reverse only the vowels in s and return the result.",
          "  return \"\";",
          "}",
        ].join("\n"),
        functionName: "reverseVowels",
      },
      {
        language: "python",
        code: [
          "def reverse_vowels(s: str) -> str:",
          "    # Reverse only the vowels in s and return the result.",
          "    return \"\"",
        ].join("\n"),
        functionName: "reverse_vowels",
      },
    ],
    hints: [
      {
        title: "Identify vowels",
        body: "Treat a, e, i, o, u as vowels in either case. Consonants and other characters are skipped.",
      },
      {
        title: "Two pointers from both ends",
        body: "Advance left until it points at a vowel, retreat right until it points at a vowel, swap, then repeat while left < right.",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: [
          "function reverseVowels(s) {",
          "  const vowels = new Set([\"a\", \"e\", \"i\", \"o\", \"u\"]);",
          "  const chars = s.split(\"\");",
          "  let left = 0;",
          "  let right = chars.length - 1;",
          "",
          "  const isVowel = (ch) => vowels.has(ch.toLowerCase());",
          "",
          "  while (left < right) {",
          "    while (left < right && !isVowel(chars[left])) {",
          "      left += 1;",
          "    }",
          "    while (left < right && !isVowel(chars[right])) {",
          "      right -= 1;",
          "    }",
          "    if (left < right) {",
          "      const temp = chars[left];",
          "      chars[left] = chars[right];",
          "      chars[right] = temp;",
          "      left += 1;",
          "      right -= 1;",
          "    }",
          "  }",
          "",
          "  return chars.join(\"\");",
          "}",
        ].join("\n"),
        explanation:
          "Use two pointers from both ends. Skip non-vowels, swap when both point at vowels, and stop when the pointers cross.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
      },
    ],
    testCases: [
      {
        input: '["hello"]',
        expectedOutput: '"holle"',
        isSample: true,
      },
      {
        input: '["leetcode"]',
        expectedOutput: '"leotcede"',
        isSample: true,
      },
      {
        input: '["aA"]',
        expectedOutput: '"Aa"',
        isSample: false,
      },
      {
        input: '["race a car"]',
        expectedOutput: '"race a car"',
        isSample: false,
      },
      {
        input: '["."]',
        expectedOutput: '"."',
        isSample: false,
      },
    ],
  };
}
