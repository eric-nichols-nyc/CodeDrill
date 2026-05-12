"use client";

import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import { cn } from "@repo/design-system/lib/utils";
import { useEffect, useState } from "react";
import { JsonFallback } from "@/features/problem-detail/json-fallback";
import {
  asRecord,
  rowKey,
  strField,
} from "@/features/problem-detail/problem-detail-helpers";

function languageExtensions(language: string) {
  switch (language.toLowerCase()) {
    case "javascript":
    case "js":
      return [javascript()];
    case "typescript":
    case "ts":
      return [javascript({ typescript: true })];
    default:
      return [];
  }
}

export function SolutionEditor({
  row,
  fillHeight = false,
}: {
  row: unknown;
  /** When true, stretches to fill a flex parent (e.g. single starter file in the panel). */
  fillHeight?: boolean;
}) {
  const o = asRecord(row);
  const editorId = rowKey(o, "starter-code");
  const lang = strField(o, "language") ?? "code";
  const code = strField(o, "code");
  const fn = strField(o, "functionName");
  const showFn = fn !== null && fn.length > 0;
  const [value, setValue] = useState(code ?? "");

  useEffect(() => {
    setValue(code ?? "");
  }, [code, editorId]);

  const bodyClass = cn(
    "min-h-0 overflow-auto text-xs leading-relaxed",
    fillHeight ? "min-h-0 flex-1" : "min-h-[280px]"
  );

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-md border border-border bg-muted/30",
        fillHeight ? "h-full min-h-0 flex-1" : ""
      )}
    >
      <div className="flex shrink-0 items-center justify-between border-border border-b bg-muted/60 px-3 py-2">
        <span className="font-mono text-muted-foreground text-xs">{lang}</span>
        {showFn ? (
          <span className="text-muted-foreground text-xs">{fn}</span>
        ) : null}
      </div>
      {code !== null ? (
        <div className={cn(bodyClass, "overflow-hidden")}>
          <CodeMirror
            basicSetup={{
              foldGutter: false,
              highlightActiveLine: true,
            }}
            className="h-full text-sm"
            extensions={[
              ...languageExtensions(lang),
              EditorView.theme({
                "&": {
                  backgroundColor: "transparent",
                  height: "100%",
                },
                ".cm-scroller": {
                  fontFamily:
                    "ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, monospace",
                  overflow: "auto",
                },
                ".cm-content": {
                  minHeight: "100%",
                  padding: "12px",
                },
                ".cm-gutters": {
                  backgroundColor: "transparent",
                  borderRight: "1px solid hsl(var(--border) / 0.45)",
                },
              }),
            ]}
            height="100%"
            onChange={setValue}
            value={value}
          />
        </div>
      ) : (
        <div className={cn(bodyClass, "min-h-0")}>
          <JsonFallback data={row} />
        </div>
      )}
    </div>
  );
}
