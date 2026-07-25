import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  vi.resetAllMocks();
});

describe('Chess.com API client', () => {
  it('getProfile fetches and transforms profile', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ username: 'testuser', name: 'Test User', avatar: 'https://example.com/av.jpg', rating: 1800, title: 'FM' }),
    });

    const { getProfile } = await import('./chesscom');
    const profile = await getProfile('testuser');

    expect(profile.username).toBe('testuser');
    expect(profile.name).toBe('Test User');
    expect(profile.rating).toBe(1800);
    expect(profile.title).toBe('FM');
  });

  it('getProfile throws on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });
    const { getProfile } = await import('./chesscom');
    await expect(getProfile('unknown')).rejects.toThrow('Chess.com profile not found: unknown');
  });

  it('getGames fetches monthly games', async () => {
    const fakeGames = [{ url: 'game1' }, { url: 'game2' }];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ games: fakeGames }),
    });

    const { getGames } = await import('./chesscom');
    const games = await getGames('testuser', 2024, 6);

    expect(games).toHaveLength(2);
    expect(games[0].url).toBe('game1');
  });

  it('getStats returns stats object', async () => {
    const statsData = {
      chess_rapid: { last: { rating: 1700 }, best: { rating: 1750 } },
      chess_blitz: { last: { rating: 1600 }, best: { rating: 1650 } },
      chess_bullet: { last: { rating: 1500 }, best: { rating: 1550 } },
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => statsData,
    });

    const { getStats } = await import('./chesscom');
    const stats = await getStats('testuser');

    expect(stats.chess_rapid.last.rating).toBe(1700);
    expect(stats.chess_blitz.last.rating).toBe(1600);
  });

  it('importGames fetches from last 3 months', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ games: [{ url: 'g1' }] }),
    });

    const { importGames } = await import('./chesscom');
    const games = await importGames('testuser');

    expect(games).toHaveLength(3);
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });
});