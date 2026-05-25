import { describe, expect, it } from "vitest";
import type { Problem } from "@/features/problems-page/lib/types";
import { createFilterRow } from "@/features/problems-page/problems-list/utils/create-filter-row";
import { problemMatchesProblemsListQuery } from "@/features/problems-page/problems-list/utils/matches-problems-list-query";

function sampleProblem(overrides: Partial<Problem> = {}): Problem {
  return {
    id: 1,
    slug: "two-sum",
    title: "Two Sum",
    acceptance: 50,
    difficulty: "Easy",
    status: "unsolved",
    tags: ["Array", "Hash Table"],
    isPremium: false,
    ...overrides,
  };
}

describe("problemMatchesProblemsListQuery", () => {
  it("matches when search and filters are empty", () => {
    expect(
      problemMatchesProblemsListQuery(sampleProblem(), {
        search: "",
        filterRows: [createFilterRow()],
      })
    ).toBe(true);
  });

  it("matches title substring case-insensitively", () => {
    const problem = sampleProblem({ title: "Valid Anagram" });

    expect(
      problemMatchesProblemsListQuery(problem, {
        search: "array",
        filterRows: [],
      })
    ).toBe(false);

    expect(
      problemMatchesProblemsListQuery(problem, {
        search: "anagram",
        filterRows: [],
      })
    ).toBe(true);

    expect(
      problemMatchesProblemsListQuery(problem, {
        search: "  ANA  ",
        filterRows: [],
      })
    ).toBe(true);
  });

  it("filters by difficulty", () => {
    const problem = sampleProblem({ difficulty: "Medium" });

    expect(
      problemMatchesProblemsListQuery(problem, {
        search: "",
        filterRows: [createFilterRow({ field: "difficulty", value: "Medium" })],
      })
    ).toBe(true);

    expect(
      problemMatchesProblemsListQuery(problem, {
        search: "",
        filterRows: [createFilterRow({ field: "difficulty", value: "Easy" })],
      })
    ).toBe(false);
  });

  it("filters by status", () => {
    const problem = sampleProblem({ status: "solved" });

    expect(
      problemMatchesProblemsListQuery(problem, {
        search: "",
        filterRows: [createFilterRow({ field: "status", value: "solved" })],
      })
    ).toBe(true);

    expect(
      problemMatchesProblemsListQuery(problem, {
        search: "",
        filterRows: [createFilterRow({ field: "status", value: "attempted" })],
      })
    ).toBe(false);
  });

  it("filters by topic tag", () => {
    const problem = sampleProblem({ tags: ["Array", "Two Pointers"] });

    expect(
      problemMatchesProblemsListQuery(problem, {
        search: "",
        filterRows: [createFilterRow({ field: "topic", value: "Array" })],
      })
    ).toBe(true);

    expect(
      problemMatchesProblemsListQuery(problem, {
        search: "",
        filterRows: [createFilterRow({ field: "topic", value: "Dynamic Programming" })],
      })
    ).toBe(false);
  });

  it("ignores filter rows with empty values", () => {
    expect(
      problemMatchesProblemsListQuery(sampleProblem(), {
        search: "",
        filterRows: [createFilterRow({ field: "difficulty", value: "   " })],
      })
    ).toBe(true);
  });

  it("combines search and filter rows with AND logic", () => {
    const problem = sampleProblem({
      title: "Two Sum",
      difficulty: "Easy",
      status: "unsolved",
      tags: ["Array"],
    });

    expect(
      problemMatchesProblemsListQuery(problem, {
        search: "two",
        filterRows: [
          createFilterRow({ field: "difficulty", value: "Easy" }),
          createFilterRow({ field: "topic", value: "Array" }),
        ],
      })
    ).toBe(true);

    expect(
      problemMatchesProblemsListQuery(problem, {
        search: "two",
        filterRows: [
          createFilterRow({ field: "difficulty", value: "Easy" }),
          createFilterRow({ field: "topic", value: "Graph" }),
        ],
      })
    ).toBe(false);
  });
});
