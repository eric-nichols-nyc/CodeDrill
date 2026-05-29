"use client";

import { useMemo } from "react";
import { useWorkspace } from "@/features/problem-workspace/components/shell/workspace-provider";
import {
  buildDirectionsViewModel,
  type DirectionsViewModel,
} from "../lib/directions-view-model";

export function useDirectionsData(): DirectionsViewModel {
  const { data } = useWorkspace();

  return useMemo(() => buildDirectionsViewModel(data), [data]);
}
