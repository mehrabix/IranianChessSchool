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
const mockAddXp = vi.hoisted(() => vi.fn());
const mockCheckAchievements = vi.hoisted(() => vi.fn(() => Promise.resolve([])));

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
vi.mock('@/lib/streak', () => ({ addXp: mockAddXp }));
vi.mock('@/lib/achievements', () => ({ checkAchievements: mockCheckAchievements }));

import { POST } from './route';

describe('XP Award API', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns 401 without auth', async () => {
    mockAuth.mockResolvedValue(null);

    const req = new Request('http://localhost/api/xp/award', {
      method: 'POST',
      body: JSON.stringify({ action: 'COMPLETE_LESSON' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('returns 401 when session has no user id', async () => {
    mockAuth.mockResolvedValue({ user: {} });

    const req = new Request('http://localhost/api/xp/award', {
      method: 'POST',
      body: JSON.stringify({ action: 'COMPLETE_LESSON' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('returns 400 for invalid action', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'u1' } });

    const req = new Request('http://localhost/api/xp/award', {
      method: 'POST',
      body: JSON.stringify({ action: 'INVALID_ACTION' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.error).toBe('Invalid action');
  });

  it('awards XP for valid action COMPLETE_LESSON', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'u1' } });

    const { createQuery } = mockDb;
    mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery([{ xp: 50, level: 1, streak: 3 }])) });
    mockCheckAchievements.mockResolvedValue([
      { title: 'First Steps', description: 'Completed your first lesson', xpReward: 50 },
    ]);

    const req = new Request('http://localhost/api/xp/award', {
      method: 'POST',
      body: JSON.stringify({ action: 'COMPLETE_LESSON' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.xp).toBe(50);
    expect(body.xpEarned).toBe(50);
    expect(body.streak).toBe(3);
    expect(body.achievements).toHaveLength(1);
    expect(body.achievements[0].title).toBe('First Steps');

    expect(mockAddXp).toHaveBeenCalledWith('u1', 50);
    expect(mockCheckAchievements).toHaveBeenCalledWith('u1');
  });

  it('handles level up when xp crosses threshold', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'u1' } });

    const { createQuery } = mockDb;
    mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery([{ xp: 500, level: 1, streak: 3 }])) });

    const req = new Request('http://localhost/api/xp/award', {
      method: 'POST',
      body: JSON.stringify({ action: 'COMPLETE_MODULE' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.xp).toBe(500);
    expect(body.leveledUp).toBe(true);
    expect(mockDb.update).toHaveBeenCalled();
  });

  it('handles errors', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'u1' } });
    mockDb.select.mockImplementation(() => { throw new Error('DB error'); });

    const req = new Request('http://localhost/api/xp/award', {
      method: 'POST',
      body: JSON.stringify({ action: 'COMPLETE_LESSON' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});
