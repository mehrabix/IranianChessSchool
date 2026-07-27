// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import GroupDetailPage from './page';

vi.mock('next-intl/server', () => ({
  getTranslations: () => async () => (key: string) => key,
  getLocale: () => async () => 'en',
}));

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(() => Promise.resolve(null)),
}));

vi.mock('@/i18n/routing', () => ({
  redirect: vi.fn(),
  Link: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, variant, type, ...props }: any) => (
    <button type={type} data-variant={variant} {...props}>{children}</button>
  ),
}));

vi.mock('lucide-react', () => ({
  ArrowLeft: () => <span />,
  Users: () => <span />,
  LogIn: () => <span />,
  LogOut: () => <span />,
}));

const mockGroup = {
  id: 'g1',
  name: 'Chess Openings Group',
  description: 'Discuss openings and variations',
  category: 'OPENINGS',
  memberCount: 3,
  members: [
    { id: 'm1', userId: 'u1', role: 'ADMIN', userName: 'Alice', userImage: null, joinedAt: '2025-01-01T00:00:00Z' },
    { id: 'm2', userId: 'u2', role: 'MEMBER', userName: 'Bob', userImage: null, joinedAt: '2025-01-02T00:00:00Z' },
  ],
};

const createFetchMock = (data: any, ok = true) =>
  vi.fn(() => Promise.resolve({ ok, json: () => Promise.resolve(data) }));

const originalFetch = globalThis.fetch;

describe('GroupDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('renders group name and description', async () => {
    globalThis.fetch = createFetchMock({ group: mockGroup }) as any;
    const jsx = await GroupDetailPage({ params: Promise.resolve({ id: 'g1', locale: 'en' }) });
    const { container } = render(jsx);
    expect(container.textContent).toContain('Chess Openings Group');
    expect(container.textContent).toContain('Discuss openings and variations');
  });

  it('renders group category badge', async () => {
    globalThis.fetch = createFetchMock({ group: mockGroup }) as any;
    const jsx = await GroupDetailPage({ params: Promise.resolve({ id: 'g1', locale: 'en' }) });
    const { container } = render(jsx);
    expect(container.textContent).toContain('OPENINGS');
  });

  it('renders member count', async () => {
    globalThis.fetch = createFetchMock({ group: mockGroup }) as any;
    const jsx = await GroupDetailPage({ params: Promise.resolve({ id: 'g1', locale: 'en' }) });
    const { container } = render(jsx);
    expect(container.textContent).toContain('3 members');
  });

  it('renders members list', async () => {
    globalThis.fetch = createFetchMock({ group: mockGroup }) as any;
    const jsx = await GroupDetailPage({ params: Promise.resolve({ id: 'g1', locale: 'en' }) });
    const { container } = render(jsx);
    expect(container.textContent).toContain('Alice');
    expect(container.textContent).toContain('Bob');
  });

  it('renders join button', async () => {
    globalThis.fetch = createFetchMock({ group: mockGroup }) as any;
    const jsx = await GroupDetailPage({ params: Promise.resolve({ id: 'g1', locale: 'en' }) });
    const { container } = render(jsx);
    expect(container.textContent).toContain('Join Group');
  });
});
