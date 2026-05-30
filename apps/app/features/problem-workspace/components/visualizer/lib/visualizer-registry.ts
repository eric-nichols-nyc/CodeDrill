import dynamic from "next/dynamic";
import type { VisualizerComponent } from "./visualizer-types";

/**
 * [O] Extension point: add one entry per visualizer slug family.
 * [D] Consumers use getVisualizer — never import concrete visualizers elsewhere.
 */
const spiralMatrixVisualizer = dynamic(
  () =>
    import(
      "../spiral-matrix/components/spiral-matrix-visualizer"
    ).then((mod) => mod.SpiralMatrixVisualizer),
  { ssr: false }
);

const longestSubstringVisualizer = dynamic(
  () =>
    import(
      "../longest-substring/components/longest-substring-visualizer"
    ).then((mod) => mod.LongestSubstringVisualizer),
  { ssr: false }
);

/** Prefix match supports admin slugs like `spiral-matrix-1730000000`. */
const prefixRegistry: { prefix: string; component: VisualizerComponent }[] = [
  { prefix: "spiral-matrix", component: spiralMatrixVisualizer },
  {
    prefix: "longest-unique-substring",
    component: longestSubstringVisualizer,
  },
  { prefix: "longest-substring", component: longestSubstringVisualizer },
];

export function getVisualizer(slug: string): VisualizerComponent | null {
  const prefixMatch = prefixRegistry.find((entry) =>
    slug.startsWith(entry.prefix)
  );
  return prefixMatch?.component ?? null;
}
