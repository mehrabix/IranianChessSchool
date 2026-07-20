import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockDb = vi.hoisted(() => {
  const createQuery = (rows) => ({
    where: () => createQuery(rows),
    then: (fn) => Promise.resolve(fn(rows)),
    get: () => Promise.resolve(rows?.[0] ?? null),
    orderBy: () => createQuery(rows),
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
  eq: vi.fn((a, b) => ({ left: a, right: b })),
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
  quizzes: {},
  quizQuestions: {},
  quizAttempts: {},
  quizAnswers: {},
}));

vi.mock('@/lib/auth', () => ({
  auth: () => Promise.resolve({ user: { id: 'u1' } }),
}));

import { GET, POST } from './route';

describe('Quiz API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET returns all quizzes', async () => {
    mockDb.select.mockReturnValue({ from: vi.fn(() => mockDb.createQuery([{ id: 'q1', title: 'Quiz 1' }])) });
    const res = await GET(new Request('http://localhost/api/quizzes'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.quizzes).toHaveLength(1);
  });

  it('GET returns quizzes by lessonId', async () => {
    mockDb.select.mockReturnValue({ from: vi.fn(() => mockDb.createQuery([{ id: 'q1', title: 'Quiz 1' }])) });
    const res = await GET(new Request('http://localhost/api/quizzes?lessonId=l1'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.quizzes).toHaveLength(1);
  });

  it('POST creates a new quiz', async () => {
    const res = await POST(new Request('http://localhost/api/quizzes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New Quiz', lessonId: 'l1' }),
    }));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.id).toBeDefined();
  });
});
