import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('sign in page loads', async ({ page }) => {
    await page.goto('/auth/signin');
    await expect(page.getByText('Sign In')).toBeVisible();
    await expect(page.getByText('Google')).toBeVisible();
    await expect(page.getByText('GitHub')).toBeVisible();
  });

  test('auth error page loads', async ({ page }) => {
    await page.goto('/auth/error');
    await expect(page.getByText('Authentication Error')).toBeVisible();
    await expect(page.getByText('Try Again')).toBeVisible();
  });

  test('navigation to sign in from navbar', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Sign In').first().click();
    await expect(page).toHaveURL('/auth/signin');
  });
});
