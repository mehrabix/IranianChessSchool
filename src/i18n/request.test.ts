import { describe, it, expect, vi } from 'vitest';

vi.mock('next-intl/server', () => ({
  getRequestConfig: (fn: (...args: unknown[]) => unknown) => fn,
}));

vi.mock('@/i18n/routing', () => ({
  routing: { locales: ['en', 'fa'], defaultLocale: 'en' },
}));

vi.mock('../../messages/en.json', () => ({ default: { hello: 'Hello' } }));

describe('i18n request', () => {
  it('returns messages for a given locale', async () => {
    const { default: getMessages } = await import('@/i18n/request');
    const result = await getMessages({ requestLocale: Promise.resolve('en') });
    expect(result).toBeDefined();
    expect(result.locale).toBe('en');
  });
});
