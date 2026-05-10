import { expect, test } from "@playwright/test";

test.describe("Navigation", () => {
  test("homepage has correct title", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Testing Lab" })
    ).toBeVisible();
  });

  test("homepage shows all demo cards", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Custom Hooks")).toBeVisible();
    await expect(page.getByText("Component Testing")).toBeVisible();
    await expect(page.getByText("API Mocking")).toBeVisible();
    await expect(page.getByText("Async Patterns")).toBeVisible();
  });

  test("can navigate to hooks demo", async ({ page }) => {
    await page.goto("/");
    await page.click('text="Custom Hooks"');
    await expect(page).toHaveURL("/hooks");
  });
});
