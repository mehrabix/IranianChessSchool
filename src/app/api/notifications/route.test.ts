import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockDb = vi.hoisted(() => {
  const createQuery = (rows: any[]) => ({
    where: () => createQuery(rows),
    orderBy: () => createQuery(rows),
    limit: () => createQuery(rows),
    then: (fn: any) => Promise.resolve(fn(rows)),
  });
  return {
    select: vi.fn(() => ({ from: vi.fn(() => createQuery([])) })),
    update: vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn(() => Promise.resolve()) })) })),
    createQuery,
  };
});

vi.mock('@/lib/db', () => ({
  db: mockDb,
  eq: vi.fn((a: any, b: any) => ({ left: a, right: b })),
  desc: vi.fn(),
  notifications: { id: 'id', userId: 'userId', read: 'read', createdAt: 'createdAt' },
}));

const { mockAuth } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
}));
vi.mock('@/lib/auth', () => ({ auth: mockAuth }));

import { GET, PATCH } from './route';

describe('GET /api/notifications', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns 401 without auth', async () => {
    mockAuth.mockResolvedValueOnce(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it('returns notifications with unread count', async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } });
    const { createQuery } = mockDb;
    mockDb.select.mockReturnValue({
      from: vi.fn(() => createQuery([
        { id: 'n1', userId: 'user-1', type: 'LIKE', title: 'Someone liked your post', read: false },
        { id: 'n2', userId: 'user-1', type: 'COMMENT', title: 'New comment', read: true },
      ])),
    });
    const res = await GET();
    const body = await res.json();
    expect(body.notifications).toHaveLength(2);
    expect(body.unread).toBe(1);
  });
});

describe('PATCH /api/notifications', () => {
  it('returns 401 without auth', async () => {
    mockAuth.mockResolvedValueOnce(null);
    const res = await PATCH(new Request('http://localhost/api/notifications', {
      method: 'PATCH',
      body: JSON.stringify({ id: 'n1' }),
    }));
    expect(res.status).toBe(401);
  });

  it('marks single notification as read', async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } });
    const res = await PATCH(new Request('http://localhost/api/notifications', {
      method: 'PATCH',
      body: JSON.stringify({ id: 'n1' }),
    }));
    expect(res.status).toBe(200);
  });

  it('marks all notifications as read', async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } });
    const res = await PATCH(new Request('http://localhost/api/notifications', {
      method: 'PATCH',
      body: JSON.stringify({ all: true }),
    }));
    expect(res.status).toBe(200);
  });
});
