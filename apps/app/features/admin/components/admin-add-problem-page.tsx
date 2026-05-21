"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminProblemListSidebar } from "@/features/admin/components/admin-problem-list-sidebar";
import { AdminSplitShell } from "@/features/admin/components/admin-split-shell";
import { NewProblemForm } from "@/features/admin/components/new-problem-form";
import { findCatalogEntry } from "@/features/admin/lib/admin-problem-catalog";
import { getCatalogProblemPayload } from "@/features/admin/lib/get-catalog-problem-payload";
import {
  type AdminProblemListItem,
  parseAdminProblemListItem,
} from "@/features/admin/lib/problem-form-values";

export function AdminAddProblemPage({
  initialProblems,
}: {
  initialProblems: AdminProblemListItem[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const catalogKey = searchParams.get("catalogKey");

  const initialValues = useMemo(() => {
    if (!catalogKey) {
      return;
    }
    const entry = findCatalogEntry(catalogKey);
    if (!entry) {
      return;
    }
    return getCatalogProblemPayload(entry);
  }, [catalogKey]);

  const description =
    catalogKey && initialValues
      ? `Prefilled from catalog template "${initialValues.title}". Review and submit to create it in the database.`
      : "Fill out the authoring form below. After you create a problem, you will return to the admin list with it selected.";
  const unknownCatalogKey = Boolean(catalogKey && !initialValues);

  const handleSubmitted = useCallback(
    (body: unknown) => {
      const item = parseAdminProblemListItem(body);
      if (item) {
        router.push(`/admin?id=${encodeURIComponent(item.id)}`);
        return;
      }
      router.push("/admin");
    },
    [router]
  );

  return (
    <AdminSplitShell
      header={<AdminPageHeader variant="add" />}
      sidebar={<AdminProblemListSidebar dbProblems={initialProblems} />}
    >
      <div className="mx-auto max-w-5xl space-y-6 pb-6">
        <div>
          <h1 className="font-semibold text-2xl">Add a problem</h1>
          <p className="text-muted-foreground text-sm">{description}</p>
          {unknownCatalogKey ? (
            <p className="mt-2 text-destructive text-sm">
              Unknown catalog key &quot;{catalogKey}&quot;. Choose a template
              from the admin catalog tab.
            </p>
          ) : null}
        </div>
        <NewProblemForm
          initialValues={initialValues}
          onSubmitted={handleSubmitted}
        />
      </div>
    </AdminSplitShell>
  );
}
