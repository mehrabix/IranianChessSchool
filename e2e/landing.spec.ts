import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should display the hero section', async ({ page }) => {
    await page.goto('/en');
    await expect(page.getByText('Start Free Trial').first()).toBeVisible();
  });

  test('should show features section', async ({ page }) => {
    await page.goto('/en');
    await expect(page.getByText('More Than Just a Course')).toBeVisible();
  });

  test('should show training levels', async ({ page }) => {
    await page.goto('/en');
    await expect(page.getByText('Training Levels')).toBeVisible();
  });

  test('navigation links work', async ({ page }) => {
    await page.goto('/en');
    await page.getByRole('link', { name: 'About' }).first().click();
    await expect(page).toHaveURL(/about/);
  });
});
