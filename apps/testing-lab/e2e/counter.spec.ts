import { expect, test } from "@playwright/test";

test.describe("Counter Demo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/hooks");
  });

  test("displays counter with initial value", async ({ page }) => {
    await expect(page.getByTestId("counter-value")).toBeVisible();
  });

  test("increments counter when + button is clicked", async ({ page }) => {
    const counter = page.getByTestId("counter-value");
    const initialValue = await counter.textContent();

    await page.getByRole("button", { name: "+" }).click();

    const newValue = await counter.textContent();
    expect(Number(newValue)).toBe(Number(initialValue) + 1);
  });

  test("decrements counter when - button is clicked", async ({ page }) => {
    const counter = page.getByTestId("counter-value");

    // First increment to have something to decrement
    await page.getByRole("button", { name: "+" }).click();
    const beforeDecrement = await counter.textContent();

    await page.getByRole("button", { name: "-" }).click();

    const afterDecrement = await counter.textContent();
    expect(Number(afterDecrement)).toBe(Number(beforeDecrement) - 1);
  });

  test("resets counter to initial value", async ({ page }) => {
    // Increment a few times
    await page.getByRole("button", { name: "+" }).click();
    await page.getByRole("button", { name: "+" }).click();
    await page.getByRole("button", { name: "+" }).click();

    // Reset
    await page.getByRole("button", { name: "Reset" }).click();

    const counter = page.getByTestId("counter-value");
    expect(await counter.textContent()).toBe("0");
  });
});
