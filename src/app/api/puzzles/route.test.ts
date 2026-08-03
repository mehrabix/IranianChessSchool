import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockDb = vi.hoisted(() => {
  let queryResolve = Promise.resolve([
    { id: 'p1', fen: 'start', solution: 'e2e4', rating: 1200, themes: '["fork"]' },
    { id: 'p2', fen: 'mid', solution: 'd4d5', rating: 1500, themes: '["pin"]' },
  ]);
  return {
    select: vi.fn(() => ({ from: vi.fn(() => ({ orderBy: vi.fn(() => ({ limit: vi.fn(() => ({ offset: vi.fn(() => queryResolve) })) })), where: vi.fn(() => ({ orderBy: vi.fn(() => ({ limit: vi.fn(() => ({ offset: vi.fn(() => queryResolve) })) })) })) })) })),
    setResolver: (r: unknown[]) => { queryResolve = Promise.resolve(r); },
  };
});

vi.mock('@/lib/db', () => ({
  db: mockDb,
  puzzles: { id: 'id', fen: 'fen', solution: 'solution', rating: 'rating', themes: 'themes' },
  eq: vi.fn(),
  desc: vi.fn(),
  asc: vi.fn(),
  sql: vi.fn(),
}));

import { GET } from './route';

function req(url: string) {
  return new Request(url);
}

describe('GET /api/puzzles', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns puzzles list with default limit', async () => {
    const res = await GET(req('http://localhost/api/puzzles'));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.puzzles).toHaveLength(2);
  });

  it('handles rating filter', async () => {
    const res = await GET(req('http://localhost/api/puzzles?rating=1000-1500'));
    expect(res.status).toBe(200);
  });

  it('respects limit parameter', async () => {
    const res = await GET(req('http://localhost/api/puzzles?limit=10'));
    expect(res.status).toBe(200);
  });

  it('returns empty puzzles when none exist', async () => {
    mockDb.setResolver([]);
    const res = await GET(req('http://localhost/api/puzzles'));
    const data = await res.json();
    expect(data.puzzles).toHaveLength(0);
  });
});
