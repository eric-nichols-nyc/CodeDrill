"use client";

import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import { androidStudio } from "@fsegurai/codemirror-theme-android-studio";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/components/ui/select";
import { cn } from "@repo/design-system/lib/utils";
import CodeMirror from "@uiw/react-codemirror";
import { useMemo, useState } from "react";
import { JsonFallback } from "@/features/problem-detail/components/json-fallback";
import {
  asRecord,
  strField,
} from "@/features/problem-detail/problem-detail-helpers";

type SyntaxMode = "javascript" | "typescript";

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
  const code = strField(o, "code");
  const fn = strField(o, "functionName");
  const showFn = fn !== null && fn.length > 0;

  const [syntaxMode, setSyntaxMode] = useState<SyntaxMode>("javascript");

  const langExtension = useMemo(
    () =>
      syntaxMode === "typescript"
        ? javascript({ typescript: true })
        : javascript(),
    [syntaxMode]
  );

  const extensions = useMemo(
    () => [
      androidStudio,
      langExtension,
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
    ],
    [langExtension]
  );

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
      <div className="flex shrink-0 items-center justify-between gap-2 border-[#44475a] border-b bg-[#0c0c0e] px-3 py-2">
        <Select
          onValueChange={(v) => setSyntaxMode(v as SyntaxMode)}
          value={syntaxMode}
        >
          <SelectTrigger
            aria-label="Editor syntax"
            className="h-7 w-[min(11rem,100%)] border-[#44475a] bg-[#282a36] text-[#f8f8f2] text-xs shadow-none hover:bg-[#343746] [&_svg]:text-[#f8f8f2]/70"
            size="sm"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="text-xs">
            <SelectItem className="text-xs" value="javascript">
              JavaScript
            </SelectItem>
            <SelectItem className="text-xs" value="typescript">
              TypeScript
            </SelectItem>
          </SelectContent>
        </Select>
        {showFn ? (
          <span className="truncate text-right text-[#f8f8f2]/70 text-xs">
            {fn}
          </span>
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
            extensions={extensions}
            height="100%"
            key={syntaxMode}
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
