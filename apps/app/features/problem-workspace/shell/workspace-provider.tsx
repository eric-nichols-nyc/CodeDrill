"use client";

import { useProblemWorkspace } from "@/features/problem-workspace/components/problem-workspace/hooks/use-problem-workspace";
import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
} from "react";
import type { WorkspaceData } from "./lib/workspace-data";

type WorkspaceContextValue = {
  data: WorkspaceData;
  workspace: ReturnType<typeof useProblemWorkspace>;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({
  data,
  children,
}: {
  data: WorkspaceData;
  children: ReactNode;
}) {
  const workspace = useProblemWorkspace({
    problemId: data.problemId,
    starterCode: data.starterCode,
    testCases: data.testCases,
  });

  const value = useMemo(
    () => ({
      data,
      workspace,
    }),
    [data, workspace]
  );

  return (
    <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within WorkspaceProvider");
  }
  return context;
}
