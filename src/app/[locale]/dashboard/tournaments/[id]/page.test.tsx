// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import TournamentDetailPage from './page';

vi.mock('next-intl/server', () => ({
  getTranslations: async () => (key: string) => {
    const map: Record<string, string> = {
      players: 'Players', noPlayers: 'No players yet.',
      joinTournament: 'Join Tournament', leaveTournament: 'Leave Tournament',
      backToDashboard: 'Back to Dashboard',
    };
    return map[key] || key;
  },
  getLocale: async () => 'en',
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
  Trophy: () => <span />,
  LogIn: () => <span />,
  LogOut: () => <span />,
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: any) => <span>{children}</span>,
}));

vi.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children }: any) => <div>{children}</div>,
  AvatarImage: () => null,
  AvatarFallback: ({ children }: any) => <span>{children}</span>,
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@/components/ui/container', () => ({
  Container: ({ children }: any) => <div>{children}</div>,
}));

const mockTournament = {
  id: 't1',
  name: "King's Gambit Showdown",
  description: 'A fun tournament for all levels',
  type: 'SWISS',
  status: 'UPCOMING',
  maxPlayers: 16,
  playerCount: 2,
  players: [
    { id: 'p1', userId: 'u1', score: 0, joinedAt: '2025-03-01T00:00:00Z' },
    { id: 'p2', userId: 'u2', score: 0, joinedAt: '2025-03-02T00:00:00Z' },
  ],
};

const createFetchMock = (tournament: any, ok = true) =>
  vi.fn(() => Promise.resolve({ ok, json: () => Promise.resolve({ tournament }) }));

const originalFetch = globalThis.fetch;

describe('TournamentDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('renders tournament name and description', async () => {
    globalThis.fetch = createFetchMock(mockTournament) as any;
    const jsx = await TournamentDetailPage({ params: Promise.resolve({ id: 't1', locale: 'en' }) });
    const { container } = render(jsx);
    expect(container.textContent).toContain("King's Gambit Showdown");
    expect(container.textContent).toContain('A fun tournament for all levels');
  });

  it('renders tournament type and status', async () => {
    globalThis.fetch = createFetchMock(mockTournament) as any;
    const jsx = await TournamentDetailPage({ params: Promise.resolve({ id: 't1', locale: 'en' }) });
    const { container } = render(jsx);
    expect(container.textContent).toContain('SWISS');
    expect(container.textContent).toContain('UPCOMING');
  });

  it('renders player count', async () => {
    globalThis.fetch = createFetchMock(mockTournament) as any;
    const jsx = await TournamentDetailPage({ params: Promise.resolve({ id: 't1', locale: 'en' }) });
    const { container } = render(jsx);
    expect(container.textContent).toContain('2 / 16');
  });

  it('renders players list with scores', async () => {
    globalThis.fetch = createFetchMock(mockTournament) as any;
    const jsx = await TournamentDetailPage({ params: Promise.resolve({ id: 't1', locale: 'en' }) });
    const { container } = render(jsx);
    expect(container.textContent).toContain('u1');
    expect(container.textContent).toContain('u2');
  });

  it('renders join button', async () => {
    globalThis.fetch = createFetchMock(mockTournament) as any;
    const jsx = await TournamentDetailPage({ params: Promise.resolve({ id: 't1', locale: 'en' }) });
    const { container } = render(jsx);
    expect(container.textContent).toContain('Join Tournament');
  });
});
