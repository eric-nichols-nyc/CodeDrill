import type { CreateProblemBody } from "../lib/create-problem-schema";

/** Deterministic copy for local testing; slug gets a unique suffix when applied. */
export function getFindDifferenceTwoArraysProblem(): CreateProblemBody {
  const suffix = Date.now();

  return {
    title: "Find the Difference of Two Arrays",
    slug: `find-difference-two-arrays-${suffix}`,
    difficulty: "easy",
    description:
      "Given two 0-indexed integer arrays nums1 and nums2, return a list answer of size 2 where answer[0] is a list of all distinct integers in nums1 which are not present in nums2, and answer[1] is a list of all distinct integers in nums2 which are not present in nums1. Note that the integers in the lists may be returned in any order; the local runner compares JSON exactly, so match the reference solution order (Set iteration / first-seen order).",
    constraints:
      "1 <= nums1.length, nums2.length <= 1000. -1000 <= nums1[i], nums2[i] <= 1000.",
    isPublished: false,
    patternSlug: "hash-set",
    loopStructure: "iterate-sets",
    skillFocus:
      "Build a set from each array, then scan one set and keep values missing from the other set.",
    tutorLevel: "beginner",
    visualizationNotes:
      "Put each array in a set. Walk set1 and collect values not in set2; walk set2 and collect values not in set1.",
    editorial: { content: "", embeds: [] },
    tags: ["array", "hash-table"],
    examples: [
      {
        input: "nums1 = [1,2,3], nums2 = [2,4,6]",
        output: "[[1,3],[4,6]]",
        explanation:
          "For nums1, 2 is in nums2 but 1 and 3 are not, so answer[0] = [1,3]. For nums2, 2 is in nums1 but 4 and 6 are not, so answer[1] = [4,6].",
      },
      {
        input: "nums1 = [1,2,3,3], nums2 = [1,1,2,2]",
        output: "[[3],[]]",
        explanation:
          "Only 3 from nums1 is absent from nums2 (duplicates count once). Every value in nums2 appears in nums1, so answer[1] = [].",
      },
    ],
    starterCode: [
      {
        language: "javascript",
        code: [
          "function findDifference(nums1, nums2) {",
          "  // Return [distinct in nums1 not in nums2, distinct in nums2 not in nums1].",
          "  return [[], []];",
          "}",
        ].join("\n"),
        functionName: "findDifference",
      },
      {
        language: "typescript",
        code: [
          "function findDifference(nums1: number[], nums2: number[]): number[][] {",
          "  // Return [distinct in nums1 not in nums2, distinct in nums2 not in nums1].",
          "  return [[], []];",
          "}",
        ].join("\n"),
        functionName: "findDifference",
      },
      {
        language: "python",
        code: [
          "def find_difference(nums1: list[int], nums2: list[int]) -> list[list[int]]:",
          "    # Return [distinct in nums1 not in nums2, distinct in nums2 not in nums1].",
          "    return [[], []]",
        ].join("\n"),
        functionName: "find_difference",
      },
    ],
    hints: [
      {
        title: "Check nums1 against nums2",
        body: "For each distinct integer in nums1, check whether it exists in nums2.",
      },
      {
        title: "Check nums2 against nums1",
        body: "Do the same for each distinct integer in nums2.",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: [
          "function findDifference(nums1, nums2) {",
          "  const set1 = new Set(nums1);",
          "  const set2 = new Set(nums2);",
          "",
          "  const ans1 = [];",
          "  const ans2 = [];",
          "",
          "  // Find elements in nums1 that are not in nums2",
          "  for (const num of set1) {",
          "    if (!set2.has(num)) {",
          "      ans1.push(num);",
          "    }",
          "  }",
          "",
          "  // Find elements in nums2 that are not in nums1",
          "  for (const num of set2) {",
          "    if (!set1.has(num)) {",
          "      ans2.push(num);",
          "    }",
          "  }",
          "",
          "  return [ans1, ans2];",
          "}",
        ].join("\n"),
        explanation:
          "Store each array in a set for O(1) lookups, then iterate each set once and collect values missing from the other set.",
        timeComplexity: "O(n + m)",
        spaceComplexity: "O(n + m)",
      },
    ],
    testCases: [
      {
        input: "[[1,2,3],[2,4,6]]",
        expectedOutput: "[[1,3],[4,6]]",
        isSample: true,
      },
      {
        input: "[[1,2,3,3],[1,1,2,2]]",
        expectedOutput: "[[3],[]]",
        isSample: true,
      },
      {
        input: "[[1],[1]]",
        expectedOutput: "[[],[]]",
        isSample: false,
      },
      {
        input: "[[7,8,9],[10,11,7]]",
        expectedOutput: "[[8,9],[10,11]]",
        isSample: false,
      },
      {
        input: "[[3,3,3],[3]]",
        expectedOutput: "[[],[]]",
        isSample: false,
      },
    ],
  };
}
