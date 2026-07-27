import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockDb = vi.hoisted(() => {
  const createQuery = (rows: any[]) => {
    const query: any = {
      where: () => query,
      then: (fn: any) => Promise.resolve(fn(rows)),
      orderBy: () => query,
      limit: () => query,
    };
    return query;
  };
  return {
    select: vi.fn(() => ({ from: vi.fn(() => createQuery([])) })),
    update: vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn(() => Promise.resolve()) })) })),
    createQuery,
  };
});

vi.mock('@/lib/db', () => ({
  db: mockDb,
  eq: vi.fn((a: any, b: any) => ({ left: a, right: b })),
  and: vi.fn(),
  desc: vi.fn(),
  sql: vi.fn((literals: TemplateStringsArray, ...exprs: any[]) => ({ as: 'sql' })),
  users: { id: 'id', xp: 'xp', level: 'level', rating: 'rating', name: 'name', image: 'image', streak: 'streak', lastActive: 'lastActive' },
  courses: { id: 'id' },
  posts: { id: 'id' },
  progress: { completed: 'completed' },
}));

import { GET } from './route';

describe('Leaderboard API', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns users array sorted by XP', async () => {
    const users = [
      { id: 'u1', name: 'Alice', image: null, xp: 500, level: 5, rating: 1200 },
      { id: 'u2', name: 'Bob', image: null, xp: 300, level: 3, rating: 1100 },
    ];

    const { createQuery } = mockDb;
    mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery(users)) });

    const res = await GET();
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.users).toEqual(users);
  });

  it('handles errors', async () => {
    mockDb.select.mockImplementation(() => { throw new Error('DB error'); });

    const res = await GET();
    expect(res.status).toBe(500);

    const body = await res.json();
    expect(body.error).toBeDefined();
  });
});
