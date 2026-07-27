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

const mockAuth = vi.hoisted(() => vi.fn());

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

vi.mock('@/lib/auth', () => ({ auth: mockAuth }));

import { GET } from './route';

describe('Admin Analytics API', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns 403 for non-admin', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'u1', role: 'STUDENT' } });

    const res = await GET();
    expect(res.status).toBe(403);
  });

  it('returns 403 for unauthenticated user', async () => {
    mockAuth.mockResolvedValue(null);

    const res = await GET();
    expect(res.status).toBe(403);
  });

  it('returns analytics data for admin user', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'u1', role: 'ADMIN' } });

    const { createQuery } = mockDb;

    mockDb.select
      .mockReturnValueOnce({ from: vi.fn(() => createQuery([{ count: 100 }])) })
      .mockReturnValueOnce({ from: vi.fn(() => createQuery([{ count: 50 }])) })
      .mockReturnValueOnce({ from: vi.fn(() => createQuery([{ count: 200 }])) })
      .mockReturnValueOnce({ from: vi.fn(() => createQuery([{ count: 150 }])) })
      .mockReturnValueOnce({ from: vi.fn(() => createQuery([{ count: 75 }])) })
      .mockReturnValueOnce({ from: vi.fn(() => createQuery([{ name: 'Player1', xp: 500, level: 5, streak: 7 }])) });

    const res = await GET();
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.users).toBe(100);
    expect(body.courses).toBe(50);
    expect(body.posts).toBe(200);
    expect(body.completed).toBe(150);
    expect(body.activeToday).toBe(75);
    expect(body.topUsers).toHaveLength(1);
    expect(body.topUsers[0].name).toBe('Player1');
  });

  it('handles errors', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'u1', role: 'ADMIN' } });
    mockDb.select.mockImplementation(() => { throw new Error('DB error'); });

    const res = await GET();
    expect(res.status).toBe(500);
  });
});
