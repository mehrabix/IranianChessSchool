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
  quizzes: {},
  quizQuestions: {},
  quizAttempts: {},
  quizAnswers: {},
}));

vi.mock('@/lib/auth', () => ({
  auth: () => Promise.resolve({ user: { id: 'u1' } }),
}));

import { GET, PUT, DELETE } from './route';

describe('GET /api/quizzes/[quizId]', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns quiz with questions', async () => {
    mockDb.select.mockReturnValue({ from: vi.fn()
      .mockReturnValueOnce(mockDb.createQuery([{ id: 'q1', title: 'Quiz 1' }]))
      .mockReturnValueOnce(mockDb.createQuery([{ id: 'qq1', questionText: 'Q1', quizId: 'q1', options: '[]', correctIndices: '[0]', type: 'SINGLE', order: 0 }]))
    });
    const res = await GET(new Request('http://localhost/api/quizzes/q1'), { params: Promise.resolve({ quizId: 'q1' }) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.quiz.id).toBe('q1');
    expect(body.questions).toHaveLength(1);
  });

  it('returns 404 for missing quiz', async () => {
    mockDb.select.mockReturnValue({ from: vi.fn(() => mockDb.createQuery([])) });
    const res = await GET(new Request('http://localhost/api/quizzes/nonexistent'), { params: Promise.resolve({ quizId: 'nonexistent' }) });
    expect(res.status).toBe(404);
  });
});
