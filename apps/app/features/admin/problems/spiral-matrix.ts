import type { CreateProblemBody } from "../lib/create-problem-schema";

/** Deterministic copy for local testing; slug gets a unique suffix when applied. */
export function getSpiralMatrixProblem(): CreateProblemBody {
  const suffix = Date.now();

  return {
    title: "Spiral Matrix",
    slug: `spiral-matrix-${suffix}`,
    difficulty: "medium",
    description:
      "Given an m x n matrix, return all elements of the matrix in spiral order (clockwise from the outside inward).",
    constraints:
      "m == matrix.length. n == matrix[i].length. 1 <= m, n <= 10. -100 <= matrix[i][j] <= 100.",
    isPublished: false,
    patternSlug: "array",
    loopStructure: "layer-boundaries",
    skillFocus:
      "Track top, bottom, left, and right bounds; walk right, down, left, up, then shrink each boundary.",
    tutorLevel: "pattern-rep",
    visualizationNotes:
      "Peel the matrix layer by layer until all elements are collected in res.length === m * n.",
    editorial: { content: "", embeds: [] },
    tags: ["array", "matrix"],
    examples: [
      {
        input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        output: "[1,2,3,6,9,8,7,4,5]",
        explanation:
          "Spiral order visits the outer ring, then the center.",
      },
      {
        input: "matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]",
        output: "[1,2,3,4,8,12,11,10,9,5,6,7]",
        explanation: "A 3x4 matrix unwinds clockwise from the top-left.",
      },
    ],
    starterCode: [
      {
        language: "javascript",
        code: [
          "function spiralOrder(matrix) {",
          "  // Return all matrix elements in clockwise spiral order.",
          "  return [];",
          "}",
        ].join("\n"),
        functionName: "spiralOrder",
      },
      {
        language: "typescript",
        code: [
          "function spiralOrder(matrix: number[][]): number[] {",
          "  // Return all matrix elements in clockwise spiral order.",
          "  return [];",
          "}",
        ].join("\n"),
        functionName: "spiralOrder",
      },
      {
        language: "python",
        code: [
          "def spiral_order(matrix: list[list[int]]) -> list[int]:",
          "    # Return all matrix elements in clockwise spiral order.",
          "    return []",
        ].join("\n"),
        functionName: "spiral_order",
      },
    ],
    hints: [
      {
        title: "Four boundaries",
        body: "Use left, right, top, and bottom pointers that shrink after each direction.",
      },
      {
        title: "Stop when full",
        body: "Keep looping until res.length equals rows * cols.",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: [
          "function spiralOrder(matrix) {",
          "  const res = [];",
          "  if (!matrix || matrix.length === 0) return res;",
          "",
          "  let left = 0;",
          "  let right = matrix[0].length - 1;",
          "  let top = 0;",
          "  let bottom = matrix.length - 1;",
          "",
          "  const totalElements = matrix.length * matrix[0].length;",
          "",
          "  // Run until we have collected every single number",
          "  while (res.length < totalElements) {",
          "    // 1. Move Right along the top row",
          "    for (let i = left; i <= right && res.length < totalElements; i++) {",
          "      res.push(matrix[top][i]);",
          "    }",
          "    top++; // Shrink the top boundary down",
          "",
          "    // 2. Move Down along the right column",
          "    for (let i = top; i <= bottom && res.length < totalElements; i++) {",
          "      res.push(matrix[i][right]);",
          "    }",
          "    right--; // Shrink the right boundary left",
          "",
          "    // 3. Move Left along the bottom row",
          "    for (let i = right; i >= left && res.length < totalElements; i--) {",
          "      res.push(matrix[bottom][i]);",
          "    }",
          "    bottom--; // Shrink the bottom boundary up",
          "",
          "    // 4. Move Up along the left column",
          "    for (let i = bottom; i >= top && res.length < totalElements; i--) {",
          "      res.push(matrix[i][left]);",
          "    }",
          "    left++; // Shrink the left boundary right",
          "  }",
          "",
          "  return res;",
          "}",
        ].join("\n"),
        explanation:
          "Walk each side of the current rectangle, then shrink top/right/bottom/left until every cell is visited.",
        timeComplexity: "O(m * n)",
        spaceComplexity: "O(1) excluding output",
      },
    ],
    testCases: [
      {
        input: "[[[1,2,3],[4,5,6],[7,8,9]]]",
        expectedOutput: "[1,2,3,6,9,8,7,4,5]",
        isSample: true,
      },
      {
        input: "[[[1,2,3,4],[5,6,7,8],[9,10,11,12]]]",
        expectedOutput: "[1,2,3,4,8,12,11,10,9,5,6,7]",
        isSample: true,
      },
      {
        input: "[[[1]]]",
        expectedOutput: "[1]",
        isSample: false,
      },
      {
        input: "[[[1,2,3]]]",
        expectedOutput: "[1,2,3]",
        isSample: false,
      },
      {
        input: "[[[1],[2],[3]]]",
        expectedOutput: "[1,2,3]",
        isSample: false,
      },
    ],
  };
}
