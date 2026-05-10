import { expect, test } from '@playwright/test'

test.describe('Home', () => {
  test('homepage has correct title', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByRole('heading', { level: 1, name: 'Performance Workshop' })
    ).toBeVisible()
  })

  test('sidenav shows all section links', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Elements' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Context' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Rerenders' })).toBeVisible()
  })
})
