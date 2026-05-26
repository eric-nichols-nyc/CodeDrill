"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/design-system/components/ui/alert-dialog";
import { Button } from "@repo/design-system/components/ui/button";
import { Label } from "@repo/design-system/components/ui/label";
import { Textarea } from "@repo/design-system/components/ui/textarea";
import { useCallback, useState } from "react";
import {
  AI_PROBLEM_DRAFT_SUCCESS_MESSAGE,
  AI_PROBLEM_OVERWRITE_CONFIRM_MESSAGE,
  AI_PROBLEM_PROMPT_MAX_LENGTH,
} from "@/features/admin/lib/ai-problem-generate";
import type { CreateProblemBody } from "@/features/admin/lib/create-problem-schema";
import { requestGeneratedProblem } from "@/features/admin/lib/request-generated-problem";

type GenerateProblemFromPromptProps = {
  onFilled: (values: CreateProblemBody) => void;
  hasUnsavedFormValues?: boolean;
};

export function GenerateProblemFromPrompt({
  onFilled,
  hasUnsavedFormValues = false,
}: GenerateProblemFromPromptProps) {
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const trimmedPrompt = prompt.trim();
  const promptTooLong = prompt.length > AI_PROBLEM_PROMPT_MAX_LENGTH;
  const canGenerate = trimmedPrompt.length > 0 && !promptTooLong && !busy;

  const executeGenerate = useCallback(async () => {
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await requestGeneratedProblem(trimmedPrompt);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onFilled(result.body);
      setSuccess(AI_PROBLEM_DRAFT_SUCCESS_MESSAGE);
    } finally {
      setBusy(false);
    }
  }, [onFilled, trimmedPrompt]);

  const requestGenerate = useCallback(() => {
    if (!canGenerate) {
      return;
    }
    if (hasUnsavedFormValues) {
      setConfirmOpen(true);
      return;
    }
    executeGenerate().catch(() => {
      // Errors are surfaced via component state in executeGenerate.
    });
  }, [canGenerate, executeGenerate, hasUnsavedFormValues]);

  const handlePromptChange = (value: string) => {
    setPrompt(value);
    setSuccess(null);
    if (error) {
      setError(null);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <Label className="text-xs" htmlFor="admin-generate-problem-prompt">
              Describe the problem (same as you’d tell a teammate)
            </Label>
            <span
              className={
                promptTooLong
                  ? "text-destructive text-xs tabular-nums"
                  : "text-muted-foreground text-xs tabular-nums"
              }
            >
              {prompt.length} / {AI_PROBLEM_PROMPT_MAX_LENGTH}
            </span>
          </div>
          <Textarea
            className="min-h-28 font-mono text-xs"
            id="admin-generate-problem-prompt"
            maxLength={AI_PROBLEM_PROMPT_MAX_LENGTH}
            onChange={(e) => {
              handlePromptChange(e.target.value);
            }}
            placeholder='e.g. "Medium: longest consecutive sequence in an unsorted int array, O(n). Use this solution: …"'
            value={prompt}
          />
          {promptTooLong ? (
            <p className="text-destructive text-xs">
              Prompt must be {AI_PROBLEM_PROMPT_MAX_LENGTH} characters or fewer.
            </p>
          ) : null}
        </div>
        <Button
          disabled={!canGenerate}
          onClick={requestGenerate}
          size="sm"
          type="button"
          variant="secondary"
        >
          {busy ? "Generating…" : "Generate & fill form"}
        </Button>
        {success ? (
          <p className="text-muted-foreground text-xs">{success}</p>
        ) : null}
        {error ? (
          <p className="wrap-break-word text-destructive text-xs">{error}</p>
        ) : null}
      </div>

      <AlertDialog onOpenChange={setConfirmOpen} open={confirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace form values?</AlertDialogTitle>
            <AlertDialogDescription>
              {AI_PROBLEM_OVERWRITE_CONFIRM_MESSAGE}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmOpen(false);
                executeGenerate().catch(() => {
                  // Errors are surfaced via component state in executeGenerate.
                });
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
