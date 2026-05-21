"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@repo/design-system/components/ui/dialog";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminProblemDetail } from "@/features/admin/components/admin-problem-detail";
import { AdminProblemListSidebar } from "@/features/admin/components/admin-problem-list-sidebar";
import { AdminSplitShell } from "@/features/admin/components/admin-split-shell";
import { NewProblemForm } from "@/features/admin/components/new-problem-form";
import {
  type AdminProblemDetail as AdminProblemDetailData,
  type AdminProblemListItem,
  detailToFormValues,
  parseAdminProblemListItem,
} from "@/features/admin/lib/problem-form-values";

type Mode = "view" | "edit";

const adminProblemFormDialogContentClass =
  "flex max-h-[min(56rem,calc(100dvh-2rem))] max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl";

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

function AdminProblemDetailPane({
  loading,
  detail,
  selectedProblem,
}: {
  loading: boolean;
  detail: AdminProblemDetailData | null;
  selectedProblem: AdminProblemListItem | null;
}) {
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
        Select a problem from the list or{" "}
        <Link className="text-foreground underline" href="/admin/add">
          add one
        </Link>
        .
      </p>
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
  initialSelectedId,
}: {
  initialProblems: AdminProblemListItem[];
  initialSelectedId?: string | null;
}) {
  const [problems, setProblems] = useState(initialProblems);
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    if (
      initialSelectedId &&
      initialProblems.some((problem) => problem.id === initialSelectedId)
    ) {
      return initialSelectedId;
    }
    return initialProblems[0]?.id ?? null;
  });
  const [mode, setMode] = useState<Mode>("view");

  const { detail, loading, refresh } = useAdminProblemDetail(
    selectedId,
    selectedId !== null
  );

  useEffect(() => {
    setProblems(initialProblems);
    if (
      initialSelectedId &&
      initialProblems.some((problem) => problem.id === initialSelectedId)
    ) {
      setSelectedId(initialSelectedId);
      return;
    }
    setSelectedId((current) => current ?? initialProblems[0]?.id ?? null);
  }, [initialProblems, initialSelectedId]);

  const selectedProblem = useMemo(
    () => problems.find((problem) => problem.id === selectedId) ?? null,
    [problems, selectedId]
  );

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    setMode("view");
  }, []);

  const handleToggleEdit = useCallback(() => {
    setMode((current) => (current === "edit" ? "view" : "edit"));
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

  const canEditProblem =
    selectedProblem !== null && detail !== null && !loading;
  const editDialogOpen = mode === "edit" && canEditProblem;

  return (
    <AdminSplitShell
      header={
        <AdminPageHeader
          canEdit={canEditProblem}
          isEditing={mode === "edit"}
          onToggleEdit={handleToggleEdit}
          variant="browse"
        />
      }
      modals={
        <Dialog
          onOpenChange={(open) => {
            if (!open) {
              setMode("view");
            }
          }}
          open={editDialogOpen}
        >
          <DialogContent
            className={adminProblemFormDialogContentClass}
            showCloseButton
          >
            {selectedProblem !== null && detail !== null ? (
              <>
                <DialogHeader className="shrink-0 border-border border-b px-6 py-4 pr-14 text-left">
                  <DialogTitle>Edit problem</DialogTitle>
                  <DialogDescription>
                    Update the stored problem definition and submit the full
                    replacement payload.
                  </DialogDescription>
                </DialogHeader>
                <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-4 pb-0">
                  <NewProblemForm
                    endpoint={adminProblemEndpoint(selectedProblem.id)}
                    initialValues={detailToFormValues(detail)}
                    method="PUT"
                    onSubmitted={handleEditSubmitted}
                    showDevFill={false}
                    submitLabel="Save changes"
                    successMessage="Problem updated."
                  />
                </div>
              </>
            ) : null}
          </DialogContent>
        </Dialog>
      }
      sidebar={
        <AdminProblemListSidebar
          dbProblems={problems}
          onSelectProblem={handleSelect}
          selectedId={selectedId}
        />
      }
    >
      <AdminProblemDetailPane
        detail={detail}
        loading={loading}
        selectedProblem={selectedProblem}
      />
    </AdminSplitShell>
  );
}
