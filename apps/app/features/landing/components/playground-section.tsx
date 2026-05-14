"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { cn } from "@repo/design-system/lib/utils";
import { Copy, Play, SquareTerminal } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

const starters = {
  javascript: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i += 1) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}`,
  python: `class Solution:
    def twoSum(self, nums, target):
        seen = {}
        for i, n in enumerate(nums):
            complement = target - n
            if complement in seen:
                return [seen[complement], i]
            seen[n] = i
        return []`,
  typescript: `function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i += 1) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement)!, i];
    }
    seen.set(nums[i], i);
  }
  return [];
}`,
} as const;

type PlaygroundLang = keyof typeof starters;

const monacoLanguage: Record<PlaygroundLang, string> = {
  javascript: "javascript",
  python: "python",
  typescript: "typescript",
};

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-1 items-center justify-center bg-muted text-muted-foreground text-sm">
      Loading editor…
    </div>
  ),
});

export function PlaygroundSection() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<PlaygroundLang>("javascript");
  const [code, setCode] = useState<string>(starters.javascript);
  const [copyLabel, setCopyLabel] = useState("Copy");

  useEffect(() => {
    setMounted(true);
  }, []);

  const editorTheme = mounted && resolvedTheme === "dark" ? "vs-dark" : "vs";

  const selectLang = useCallback((next: PlaygroundLang) => {
    setLang(next);
    setCode(starters[next]);
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopyLabel("Copied!");
      setTimeout(() => setCopyLabel("Copy"), 1500);
    } catch {
      setCopyLabel("Failed");
      setTimeout(() => setCopyLabel("Copy"), 1500);
    }
  }

  function runCode() {
    console.log("[playground-section] runCode", { code });
    // POST /submissions/run when wired
  }

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="flex h-[360px] flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <div className="flex shrink-0 flex-wrap items-stretch justify-between gap-2 border-border border-b bg-muted/60 px-1 pt-1 dark:bg-neutral-900/80">
            <div className="flex min-w-0">
              {(
                [
                  ["javascript", "JavaScript"],
                  ["python", "Python"],
                  ["typescript", "TypeScript"],
                ] as const
              ).map(([id, label]) => (
                <button
                  className={cn(
                    "relative shrink-0 border-border border-t-2 px-3 py-2 font-medium text-sm transition-colors",
                    lang === id
                      ? "border-green-600 bg-background text-foreground dark:bg-neutral-950"
                      : "border-transparent text-muted-foreground hover:bg-background/60 hover:text-foreground dark:hover:bg-neutral-800/80"
                  )}
                  key={id}
                  onClick={() => selectLang(id)}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex shrink-0 items-center gap-1.5 p-1.5 sm:gap-2">
              <Button
                className="h-8 gap-1.5 px-2.5 sm:px-3"
                onClick={handleCopy}
                size="sm"
                type="button"
                variant="outline"
              >
                <Copy aria-hidden className="size-3.5" />
                {copyLabel}
              </Button>
              <Button
                className="h-8 gap-1.5 bg-green-600 px-2.5 text-white hover:bg-green-700 sm:px-3"
                onClick={runCode}
                size="sm"
                type="button"
              >
                <Play aria-hidden className="size-3.5 fill-current" />
                Run
              </Button>
              <Button
                asChild
                className="h-8 gap-1.5 bg-neutral-900 px-2.5 text-neutral-50 hover:bg-neutral-800 sm:px-3 dark:bg-neutral-950 dark:hover:bg-neutral-900"
                size="sm"
              >
                <Link href="/problems">
                  <SquareTerminal aria-hidden className="size-3.5" />
                  Playground
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative min-h-0 flex-1">
            <div className="absolute inset-0">
              <MonacoEditor
                height="100%"
                language={monacoLanguage[lang]}
                onChange={(value) => setCode(value ?? "")}
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                  wordWrap: "on",
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  folding: true,
                  lineNumbers: "on",
                  padding: { top: 8 },
                }}
                theme={editorTheme}
                value={code}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
