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

describe('Admin Modules API', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe('GET', () => {
    it('returns 403 for non-admin', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'u1', role: 'STUDENT' } });
      const req = new Request('http://localhost/api/admin/modules?courseId=c1');
      expect((await GET(req)).status).toBe(403);
    });

    it('returns modules for admin', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'u1', role: 'ADMIN' } });
      const { createQuery } = mockDb;
      mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery([{ id: 'm1', title: 'Module 1' }])) });
      const req = new Request('http://localhost/api/admin/modules?courseId=c1');
      const res = await GET(req);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.modules).toHaveLength(1);
    });
  });

  describe('POST', () => {
    it('creates a module', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'u1', role: 'ADMIN' } });
      const { createQuery } = mockDb;
      mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery([{ id: 'm1', title: 'New Module' }])) });
      const req = new Request('http://localhost/api/admin/modules', { method: 'POST', body: JSON.stringify({ title: 'New Module', courseId: 'c1' }) });
      const res = await POST(req);
      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.module.title).toBe('New Module');
    });
  });

  describe('PUT', () => {
    it('updates a module', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'u1', role: 'ADMIN' } });
      const { createQuery } = mockDb;
      mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery([{ id: 'm1', title: 'Updated' }])) });
      const req = new Request('http://localhost/api/admin/modules', { method: 'PUT', body: JSON.stringify({ id: 'm1', title: 'Updated' }) });
      const res = await PUT(req);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.module.title).toBe('Updated');
    });
  });

  describe('DELETE', () => {
    it('deletes a module', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'u1', role: 'ADMIN' } });
      const req = new Request('http://localhost/api/admin/modules', { method: 'DELETE', body: JSON.stringify({ id: 'm1' }) });
      const res = await DELETE(req);
      expect(res.status).toBe(200);
      expect(mockDb.delete).toHaveBeenCalled();
    });
  });
});
