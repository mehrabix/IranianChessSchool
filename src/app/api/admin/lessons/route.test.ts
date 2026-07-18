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

describe('Admin Lessons API', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe('GET', () => {
    it('returns 403 for non-admin', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'u1', role: 'STUDENT' } });
      const req = new Request('http://localhost/api/admin/lessons?moduleId=m1');
      expect((await GET(req)).status).toBe(403);
    });

    it('returns lessons for admin', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'u1', role: 'ADMIN' } });
      const { createQuery } = mockDb;
      mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery([{ id: 'l1', title: 'Lesson 1' }])) });
      const req = new Request('http://localhost/api/admin/lessons?moduleId=m1');
      const res = await GET(req);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.lessons).toHaveLength(1);
    });
  });

  describe('POST', () => {
    it('creates a lesson', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'u1', role: 'ADMIN' } });
      const { createQuery } = mockDb;
      mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery([{ id: 'l1', title: 'New Lesson' }])) });
      const req = new Request('http://localhost/api/admin/lessons', { method: 'POST', body: JSON.stringify({ title: 'New Lesson', courseId: 'c1', moduleId: 'm1' }) });
      const res = await POST(req);
      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.lesson.title).toBe('New Lesson');
    });
  });

  describe('PUT', () => {
    it('updates a lesson', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'u1', role: 'ADMIN' } });
      const { createQuery } = mockDb;
      mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery([{ id: 'l1', title: 'Updated' }])) });
      const req = new Request('http://localhost/api/admin/lessons', { method: 'PUT', body: JSON.stringify({ id: 'l1', title: 'Updated' }) });
      const res = await PUT(req);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.lesson.title).toBe('Updated');
    });
  });

  describe('DELETE', () => {
    it('deletes a lesson', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'u1', role: 'ADMIN' } });
      const req = new Request('http://localhost/api/admin/lessons', { method: 'DELETE', body: JSON.stringify({ id: 'l1' }) });
      const res = await DELETE(req);
      expect(res.status).toBe(200);
      expect(mockDb.delete).toHaveBeenCalled();
    });
  });
});
