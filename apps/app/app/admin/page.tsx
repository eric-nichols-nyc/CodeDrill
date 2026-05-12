import { AdminPageShell } from "./admin-page-shell";
import { getNeonAuth } from "@/lib/auth/server";
import { type AdminProblemListItem } from "@/lib/admin/problem-form-values";
import { fetchProblemsList } from "@/lib/problems/fetch-problems-list";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const { session } = await getNeonAuth();

  if (!session) {
    redirect("/auth/sign-in?next=/admin");
  }

  const result = await fetchProblemsList();
  const initialProblems: AdminProblemListItem[] =
    result.ok && Array.isArray(result.body)
      ? result.body
          .map((row) => {
            if (typeof row !== "object" || row === null) {
              return null;
            }
            const record = row as Record<string, unknown>;
            return typeof record.id === "string" &&
              typeof record.title === "string" &&
              typeof record.slug === "string" &&
              typeof record.difficulty === "string"
              ? {
                  id: record.id,
                  title: record.title,
                  slug: record.slug,
                  difficulty: record.difficulty,
                  isPublished: record.isPublished === true,
                }
              : null;
          })
          .filter((row): row is AdminProblemListItem => row !== null)
      : [];

  return <AdminPageShell initialProblems={initialProblems} />;
}
