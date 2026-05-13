import { redirect } from "next/navigation";
import { AdminPageShell } from "@/features/admin/components/admin-page-shell";
import {
  type AdminProblemListItem,
  parseAdminProblemListItem,
} from "@/features/admin/lib/problem-form-values";
import { getNeonAuth } from "@/lib/auth/server";
import { fetchProblemsList } from "@/lib/problems/fetch-problems-list";

export default async function AdminPage() {
  const { session } = await getNeonAuth();

  if (!session) {
    redirect("/auth/sign-in?next=/admin");
  }

  const result = await fetchProblemsList();
  const initialProblems: AdminProblemListItem[] =
    result.ok && Array.isArray(result.body)
      ? result.body
          .map(parseAdminProblemListItem)
          .filter((row): row is AdminProblemListItem => row !== null)
      : [];

  return <AdminPageShell initialProblems={initialProblems} />;
}
