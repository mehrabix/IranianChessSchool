import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockDb = vi.hoisted(() => {
  const createQuery = (rows: any[]) => ({
    where: () => createQuery(rows),
    leftJoin: () => createQuery(rows),
    then: (fn: any) => Promise.resolve(fn(rows)),
    orderBy: () => createQuery(rows),
    limit: () => createQuery(rows),
    returning: () => Promise.resolve(rows),
  });
  return {
    select: vi.fn(() => ({ from: vi.fn(() => createQuery([])) })),
    insert: vi.fn(() => ({ values: vi.fn(() => ({ returning: vi.fn(() => Promise.resolve([{ id: 'p1' }])) })) })),
    createQuery,
  };
});

vi.mock('@/lib/db', () => ({
  db: mockDb,
  eq: vi.fn((a: any, b: any) => ({ left: a, right: b })),
  and: vi.fn(),
  or: vi.fn(),
  desc: vi.fn(),
  asc: vi.fn(),
  sql: vi.fn(),
  like: vi.fn(),
  inArray: vi.fn(),
  between: vi.fn(),
  not: vi.fn(),
  isNull: vi.fn(),
  isNotNull: vi.fn(),
  users: { id: 'id', name: 'name', image: 'image' },
  courses: { id: 'id' },
  modules: { id: 'id' },
  lessons: { id: 'id' },
  progress: { id: 'id' },
  posts: { id: 'id', content: 'content', userId: 'userId', likes: 'likes', comments: 'comments', createdAt: 'createdAt', image: 'image', pgn: 'pgn' },
}));

const { mockAuth } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
}));
vi.mock('@/lib/auth', () => ({ auth: mockAuth }));

import { GET, POST } from './route';

describe('GET /api/posts', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns all posts', async () => {
    const { createQuery } = mockDb;
    mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery([{ id: 'p1', content: 'Post 1' }, { id: 'p2', content: 'Post 2' }])) });
    const res = await GET(new Request('http://localhost/api/posts'));
    const body = await res.json();
    expect(body.posts).toHaveLength(2);
  });

  it('handles errors with 500', async () => {
    mockDb.select.mockImplementationOnce(() => { throw new Error('DB error'); });
    const res = await GET(new Request('http://localhost/api/posts'));
    expect(res.status).toBe(500);
  });
});

describe('POST /api/posts', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns 401 without auth', async () => {
    mockAuth.mockResolvedValueOnce(null);
    const res = await POST(new Request('http://localhost/api/posts', {
      method: 'POST',
      body: JSON.stringify({ content: 'test' }),
    }));
    expect(res.status).toBe(401);
  });

  it('returns 400 with no content', async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } });
    const res = await POST(new Request('http://localhost/api/posts', {
      method: 'POST',
      body: JSON.stringify({}),
    }));
    expect(res.status).toBe(400);
  });

  it('creates post successfully', async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } });
    const { createQuery } = mockDb;
    mockDb.insert.mockReturnValue({ values: vi.fn(() => ({ returning: vi.fn(() => Promise.resolve([{ id: 'new-post', content: 'Hello' }])) })) });
    const res = await POST(new Request('http://localhost/api/posts', {
      method: 'POST',
      body: JSON.stringify({ content: 'Hello' }),
    }));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.post).toBeDefined();
  });
});
