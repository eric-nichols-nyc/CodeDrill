"use client";

import { cn } from "@repo/design-system/lib/utils";
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-1 items-center justify-center bg-muted text-muted-foreground text-sm">
      Loading editor…
    </div>
  ),
});

export function MonacoSolutionEdtor({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("relative min-h-0 flex-1", className)}>
      <div className="absolute inset-0">
        <MonacoEditor
          height="100%"
          language="javascript"
          onChange={(next) => onChange(next ?? "")}
          options={{
            fontSize: 13,
            minimap: { enabled: false },
            wordWrap: "on",
            automaticLayout: true,
            scrollBeyondLastLine: false,
          }}
          theme="vs-dark"
          value={value}
        />
      </div>
    </div>
  );
}
