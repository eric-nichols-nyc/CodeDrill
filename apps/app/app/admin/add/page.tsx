import { Suspense } from "react";
import { AdminAddProblemPage } from "@/features/admin/components/admin-add-problem-page";
import {
  type AdminProblemListItem,
  parseAdminProblemListItem,
} from "@/features/admin/lib/problem-form-values";
import { fetchProblemsList } from "@/lib/problems/fetch-problems-list";

export default async function AdminAddPage() {
  const result = await fetchProblemsList();
  const initialProblems: AdminProblemListItem[] =
    result.ok && Array.isArray(result.body)
      ? result.body
          .map(parseAdminProblemListItem)
          .filter((row): row is AdminProblemListItem => row !== null)
      : [];

  return (
    <Suspense fallback={null}>
      <AdminAddProblemPage initialProblems={initialProblems} />
    </Suspense>
  );
}
