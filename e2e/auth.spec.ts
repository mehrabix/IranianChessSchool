import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('sign in page loads', async ({ page }) => {
    await page.goto('/en/auth/signin');
    await expect(page.getByText('Sign In').first()).toBeVisible();
  });

  test('auth error page loads', async ({ page }) => {
    await page.goto('/en/auth/error');
    await expect(page.getByText('Authentication Error')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Try Again' })).toBeVisible();
  });

  test('navigation to register from sign in page', async ({ page }) => {
    await page.goto('/en/auth/signin');
    await page.getByRole('link', { name: /sign up/i }).click();
    await expect(page).toHaveURL(/register/);
  });

  test('navigation to sign in from register page', async ({ page }) => {
    await page.goto('/en/auth/register');
    await page.getByRole('link', { name: 'Sign in' }).first().click();
    await expect(page).toHaveURL(/signin/);
  });

  test('auth error page has back link', async ({ page }) => {
    await page.goto('/en/auth/error');
    await page.getByRole('button', { name: 'Try Again' }).click();
    await expect(page).toHaveURL(/signin/);
  });
});
