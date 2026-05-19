import type { CreateProblemBody } from "../lib/create-problem-schema";

/** Deterministic copy for local testing; slug gets a unique suffix when applied. */
export function getHasPairSumProblem(): CreateProblemBody {
  const suffix = Date.now();

  return {
    title: "Has Pair With Sum",
    slug: `has-pair-sum-${suffix}`,
    difficulty: "easy",
    description:
      "Given a sorted array of integers arr and an integer target, return true if there exist two distinct indices i and j such that arr[i] + arr[j] === target. Otherwise return false. You may assume arr is sorted in non-decreasing order.",
    constraints:
      "2 <= arr.length <= 10^4. -10^4 <= arr[i], target <= 10^4. arr is sorted in non-decreasing order.",
    isPublished: false,
    patternSlug: "two-pointers",
    loopStructure: "opposite-ends",
    skillFocus:
      "Use left and right pointers at both ends; move the pointer that makes the sum too large or too small.",
    tutorLevel: "beginner",
    visualizationNotes:
      "If the sum is too big, shrink from the right; if too small, advance from the left.",
    editorial: { content: "", embeds: [] },
    tags: ["array", "two-pointers"],
    examples: [
      {
        input: "arr = [1, 2, 3, 4, 6], target = 6",
        output: "true",
        explanation: "2 + 4 = 6, so a pair exists.",
      },
      {
        input: "arr = [1, 2, 3, 4, 5], target = 10",
        output: "false",
        explanation: "No two values in the array sum to 10.",
      },
    ],
    starterCode: [
      {
        language: "javascript",
        code: [
          "function hasPairSum(arr, target) {",
          "  // Return true if any two distinct elements sum to target.",
          "  return false;",
          "}",
        ].join("\n"),
        functionName: "hasPairSum",
      },
      {
        language: "typescript",
        code: [
          "function hasPairSum(arr: number[], target: number): boolean {",
          "  // Return true if any two distinct elements sum to target.",
          "  return false;",
          "}",
        ].join("\n"),
        functionName: "hasPairSum",
      },
      {
        language: "python",
        code: [
          "def has_pair_sum(arr: list[int], target: int) -> bool:",
          "    # Return True if any two distinct elements sum to target.",
          "    return False",
        ].join("\n"),
        functionName: "has_pair_sum",
      },
    ],
    hints: [
      {
        title: "Start at both ends",
        body: "Put left at index 0 and right at the last index.",
      },
      {
        title: "Move one pointer",
        body: "If the sum is greater than target, decrement right; if less, increment left.",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: [
          "function hasPairSum(arr, target) {",
          "  let left = 0;",
          "  let right = arr.length - 1;",
          "",
          "  while (left < right) {",
          "    if (arr[left] + arr[right] === target) {",
          "      return true;",
          "    }",
          "    if (arr[left] + arr[right] > target) {",
          "      right -= 1;",
          "    } else {",
          "      left += 1;",
          "    }",
          "  }",
          "",
          "  return false;",
          "}",
        ].join("\n"),
        explanation:
          "Opposite-end two pointers on a sorted array: shrink the sum from the right when too large, grow from the left when too small.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
      },
    ],
    testCases: [
      {
        input: "[[1,2,3,4,6],6]",
        expectedOutput: "true",
        isSample: true,
      },
      {
        input: "[[1,2,3,4,5],10]",
        expectedOutput: "false",
        isSample: true,
      },
      {
        input: "[[2,7,11,15],9]",
        expectedOutput: "true",
        isSample: false,
      },
      {
        input: "[[1,2],3]",
        expectedOutput: "true",
        isSample: false,
      },
      {
        input: "[[1,2],4]",
        expectedOutput: "false",
        isSample: false,
      },
    ],
  };
}
