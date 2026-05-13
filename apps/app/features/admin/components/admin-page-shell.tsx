"use client";

import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import { Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SplitLayout } from "@/components/split-layout";
import { AdminProblemDetail } from "@/features/admin/components/admin-problem-detail";
import { NewProblemForm } from "@/features/admin/components/new-problem-form";
import {
  type AdminProblemDetail as AdminProblemDetailData,
  type AdminProblemListItem,
  detailToFormValues,
  parseAdminProblemListItem,
} from "@/lib/admin/problem-form-values";

type Mode = "view" | "edit" | "create";

const adminProblemEndpoint = (id: string) => `/api/admin/problems/${id}`;

async function fetchAdminProblemDetail(
  id: string,
  signal?: AbortSignal
): Promise<AdminProblemDetailData> {
  const response = await fetch(adminProblemEndpoint(id), {
    cache: "no-store",
    credentials: "include",
    signal,
  });
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  return (await response.json()) as AdminProblemDetailData;
}

function useAdminProblemDetail(id: string | null, enabled: boolean) {
  const [detail, setDetail] = useState<AdminProblemDetailData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!(id && enabled)) {
      setDetail(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    fetchAdminProblemDetail(id, controller.signal)
      .then((next) => {
        if (!controller.signal.aborted) {
          setDetail(next);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setDetail(null);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [id, enabled]);

  const refresh = useCallback(async () => {
    if (!id) {
      return;
    }
    setLoading(true);
    try {
      setDetail(await fetchAdminProblemDetail(id));
    } finally {
      setLoading(false);
    }
  }, [id]);

  return { detail, loading, refresh };
}

function AdminPageHeader({
  canEdit,
  isEditing,
  onCreateClick,
  onToggleEdit,
}: {
  canEdit: boolean;
  isEditing: boolean;
  onCreateClick: () => void;
  onToggleEdit: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 border-border border-b bg-background/95 px-6 py-4 backdrop-blur">
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
            onClick={onCreateClick}
            size="icon"
            type="button"
          >
            <Plus />
          </Button>
        </div>
        <div className="flex justify-end">
          {canEdit ? (
            <Button
              onClick={onToggleEdit}
              size="sm"
              type="button"
              variant="outline"
            >
              {isEditing ? null : <Pencil />}
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </header>
  );
}

function AdminProblemListPane({
  problems,
  selectedId,
  isCreating,
  onSelect,
}: {
  problems: AdminProblemListItem[];
  selectedId: string | null;
  isCreating: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col border-border border-r bg-muted/10">
      <div className="border-border border-b px-4 py-3">
        <p className="font-medium text-sm">Problems</p>
        <p className="text-muted-foreground text-xs">
          {problems.length} total problem{problems.length === 1 ? "" : "s"}
        </p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        <div className="space-y-2">
          {problems.map((problem) => {
            const isActive = problem.id === selectedId && !isCreating;
            return (
              <button
                className={`w-full rounded-lg border px-3 py-3 text-left transition-colors ${
                  isActive
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background hover:bg-muted/40"
                }`}
                key={problem.id}
                onClick={() => onSelect(problem.id)}
                type="button"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-sm">
                      {problem.title}
                    </p>
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
}

function AdminProblemDetailPane({
  mode,
  loading,
  detail,
  selectedProblem,
  onCreateSubmitted,
  onEditSubmitted,
}: {
  mode: Mode;
  loading: boolean;
  detail: AdminProblemDetailData | null;
  selectedProblem: AdminProblemListItem | null;
  onCreateSubmitted: (body: unknown) => void;
  onEditSubmitted: (body: unknown) => Promise<void>;
}) {
  if (mode === "create") {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="font-semibold text-xl">New problem</h2>
          <p className="text-muted-foreground text-sm">
            Fill out the full authoring form to create a new coding problem.
          </p>
        </div>
        <NewProblemForm onSubmitted={onCreateSubmitted} />
      </div>
    );
  }

  if (loading) {
    return (
      <p className="text-muted-foreground text-sm">
        Loading problem details...
      </p>
    );
  }

  if (!(detail && selectedProblem)) {
    return (
      <p className="text-muted-foreground text-sm">
        Select a problem from the list or create a new one.
      </p>
    );
  }

  if (mode === "edit") {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="font-semibold text-xl">Edit problem</h2>
          <p className="text-muted-foreground text-sm">
            Update the selected problem and save the full replacement payload.
          </p>
        </div>
        <NewProblemForm
          endpoint={adminProblemEndpoint(selectedProblem.id)}
          initialValues={detailToFormValues(detail)}
          method="PUT"
          onSubmitted={onEditSubmitted}
          showDevFill={false}
          submitLabel="Save changes"
          successMessage="Problem updated."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-semibold text-xl">{selectedProblem.title}</h2>
        <p className="text-muted-foreground text-sm">
          Review the full stored problem content before making edits.
        </p>
      </div>
      <AdminProblemDetail detail={detail} />
    </div>
  );
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
  const [mode, setMode] = useState<Mode>(
    initialProblems[0] ? "view" : "create"
  );

  const { detail, loading, refresh } = useAdminProblemDetail(
    selectedId,
    mode !== "create"
  );

  useEffect(() => {
    setProblems(initialProblems);
    setSelectedId((current) => current ?? initialProblems[0]?.id ?? null);
  }, [initialProblems]);

  const selectedProblem = useMemo(
    () => problems.find((problem) => problem.id === selectedId) ?? null,
    [problems, selectedId]
  );

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    setMode("view");
  }, []);

  const handleCreateClick = useCallback(() => {
    setMode("create");
    setSelectedId(null);
  }, []);

  const handleToggleEdit = useCallback(() => {
    setMode((current) => (current === "edit" ? "view" : "edit"));
  }, []);

  const handleCreateSubmitted = useCallback((body: unknown) => {
    const item = parseAdminProblemListItem(body);
    if (!item) {
      return;
    }
    setProblems((prev) => [item, ...prev.filter((p) => p.id !== item.id)]);
    setSelectedId(item.id);
    setMode("view");
  }, []);

  const handleEditSubmitted = useCallback(
    async (body: unknown) => {
      const item = parseAdminProblemListItem(body);
      if (item) {
        setProblems((prev) =>
          prev.map((problem) => (problem.id === item.id ? item : problem))
        );
      }
      await refresh();
      setMode("view");
    },
    [refresh]
  );

  return (
    <div className="h-[calc(100dvh-1rem)] p-4">
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-background">
        <AdminPageHeader
          canEdit={Boolean(selectedProblem)}
          isEditing={mode === "edit"}
          onCreateClick={handleCreateClick}
          onToggleEdit={handleToggleEdit}
        />

        <SplitLayout
          className="min-h-0 flex-1"
          defaultLeftPercent={28}
          left={
            <AdminProblemListPane
              isCreating={mode === "create"}
              onSelect={handleSelect}
              problems={problems}
              selectedId={selectedId}
            />
          }
          minLeftPx={220}
          minRightPx={420}
          right={
            <div className="flex h-full min-h-0 flex-col">
              <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
                <AdminProblemDetailPane
                  detail={detail}
                  loading={loading}
                  mode={mode}
                  onCreateSubmitted={handleCreateSubmitted}
                  onEditSubmitted={handleEditSubmitted}
                  selectedProblem={selectedProblem}
                />
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}
