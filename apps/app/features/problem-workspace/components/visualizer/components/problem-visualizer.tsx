"use client";

import { getVisualizer } from "../lib/visualizer-registry";

type ProblemVisualizerProps = {
  slug: string;
  hasVisualizer: boolean;
};

/**
 * [S] Gate: show a visualizer only when the problem opts in and a component is registered.
 * [D] Depends on getVisualizer — no concrete visualizer imports.
 */
export function ProblemVisualizer({
  slug,
  hasVisualizer,
}: ProblemVisualizerProps) {
  if (!hasVisualizer) {
    return null;
  }

  const Visualizer = getVisualizer(slug);
  if (!Visualizer) {
    return null;
  }

  return <Visualizer />;
}
