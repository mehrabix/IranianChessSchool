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
  quizzes: {},
  quizAttempts: {},
  quizAnswers: {},
}));

vi.mock('@/lib/auth', () => ({
  auth: () => Promise.resolve({ user: { id: 'u1' } }),
}));

import { GET, POST } from './route';

describe('Quiz Attempts API', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('POST creates a new attempt', async () => {
    mockDb.select.mockReturnValue({ from: vi.fn()
      .mockReturnValueOnce(mockDb.createQuery([{ id: 'q1', maxAttempts: 3 }]))
      .mockReturnValueOnce(mockDb.createQuery([])) // no existing attempts
    });
    const res = await POST(new Request('http://localhost/api/quizzes/q1/attempts', { method: 'POST' }), { params: Promise.resolve({ quizId: 'q1' }) });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.attemptId).toBeDefined();
  });

  it('POST returns 403 when max attempts reached', async () => {
    mockDb.select.mockReturnValue({ from: vi.fn()
      .mockReturnValueOnce(mockDb.createQuery([{ id: 'q1', maxAttempts: 1 }]))
      .mockReturnValueOnce(mockDb.createQuery([{ id: 'a1' }, { id: 'a2' }])) // 2 existing
    });
    const res = await POST(new Request('http://localhost/api/quizzes/q1/attempts', { method: 'POST' }), { params: Promise.resolve({ quizId: 'q1' }) });
    expect(res.status).toBe(403);
  });

  it('GET returns user attempts', async () => {
    mockDb.select.mockReturnValue({ from: vi.fn(() => mockDb.createQuery([{ id: 'a1', quizId: 'q1' }])) });
    const res = await GET(new Request('http://localhost/api/quizzes/q1/attempts'), { params: Promise.resolve({ quizId: 'q1' }) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.attempts).toHaveLength(1);
  });
});
