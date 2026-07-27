import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockDb = vi.hoisted(() => {
  const createQuery = (rows: any[]) => ({
    where: () => createQuery(rows),
    limit: () => createQuery(rows),
    returning: () => Promise.resolve(rows),
    then: (fn: any) => Promise.resolve(fn(rows)),
  });
  return {
    select: vi.fn(() => ({ from: vi.fn(() => createQuery([])) })),
    update: vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn(() => ({ returning: vi.fn(() => Promise.resolve([])) })) })) })),
    delete: vi.fn(() => ({ where: vi.fn(() => Promise.resolve()) })),
    createQuery,
  };
});

vi.mock('@/lib/db', () => ({
  db: mockDb,
  eq: vi.fn((a: any, b: any) => ({ left: a, right: b })),
  and: vi.fn(),
  desc: vi.fn(),
  sql: vi.fn(),
  posts: { id: 'id', content: 'content', userId: 'userId', image: 'image', pgn: 'pgn', likes: 'likes', comments: 'comments', createdAt: 'createdAt' },
}));

const mockAuth = vi.hoisted(() => vi.fn());
vi.mock('@/lib/auth', () => ({ auth: mockAuth }));

import { PUT, DELETE } from './route';

describe('PUT /api/posts/[id]', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns 401 without auth', async () => {
    mockAuth.mockResolvedValueOnce(null);
    const res = await PUT(
      new Request('http://localhost/api/posts/p1', {
        method: 'PUT',
        body: JSON.stringify({ content: 'updated' }),
      }),
      { params: Promise.resolve({ id: 'p1' }) },
    );
    expect(res.status).toBe(401);
  });

  it('returns 404 for missing post', async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } });
    const { createQuery } = mockDb;
    mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery([])) });
    const res = await PUT(
      new Request('http://localhost/api/posts/p1', {
        method: 'PUT',
        body: JSON.stringify({ content: 'updated' }),
      }),
      { params: Promise.resolve({ id: 'p1' }) },
    );
    expect(res.status).toBe(404);
  });

  it('returns 403 for non-owner', async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } });
    const { createQuery } = mockDb;
    mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery([{ id: 'p1', content: 'orig', userId: 'user-2' }])) });
    const res = await PUT(
      new Request('http://localhost/api/posts/p1', {
        method: 'PUT',
        body: JSON.stringify({ content: 'updated' }),
      }),
      { params: Promise.resolve({ id: 'p1' }) },
    );
    expect(res.status).toBe(403);
  });

  it('returns 400 with no content', async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } });
    const { createQuery } = mockDb;
    mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery([{ id: 'p1', content: 'orig', userId: 'user-1' }])) });
    const res = await PUT(
      new Request('http://localhost/api/posts/p1', {
        method: 'PUT',
        body: JSON.stringify({}),
      }),
      { params: Promise.resolve({ id: 'p1' }) },
    );
    expect(res.status).toBe(400);
  });

  it('updates post successfully', async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } });
    const { createQuery } = mockDb;
    mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery([{ id: 'p1', content: 'orig', userId: 'user-1' }])) });
    mockDb.update.mockReturnValue({
      set: vi.fn(() => ({
        where: vi.fn(() => ({
          returning: vi.fn(() => Promise.resolve([{ id: 'p1', content: 'updated content', image: null, pgn: null }])),
        })),
      })),
    });
    const res = await PUT(
      new Request('http://localhost/api/posts/p1', {
        method: 'PUT',
        body: JSON.stringify({ content: 'updated content' }),
      }),
      { params: Promise.resolve({ id: 'p1' }) },
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.post.content).toBe('updated content');
  });
});

describe('DELETE /api/posts/[id]', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns 401 without auth', async () => {
    mockAuth.mockResolvedValueOnce(null);
    const res = await DELETE(
      new Request('http://localhost/api/posts/p1', { method: 'DELETE' }),
      { params: Promise.resolve({ id: 'p1' }) },
    );
    expect(res.status).toBe(401);
  });

  it('returns 404 for missing post', async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } });
    const { createQuery } = mockDb;
    mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery([])) });
    const res = await DELETE(
      new Request('http://localhost/api/posts/p1', { method: 'DELETE' }),
      { params: Promise.resolve({ id: 'p1' }) },
    );
    expect(res.status).toBe(404);
  });

  it('returns 403 for non-owner', async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } });
    const { createQuery } = mockDb;
    mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery([{ id: 'p1', userId: 'user-2' }])) });
    const res = await DELETE(
      new Request('http://localhost/api/posts/p1', { method: 'DELETE' }),
      { params: Promise.resolve({ id: 'p1' }) },
    );
    expect(res.status).toBe(403);
  });

  it('deletes post successfully', async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } });
    const { createQuery } = mockDb;
    mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery([{ id: 'p1', userId: 'user-1' }])) });
    const res = await DELETE(
      new Request('http://localhost/api/posts/p1', { method: 'DELETE' }),
      { params: Promise.resolve({ id: 'p1' }) },
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });
});
