"use client";

import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import { cn } from "@repo/design-system/lib/utils";
import { JsonFallback } from "@/features/problem-detail/json-fallback";
import {
  asRecord,
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
  value,
  fillHeight = false,
  onChange,
}: {
  row: unknown;
  value?: string;
  /** When true, stretches to fill a flex parent (e.g. single starter file in the panel). */
  fillHeight?: boolean;
  onChange?: (value: string) => void;
}) {
  const o = asRecord(row);
  const lang = strField(o, "language") ?? "code";
  const code = strField(o, "code");
  const fn = strField(o, "functionName");
  const showFn = fn !== null && fn.length > 0;

  const bodyClass = cn(
    "min-h-0 overflow-auto text-xs leading-relaxed",
    fillHeight ? "min-h-0 flex-1" : "min-h-[280px]"
  );

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-md border border-[#44475a] bg-[#282a36]",
        fillHeight ? "h-full min-h-0 flex-1" : ""
      )}
    >
      <div className="flex shrink-0 items-center justify-between border-[#44475a] border-b bg-[#21222c] px-3 py-2">
        <span className="font-mono text-[#bd93f9] text-xs">{lang}</span>
        {showFn ? (
          <span className="text-[#f8f8f2]/70 text-xs">{fn}</span>
        ) : null}
      </div>
      {code !== null ? (
        <div className={cn(bodyClass, "overflow-hidden")}>
          {/* @uiw/react-codemirror defaults to a light theme merged after extensions; theme="none" keeps Dracula. */}
          <CodeMirror
            basicSetup={{
              foldGutter: false,
              highlightActiveLine: true,
            }}
            className="h-full text-sm"
            extensions={[
              dracula,
              ...languageExtensions(lang),
              EditorView.theme({
                "&": {
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
              }),
            ]}
            height="100%"
            onChange={(nextValue) => onChange?.(nextValue)}
            theme="none"
            value={value ?? code}
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
