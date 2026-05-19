import type { CreateProblemBody } from "../lib/create-problem-schema";

/** Deterministic copy for local testing; slug gets a unique suffix when applied. */
export function getThreeSumProblem(): CreateProblemBody {
  const suffix = Date.now();

  return {
    title: "3Sum",
    slug: `three-sum-${suffix}`,
    difficulty: "medium",
    description:
      "Given an integer array nums, return all unique triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, j != k, and nums[i] + nums[j] + nums[k] === 0. The solution set must not contain duplicate triplets.",
    constraints:
      "3 <= nums.length <= 3000. -10^5 <= nums[i] <= 10^5.",
    isPublished: false,
    patternSlug: "two-pointers",
    loopStructure: "sort-then-opposite-ends",
    skillFocus:
      "Sort nums; fix index i, run opposite-ends on i+1..end; skip duplicate values for i, left, and right.",
    tutorLevel: "pattern-rep",
    visualizationNotes:
      "Outer loop picks the first value; inner two pointers find pairs that complete the zero sum, like has-pair-sum on a sorted slice.",
    editorial: { content: "", embeds: [] },
    tags: ["array", "two-pointers", "sorting"],
    examples: [
      {
        input: "nums = [-1,0,1,2,-1,-4]",
        output: "[[-1,-1,2],[-1,0,1]]",
        explanation:
          "The distinct triplets that sum to zero are (-1, -1, 2) and (-1, 0, 1).",
      },
      {
        input: "nums = [0,1,1]",
        output: "[]",
        explanation: "No triplet sums to zero.",
      },
      {
        input: "nums = [0,0,0]",
        output: "[[0,0,0]]",
        explanation: "The only triplet is three zeros.",
      },
    ],
    starterCode: [
      {
        language: "javascript",
        code: [
          "function threeSum(nums) {",
          "  // Return all unique triplets that sum to zero.",
          "  return [];",
          "}",
        ].join("\n"),
        functionName: "threeSum",
      },
      {
        language: "typescript",
        code: [
          "function threeSum(nums: number[]): number[][] {",
          "  // Return all unique triplets that sum to zero.",
          "  return [];",
          "}",
        ].join("\n"),
        functionName: "threeSum",
      },
      {
        language: "python",
        code: [
          "def three_sum(nums: list[int]) -> list[list[int]]:",
          "    # Return all unique triplets that sum to zero.",
          "    return []",
        ].join("\n"),
        functionName: "three_sum",
      },
    ],
    hints: [
      {
        title: "Sort first",
        body: "Sorting makes duplicate skipping and the two-pointer scan straightforward.",
      },
      {
        title: "Fix i, scan the rest",
        body: "For each i, set left = i + 1 and right = end. If the sum is too small, move left; if too large, move right.",
      },
      {
        title: "Skip duplicates",
        body: "After recording a triplet, advance left/right past equal values; also skip repeated nums[i] in the outer loop.",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: [
          "function threeSum(nums) {",
          "  const result = [];",
          "  nums.sort((a, b) => a - b);",
          "",
          "  for (let i = 0; i < nums.length - 2; i += 1) {",
          "    if (i > 0 && nums[i] === nums[i - 1]) {",
          "      continue;",
          "    }",
          "",
          "    let left = i + 1;",
          "    let right = nums.length - 1;",
          "",
          "    while (left < right) {",
          "      const sum = nums[i] + nums[left] + nums[right];",
          "",
          "      if (sum === 0) {",
          "        result.push([nums[i], nums[left], nums[right]]);",
          "        left += 1;",
          "        right -= 1;",
          "        while (left < right && nums[left] === nums[left - 1]) {",
          "          left += 1;",
          "        }",
          "        while (left < right && nums[right] === nums[right + 1]) {",
          "          right -= 1;",
          "        }",
          "      } else if (sum < 0) {",
          "        left += 1;",
          "      } else {",
          "        right -= 1;",
          "      }",
          "    }",
          "  }",
          "",
          "  return result;",
          "}",
        ].join("\n"),
        explanation:
          "Sort, fix one index, and use opposite-ends on the remainder. Skip duplicates at each level to avoid repeated triplets.",
        timeComplexity: "O(n^2)",
        spaceComplexity: "O(1) excluding output",
      },
    ],
    testCases: [
      {
        input: "[[-1,0,1,2,-1,-4]]",
        expectedOutput: "[[-1,-1,2],[-1,0,1]]",
        isSample: true,
      },
      {
        input: "[[0,1,1]]",
        expectedOutput: "[]",
        isSample: true,
      },
      {
        input: "[[0,0,0]]",
        expectedOutput: "[[0,0,0]]",
        isSample: true,
      },
      {
        input: "[[-2,0,1,1,2]]",
        expectedOutput: "[[-2,0,2],[-2,1,1]]",
        isSample: false,
      },
      {
        input: "[[1,2,-2,-1]]",
        expectedOutput: "[]",
        isSample: false,
      },
    ],
  };
}
