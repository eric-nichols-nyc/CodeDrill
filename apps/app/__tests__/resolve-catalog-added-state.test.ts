import { describe, expect, it } from "vitest";
import type { AdminProblemCatalogEntry } from "@/features/admin/lib/admin-problem-catalog";
import type { AdminProblemListItem } from "@/features/admin/lib/problem-form-values";
import {
  normalizeCatalogTitle,
  resolveCatalogAddedState,
} from "@/features/admin/lib/resolve-catalog-added-state";

const sampleEntry: AdminProblemCatalogEntry = {
  catalogKey: "contains-duplicate",
  title: "Contains Duplicate",
  difficulty: "easy",
  getPayload: () => ({
    title: "Contains Duplicate",
    slug: "contains-duplicate",
    difficulty: "easy",
    description: "",
    constraints: "",
    isPublished: false,
    patternSlug: "",
    loopStructure: "",
    skillFocus: "",
    tutorLevel: "",
    visualizationNotes: "",
    editorial: { content: "", embeds: [] },
    tags: [],
    examples: [],
    starterCode: [],
    hints: [],
    solutions: [],
    testCases: [],
  }),
};

const dbProblems: AdminProblemListItem[] = [
  {
    id: "problem-1",
    title: "  Contains Duplicate  ",
    slug: "contains-duplicate-123",
    difficulty: "easy",
    isPublished: false,
  },
];

describe("resolveCatalogAddedState", () => {
  it("normalizes titles when matching", () => {
    expect(normalizeCatalogTitle("  Contains Duplicate  ")).toBe(
      "contains duplicate"
    );
  });

  it("marks a catalog entry as added when a DB title matches", () => {
    expect(resolveCatalogAddedState(sampleEntry, dbProblems)).toEqual({
      isAdded: true,
      problemId: "problem-1",
    });
  });

  it("marks a catalog entry as not added when no DB title matches", () => {
    expect(resolveCatalogAddedState(sampleEntry, [])).toEqual({
      isAdded: false,
    });
  });
});
