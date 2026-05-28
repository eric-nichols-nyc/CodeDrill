import { AdminPageShell } from "@/features/admin/components/admin-page-shell";
import {
  type AdminProblemListItem,
  parseAdminProblemListItem,
} from "@/features/admin/lib/problem-form-values";
import { fetchProblemsList } from "@/lib/problems/fetch-problems-list";

type AdminPageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const { id: initialSelectedId } = await searchParams;

  const result = await fetchProblemsList();
  const initialProblems: AdminProblemListItem[] =
    result.ok && Array.isArray(result.body)
      ? result.body
          .map(parseAdminProblemListItem)
          .filter((row): row is AdminProblemListItem => row !== null)
      : [];

  return (
    <AdminPageShell
      initialProblems={initialProblems}
      initialSelectedId={initialSelectedId ?? null}
    />
  );
}
