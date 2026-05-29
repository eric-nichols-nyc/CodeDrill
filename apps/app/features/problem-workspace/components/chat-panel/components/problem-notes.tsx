"use client";

import { Button } from "@repo/design-system/components/ui/button";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useWorkspace } from "@/features/problem-workspace/components/shell/workspace-provider";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

function initialNotesValue(learningNotes?: unknown): string {
  if (typeof learningNotes === "string") {
    return learningNotes;
  }

  if (Array.isArray(learningNotes)) {
    const firstWithBody = learningNotes.find(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "body" in item &&
        typeof (item as { body?: unknown }).body === "string"
    ) as { body?: string } | undefined;

    return firstWithBody?.body ?? "";
  }

  if (
    typeof learningNotes === "object" &&
    learningNotes !== null &&
    "body" in learningNotes &&
    typeof (learningNotes as { body?: unknown }).body === "string"
  ) {
    return (learningNotes as { body: string }).body;
  }

  return "";
}

const modules = {
  toolbar: [
    ["bold", "italic"], // toggled buttons
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image", "video"],
    ["clean"], // remove formatting
  ],
};

export function ProblemNotes() {
  const { data } = useWorkspace();
  const initialValue = useMemo(
    () => initialNotesValue(data.learningNotes),
    [data.learningNotes]
  );
  const [value, setValue] = useState(initialValue);
  const [status, setStatus] = useState<"idle" | "saved">("idle");

  return (
    <form
      className="flex h-full flex-col space-y-4 p-1"
      onSubmit={(e) => {
        e.preventDefault();
        setStatus("saved");
      }}
    >
      <div className="flex-1 overflow-hidden bg-background">
        <ReactQuill
          modules={modules}
          onChange={(nextValue) => {
            setValue(nextValue);
            setStatus("idle");
          }}
          placeholder="Capture patterns, mistakes, and takeaways here..."
          theme="snow"
          value={value}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-xs">
          {status === "saved"
            ? "Notes saved locally in this session."
            : "Unsaved changes."}
        </p>
        <div className="flex items-center gap-2">
          <Button type="submit">Save</Button>
        </div>
      </div>
    </form>
  );
}
