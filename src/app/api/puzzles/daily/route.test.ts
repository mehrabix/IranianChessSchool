import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockDb = vi.hoisted(() => ({
  select: vi.fn(() => ({
    from: vi.fn(() => Promise.resolve([
      { id: 'p1', fen: 'start', solution: 'e2e4', rating: 1200, themes: '["fork"]' },
    ])),
  })),
}));

vi.mock('@/lib/db', () => ({
  db: mockDb,
  puzzles: { id: 'id', fen: 'fen' },
  sql: vi.fn(),
}));

import { GET } from './route';

describe('GET /api/puzzles/daily', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns a puzzle', async () => {
    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.puzzle.id).toBe('p1');
  });

  it('returns 404 when no puzzles exist', async () => {
    mockDb.select.mockReturnValue({ from: vi.fn(() => Promise.resolve([])) });
    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(404);
    expect(data.error).toBe('No puzzles available');
  });
});
