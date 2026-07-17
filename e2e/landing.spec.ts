import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should display the hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Iranian Chess School')).toBeVisible();
    await expect(page.getByText('Try for Free')).toBeVisible();
  });

  test('should show features section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('More Than Just a Course')).toBeVisible();
  });

  test('should show training levels', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Training Levels')).toBeVisible();
    await expect(page.getByText('Beginner (0–500)')).toBeVisible();
  });

  test('navigation links work', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL('/about');
  });
});
