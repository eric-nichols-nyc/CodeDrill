import type { CreateProblemBody } from "../lib/create-problem-schema";

/** Deterministic copy for local testing; slug gets a unique suffix when applied. */
export function getRemoveDuplicatesFromSortedArrayProblem(): CreateProblemBody {
  const suffix = Date.now();

  return {
    title: "Remove Duplicates from Sorted Array",
    slug: `remove-duplicates-from-sorted-array-${suffix}`,
    difficulty: "easy",
    description:
      "Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place so each unique element appears only once. Return k, the number of unique elements. The first k elements of nums should hold the unique values in order; the runner compares only the return value.",
    constraints:
      "1 <= nums.length <= 3 * 10^4. -100 <= nums[i] <= 100. nums is sorted in non-decreasing order.",
    isPublished: false,
    patternSlug: "two-pointers",
    loopStructure: "single-pass-write-index",
    skillFocus:
      "Use a write index k; when nums[i] differs from the last unique value, copy it forward and advance k.",
    tutorLevel: "beginner",
    visualizationNotes:
      "Keep k at the end of the unique prefix. Compare nums[i] to nums[k - 1]; copy forward only on a new value.",
    editorial: { content: "", embeds: [] },
    tags: ["array", "two-pointers"],
    examples: [
      {
        input: "nums = [1,1,2]",
        output: "2",
        explanation:
          "Unique values are 1 and 2, so return 2. nums becomes [1,2,_] in-place.",
      },
      {
        input: "nums = [0,0,1,1,1,2,2,3,3,4]",
        output: "5",
        explanation:
          "Unique values are 0, 1, 2, 3, 4 — five elements, so return 5.",
      },
    ],
    starterCode: [
      {
        language: "javascript",
        code: [
          "function removeDuplicates(nums) {",
          "  // Return k, the count of unique elements at the front of nums.",
          "  return 0;",
          "}",
        ].join("\n"),
        functionName: "removeDuplicates",
      },
      {
        language: "typescript",
        code: [
          "function removeDuplicates(nums: number[]): number {",
          "  // Return k, the count of unique elements at the front of nums.",
          "  return 0;",
          "}",
        ].join("\n"),
        functionName: "removeDuplicates",
      },
      {
        language: "python",
        code: [
          "def remove_duplicates(nums: list[int]) -> int:",
          "    # Return k, the count of unique elements at the front of nums.",
          "    return 0",
        ].join("\n"),
        functionName: "remove_duplicates",
      },
    ],
    hints: [
      {
        title: "Sorted means duplicates are adjacent",
        body: "You only need to compare each element with the last unique value you kept.",
      },
      {
        title: "Track the write position",
        body: "Use index k for the next unique slot; start with k = 1 when nums is non-empty.",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: [
          "function removeDuplicates(nums) {",
          "  if (nums.length === 0) return 0;",
          "",
          "  let k = 1;",
          "",
          "  for (let i = 1; i < nums.length; i += 1) {",
          "    if (nums[i] !== nums[k - 1]) {",
          "      nums[k] = nums[i];",
          "      k += 1;",
          "    }",
          "  }",
          "",
          "  return k;",
          "}",
        ].join("\n"),
        explanation:
          "Walk with i from 1. Whenever nums[i] is new compared to nums[k - 1], write it at k and increment k.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
      },
    ],
    testCases: [
      {
        input: "[[1,1,2]]",
        expectedOutput: "2",
        isSample: true,
      },
      {
        input: "[[0,0,1,1,1,2,2,3,3,4]]",
        expectedOutput: "5",
        isSample: true,
      },
      {
        input: "[[1]]",
        expectedOutput: "1",
        isSample: false,
      },
      {
        input: "[[1,2,3]]",
        expectedOutput: "3",
        isSample: false,
      },
      {
        input: "[[2,2,2,2]]",
        expectedOutput: "1",
        isSample: false,
      },
    ],
  };
}
