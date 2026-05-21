import { describe, expect, it } from "vitest";
import {
  getAdjacentSlug,
  getRandomSlug,
} from "@/features/problem-slug-nav/utils/get-adjacent-slug";

const slugs = ["alpha", "beta", "gamma"] as const;

describe("getAdjacentSlug", () => {
  it("wraps next from last to first", () => {
    expect(getAdjacentSlug(slugs, "gamma", "next")).toBe("alpha");
  });

  it("wraps prev from first to last", () => {
    expect(getAdjacentSlug(slugs, "alpha", "prev")).toBe("gamma");
  });

  it("returns null for empty catalog", () => {
    expect(getAdjacentSlug([], "alpha", "next")).toBeNull();
  });
});

describe("getRandomSlug", () => {
  it("never returns current slug when others exist", () => {
    for (let i = 0; i < 20; i++) {
      const pick = getRandomSlug(slugs, "beta");
      expect(pick).not.toBe("beta");
      expect(slugs).toContain(pick);
    }
  });
});
