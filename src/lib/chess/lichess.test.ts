import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  vi.resetAllMocks();
});

describe('Lichess API client', () => {
  it('getProfile fetches user profile', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 'testuser',
        username: 'testuser',
        perfs: { blitz: { rating: 1800, games: 100 }, rapid: { rating: 1750, games: 50 }, bullet: { rating: 1700, games: 200 }, puzzle: { rating: 1900, games: 500 } },
      }),
    });

    const { getProfile } = await import('./lichess');
    const profile = await getProfile('testuser');

    expect(profile.username).toBe('testuser');
    expect(profile.perfs.blitz.rating).toBe(1800);
  });

  it('getProfile throws on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });
    const { getProfile } = await import('./lichess');
    await expect(getProfile('unknown')).rejects.toThrow('Lichess user not found: unknown');
  });

  it('getGames parses NDJSON response', async () => {
    const ndjson = `${JSON.stringify({ id: 'game1' })}\n${JSON.stringify({ id: 'game2' })}\n`;
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: async () => ndjson,
    });

    const { getGames } = await import('./lichess');
    const games = await getGames('testuser', 5);

    expect(games).toHaveLength(2);
    expect(games[0].id).toBe('game1');
  });

  it('getDailyPuzzle returns puzzle data', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        puzzle: { id: 'p123', solution: ['e2e4', 'e7e5'], rating: 1500, themes: ['fork'] },
        game: { fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' },
      }),
    });

    const { getDailyPuzzle } = await import('./lichess');
    const puzzle = await getDailyPuzzle();

    expect(puzzle.id).toBe('p123');
    expect(puzzle.solution).toEqual(['e2e4', 'e7e5']);
    expect(puzzle.rating).toBe(1500);
  });

  it('getOpeningExplorer returns moves', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        moves: [
          { san: 'e4', white: 1000, black: 500, draws: 300 },
          { san: 'd4', white: 800, black: 600, draws: 400 },
        ],
      }),
    });

    const { getOpeningExplorer } = await import('./lichess');
    const result = await getOpeningExplorer('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

    expect(result.moves).toHaveLength(2);
    expect(result.moves[0].san).toBe('e4');
    expect(result.moves[0].total).toBe(1800);
  });

  it('getRatingHistory returns rating history', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { name: 'Blitz', points: [{ date: 20240101, rating: 1500 }] },
      ],
    });

    const { getRatingHistory } = await import('./lichess');
    const history = await getRatingHistory('testuser');

    expect(history).toHaveLength(1);
    expect(history[0].name).toBe('Blitz');
  });
});