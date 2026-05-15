import type { Problem, SortDirection, SortField } from "../../lib/types";

const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 } as const;

export function sortProblems(
  problems: Problem[],
  sortField: SortField,
  sortDirection: SortDirection
): Problem[] {
  return [...problems].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case "id":
        comparison = a.id - b.id;
        break;
      case "title":
        comparison = a.title.localeCompare(b.title);
        break;
      case "acceptance":
        comparison = a.acceptance - b.acceptance;
        break;
      case "difficulty":
        comparison =
          difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        break;
      default:
        break;
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });
}
