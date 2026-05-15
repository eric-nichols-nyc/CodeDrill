import type { CreateProblemBody } from "../lib/create-problem-schema";

/** Deterministic copy for local testing; slug gets a unique suffix when applied. */
export function getDevSampleLongestConsecutiveSequenceProblem(): CreateProblemBody {
  const suffix = Date.now();

  return {
    title: "Longest Consecutive Sequence (dev sample)",
    slug: `longest-consecutive-sequence-dev-${suffix}`,
    difficulty: "medium",
    description:
      "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. A consecutive sequence is a range of integers where each value equals the previous plus one (for example, 3, 4, 5, 6). The integers in nums are not guaranteed to be sorted and may contain duplicates. Your algorithm should run in O(n) time on average.",
    constraints:
      "0 <= nums.length <= 10^5. Each nums[i] fits in a 32-bit signed integer.",
    isPublished: false,

    patternSlug: "hash-map",
    loopStructure: "for-with-inner-while",
    skillFocus:
      "Put all values in a Set for O(1) membership. Only start extending a sequence from a number n when n - 1 is not in the set.",
    tutorLevel: "pattern-rep",
    visualizationNotes:
      "Each streak has a unique minimum element. Scan the set; when num - 1 is missing, walk num, num+1, num+2, … while each exists.",
    editorial: { content: "", embeds: [] },

    tags: ["array", "hash-table", "union-find"],

    examples: [
      {
        input: "nums = [100,4,200,1,3,2]",
        output: "4",
        explanation:
          "The longest consecutive sequence is 1, 2, 3, 4 (length 4). 100 and 200 are isolated.",
      },
      {
        input: "nums = [0,3,7,2,5,8,4,6,0,1]",
        output: "9",
        explanation:
          "The longest consecutive sequence is 0 through 8 (length 9). Duplicates do not extend a streak beyond unique values.",
      },
    ],

    starterCode: [
      {
        language: "javascript",
        code: [
          "function longestConsecutiveSequence(nums) {",
          "  // Return the length of the longest run of consecutive integers.",
          "}",
        ].join("\n"),
        functionName: "longestConsecutiveSequence",
      },
      {
        language: "typescript",
        code: [
          "function longestConsecutiveSequence(nums: number[]): number {",
          "  // Return the length of the longest run of consecutive integers.",
          "  return 0;",
          "}",
        ].join("\n"),
        functionName: "longestConsecutiveSequence",
      },
      {
        language: "python",
        code: [
          "def longest_consecutive_sequence(nums: list[int]) -> int:",
          "    # Return the length of the longest run of consecutive integers.",
          "    return 0",
        ].join("\n"),
        functionName: "longest_consecutive_sequence",
      },
    ],

    hints: [
      {
        title: "Use a Set",
        body: "Store all numbers in a set so you can check neighbors in O(1).",
      },
      {
        title: "Avoid double work",
        body: "Only start counting from num if num - 1 is not in the set. Otherwise you are in the middle of a streak someone else will count.",
      },
      {
        title: "Walk the streak",
        body: "From a sequence start, repeatedly check num + 1, num + 2, … while they exist and track the length.",
      },
    ],

    solutions: [
      {
        language: "javascript",
        code: [
          "function longestConsecutiveSequence(nums) {",
          "  if (nums.length === 0) return 0;",
          "",
          "  const numSet = new Set(nums);",
          "  let maxLength = 0;",
          "",
          "  for (const num of numSet) {",
          "    // Only start counting if 'num' is the BEGINNING of a sequence",
          "    // We check this by seeing if (num - 1) exists in the set",
          "    if (!numSet.has(num - 1)) {",
          "      let currentNum = num;",
          "      let currentLength = 1;",
          "",
          "      // Continue counting as long as the next number exists",
          "      while (numSet.has(currentNum + 1)) {",
          "        currentNum++;",
          "        currentLength++;",
          "      }",
          "",
          "      maxLength = Math.max(maxLength, currentLength);",
          "    }",
          "  }",
          "",
          "  return maxLength;",
          "}",
        ].join("\n"),
        explanation:
          "Insert all values into a set. For each value, treat it as the start of a sequence only when value - 1 is absent. From each start, walk forward while value + k exists and track the maximum streak length.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
      },
    ],

    testCases: [
      {
        input: "[[100,4,200,1,3,2]]",
        expectedOutput: "4",
        isSample: true,
      },
      {
        input: "[[0,3,7,2,5,8,4,6,0,1]]",
        expectedOutput: "9",
        isSample: true,
      },
      {
        input: "[[]]",
        expectedOutput: "0",
        isSample: false,
      },
      {
        input: "[[1]]",
        expectedOutput: "1",
        isSample: false,
      },
      {
        input: "[[1,2,0,1]]",
        expectedOutput: "3",
        isSample: false,
      },
      {
        input: "[[9,1,4,7,3,-1,0,5,8,-2,6]]",
        expectedOutput: "7",
        isSample: false,
      },
    ],
  };
}
