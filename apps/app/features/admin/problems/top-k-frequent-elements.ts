import type { CreateProblemBody } from "../lib/create-problem-schema";

/** Deterministic copy for local testing; slug gets a unique suffix when applied. */
export function getTopKFrequentElementsProblem(): CreateProblemBody {
  const suffix = Date.now();

  return {
    title: "Top K Frequent Elements",
    slug: `top-k-frequent-elements-${suffix}`,
    difficulty: "medium",
    description:
      "Given an integer array nums and an integer k, return the k most frequent elements in any order. It is guaranteed that the answer is unique.",
    constraints:
      "1 <= nums.length <= 10^5. -10^4 <= nums[i] <= 10^4. k is in the range [1, number of unique elements]. The answer is guaranteed to be unique.",
    isPublished: false,
    patternSlug: "hash-map",
    loopStructure: "count-then-custom-sort",
    skillFocus:
      "Count frequencies in a map, then sort unique values by frequency descending and take the first k.",
    tutorLevel: "pattern-rep",
    visualizationNotes:
      "Same frequency counting as sort-by-frequency problems; output only the top k keys by count.",
    editorial: { content: "", embeds: [] },
    tags: ["array", "hash-table"],
    examples: [
      {
        input: "nums = [1,1,1,2,2,3], k = 2",
        output: "[1,2]",
        explanation: "1 appears three times and 2 appears twice.",
      },
      {
        input: "nums = [1], k = 1",
        output: "[1]",
        explanation: "Only one distinct element.",
      },
    ],
    starterCode: [
      {
        language: "javascript",
        code: [
          "function topKFrequent(nums, k) {",
          "  // Return the k most frequent elements.",
          "  return [];",
          "}",
        ].join("\n"),
        functionName: "topKFrequent",
      },
      {
        language: "typescript",
        code: [
          "function topKFrequent(nums: number[], k: number): number[] {",
          "  // Return the k most frequent elements.",
          "  return [];",
          "}",
        ].join("\n"),
        functionName: "topKFrequent",
      },
      {
        language: "python",
        code: [
          "def top_k_frequent(nums: list[int], k: int) -> list[int]:",
          "    # Return the k most frequent elements.",
          "    return []",
        ].join("\n"),
        functionName: "top_k_frequent",
      },
    ],
    hints: [
      {
        title: "Count first",
        body: "Build a map from value to frequency by scanning nums once.",
      },
      {
        title: "Sort unique values",
        body: "Sort the distinct keys by frequency descending, then slice the first k entries.",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: [
          "function topKFrequent(nums, k) {",
          "  const count = {};",
          "  for (const num of nums) {",
          "    count[num] = (count[num] || 0) + 1;",
          "  }",
          "",
          "  const unique = Object.keys(count).map(Number);",
          "  unique.sort((a, b) => count[b] - count[a]);",
          "",
          "  return unique.slice(0, k);",
          "}",
        ].join("\n"),
        explanation:
          "Count frequencies, sort unique values by count descending, return the first k values.",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(n)",
      },
    ],
    testCases: [
      {
        input: "[[[1,1,1,2,2,3],2]]",
        expectedOutput: "[1,2]",
        isSample: true,
      },
      {
        input: "[[[1],1]]",
        expectedOutput: "[1]",
        isSample: true,
      },
      {
        input: "[[[4,1,-1,2,-1,2,3],2]]",
        expectedOutput: "[-1,2]",
        isSample: false,
      },
      {
        input: "[[[5,5,5,2,2,3],2]]",
        expectedOutput: "[5,2]",
        isSample: false,
      },
    ],
  };
}
