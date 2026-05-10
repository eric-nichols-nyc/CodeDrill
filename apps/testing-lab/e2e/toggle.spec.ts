import { expect, test } from "@playwright/test";

test.describe("Toggle Demo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/hooks");
  });

  test("toggle switch is visible", async ({ page }) => {
    await expect(page.getByTestId("toggle-switch")).toBeVisible();
  });

  test("clicking toggle changes state", async ({ page }) => {
    const toggle = page.getByTestId("toggle-switch");
    const status = page.getByTestId("toggle-status");

    // Check initial state
    const initialStatus = await status.textContent();
    expect(initialStatus).toContain("OFF");

    // Click toggle
    await toggle.click();

    // Check updated state
    const updatedStatus = await status.textContent();
    expect(updatedStatus).toContain("ON");
  });

  test("toggle can be turned on and off multiple times", async ({ page }) => {
    const toggle = page.getByTestId("toggle-switch");
    const status = page.getByTestId("toggle-status");

    // Toggle on
    await toggle.click();
    expect(await status.textContent()).toContain("ON");

    // Toggle off
    await toggle.click();
    expect(await status.textContent()).toContain("OFF");

    // Toggle on again
    await toggle.click();
    expect(await status.textContent()).toContain("ON");
  });
});
