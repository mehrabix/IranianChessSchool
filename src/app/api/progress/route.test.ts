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
  desc: vi.fn(),
  asc: vi.fn(),
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
  progress: {},
  lessons: {},
  posts: {},
}));

vi.mock('@/lib/auth', () => ({ auth: mockAuth }));

import { GET, POST } from './route';

describe('GET /api/progress', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns 401 without session', async () => {
    mockAuth.mockResolvedValue(null);
    const res = await GET(new Request('http://localhost/api/progress'));
    expect(res.status).toBe(401);
  });

  it('returns all progress', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'u1' } });
    const { createQuery } = mockDb;
    mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery([{ id: 'p1', lessonId: 'l1' }])) });
    const res = await GET(new Request('http://localhost/api/progress'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.progress).toHaveLength(1);
  });
});

describe('POST /api/progress', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns 401 without session', async () => {
    mockAuth.mockResolvedValueOnce(null);
    const res = await POST(new Request('http://localhost/api/progress', { method: 'POST', body: JSON.stringify({ lessonId: 'l1' }) }));
    expect(res.status).toBe(401);
  });

  it('returns 400 without lessonId', async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: 'u1' } });
    const res = await POST(new Request('http://localhost/api/progress', { method: 'POST', body: JSON.stringify({}) }));
    expect(res.status).toBe(400);
  });

  it('creates new progress record', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'u1' } });
    const { createQuery } = mockDb;
    const fromFn = vi.fn()
      .mockReturnValueOnce(createQuery([]))
      .mockReturnValueOnce(createQuery([{ id: 'n1', userId: 'u1', lessonId: 'l1' }]));
    mockDb.select.mockReturnValue({ from: fromFn });
    const res = await POST(new Request('http://localhost/api/progress', { method: 'POST', body: JSON.stringify({ lessonId: 'l1', completed: true }) }));
    const body = await res.json();
    expect(body.progress.lessonId).toBe('l1');
  });
});
