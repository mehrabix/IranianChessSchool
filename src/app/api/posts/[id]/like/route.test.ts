import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockDb = vi.hoisted(() => {
  const createQuery = (rows: any[]) => ({
    where: () => createQuery(rows),
    then: (fn: any) => Promise.resolve(fn(rows)),
    orderBy: () => createQuery(rows),
    limit: () => createQuery(rows),
    leftJoin: () => createQuery(rows),
    returning: () => Promise.resolve(rows),
  });
  return {
    select: vi.fn(() => ({ from: vi.fn(() => createQuery([])) })),
    insert: vi.fn(() => ({ values: vi.fn(() => ({ returning: vi.fn(() => Promise.resolve([{}])) })) })),
    update: vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn(() => Promise.resolve()) })) })),
    delete: vi.fn(() => ({ where: vi.fn(() => Promise.resolve()) })),
    createQuery,
  };
});

vi.mock('@/lib/db', () => ({
  db: mockDb,
  eq: vi.fn((a: any, b: any) => ({ left: a, right: b })),
  and: vi.fn(),
  desc: vi.fn(),
  sql: vi.fn((literals: TemplateStringsArray, ...exprs: any[]) => ({ raw: literals.join('?'), params: exprs })),
  posts: { id: 'id', likes: 'likes' },
  likes: { id: 'id', postId: 'postId', userId: 'userId' },
}));

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(() => Promise.resolve(null)),
}));

import { POST } from './route';
import { auth } from '@/lib/auth';

const { createQuery } = mockDb;

describe('POST /api/posts/[id]/like', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(auth).mockResolvedValue(null);
  });

  it('returns 401 without auth', async () => {
    const req = new Request('http://localhost/api/posts/post-1/like', { method: 'POST' });

    const res = await POST(req, { params: Promise.resolve({ id: 'post-1' }) });
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body.error).toBe('Unauthorized');
  });

  it('likes post when not already liked', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'user-1' } });
    mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery([])) });

    const req = new Request('http://localhost/api/posts/post-1/like', { method: 'POST' });
    const res = await POST(req, { params: Promise.resolve({ id: 'post-1' }) });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.liked).toBe(true);
    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockDb.delete).not.toHaveBeenCalled();
  });

  it('unlikes post when already liked', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { id: 'user-1' } });
    mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery([{ id: 'like-1', postId: 'post-1', userId: 'user-1' }])) });

    const req = new Request('http://localhost/api/posts/post-1/like', { method: 'POST' });
    const res = await POST(req, { params: Promise.resolve({ id: 'post-1' }) });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.liked).toBe(false);
    expect(mockDb.delete).toHaveBeenCalled();
    expect(mockDb.insert).not.toHaveBeenCalled();
  });
});
