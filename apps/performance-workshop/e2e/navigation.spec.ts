import { expect, test } from '@playwright/test'

test.describe('Navigation', () => {
  test('can navigate to Elements', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Elements' }).click()
    await expect(page).toHaveURL('/elements')
    await expect(
      page.getByRole('heading', { level: 1, name: 'Elements' })
    ).toBeVisible()
  })

  test('can navigate to Rerenders', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Rerenders' }).click()
    await expect(page).toHaveURL('/rerenders')
    await expect(
      page.getByRole('heading', { level: 1, name: 'Rerenders' })
    ).toBeVisible()
  })
})
