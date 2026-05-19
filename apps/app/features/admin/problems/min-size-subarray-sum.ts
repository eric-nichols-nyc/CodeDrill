import type { CreateProblemBody } from "../lib/create-problem-schema";

/** Deterministic copy for local testing; slug gets a unique suffix when applied. */
export function getMinSizeSubarraySumProblem(): CreateProblemBody {
  const suffix = Date.now();

  return {
    title: "Minimum Size Subarray Sum",
    slug: `min-size-subarray-sum-${suffix}`,
    difficulty: "medium",
    description:
      "Given an array of positive integers nums and a positive integer target, return the minimal length of a contiguous subarray whose sum is greater than or equal to target. If there is no such subarray, return 0.",
    constraints:
      "1 <= target <= 10^9. 1 <= nums.length <= 10^5. 1 <= nums[i] <= 10^4.",
    isPublished: false,
    patternSlug: "sliding-window",
    loopStructure: "for-with-inner-while",
    skillFocus:
      "Expand right to grow the window sum; while sum >= target, shrink left and track the minimum window length.",
    tutorLevel: "pattern-rep",
    visualizationNotes:
      "Variable window: right adds nums[right]; while windowSum >= target, update min length and subtract nums[left].",
    editorial: { content: "", embeds: [] },
    tags: ["array", "sliding-window"],
    examples: [
      {
        input: "target = 7, nums = [2,3,1,2,4,3]",
        output: "2",
        explanation: "The subarray [4,3] has sum 7 and is the shortest valid window.",
      },
      {
        input: "target = 4, nums = [1,4,4]",
        output: "1",
        explanation: "The subarray [4] alone meets the target.",
      },
      {
        input: "target = 11, nums = [1,1,1,1,1,1,1,1]",
        output: "0",
        explanation: "No contiguous subarray sums to at least 11.",
      },
    ],
    starterCode: [
      {
        language: "javascript",
        code: [
          "function minSubArrayLen(target, nums) {",
          "  // Return the minimal length of a subarray with sum >= target, or 0.",
          "  return 0;",
          "}",
        ].join("\n"),
        functionName: "minSubArrayLen",
      },
      {
        language: "typescript",
        code: [
          "function minSubArrayLen(target: number, nums: number[]): number {",
          "  // Return the minimal length of a subarray with sum >= target, or 0.",
          "  return 0;",
          "}",
        ].join("\n"),
        functionName: "minSubArrayLen",
      },
      {
        language: "python",
        code: [
          "def min_sub_array_len(target: int, nums: list[int]) -> int:",
          "    # Return the minimal length of a subarray with sum >= target, or 0.",
          "    return 0",
        ].join("\n"),
        functionName: "min_sub_array_len",
      },
    ],
    hints: [
      {
        title: "Variable window",
        body: "Unlike a fixed k-window, grow with right and shrink with left when the sum is already large enough.",
      },
      {
        title: "When to shrink",
        body: "While windowSum >= target, record right - left + 1, then remove nums[left] and move left forward.",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: [
          "function minSubArrayLen(target, nums) {",
          "  let left = 0;",
          "  let windowSum = 0;",
          "  let minLen = Infinity;",
          "",
          "  for (let right = 0; right < nums.length; right += 1) {",
          "    windowSum += nums[right];",
          "",
          "    while (windowSum >= target) {",
          "      minLen = Math.min(minLen, right - left + 1);",
          "      windowSum -= nums[left];",
          "      left += 1;",
          "    }",
          "  }",
          "",
          "  return minLen === Infinity ? 0 : minLen;",
          "}",
        ].join("\n"),
        explanation:
          "Slide right to expand the sum; while valid, shrink from the left and track the smallest window length.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
      },
    ],
    testCases: [
      {
        input: "[[7,[2,3,1,2,4,3]]]",
        expectedOutput: "2",
        isSample: true,
      },
      {
        input: "[[4,[1,4,4]]]",
        expectedOutput: "1",
        isSample: true,
      },
      {
        input: "[[11,[1,1,1,1,1,1,1,1]]]",
        expectedOutput: "0",
        isSample: true,
      },
      {
        input: "[[15,[1,2,3,4,5]]]",
        expectedOutput: "5",
        isSample: false,
      },
      {
        input: "[[100,[1,2,3,4,5]]]",
        expectedOutput: "0",
        isSample: false,
      },
    ],
  };
}
