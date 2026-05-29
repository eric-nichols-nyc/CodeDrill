import type { ComponentType } from "react";

/**
 * [L] Every visualizer satisfies this contract — no required props.
 * Self-contained: each visualizer ships its own data for MVP.
 */
export type VisualizerComponent = ComponentType;
