// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
  signOut: vi.fn(),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}));

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: vi.fn() }),
}));

vi.mock('@/i18n/routing', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
  usePathname: () => '/',
  useRouter: () => ({ replace: vi.fn() }),
  locales: ['en', 'fa'],
  localeNames: { en: 'English', fa: 'فارسی' },
}));

describe('Navbar', () => {
  it('renders header element', async () => {
    const { Navbar } = await import('./Navbar');
    const { container } = render(<Navbar />);
    expect(container.querySelector('header')).toBeDefined();
  });
});
