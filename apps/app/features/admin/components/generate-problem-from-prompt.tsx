"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Label } from "@repo/design-system/components/ui/label";
import { Textarea } from "@repo/design-system/components/ui/textarea";
import { useCallback, useState } from "react";
import type { CreateProblemBody } from "@/features/admin/lib/create-problem-schema";
import { requestGeneratedProblem } from "@/features/admin/lib/request-generated-problem";

type GenerateProblemFromPromptProps = {
  onFilled: (values: CreateProblemBody) => void;
};

export function GenerateProblemFromPrompt({
  onFilled,
}: GenerateProblemFromPromptProps) {
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const result = await requestGeneratedProblem(prompt);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onFilled(result.body);
      setPrompt("");
    } finally {
      setBusy(false);
    }
  }, [onFilled, prompt]);

  return (
    <div className="flex flex-col gap-2">
      <div className="space-y-1">
        <Label className="text-xs" htmlFor="admin-generate-problem-prompt">
          Describe the problem (same as you’d tell a teammate)
        </Label>
        <Textarea
          className="min-h-28 font-mono text-xs"
          id="admin-generate-problem-prompt"
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='e.g. "Medium: longest consecutive sequence in an unsorted int array, O(n). Use this solution: …"'
          value={prompt}
        />
      </div>
      <Button
        disabled={busy || !prompt.trim()}
        onClick={run}
        size="sm"
        type="button"
        variant="secondary"
      >
        {busy ? "Generating…" : "Generate & fill form"}
      </Button>
      {error ? (
        <p className="wrap-break-word text-destructive text-xs">{error}</p>
      ) : null}
    </div>
  );
}
