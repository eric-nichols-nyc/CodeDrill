/**
 * [S] Pure spiral-order step generator — no React, no I/O.
 * [O] Closed to UI changes; open to any matrix input via parameter.
 */

export type Direction = "right" | "down" | "left" | "up";

export type Bounds = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type SpiralStep = {
  index: number;
  row: number;
  col: number;
  value: number;
  direction: Direction;
  result: number[];
  visited: boolean[][];
  bounds: Bounds;
  activeLine: number;
  explanation: string;
};

function cloneVisited(visited: boolean[][]) {
  return visited.map((row) => [...row]);
}

export function generateSpiralSteps(input: number[][]): SpiralStep[] {
  const steps: SpiralStep[] = [];
  const result: number[] = [];
  const visited = input.map((row) => row.map(() => false));

  let top = 0;
  let bottom = input.length - 1;
  let left = 0;
  let right = input[0].length - 1;

  const pushStep = ({
    row,
    col,
    direction,
    activeLine,
    bounds,
  }: {
    row: number;
    col: number;
    direction: Direction;
    activeLine: number;
    bounds: Bounds;
  }) => {
    const value = input[row][col];
    result.push(value);
    visited[row][col] = true;

    steps.push({
      index: steps.length,
      row,
      col,
      value,
      direction,
      result: [...result],
      visited: cloneVisited(visited),
      bounds: { ...bounds },
      activeLine,
      explanation: `Move ${direction} and add matrix[${row}][${col}] = ${value} to the result.`,
    });
  };

  while (top <= bottom && left <= right) {
    const boundsBeforeTop = { top, bottom, left, right };
    for (let col = left; col <= right; col += 1) {
      pushStep({
        row: top,
        col,
        direction: "right",
        activeLine: 8,
        bounds: boundsBeforeTop,
      });
    }
    top += 1;

    const boundsBeforeRight = { top, bottom, left, right };
    for (let rowIndex = top; rowIndex <= bottom; rowIndex += 1) {
      pushStep({
        row: rowIndex,
        col: right,
        direction: "down",
        activeLine: 10,
        bounds: boundsBeforeRight,
      });
    }
    right -= 1;

    if (top <= bottom) {
      const boundsBeforeBottom = { top, bottom, left, right };
      for (let col = right; col >= left; col -= 1) {
        pushStep({
          row: bottom,
          col,
          direction: "left",
          activeLine: 13,
          bounds: boundsBeforeBottom,
        });
      }
      bottom -= 1;
    }

    if (left <= right) {
      const boundsBeforeLeft = { top, bottom, left, right };
      for (let rowIndex = bottom; rowIndex >= top; rowIndex -= 1) {
        pushStep({
          row: rowIndex,
          col: left,
          direction: "up",
          activeLine: 17,
          bounds: boundsBeforeLeft,
        });
      }
      left += 1;
    }
  }

  return steps;
}
