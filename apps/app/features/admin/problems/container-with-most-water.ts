import type { CreateProblemBody } from "../lib/create-problem-schema";

/** Deterministic copy for local testing; slug gets a unique suffix when applied. */
export function getContainerWithMostWaterProblem(): CreateProblemBody {
  const suffix = Date.now();

  return {
    title: "Container With Most Water",
    slug: `container-with-most-water-${suffix}`,
    difficulty: "medium",
    description:
      "Given n non-negative integers height where each element represents a vertical line at coordinate (i, 0) to (i, height[i]), find two lines that together with the x-axis form a container that holds the most water. Return the maximum amount of water the container can store.",
    constraints:
      "n == height.length. 2 <= n <= 10^5. 0 <= height[i] <= 10^4.",
    isPublished: false,
    patternSlug: "two-pointers",
    loopStructure: "opposite-ends",
    skillFocus:
      "Start left at 0 and right at end; compute area; move the pointer at the shorter line inward.",
    tutorLevel: "pattern-rep",
    visualizationNotes:
      "Area is min(height[left], height[right]) * (right - left). Always discard the shorter side.",
    editorial: { content: "", embeds: [] },
    tags: ["array", "two-pointers"],
    examples: [
      {
        input: "height = [1,8,6,2,5,4,8,3,7]",
        output: "49",
        explanation:
          "The max area uses lines at indices 1 and 8: min(8,7) * 7 = 49.",
      },
      {
        input: "height = [1,1]",
        output: "1",
        explanation: "Only one container: width 1 and height 1.",
      },
    ],
    starterCode: [
      {
        language: "javascript",
        code: [
          "function maxArea(height) {",
          "  // Return the maximum water the container can store.",
          "  return 0;",
          "}",
        ].join("\n"),
        functionName: "maxArea",
      },
      {
        language: "typescript",
        code: [
          "function maxArea(height: number[]): number {",
          "  // Return the maximum water the container can store.",
          "  return 0;",
          "}",
        ].join("\n"),
        functionName: "maxArea",
      },
      {
        language: "python",
        code: [
          "def max_area(height: list[int]) -> int:",
          "    # Return the maximum water the container can store.",
          "    return 0",
        ].join("\n"),
        functionName: "max_area",
      },
    ],
    hints: [
      {
        title: "Opposite ends",
        body: "Try the widest container first, then narrow by moving one pointer inward.",
      },
      {
        title: "Which pointer moves?",
        body: "Move the pointer at the shorter line; keeping the shorter side cannot improve area.",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: [
          "function maxArea(height) {",
          "  let left = 0;",
          "  let right = height.length - 1;",
          "  let best = 0;",
          "",
          "  while (left < right) {",
          "    const width = right - left;",
          "    const h = Math.min(height[left], height[right]);",
          "    best = Math.max(best, width * h);",
          "",
          "    if (height[left] < height[right]) {",
          "      left += 1;",
          "    } else {",
          "      right -= 1;",
          "    }",
          "  }",
          "",
          "  return best;",
          "}",
        ].join("\n"),
        explanation:
          "Two pointers from both ends; compute area each step and move the shorter side inward.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
      },
    ],
    testCases: [
      {
        input: "[[1,8,6,2,5,4,8,3,7]]",
        expectedOutput: "49",
        isSample: true,
      },
      {
        input: "[[1,1]]",
        expectedOutput: "1",
        isSample: true,
      },
      {
        input: "[[4,3,2,1,4]]",
        expectedOutput: "16",
        isSample: false,
      },
      {
        input: "[[1,2,1]]",
        expectedOutput: "2",
        isSample: false,
      },
    ],
  };
}
