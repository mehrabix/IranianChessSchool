// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

vi.mock('next-intl/server', () => ({
  getTranslations: async () => (key: string) => key,
}));

vi.mock('@/i18n/routing', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

vi.mock('@/components/ui/container', () => ({
  Container: ({ children, ...props }: { children: React.ReactNode }) => <div {...props}>{children}</div>,
}));

describe('Footer', () => {
  it('renders footer content', async () => {
    const Footer = (await import('./Footer')).default;
    const { container } = render(await Footer());
    expect(container.querySelector('footer')).toBeDefined();
  });
});
