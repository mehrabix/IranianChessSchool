// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@tanstack/react-query', () => ({
  QueryClient: function() { this.mount = vi.fn(); this.unmount = vi.fn(); },
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Providers', () => {
  it('renders children', async () => {
    const { Providers } = await import('./Providers');
    render(<Providers><div>Child</div></Providers>);
    expect(screen.getByText('Child')).toBeDefined();
  });
});
