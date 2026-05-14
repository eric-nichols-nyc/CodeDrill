import type { CreateProblemBody } from "../lib/create-problem-schema";

/** Deterministic copy for local testing; slug gets a unique suffix when applied. */
export function getDevSampleProblem(): CreateProblemBody {
  const suffix = Date.now();

  return {
    title: "Move Zeroes (dev sample)",
    slug: `move-zeroes-dev-${suffix}`,
    difficulty: "easy",
    description:
      "Given an integer array nums, move all 0's to the end of the array while maintaining the relative order of the non-zero elements. You must do this in-place without making a copy of the array.",

    constraints: "1 <= nums.length <= 10^4. -2^31 <= nums[i] <= 2^31 - 1.",

    isPublished: false,

    patternSlug: "two-pointers",

    loopStructure: "single-pass-two-pointers",

    skillFocus:
      "Use two pointers to track where the next non-zero value should be placed.",

    tutorLevel: "beginner",

    visualizationNotes:
      "Use a left pointer to track the next non-zero placement position while the right pointer scans the array.",

    editorial: "https://www.youtube.com/watch?v=aayNRwUN3Do",

    tags: ["array", "two-pointers"],

    examples: [
      {
        input: "nums = [0,1,0,3,12]",
        output: "[1,3,12,0,0]",
        explanation:
          "All non-zero elements are shifted forward while zeroes move to the end.",
      },
      {
        input: "nums = [0]",
        output: "[0]",
        explanation: "The array already contains only zero.",
      },
    ],

    starterCode: [
      {
        language: "javascript",
        code: [
          "function moveZeroes(nums) {",
          "  // Move all zeroes to the end in-place.",
          "  return nums;",
          "}",
        ].join("\n"),
        functionName: "moveZeroes",
      },

      {
        language: "typescript",
        code: [
          "function moveZeroes(nums: number[]): number[] {",
          "  // Move all zeroes to the end in-place.",
          "  return nums;",
          "}",
        ].join("\n"),
        functionName: "moveZeroes",
      },

      {
        language: "python",
        code: [
          "def move_zeroes(nums: list[int]) -> list[int]:",
          "    # Move all zeroes to the end in-place.",
          "    return nums",
        ].join("\n"),
        functionName: "move_zeroes",
      },
    ],

    hints: [
      {
        title: "Track the next placement index",
        body: "Keep a pointer that tracks where the next non-zero number should go.",
      },

      {
        title: "Swap non-zero values forward",
        body: "Whenever you find a non-zero value, swap it into the next available position.",
      },
    ],

    solutions: [
      {
        language: "javascript",

        code: [
          "function moveZeroes(nums) {",
          "  let left = 0;",
          "",
          "  for (let right = 0; right < nums.length; right += 1) {",
          "    if (nums[right] !== 0) {",
          "      [nums[left], nums[right]] = [nums[right], nums[left]];",
          "      left += 1;",
          "    }",
          "  }",
          "",
          "  return nums;",
          "}",
        ].join("\n"),

        explanation:
          "Use two pointers. The right pointer scans the array while the left pointer tracks the next position for a non-zero value. Swap non-zero values forward as you scan.",

        timeComplexity: "O(n)",

        spaceComplexity: "O(1)",
      },
    ],

    testCases: [
      {
        input: "[[0,1,0,3,12]]",
        expectedOutput: "[1,3,12,0,0]",
        isSample: true,
      },

      {
        input: "[[0]]",
        expectedOutput: "[0]",
        isSample: true,
      },

      {
        input: "[[1,0,2,0,3]]",
        expectedOutput: "[1,2,3,0,0]",
        isSample: false,
      },

      {
        input: "[[4,2,4,0,0,3,0,5,1,0]]",
        expectedOutput: "[4,2,4,3,5,1,0,0,0,0]",
        isSample: false,
      },
    ],
  };
}
