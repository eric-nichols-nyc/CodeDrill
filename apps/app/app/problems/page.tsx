import { ProblemsPageView } from "@/features/problems-page/components/problems-page-view";
import { mapRowsToProblems } from "@/features/problems-page/lib/map-rows-to-problems";
import { parseProblemsListBody } from "@/features/problems-page/lib/parse-problems-list-body";
import { fetchProblemsList } from "@/lib/problems/fetch-problems-list";

export default async function ProblemsPage() {
  const result = await fetchProblemsList();
  const rows = result.ok ? parseProblemsListBody(result.body) : [];
  const problems = mapRowsToProblems(rows);

  return (
    <ProblemsPageView
      fetchOk={result.ok}
      fetchStatus={result.status}
      initialProblems={problems}
    />
  );
}
