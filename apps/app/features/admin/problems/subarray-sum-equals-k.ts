import type { CreateProblemBody } from "../lib/create-problem-schema";

/** Deterministic copy for local testing; slug gets a unique suffix when applied. */
export function getSubarraySumEqualsKProblem(): CreateProblemBody {
  const suffix = Date.now();

  return {
    title: "Subarray Sum Equals K",
    slug: `subarray-sum-equals-k-${suffix}`,
    difficulty: "medium",
    description:
      "Given an integer array nums and an integer k, return the number of contiguous subarrays whose sum equals k.",
    constraints:
      "1 <= nums.length <= 2 * 10^4. -1000 <= nums[i] <= 1000. -10^7 <= k <= 10^7.",
    isPublished: false,
    patternSlug: "hash-map",
    loopStructure: "prefix-sum-with-map",
    skillFocus:
      "Track prefix sums in a map; at each index, add the count of earlier prefixes equal to currentPrefix - k.",
    tutorLevel: "pattern-rep",
    visualizationNotes:
      "prefix grows as you scan; the complement prefix is prefix - k. Increment count before recording the current prefix.",
    editorial: { content: "", embeds: [] },
    tags: ["array", "hash-table", "prefix-sum"],
    examples: [
      {
        input: "nums = [1,1,1], k = 2",
        output: "2",
        explanation: "Subarrays [1,1] at indices 0-1 and 1-2 both sum to 2.",
      },
      {
        input: "nums = [1,2,3], k = 3",
        output: "2",
        explanation: "Subarrays [1,2] and [3] both sum to 3.",
      },
    ],
    starterCode: [
      {
        language: "javascript",
        code: [
          "function subarraySum(nums, k) {",
          "  // Return how many contiguous subarrays sum to k.",
          "  return 0;",
          "}",
        ].join("\n"),
        functionName: "subarraySum",
      },
      {
        language: "typescript",
        code: [
          "function subarraySum(nums: number[], k: number): number {",
          "  // Return how many contiguous subarrays sum to k.",
          "  return 0;",
          "}",
        ].join("\n"),
        functionName: "subarraySum",
      },
      {
        language: "python",
        code: [
          "def subarray_sum(nums: list[int], k: int) -> int:",
          "    # Return how many contiguous subarrays sum to k.",
          "    return 0",
        ].join("\n"),
        functionName: "subarray_sum",
      },
    ],
    hints: [
      {
        title: "Prefix sum idea",
        body: "If prefix[j] - prefix[i] = k, then the subarray from i+1 through j sums to k.",
      },
      {
        title: "Map of prefix counts",
        body: "Store how many times each prefix sum has appeared. Look up prefix - k before adding the current prefix.",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: [
          "function subarraySum(nums, k) {",
          "  const counts = new Map([[0, 1]]);",
          "  let prefix = 0;",
          "  let total = 0;",
          "",
          "  for (let i = 0; i < nums.length; i += 1) {",
          "    prefix += nums[i];",
          "    const need = prefix - k;",
          "    if (counts.has(need)) {",
          "      total += counts.get(need);",
          "    }",
          "    counts.set(prefix, (counts.get(prefix) ?? 0) + 1);",
          "  }",
          "",
          "  return total;",
          "}",
        ].join("\n"),
        explanation:
          "Walk once, updating a running prefix. Add the count of prior prefixes that would make the current subarray sum to k.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
      },
    ],
    testCases: [
      {
        input: "[[[1,1,1],2]]",
        expectedOutput: "2",
        isSample: true,
      },
      {
        input: "[[[1,2,3],3]]",
        expectedOutput: "2",
        isSample: true,
      },
      {
        input: "[[[1],0]]",
        expectedOutput: "0",
        isSample: false,
      },
      {
        input: "[[[1,-1,0],0]]",
        expectedOutput: "3",
        isSample: false,
      },
      {
        input: "[[[3,4,7,2,-3,1,4,2],7]]",
        expectedOutput: "4",
        isSample: false,
      },
    ],
  };
}
