import { expect, test } from "@playwright/test";

test.describe("Home", () => {
  test("homepage has correct title", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Next.js Optimization Lab" })
    ).toBeVisible();
  });

  test("shows strategy cards", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Network Bottleneck")).toBeVisible();
    await expect(page.getByText("useMemo")).toBeVisible();
  });
});
