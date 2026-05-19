import type { CreateProblemBody } from "../lib/create-problem-schema";

/** Deterministic copy for local testing; slug gets a unique suffix when applied. */
export function getContainsDuplicateProblem(): CreateProblemBody {
  const suffix = Date.now();

  return {
    title: "Contains Duplicate",
    slug: `contains-duplicate-${suffix}`,
    difficulty: "easy",
    description:
      "Given an integer array nums, return true if any value appears at least twice in the array. Otherwise return false.",
    constraints:
      "1 <= nums.length <= 10^5. -10^9 <= nums[i] <= 10^9.",
    isPublished: false,
    patternSlug: "hash-set",
    loopStructure: "single-pass-seen-set",
    skillFocus:
      "Walk once; if nums[i] is already in a set, return true; otherwise add nums[i] to the set.",
    tutorLevel: "beginner",
    visualizationNotes:
      "At each index, ask whether you have seen this value before. If yes, duplicate exists.",
    editorial: { content: "", embeds: [] },
    tags: ["array", "hash-table"],
    examples: [
      {
        input: "nums = [1,2,3,1]",
        output: "true",
        explanation: "1 appears at indices 0 and 3.",
      },
      {
        input: "nums = [1,2,3,4]",
        output: "false",
        explanation: "All values are distinct.",
      },
    ],
    starterCode: [
      {
        language: "javascript",
        code: [
          "function containsDuplicate(nums) {",
          "  // Return true if any value appears at least twice.",
          "  return false;",
          "}",
        ].join("\n"),
        functionName: "containsDuplicate",
      },
      {
        language: "typescript",
        code: [
          "function containsDuplicate(nums: number[]): boolean {",
          "  // Return true if any value appears at least twice.",
          "  return false;",
          "}",
        ].join("\n"),
        functionName: "containsDuplicate",
      },
      {
        language: "python",
        code: [
          "def contains_duplicate(nums: list[int]) -> bool:",
          "    # Return True if any value appears at least twice.",
          "    return False",
        ].join("\n"),
        functionName: "contains_duplicate",
      },
    ],
    hints: [
      {
        title: "What are you tracking?",
        body: "A set of values you have already seen while scanning left to right.",
      },
      {
        title: "When to return early",
        body: "Before adding nums[i], check whether it is already in the set.",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: [
          "function containsDuplicate(nums) {",
          "  const seen = new Set();",
          "",
          "  for (let i = 0; i < nums.length; i += 1) {",
          "    const value = nums[i];",
          "    if (seen.has(value)) {",
          "      return true;",
          "    }",
          "    seen.add(value);",
          "  }",
          "",
          "  return false;",
          "}",
        ].join("\n"),
        explanation:
          "One pass with a set: if a value was seen before, return true; otherwise record it.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
      },
    ],
    testCases: [
      {
        input: "[[1,2,3,1]]",
        expectedOutput: "true",
        isSample: true,
      },
      {
        input: "[[1,2,3,4]]",
        expectedOutput: "false",
        isSample: true,
      },
      {
        input: "[[1,1,1,3,3,4,3,2,4,2]]",
        expectedOutput: "true",
        isSample: false,
      },
      {
        input: "[[1]]",
        expectedOutput: "false",
        isSample: false,
      },
      {
        input: "[[-1,-1]]",
        expectedOutput: "true",
        isSample: false,
      },
    ],
  };
}
