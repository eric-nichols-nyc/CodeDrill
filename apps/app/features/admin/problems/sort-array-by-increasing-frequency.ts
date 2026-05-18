import type { CreateProblemBody } from "../lib/create-problem-schema";

/** Deterministic copy for local testing; slug gets a unique suffix when applied. */
export function getSortArrayByIncreasingFrequencyProblem(): CreateProblemBody {
  const suffix = Date.now();

  return {
    title: "Sort Array by Increasing Frequency",
    slug: `sort-array-by-increasing-frequency-${suffix}`,
    difficulty: "easy",
    description:
      "You are given an array of integers nums. Sort the array in increasing order based on the frequency of the values. If multiple values have the same frequency, sort them in decreasing order. Return the sorted array.",
    constraints:
      "1 <= nums.length <= 100. -100 <= nums[i] <= 100.",
    isPublished: false,
    patternSlug: "hash-map",
    loopStructure: "count-then-custom-sort",
    skillFocus:
      "Count frequencies in a map, then sort with a comparator: lower frequency first; on ties, larger value first.",
    tutorLevel: "beginner",
    visualizationNotes:
      "Build a frequency map, then sort nums by (frequency ascending, value descending).",
    editorial: { content: "", embeds: [] },
    tags: ["array", "hash-table", "sorting"],
    examples: [
      {
        input: "nums = [1,1,2,2,2,3]",
        output: "[3,1,1,2,2,2]",
        explanation:
          "3 has frequency 1, 1 has frequency 2, and 2 has frequency 3.",
      },
      {
        input: "nums = [2,3,1,3,2]",
        output: "[1,3,3,2,2]",
        explanation:
          "2 and 3 both have frequency 2, so they are sorted in decreasing order by value.",
      },
    ],
    starterCode: [
      {
        language: "javascript",
        code: [
          "function frequencySort(nums) {",
          "  // Sort by increasing frequency; break ties by decreasing value.",
          "  return nums;",
          "}",
        ].join("\n"),
        functionName: "frequencySort",
      },
      {
        language: "typescript",
        code: [
          "function frequencySort(nums: number[]): number[] {",
          "  // Sort by increasing frequency; break ties by decreasing value.",
          "  return nums;",
          "}",
        ].join("\n"),
        functionName: "frequencySort",
      },
      {
        language: "python",
        code: [
          "def frequency_sort(nums: list[int]) -> list[int]:",
          "    # Sort by increasing frequency; break ties by decreasing value.",
          "    return nums",
        ].join("\n"),
        functionName: "frequency_sort",
      },
    ],
    hints: [
      {
        title: "Count frequencies",
        body: "Use a hash map to record how many times each value appears in nums.",
      },
      {
        title: "Custom comparator",
        body: "When frequencies differ, put the lower frequency first. When they match, put the larger value first.",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: [
          "function frequencySort(nums) {",
          "  const count = {};",
          "  for (const num of nums) {",
          "    count[num] = (count[num] || 0) + 1;",
          "  }",
          "",
          "  nums.sort((a, b) => {",
          "    if (count[a] !== count[b]) return count[a] - count[b];",
          "    return b - a;",
          "  });",
          "",
          "  return nums;",
          "}",
        ].join("\n"),
        explanation:
          "Count each value's frequency, then sort in place: primary key frequency ascending, secondary key value descending.",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(n)",
      },
    ],
    testCases: [
      {
        input: "[[1,1,2,2,2,3]]",
        expectedOutput: "[3,1,1,2,2,2]",
        isSample: true,
      },
      {
        input: "[[2,3,1,3,2]]",
        expectedOutput: "[1,3,3,2,2]",
        isSample: true,
      },
      {
        input: "[[5,5,4]]",
        expectedOutput: "[4,5,5]",
        isSample: false,
      },
      {
        input: "[[-1,1,-6,4,5,-6,1,4,1]]",
        expectedOutput: "[5,-1,4,4,-6,-6,1,1,1]",
        isSample: false,
      },
    ],
  };
}
