import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockDb = vi.hoisted(() => {
  const createQuery = (rows: any[]) => ({
    where: () => createQuery(rows),
    then: (fn: any) => Promise.resolve(fn(rows)),
    get: () => Promise.resolve(rows?.[0] ?? null),
    orderBy: () => createQuery(rows),
    limit: () => createQuery(rows),
    offset: () => createQuery(rows),
    all: () => Promise.resolve(rows),
  });
  return {
    select: vi.fn(() => ({ from: vi.fn(() => createQuery([])) })),
    insert: vi.fn(() => ({ values: vi.fn(() => Promise.resolve()) })),
    update: vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn(() => Promise.resolve()) })) })),
    delete: vi.fn(() => ({ where: vi.fn(() => Promise.resolve()) })),
    createQuery,
  };
});

const mockAuth = vi.hoisted(() => vi.fn());

vi.mock('@/lib/db', () => ({
  db: mockDb,
  eq: vi.fn((a: any, b: any) => ({ left: a, right: b })),
  and: vi.fn(),
  or: vi.fn(),
  asc: vi.fn(),
  desc: vi.fn(),
  sql: vi.fn(),
  like: vi.fn(),
  inArray: vi.fn(),
  between: vi.fn(),
  not: vi.fn(),
  isNull: vi.fn(),
  isNotNull: vi.fn(),
  users: {},
  courses: {},
  modules: {},
  lessons: {},
  progress: {},
  posts: {},
}));

vi.mock('@/lib/auth', () => ({ auth: mockAuth }));

import { GET, POST, PUT, DELETE } from './route';

describe('Admin Posts API', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe('GET', () => {
    it('returns 403 for non-admin', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'u1', role: 'STUDENT' } });
      expect((await GET()).status).toBe(403);
    });

    it('returns posts for admin', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'u1', role: 'ADMIN' } });
      const { createQuery } = mockDb;
      mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery([{ id: 'p1', content: 'Post 1' }])) });
      const res = await GET();
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.posts).toHaveLength(1);
    });
  });

  describe('POST', () => {
    it('creates a post', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'u1', role: 'ADMIN' } });
      const { createQuery } = mockDb;
      mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery([{ id: 'p1', content: 'New Post' }])) });
      const req = new Request('http://localhost/api/admin/posts', { method: 'POST', body: JSON.stringify({ content: 'New Post' }) });
      const res = await POST(req);
      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.post.content).toBe('New Post');
    });
  });

  describe('PUT', () => {
    it('updates a post', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'u1', role: 'ADMIN' } });
      const { createQuery } = mockDb;
      mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery([{ id: 'p1', content: 'Updated' }])) });
      const req = new Request('http://localhost/api/admin/posts', { method: 'PUT', body: JSON.stringify({ id: 'p1', content: 'Updated' }) });
      const res = await PUT(req);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.post.content).toBe('Updated');
    });
  });

  describe('DELETE', () => {
    it('deletes a post', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'u1', role: 'ADMIN' } });
      const req = new Request('http://localhost/api/admin/posts', { method: 'DELETE', body: JSON.stringify({ id: 'p1' }) });
      const res = await DELETE(req);
      expect(res.status).toBe(200);
      expect(mockDb.delete).toHaveBeenCalled();
    });
  });
});
