import type { CreateProblemBody } from "../lib/create-problem-schema";

/** Deterministic copy for local testing; slug gets a unique suffix when applied. */
export function getRotateImageProblem(): CreateProblemBody {
  const suffix = Date.now();

  return {
    title: "Rotate Image",
    slug: `rotate-image-${suffix}`,
    difficulty: "medium",
    description:
      "You are given an n x n 2D matrix matrix representing an image. Rotate the image by 90 degrees clockwise in-place and return the rotated matrix.",
    constraints:
      "n == matrix.length == matrix[i].length. 1 <= n <= 20. -1000 <= matrix[i][j] <= 1000.",
    isPublished: false,
    patternSlug: "array",
    loopStructure: "reverse-then-transpose",
    skillFocus:
      "Reverse rows vertically, then transpose by swapping matrix[i][j] with matrix[j][i] for i < j.",
    tutorLevel: "pattern-rep",
    visualizationNotes:
      "Flip upside down first, then swap across the main diagonal. No extra matrix needed.",
    editorial: { content: "", embeds: [] },
    tags: ["array", "matrix"],
    examples: [
      {
        input:
          "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        output: "[[7,4,1],[8,5,2],[9,6,3]]",
        explanation: "The image rotates 90 degrees clockwise in place.",
      },
      {
        input: "matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]",
        output:
          "[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]",
        explanation: "A 4x4 matrix rotates to the clockwise orientation.",
      },
    ],
    starterCode: [
      {
        language: "javascript",
        code: [
          "function rotate(matrix) {",
          "  // Rotate the n x n matrix 90 degrees clockwise in-place.",
          "  return matrix;",
          "}",
        ].join("\n"),
        functionName: "rotate",
      },
      {
        language: "typescript",
        code: [
          "function rotate(matrix: number[][]): number[][] {",
          "  // Rotate the n x n matrix 90 degrees clockwise in-place.",
          "  return matrix;",
          "}",
        ].join("\n"),
        functionName: "rotate",
      },
      {
        language: "python",
        code: [
          "def rotate(matrix: list[list[int]]) -> list[list[int]]:",
          "    # Rotate the n x n matrix 90 degrees clockwise in-place.",
          "    return matrix",
        ].join("\n"),
        functionName: "rotate",
      },
    ],
    hints: [
      {
        title: "Two-step trick",
        body: "A 90° clockwise rotation equals vertical flip followed by transpose.",
      },
      {
        title: "Transpose only upper triangle",
        body: "Swap matrix[i][j] with matrix[j][i] for j > i to avoid swapping twice.",
      },
    ],
    solutions: [
      {
        language: "javascript",
        code: [
          "function rotate(matrix) {",
          "  // ------------------------------------------------------------------------",
          "  // STEP 1: Reverse the matrix vertically (flip it upside down)",
          "  // ------------------------------------------------------------------------",
          "  // This swaps entire row arrays.",
          "  // Row 0 [1, 2, 3] swaps with Row 2 [7, 8, 9]. The middle row stays put.",
          "  //",
          "  // After this line, the matrix looks like this:",
          "  // [",
          "  //   [7, 8, 9],  <- Former bottom row is now at index 0",
          "  //   [4, 5, 6],  <- Middle row remains at index 1",
          "  //   [1, 2, 3]   <- Former top row is now at index 2",
          "  // ]",
          "  matrix.reverse();",
          "",
          "  // ------------------------------------------------------------------------",
          "  // STEP 2: Transpose the matrix (swap rows with columns across the diagonal)",
          "  // ------------------------------------------------------------------------",
          "  // The outer loop tracks our current row index 'i'",
          "  for (let i = 0; i < matrix.length; i++) {",
          "    // The inner loop tracks the column index 'j'.",
          "    // Crucial: We start at 'i + 1' to only look at elements to the RIGHT of",
          "    // the main diagonal line (the upper right triangle).",
          "    for (let j = i + 1; j < matrix[i].length; j++) {",
          "      // This performs an in-place swap of symmetric pairs using destructuring.",
          "      // It takes the element at row 'i', col 'j' and swaps it with row 'j', col 'i'.",
          "      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];",
          "    }",
          "  }",
          "",
          "  return matrix;",
          "}",
        ].join("\n"),
        explanation:
          "Reverse rows, then transpose in place by swapping upper-triangle pairs. Return the mutated matrix for the runner.",
        timeComplexity: "O(n^2)",
        spaceComplexity: "O(1)",
      },
    ],
    testCases: [
      {
        input: "[[[1,2,3],[4,5,6],[7,8,9]]]",
        expectedOutput: "[[7,4,1],[8,5,2],[9,6,3]]",
        isSample: true,
      },
      {
        input:
          "[[[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]]",
        expectedOutput:
          "[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]",
        isSample: true,
      },
      {
        input: "[[[1]]]",
        expectedOutput: "[[1]]",
        isSample: false,
      },
      {
        input: "[[[1,2],[3,4]]]",
        expectedOutput: "[[3,1],[4,2]]",
        isSample: false,
      },
    ],
  };
}
