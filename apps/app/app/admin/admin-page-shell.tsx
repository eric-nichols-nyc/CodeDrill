"use client";

import { Pencil, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@repo/design-system/components/ui/button";
import { Badge } from "@repo/design-system/components/ui/badge";
import { SplitLayout } from "@/components/split-layout";
import { AdminProblemDetail } from "./admin-problem-detail";
import { NewProblemForm } from "./new-problem-form";
import {
  detailToFormValues,
  type AdminProblemDetail,
  type AdminProblemListItem,
} from "@/lib/admin/problem-form-values";

function asListItem(value: unknown): AdminProblemListItem | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }
  const row = value as Record<string, unknown>;
  return typeof row.id === "string" &&
    typeof row.title === "string" &&
    typeof row.slug === "string" &&
    typeof row.difficulty === "string"
    ? {
        id: row.id,
        title: row.title,
        slug: row.slug,
        difficulty: row.difficulty,
        isPublished: row.isPublished === true,
      }
    : null;
}

export function AdminPageShell({
  initialProblems,
}: {
  initialProblems: AdminProblemListItem[];
}) {
  const [problems, setProblems] = useState(initialProblems);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialProblems[0]?.id ?? null
  );
  const [detail, setDetail] = useState<AdminProblemDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [mode, setMode] = useState<"view" | "edit" | "create">(
    initialProblems[0] ? "view" : "create"
  );

  useEffect(() => {
    setProblems(initialProblems);
    setSelectedId((current) => current ?? initialProblems[0]?.id ?? null);
  }, [initialProblems]);

  useEffect(() => {
    if (!selectedId || mode === "create") {
      return;
    }

    let cancelled = false;
    setLoadingDetail(true);

    void fetch(`/api/admin/problems/${selectedId}`, {
      cache: "no-store",
      credentials: "include",
    })
      .then(async (response) => {
        const text = await response.text();
        const body = text ? (JSON.parse(text) as unknown) : null;
        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`);
        }
        return body as AdminProblemDetail;
      })
      .then((body) => {
        if (!cancelled) {
          setDetail(body);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDetail(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingDetail(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedId, mode]);

  const selectedProblem = useMemo(
    () => problems.find((problem) => problem.id === selectedId) ?? null,
    [problems, selectedId]
  );
  const editValues = useMemo(
    () => (detail ? detailToFormValues(detail) : undefined),
    [detail]
  );

  const listPane = (
    <div className="flex h-full min-h-0 flex-col border-r border-border bg-muted/10">
      <div className="border-b border-border px-4 py-3">
        <p className="font-medium text-sm">Problems</p>
        <p className="text-muted-foreground text-xs">
          {problems.length} total problem{problems.length === 1 ? "" : "s"}
        </p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        <div className="space-y-2">
          {problems.map((problem) => {
            const isActive = problem.id === selectedId && mode !== "create";
            return (
              <button
                className={`w-full rounded-lg border px-3 py-3 text-left transition-colors ${
                  isActive
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background hover:bg-muted/40"
                }`}
                key={problem.id}
                onClick={() => {
                  setSelectedId(problem.id);
                  setMode("view");
                }}
                type="button"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-sm">{problem.title}</p>
                    <p className="truncate text-muted-foreground text-xs">
                      {problem.slug}
                    </p>
                  </div>
                  <Badge variant="outline">{problem.difficulty}</Badge>
                </div>
                <div className="mt-2">
                  <Badge variant="outline">
                    {problem.isPublished ? "published" : "draft"}
                  </Badge>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const detailPane = (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
        {mode === "create" ? (
          <div className="space-y-4">
            <div>
              <h2 className="font-semibold text-xl">New problem</h2>
              <p className="text-muted-foreground text-sm">
                Fill out the full authoring form to create a new coding problem.
              </p>
            </div>
            <NewProblemForm
              onSubmitted={(body) => {
                const item = asListItem(body);
                if (item) {
                  setProblems((prev) => [item, ...prev.filter((p) => p.id !== item.id)]);
                  setSelectedId(item.id);
                  setMode("view");
                }
              }}
            />
          </div>
        ) : loadingDetail ? (
          <p className="text-muted-foreground text-sm">Loading problem details...</p>
        ) : detail && selectedProblem ? (
          mode === "edit" ? (
            <div className="space-y-4">
              <div>
                <h2 className="font-semibold text-xl">Edit problem</h2>
                <p className="text-muted-foreground text-sm">
                  Update the selected problem and save the full replacement payload.
                </p>
              </div>
              <NewProblemForm
                endpoint={`/api/admin/problems/${selectedProblem.id}`}
                initialValues={editValues}
                method="PUT"
                onSubmitted={async (body) => {
                  const item = asListItem(body);
                  if (item) {
                    setProblems((prev) =>
                      prev.map((problem) =>
                        problem.id === item.id ? item : problem
                      )
                    );
                  }

                  const response = await fetch(`/api/admin/problems/${selectedProblem.id}`, {
                    cache: "no-store",
                    credentials: "include",
                  });
                  const nextDetail = (await response.json()) as AdminProblemDetail;
                  setDetail(nextDetail);
                  setMode("view");
                }}
                showDevFill={false}
                submitLabel="Save changes"
                successMessage="Problem updated."
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h2 className="font-semibold text-xl">{selectedProblem.title}</h2>
                <p className="text-muted-foreground text-sm">
                  Review the full stored problem content before making edits.
                </p>
              </div>
              <AdminProblemDetail detail={detail} />
            </div>
          )
        ) : (
          <p className="text-muted-foreground text-sm">
            Select a problem from the list or create a new one.
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100dvh-1rem)] p-4">
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-background">
        <header className="sticky top-0 z-20 border-b border-border bg-background/95 px-6 py-4 backdrop-blur">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="flex items-center gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href="/">Home</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/problems">Problems</Link>
              </Button>
            </div>
            <div className="flex justify-center">
              <Button
                aria-label="Create new problem"
                onClick={() => {
                  setMode("create");
                  setSelectedId(null);
                  setDetail(null);
                }}
                size="icon"
                type="button"
              >
                <Plus />
              </Button>
            </div>
            <div className="flex justify-end">
              {selectedProblem ? (
                <Button
                  onClick={() => setMode(mode === "edit" ? "view" : "edit")}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  {mode === "edit" ? null : <Pencil />}
                  {mode === "edit" ? "Cancel" : "Edit"}
                </Button>
              ) : <div />}
            </div>
          </div>
        </header>

        <SplitLayout
          className="min-h-0 flex-1"
          defaultLeftPercent={28}
          left={listPane}
          minLeftPx={220}
          minRightPx={420}
          right={detailPane}
        />
      </div>
    </div>
  );
}
