import type { CreateProblemBody } from "../lib/create-problem-schema";

/** Deterministic copy for local testing; slug gets a unique suffix when applied. */
export function getMaxSumSubarrayProblem(): CreateProblemBody {
  const suffix = Date.now();

  return {
    title: "Maximum Sum Subarray of Size K",
    slug: `max-sum-subarray-${suffix}`,
    difficulty: "easy",
    description:
      "Given an integer array arr and a positive integer k, return the maximum sum of any contiguous subarray of length k.",
    constraints:
      "1 <= k <= arr.length <= 10^5. -10^4 <= arr[i] <= 10^4.",
    isPublished: false,
    patternSlug: "sliding-window",
    loopStructure: "fixed-window-sum",
    skillFocus:
      "Build the sum of the first window, then slide by adding the next element and subtracting the one that left the window.",
    tutorLevel: "beginner",
    visualizationNotes:
      "Keep windowSum for the current k-length window; at each step add arr[i] and remove arr[i - k], then update maxSum.",
    editorial: { content: "", embeds: [] },
    tags: ["array", "sliding-window"],
    examples: [
      {
        input: "arr = [1, 2, 3, 4, 5], k = 2",
        output: "9",
        explanation:
          "Subarrays of length 2: [1,2]=3, [2,3]=5, [3,4]=7, [4,5]=9. The maximum is 9.",
      },
      {
        input: "arr = [2, 1, 5, 1, 3, 2], k = 3",
        output: "9",
        explanation:
          "The window [5, 1, 3] has sum 9, which is the largest length-3 sum.",
      },
    ],
    starterCode: [
      {
        language: "javascript",
        code: [
          "function maxSumSubarray(arr, k) {",
          "  // Return the max sum of any contiguous subarray of length k.",
          "  return 0;",
          "}",
        ].join("\n"),
        functionName: "maxSumSubarray",
      },
      {
        language: "typescript",
        code: [
          "function maxSumSubarray(arr: number[], k: number): number {",
          "  // Return the max sum of any contiguous subarray of length k.",
          "  return 0;",
          "}",
        ].join("\n"),
        functionName: "maxSumSubarray",
      },
      {
        language: "python",
        code: [
          "def max_sum_subarray(arr: list[int], k: int) -> int:",
          "    # Return the max sum of any contiguous subarray of length k.",
          "    return 0",
        ].join("\n"),
        functionName: "max_sum_subarray",
      },
    ],
    hints: [
      {
        title: "Seed the first window",
        body: "Sum the first k elements before you start sliding.",
      },
      {
        title: "Slide in O(1)",
        body: "When the window moves right, add the new right element and subtract the element that left on the left.",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: [
          "function maxSumSubarray(arr, k) {",
          "  let windowSum = 0;",
          "  for (let i = 0; i < k; i += 1) {",
          "    windowSum += arr[i];",
          "  }",
          "",
          "  let maxSum = windowSum;",
          "",
          "  for (let i = k; i < arr.length; i += 1) {",
          "    windowSum = windowSum + arr[i] - arr[i - k];",
          "    maxSum = Math.max(maxSum, windowSum);",
          "  }",
          "",
          "  return maxSum;",
          "}",
        ].join("\n"),
        explanation:
          "Fixed-size sliding window: initialize the first window sum, then slide while tracking the maximum.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
      },
    ],
    testCases: [
      {
        input: "[[1,2,3,4,5],2]",
        expectedOutput: "9",
        isSample: true,
      },
      {
        input: "[[2,1,5,1,3,2],3]",
        expectedOutput: "9",
        isSample: true,
      },
      {
        input: "[[4],1]",
        expectedOutput: "4",
        isSample: false,
      },
      {
        input: "[[-1,-2,-3,-4],2]",
        expectedOutput: "-3",
        isSample: false,
      },
      {
        input: "[[100,200,300,400],4]",
        expectedOutput: "1000",
        isSample: false,
      },
    ],
  };
}
