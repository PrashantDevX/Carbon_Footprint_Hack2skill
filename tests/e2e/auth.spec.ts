import { expect, test } from '@playwright/test';

test('loads the dashboard and navigates to calculator', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /kg co2e this month/i })).toBeVisible();
  await page.getByRole('link', { name: /calculator/i }).first().click();
  await expect(page.getByRole('heading', { name: 'Calculator' })).toBeVisible();
});
