"use client";

/**
 * Thin Monaco wrapper: client-only load, syntax from optional `language` prop
 * (starter row language), controlled `value` / `onChange`. Export name is
 * `MonacoSolutionEdtor` (existing spelling).
 */

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

/** Maps problem `starterCode` language strings to Monaco built-in language ids. */
function toMonacoLanguage(language: string | undefined): string {
  const raw = (language ?? "javascript").toLowerCase();
  if (raw === "ts") {
    return "typescript";
  }
  if (raw === "js") {
    return "javascript";
  }
  if (raw === "py") {
    return "python";
  }
  if (raw === "javascript" || raw === "typescript" || raw === "python") {
    return raw;
  }
  return "javascript";
}

/** Controlled code editor; fills parent when `className` includes flex-1 / h-full. */
export function MonacoSolutionEdtor({
  value,
  onChange,
  className,
  language: starterLanguage,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  /** Starter row `language` (e.g. `typescript`); drives Monaco syntax highlighting. */
  language?: string;
}) {
  const monacoLanguage = toMonacoLanguage(starterLanguage);

  return (
    <div className={cn("relative min-h-0 flex-1", className)}>
      <div className="absolute inset-0">
        <MonacoEditor
          height="100%"
          language={monacoLanguage}
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
