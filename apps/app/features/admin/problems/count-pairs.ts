import type { CreateProblemBody } from "../lib/create-problem-schema";

/** Deterministic copy for local testing; slug gets a unique suffix when applied. */
export function getCountPairsProblem(): CreateProblemBody {
  const suffix = Date.now();

  return {
    title: "Count Pairs With Sum",
    slug: `count-pairs-${suffix}`,
    difficulty: "easy",
    description:
      "Given an integer array arr and an integer target, return the number of pairs of indices (i, j) with i < j such that arr[i] + arr[j] === target. Scan left to right; for each value, if its complement was seen earlier, count one pair.",
    constraints:
      "1 <= arr.length <= 10^4. -10^4 <= arr[i], target <= 10^4.",
    isPublished: false,
    patternSlug: "hash-map",
    loopStructure: "single-pass-complement",
    skillFocus:
      "Track seen values in a map; for each element, check whether target - current was seen before incrementing the count.",
    tutorLevel: "beginner",
    visualizationNotes:
      "As you scan, ask whether the complement already appeared. Mark the current value seen after checking.",
    editorial: { content: "", embeds: [] },
    tags: ["array", "hash-table"],
    examples: [
      {
        input: "arr = [1, 2, 3, 4], target = 5",
        output: "2",
        explanation: "Pairs (1, 4) and (2, 3) both sum to 5.",
      },
      {
        input: "arr = [1, 1, 2, 3], target = 2",
        output: "1",
        explanation: "Only indices 0 and 1 form the pair (1, 1).",
      },
    ],
    starterCode: [
      {
        language: "javascript",
        code: [
          "function countPairs(arr, target) {",
          "  // Return how many index pairs (i, j), i < j, sum to target.",
          "  return 0;",
          "}",
        ].join("\n"),
        functionName: "countPairs",
      },
      {
        language: "typescript",
        code: [
          "function countPairs(arr: number[], target: number): number {",
          "  // Return how many index pairs (i, j), i < j, sum to target.",
          "  return 0;",
          "}",
        ].join("\n"),
        functionName: "countPairs",
      },
      {
        language: "python",
        code: [
          "def count_pairs(arr: list[int], target: int) -> int:",
          "    # Return how many index pairs (i, j), i < j, sum to target.",
          "    return 0",
        ].join("\n"),
        functionName: "count_pairs",
      },
    ],
    hints: [
      {
        title: "What value do you need?",
        body: "For arr[i], the complement is target - arr[i].",
      },
      {
        title: "Check before you record",
        body: "If the complement is already in your seen set, increment the count, then mark the current value seen.",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: [
          "function countPairs(arr, target) {",
          "  const map = {};",
          "  let count = 0;",
          "",
          "  for (let i = 0; i < arr.length; i += 1) {",
          "    const current = arr[i];",
          "    const needed = target - current;",
          "",
          "    if (map[needed]) {",
          "      count += 1;",
          "    }",
          "",
          "    map[current] = true;",
          "  }",
          "",
          "  return count;",
          "}",
        ].join("\n"),
        explanation:
          "One pass: for each element, if complement was seen earlier, count a pair; then mark the current value in the map.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
      },
    ],
    testCases: [
      {
        input: "[[1,2,3,4],5]",
        expectedOutput: "2",
        isSample: true,
      },
      {
        input: "[[1,1,2,3],2]",
        expectedOutput: "1",
        isSample: true,
      },
      {
        input: "[[2,2,2],4]",
        expectedOutput: "2",
        isSample: false,
      },
      {
        input: "[[5],5]",
        expectedOutput: "0",
        isSample: false,
      },
      {
        input: "[[0,0,0],0]",
        expectedOutput: "2",
        isSample: false,
      },
    ],
  };
}
