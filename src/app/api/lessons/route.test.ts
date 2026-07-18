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
  asc: vi.fn(),
  desc: vi.fn(),
  sql: vi.fn(),
  like: vi.fn(),
  inArray: vi.fn(),
  between: vi.fn(),
  not: vi.fn(),
  isNull: vi.fn(),
  isNotNull: vi.fn(),
  or: vi.fn(),
  users: {},
  courses: {},
  modules: {},
  lessons: {},
  progress: {},
  posts: {},
}));

import { GET } from './route';

describe('GET /api/lessons', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns 400 without id, moduleId, or courseId', async () => {
    const res = await GET(new Request('http://localhost/api/lessons'));
    expect(res.status).toBe(400);
  });

  it('returns a lesson by id with next/prev navigation', async () => {
    const { createQuery } = mockDb;
    const lesson = { id: 'l1', title: 'Lesson 1', moduleId: 'm1', courseId: 'c1', order: 1 };
    const mod = { id: 'm1', title: 'Module 1', courseId: 'c1', order: 1 };
    const course = { id: 'c1', title: 'Course 1', published: true };
    const allLessons = [
      { id: 'l0', title: 'Prev', moduleId: 'm1', courseId: 'c1', order: 0 },
      lesson,
      { id: 'l2', title: 'Next', moduleId: 'm1', courseId: 'c1', order: 2 },
    ];

    const fromFn = vi.fn()
      .mockReturnValueOnce(createQuery([lesson]))
      .mockReturnValueOnce(createQuery([mod]))
      .mockReturnValueOnce(createQuery([course]))
      .mockReturnValueOnce(createQuery(allLessons));
    mockDb.select.mockReturnValue({ from: fromFn });

    const res = await GET(new Request('http://localhost/api/lessons?id=l1'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.lesson.id).toBe('l1');
    expect(body.module.id).toBe('m1');
    expect(body.course.id).toBe('c1');
    expect(body.prevLesson.id).toBe('l0');
    expect(body.nextLesson.id).toBe('l2');
  });

  it('returns lessons by moduleId', async () => {
    const { createQuery } = mockDb;
    mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery([{ id: 'l1', title: 'Lesson 1' }])) });
    const res = await GET(new Request('http://localhost/api/lessons?moduleId=m1'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.lessons).toHaveLength(1);
  });
});
