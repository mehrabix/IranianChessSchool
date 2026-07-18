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

describe('Admin Courses API', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe('GET', () => {
    it('returns 403 for non-admin', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'u1', role: 'STUDENT' } });
      expect((await GET()).status).toBe(403);
    });

    it('returns all courses for admin', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'u1', role: 'ADMIN' } });
      const { createQuery } = mockDb;
      mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery([{ id: 'c1' }])) });
      const res = await GET();
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.courses).toHaveLength(1);
    });
  });

  describe('POST', () => {
    it('returns 403 for non-admin', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'u1', role: 'STUDENT' } });
      const req = new Request('http://localhost/api/admin/courses', { method: 'POST', body: JSON.stringify({ title: 'Test' }) });
      expect((await POST(req)).status).toBe(403);
    });

    it('returns 400 without title', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'u1', role: 'ADMIN' } });
      const req = new Request('http://localhost/api/admin/courses', { method: 'POST', body: JSON.stringify({}) });
      expect((await POST(req)).status).toBe(400);
    });

    it('creates a course', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'u1', role: 'ADMIN' } });
      const { createQuery } = mockDb;
      mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery([{ id: 'new1', title: 'New Course' }])) });
      const req = new Request('http://localhost/api/admin/courses', { method: 'POST', body: JSON.stringify({ title: 'New Course' }) });
      const res = await POST(req);
      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.course.title).toBe('New Course');
    });
  });

  describe('PUT', () => {
    it('updates a course', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'u1', role: 'ADMIN' } });
      const { createQuery } = mockDb;
      mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery([{ id: 'c1', title: 'Updated' }])) });
      const req = new Request('http://localhost/api/admin/courses', { method: 'PUT', body: JSON.stringify({ id: 'c1', title: 'Updated' }) });
      const res = await PUT(req);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.course.title).toBe('Updated');
    });
  });

  describe('DELETE', () => {
    it('deletes a course', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'u1', role: 'ADMIN' } });
      const req = new Request('http://localhost/api/admin/courses', { method: 'DELETE', body: JSON.stringify({ id: 'c1' }) });
      const res = await DELETE(req);
      expect(res.status).toBe(200);
      expect(mockDb.delete).toHaveBeenCalled();
    });
  });
});
