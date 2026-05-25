"use client";

import { Button } from "@repo/design-system/components/ui/button";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useProblemNotesQuery } from "@/features/problem-workspace/chat-note-panel/hooks/use-problem-notes-query";
import { useUpsertProblemNotesMutation } from "@/features/problem-workspace/chat-note-panel/hooks/use-upsert-problem-notes-mutation";
import { authClient } from "@/lib/auth/client";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

const modules = {
  toolbar: [
    ["bold", "italic"],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image", "video"],
    ["clean"],
  ],
};

function formatSavedAt(iso: string | null | undefined): string | null {
  if (!iso) {
    return null;
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toLocaleString();
}

export function ProblemNotes({ problemId }: { problemId?: string }) {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const isSignedIn = Boolean(session?.user);

  const notesQuery = useProblemNotesQuery(problemId, isSignedIn);
  const saveMutation = useUpsertProblemNotesMutation(problemId);

  const savedBody = notesQuery.data?.body ?? "";
  const [draft, setDraft] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!isSignedIn) {
      setHydrated(false);
      setDraft("");
      return;
    }
    if (notesQuery.isSuccess && !hydrated) {
      setDraft(savedBody);
      setHydrated(true);
    }
  }, [isSignedIn, notesQuery.isSuccess, savedBody, hydrated]);

  const isDirty = hydrated && draft !== savedBody;
  const isLoading = isSignedIn && (sessionPending || notesQuery.isLoading);

  const statusMessage = useMemo(() => {
    if (!problemId) {
      return "Problem not loaded.";
    }
    if (!isSignedIn) {
      return "Sign in to save notes across sessions.";
    }
    if (isLoading) {
      return "Loading your notes…";
    }
    if (saveMutation.isError) {
      return saveMutation.error.message || "Could not save notes.";
    }
    if (saveMutation.isSuccess && !isDirty) {
      const savedAt = formatSavedAt(notesQuery.data?.updatedAt);
      return savedAt ? `Saved ${savedAt}.` : "Saved.";
    }
    if (isDirty) {
      return "Unsaved changes.";
    }
    const savedAt = formatSavedAt(notesQuery.data?.updatedAt);
    return savedAt ? `Saved ${savedAt}.` : "No saved notes yet.";
  }, [
    problemId,
    isSignedIn,
    isLoading,
    isDirty,
    saveMutation.isError,
    saveMutation.isSuccess,
    saveMutation.error,
    notesQuery.data?.updatedAt,
  ]);

  return (
    <form
      className="flex h-full flex-col space-y-4 p-1"
      onSubmit={(e) => {
        e.preventDefault();
        if (!isSignedIn || !problemId || !isDirty || saveMutation.isPending) {
          return;
        }
        saveMutation.mutate(draft);
      }}
    >
      <div className="flex-1 overflow-hidden bg-background">
        <ReactQuill
          modules={modules}
          onChange={(nextValue) => {
            setDraft(nextValue);
          }}
          placeholder="Capture patterns, mistakes, and takeaways here..."
          readOnly={isLoading}
          theme="snow"
          value={draft}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-xs">{statusMessage}</p>
        <div className="flex items-center gap-2">
          <Button
            disabled={
              !problemId ||
              !isSignedIn ||
              isLoading ||
              !isDirty ||
              saveMutation.isPending
            }
            type="submit"
          >
            {saveMutation.isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    </form>
  );
}
