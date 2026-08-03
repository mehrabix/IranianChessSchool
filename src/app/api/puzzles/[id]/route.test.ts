import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockDb = vi.hoisted(() => ({
  select: vi.fn(() => ({
    from: vi.fn(() => ({
      where: vi.fn(() => ({
        then: vi.fn((fn: (rows: unknown[]) => unknown) => Promise.resolve(fn([{ id: 'p1', fen: 'start', solution: 'e2e4' }]))),
      })),
    })),
  })),
}));

vi.mock('@/lib/db', () => ({
  db: mockDb,
  puzzles: { id: 'id' },
  eq: vi.fn(),
}));

import { GET } from './route';

function params(id: string) {
  return Promise.resolve({ id });
}

describe('GET /api/puzzles/[id]', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns a puzzle by id', async () => {
    const res = await GET(new Request('http://localhost/api/puzzles/p1'), { params: params('p1') });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.puzzle.id).toBe('p1');
  });

  it('returns 404 when puzzle not found', async () => {
    mockDb.select.mockReturnValue({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          then: vi.fn((fn: (rows: unknown[]) => unknown) => Promise.resolve(fn([]))),
        })),
      })),
    });
    const res = await GET(new Request('http://localhost/api/puzzles/unknown'), { params: params('unknown') });
    const data = await res.json();
    expect(res.status).toBe(404);
    expect(data.error).toBe('Puzzle not found');
  });
});
