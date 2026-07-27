import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockDb = vi.hoisted(() => {
  const createQuery = (result: any) => ({
    where: vi.fn(() => createQuery(result)),
    set: vi.fn(() => createQuery(result)),
    values: vi.fn(() => createQuery(result)),
    returning: vi.fn(() => Promise.resolve(Array.isArray(result) ? result : [result])),
    then: (fn: any) => Promise.resolve(fn(result)),
  });

  return {
    select: vi.fn(() => ({ from: vi.fn(() => createQuery([])) })),
    insert: vi.fn(() => createQuery([{ id: 'p1' }])),
    update: vi.fn(() => createQuery({ rowsAffected: 0 })),
    delete: vi.fn(() => createQuery({ rowsAffected: 0 })),
    createQuery,
  };
});

const { ltMock } = vi.hoisted(() => ({
  ltMock: vi.fn(() => ({})),
}));

vi.mock('drizzle-orm', () => ({
  lt: ltMock,
}));

vi.mock('@/lib/db', () => ({
  db: mockDb,
  eq: vi.fn(() => ({})),
  and: vi.fn(),
  or: vi.fn(),
  desc: vi.fn(),
  asc: vi.fn(),
  sql: { raw: vi.fn(() => '') },
  like: vi.fn(),
  inArray: vi.fn(),
  between: vi.fn(),
  not: vi.fn(),
  isNull: vi.fn(),
  isNotNull: vi.fn(),
  users: { id: 'id', lastActive: 'last_active', streak: 'streak' },
  puzzles: { id: 'id', fen: 'fen', solution: 'solution', rating: 'rating', themes: 'themes', source: 'source' },
  verificationTokens: { expires: 'expires' },
  sessions: { expires: 'expires' },
}));

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}));

import { GET as dailyPuzzleGET } from './daily-puzzle/route';
import { GET as streakResetGET } from './streak-reset/route';
import { GET as cleanupGET } from './cleanup/route';

// ---------------------------------------------------------------------------
// Daily Puzzle Cron
// ---------------------------------------------------------------------------
describe('GET /api/cron/daily-puzzle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CRON_SECRET = 'test-secret';
  });

  it('returns 401 without secret', async () => {
    const res = await dailyPuzzleGET(new Request('http://localhost/api/cron/daily-puzzle'));
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: 'Unauthorized' });
  });

  it('returns 401 with wrong secret', async () => {
    const res = await dailyPuzzleGET(new Request('http://localhost/api/cron/daily-puzzle?secret=wrong'));
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: 'Unauthorized' });
  });

  it('returns 502 when Lichess API fails', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({ ok: false });

    const res = await dailyPuzzleGET(new Request('http://localhost/api/cron/daily-puzzle?secret=test-secret'));
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: 'Failed to fetch puzzle from Lichess' });
  });

  it('fetches daily puzzle and stores it', async () => {
    const puzzleData = {
      puzzle: {
        id: 'lichess-abc',
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        moves: ['e2e4', 'e7e5', 'g1f3'],
        rating: 1500,
        themes: ['opening', 'kingsPawn'],
      },
    };
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(puzzleData),
    });

    mockDb.insert = vi.fn(() =>
      mockDb.createQuery([{ id: 'lichess-abc' }])
    );

    const res = await dailyPuzzleGET(new Request('http://localhost/api/cron/daily-puzzle?secret=test-secret'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.puzzle.id).toBe('lichess-abc');
  });

  it('handles errors with 500', async () => {
    globalThis.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

    const res = await dailyPuzzleGET(new Request('http://localhost/api/cron/daily-puzzle?secret=test-secret'));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'Internal server error' });
  });
});

// ---------------------------------------------------------------------------
// Streak Reset Cron
// ---------------------------------------------------------------------------
describe('GET /api/cron/streak-reset', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CRON_SECRET = 'test-secret';
  });

  it('returns 401 without secret', async () => {
    const res = await streakResetGET(new Request('http://localhost/api/cron/streak-reset'));
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: 'Unauthorized' });
  });

  it('returns 401 with wrong secret', async () => {
    const res = await streakResetGET(new Request('http://localhost/api/cron/streak-reset?secret=wrong'));
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: 'Unauthorized' });
  });

  it('resets streaks for inactive users', async () => {
    const updateChain = mockDb.createQuery({ rowsAffected: 3 });
    mockDb.update = vi.fn(() => updateChain);

    const res = await streakResetGET(new Request('http://localhost/api/cron/streak-reset?secret=test-secret'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.reset).toBe(3);

    expect(mockDb.update).toHaveBeenCalled();
  });

  it('handles errors with 500', async () => {
    const throwingChain = mockDb.createQuery({ rowsAffected: 0 });
    throwingChain.set = vi.fn(() => throwingChain);
    throwingChain.where = vi.fn(() => { throw new Error('DB error'); });
    mockDb.update = vi.fn(() => throwingChain);

    const res = await streakResetGET(new Request('http://localhost/api/cron/streak-reset?secret=test-secret'));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'Internal server error' });
  });
});

// ---------------------------------------------------------------------------
// Cleanup Cron
// ---------------------------------------------------------------------------
describe('GET /api/cron/cleanup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CRON_SECRET = 'test-secret';
  });

  it('returns 401 without secret', async () => {
    const res = await cleanupGET(new Request('http://localhost/api/cron/cleanup'));
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: 'Unauthorized' });
  });

  it('returns 401 with wrong secret', async () => {
    const res = await cleanupGET(new Request('http://localhost/api/cron/cleanup?secret=wrong'));
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: 'Unauthorized' });
  });

  it('deletes expired tokens and sessions', async () => {
    const tokenChain = mockDb.createQuery({ rowsAffected: 5 });
    const sessionChain = mockDb.createQuery({ rowsAffected: 3 });

    mockDb.delete
      .mockReturnValueOnce(tokenChain)
      .mockReturnValueOnce(sessionChain);

    const res = await cleanupGET(new Request('http://localhost/api/cron/cleanup?secret=test-secret'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.deletedTokens).toBe(5);
    expect(body.deletedSessions).toBe(3);
  });

  it('handles errors with 500', async () => {
    const badChain = mockDb.createQuery({ rowsAffected: 0 });
    badChain.where = vi.fn(() => { throw new Error('DB error'); });
    mockDb.delete.mockReturnValueOnce(badChain);

    const res = await cleanupGET(new Request('http://localhost/api/cron/cleanup?secret=test-secret'));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'Internal server error' });
  });
});
