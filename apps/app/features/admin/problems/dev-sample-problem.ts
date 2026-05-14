import type { CreateProblemBody } from "../lib/create-problem-schema";

/** Deterministic copy for local testing; slug gets a unique suffix when applied. */
export function getDevSampleProblem(): CreateProblemBody {
  const suffix = Date.now();
  return {
    title: "Two Sum (dev sample)",
    slug: `two-sum-dev-${suffix}`,
    difficulty: "easy",
    description:
      "Given an integer array nums and an integer target, return the indices of the two distinct elements such that they add up to target. If there is exactly one valid answer, return it. You may not use the same element twice.",
    constraints:
      "2 <= nums.length <= 10^4. -10^9 <= nums[i] <= 10^9. -10^9 <= target <= 10^9. Exactly one valid answer exists.",
    isPublished: false,
    patternSlug: "hash-map",
    loopStructure: "single-pass-with-map",
    skillFocus: "Store complement target - nums[i] in a map keyed by value.",
    tutorLevel: "beginner",
    visualizationNotes:
      "Walk the array once; for each value v, check whether (target - v) was seen. If yes, return both indices.",
    editorial: {
      content: "",
      embeds: [{ type: "youtube", videoId: "KLlXCFG5TnA" }],
    },
    tags: ["array", "hash-table"],
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "nums[0] + nums[1] equals 9.",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "nums[1] + nums[2] equals 6.",
      },
    ],
    starterCode: [
      {
        language: "javascript",
        code: [
          "function twoSum(nums, target) {",
          "  // Return the two indices whose values add up to target.",
          "  return [];",
          "}",
        ].join("\n"),
        functionName: "twoSum",
      },
      {
        language: "typescript",
        code: [
          "function twoSum(nums: number[], target: number): number[] {",
          "  // Return the two indices whose values add up to target.",
          "  return [];",
          "}",
        ].join("\n"),
        functionName: "twoSum",
      },
      {
        language: "python",
        code: [
          "def two_sum(nums: list[int], target: int) -> list[int]:",
          "    # Return the two indices whose values add up to target.",
          "    return []",
        ].join("\n"),
        functionName: "two_sum",
      },
    ],
    hints: [
      {
        title: "Use a lookup map",
        body: "As you scan the array, store each value you have seen and the index where you saw it.",
      },
      {
        title: "Think in complements",
        body: "For each number x, ask whether target - x has already appeared.",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: [
          "function twoSum(nums, target) {",
          "  const seen = new Map();",
          "  for (let i = 0; i < nums.length; i += 1) {",
          "    const complement = target - nums[i];",
          "    if (seen.has(complement)) {",
          "      return [seen.get(complement), i];",
          "    }",
          "    seen.set(nums[i], i);",
          "  }",
          "  return [];",
          "}",
        ].join("\n"),
        explanation:
          "Scan the array once, storing each value in a map. For each number, check whether its complement has already appeared.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
      },
    ],
    testCases: [
      {
        input: "[[2,7,11,15],9]",
        expectedOutput: "[0,1]",
        isSample: true,
      },
      {
        input: "[[3,2,4],6]",
        expectedOutput: "[1,2]",
        isSample: true,
      },
      {
        input: "[[3,3],6]",
        expectedOutput: "[0,1]",
        isSample: false,
      },
    ],
  };
}
