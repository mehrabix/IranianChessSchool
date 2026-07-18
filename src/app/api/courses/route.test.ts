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

import { GET } from './route';

describe('GET /api/courses', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns all published courses', async () => {
    const { createQuery } = mockDb;
    mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery([{ id: '1', title: 'Course 1' }, { id: '2', title: 'Course 2' }])) });
    const res = await GET(new Request('http://localhost/api/courses'));
    const body = await res.json();
    expect(body.courses).toHaveLength(2);
  });

  it('returns a single course by id', async () => {
    const { createQuery } = mockDb;
    mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery([{ id: '1', title: 'Test Course' }])) });
    const res = await GET(new Request('http://localhost/api/courses?id=1'));
    const body = await res.json();
    expect(body.course).toBeDefined();
    expect(body.course.id).toBe('1');
  });

  it('returns 404 for non-existent course', async () => {
    const { createQuery } = mockDb;
    mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery([])) });
    const res = await GET(new Request('http://localhost/api/courses?id=nonexistent'));
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe('Course not found');
  });
});
