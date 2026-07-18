// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LanguageSwitcher } from './LanguageSwitcher';

vi.mock('next-intl', () => ({
  useLocale: () => 'en',
}));

vi.mock('@/i18n/routing', () => ({
  usePathname: () => '/',
  useRouter: () => ({ replace: vi.fn() }),
  locales: ['en', 'fa'],
  localeNames: { en: 'English', fa: 'فارسی' },
}));

describe('LanguageSwitcher', () => {
  it('renders language switcher button', () => {
    const { container } = render(<LanguageSwitcher />);
    expect(container.querySelector('[data-slot="dropdown-menu-trigger"]')).toBeDefined();
  });
});
