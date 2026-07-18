import { test, expect } from '@playwright/test';

test.describe('Courses', () => {
  test('courses page loads', async ({ page }) => {
    await page.goto('/en/courses');
    await expect(page.getByText('Explore our chess courses').first()).toBeVisible();
  });
});
