import { test, expect } from '@playwright/test';

test.describe('Public Pages', () => {
  test('about page loads', async ({ page }) => {
    await page.goto('/en/about');
    await expect(page.getByText('Our Mission')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('faq page loads', async ({ page }) => {
    await page.goto('/en/faq');
    await expect(page.getByText('Frequently Asked Questions')).toBeVisible();
  });

  test('blog page loads', async ({ page }) => {
    await page.goto('/en/blog');
    await expect(page.getByRole('heading', { name: /chess improvement/i })).toBeVisible();
  });

  test('contact page loads', async ({ page }) => {
    await page.goto('/en/contact');
    await expect(page.getByText('Get in Touch')).toBeVisible();
    await expect(page.getByRole('button', { name: /send message/i })).toBeVisible();
  });

  test('pricing page loads', async ({ page }) => {
    await page.goto('/en/pricing');
    await expect(page.getByRole('heading', { name: 'Simple, transparent pricing' })).toBeVisible();
  });

  test('kids page loads', async ({ page }) => {
    await page.goto('/en/kids');
    await expect(page.getByRole('heading', { name: /chess lessons/i })).toBeVisible();
  });

  test('language switcher works', async ({ page }) => {
    await page.goto('/en');
    const switcher = page.getByRole('button', { name: /language/i });
    if (await switcher.isVisible()) {
      await switcher.click();
      await page.getByText('فارسی').click();
      await expect(page).toHaveURL(/\/fa/);
    }
  });

  test('footer is visible', async ({ page }) => {
    await page.goto('/en');
    await expect(page.locator('footer')).toBeVisible();
  });

  test('navigation from landing works', async ({ page }) => {
    await page.goto('/en');
    await page.getByRole('link', { name: 'About' }).first().click();
    await expect(page).toHaveURL(/\/about/);
  });
});
