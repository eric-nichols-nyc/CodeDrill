import type { CreateProblemBody } from "../lib/create-problem-schema";

/** Deterministic copy for local testing; slug gets a unique suffix when applied. */
export function getMaxConsecutiveOnesIIIProblem(): CreateProblemBody {
  const suffix = Date.now();

  return {
    title: "Max Consecutive Ones III",
    slug: `max-consecutive-ones-iii-${suffix}`,
    difficulty: "medium",
    description:
      "Given a binary array nums and an integer k, return the maximum number of consecutive 1's in the array if you can flip at most k 0's to 1's.",
    constraints:
      "1 <= nums.length <= 10^5. nums[i] is either 0 or 1. 0 <= k <= nums.length.",
    isPublished: false,
    patternSlug: "sliding-window",
    loopStructure: "for-with-inner-while",
    skillFocus:
      "Expand right; while zeros in the window exceed k, shrink left; track the maximum window size.",
    tutorLevel: "pattern-rep",
    visualizationNotes:
      "Variable window with a zero counter; valid while zeros <= k. Update max length after each expansion.",
    editorial: { content: "", embeds: [] },
    tags: ["array", "sliding-window"],
    examples: [
      {
        input: "nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2",
        output: "6",
        explanation:
          "Flip the two 0's in the middle segment to get six consecutive 1's.",
      },
      {
        input: "nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], k = 3",
        output: "10",
        explanation:
          "Flip three 0's in the middle to get a window of ten 1's.",
      },
    ],
    starterCode: [
      {
        language: "javascript",
        code: [
          "function longestOnes(nums, k) {",
          "  // Return the longest subarray of 1s with at most k flips.",
          "  return 0;",
          "}",
        ].join("\n"),
        functionName: "longestOnes",
      },
      {
        language: "typescript",
        code: [
          "function longestOnes(nums: number[], k: number): number {",
          "  // Return the longest subarray of 1s with at most k flips.",
          "  return 0;",
          "}",
        ].join("\n"),
        functionName: "longestOnes",
      },
      {
        language: "python",
        code: [
          "def longest_ones(nums: list[int], k: int) -> int:",
          "    # Return the longest subarray of 1s with at most k flips.",
          "    return 0",
        ].join("\n"),
        functionName: "longest_ones",
      },
    ],
    hints: [
      {
        title: "Count zeros in the window",
        body: "Track how many 0's are inside the current window as right expands.",
      },
      {
        title: "Shrink when invalid",
        body: "While zeroCount > k, move left forward and decrement zeroCount when nums[left] is 0.",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: [
          "function longestOnes(nums, k) {",
          "  let left = 0;",
          "  let zeros = 0;",
          "  let best = 0;",
          "",
          "  for (let right = 0; right < nums.length; right += 1) {",
          "    if (nums[right] === 0) {",
          "      zeros += 1;",
          "    }",
          "",
          "    while (zeros > k) {",
          "      if (nums[left] === 0) {",
          "        zeros -= 1;",
          "      }",
          "      left += 1;",
          "    }",
          "",
          "    best = Math.max(best, right - left + 1);",
          "  }",
          "",
          "  return best;",
          "}",
        ].join("\n"),
        explanation:
          "Sliding window keeps at most k zeros; the window length after each valid expansion is a candidate answer.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
      },
    ],
    testCases: [
      {
        input: "[[[1,1,1,0,0,0,1,1,1,1,0],2]]",
        expectedOutput: "6",
        isSample: true,
      },
      {
        input: "[[[0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1],3]]",
        expectedOutput: "10",
        isSample: true,
      },
      {
        input: "[[[1],0]]",
        expectedOutput: "1",
        isSample: false,
      },
      {
        input: "[[[0,0,0,1],4]]",
        expectedOutput: "4",
        isSample: false,
      },
    ],
  };
}
