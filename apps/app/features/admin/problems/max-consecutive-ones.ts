import type { CreateProblemBody } from "../lib/create-problem-schema";

/** Deterministic copy for local testing; slug gets a unique suffix when applied. */
export function getMaxConsecutiveOnesProblem(): CreateProblemBody {
  const suffix = Date.now();

  return {
    title: "Max Consecutive Ones",
    slug: `max-consecutive-ones-${suffix}`,
    difficulty: "easy",
    description:
      "Given a binary array nums, return the maximum number of consecutive 1's in the array.",
    constraints:
      "1 <= nums.length <= 10^5. nums[i] is either 0 or 1.",
    isPublished: false,
    patternSlug: "sliding-window",
    loopStructure: "single-pass-counter",
    skillFocus:
      "Track the current run of 1s and update the maximum whenever you see a 1; reset the run on 0.",
    tutorLevel: "beginner",
    visualizationNotes:
      "Walk the array once. Increment a streak on 1, reset on 0, keep the best streak seen.",
    editorial: { content: "", embeds: [] },
    tags: ["array"],
    examples: [
      {
        input: "nums = [1,1,0,1,1,1]",
        output: "3",
        explanation: "The last three digits are consecutive 1s; the maximum is 3.",
      },
      {
        input: "nums = [1,0,1,1,0,1]",
        output: "2",
        explanation: "The longest run of 1s is two (indices 2 and 3).",
      },
    ],
    starterCode: [
      {
        language: "javascript",
        code: [
          "function findMaxConsecutiveOnes(nums) {",
          "  // Return the length of the longest run of 1s.",
          "  return 0;",
          "}",
        ].join("\n"),
        functionName: "findMaxConsecutiveOnes",
      },
      {
        language: "typescript",
        code: [
          "function findMaxConsecutiveOnes(nums: number[]): number {",
          "  // Return the length of the longest run of 1s.",
          "  return 0;",
          "}",
        ].join("\n"),
        functionName: "findMaxConsecutiveOnes",
      },
      {
        language: "python",
        code: [
          "def find_max_consecutive_ones(nums: list[int]) -> int:",
          "    # Return the length of the longest run of 1s.",
          "    return 0",
        ].join("\n"),
        functionName: "find_max_consecutive_ones",
      },
    ],
    hints: [
      {
        title: "Track the current streak",
        body: "Keep a counter for how many consecutive 1s you have seen ending at the current index.",
      },
      {
        title: "Reset on zero",
        body: "When you see a 0, the streak breaks—reset the counter to 0.",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: [
          "function findMaxConsecutiveOnes(nums) {",
          "  let max = 0;",
          "  let current = 0;",
          "",
          "  for (const num of nums) {",
          "    if (num === 1) {",
          "      current += 1;",
          "      max = Math.max(max, current);",
          "    } else {",
          "      current = 0;",
          "    }",
          "  }",
          "",
          "  return max;",
          "}",
        ].join("\n"),
        explanation:
          "Single pass: extend the streak on 1, reset on 0, and record the maximum streak length.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
      },
    ],
    testCases: [
      {
        input: "[[1,1,0,1,1,1]]",
        expectedOutput: "3",
        isSample: true,
      },
      {
        input: "[[1,0,1,1,0,1]]",
        expectedOutput: "2",
        isSample: true,
      },
      {
        input: "[[1]]",
        expectedOutput: "1",
        isSample: false,
      },
      {
        input: "[[0]]",
        expectedOutput: "0",
        isSample: false,
      },
      {
        input: "[[1,1,1,1]]",
        expectedOutput: "4",
        isSample: false,
      },
    ],
  };
}
