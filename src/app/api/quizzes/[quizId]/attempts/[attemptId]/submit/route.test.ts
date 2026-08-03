import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockDb = vi.hoisted(() => ({
  select: vi.fn(() => ({
    from: vi.fn(() => ({
      where: vi.fn(() => ({
        then: vi.fn((fn: (rows: unknown[]) => unknown) => Promise.resolve(fn([
          { id: 'att1', userId: 'user1', quizId: 'quiz1', score: 0, completedAt: null },
        ]))),
        orderBy: vi.fn(() => Promise.resolve([
          { id: 'q1', quizId: 'quiz1', points: 10, correctIndices: '[0]' },
        ])),
      })),
    })),
  })),
  insert: vi.fn(() => ({ values: vi.fn(() => Promise.resolve()) })),
  update: vi.fn(() => ({
    set: vi.fn(() => ({ where: vi.fn(() => Promise.resolve()) })),
  })),
}));

const mockAuth = vi.hoisted(() => vi.fn());

vi.mock('@/lib/db', () => ({
  db: mockDb,
  quizAttempts: { id: 'id', userId: 'userId', completedAt: 'completedAt' },
  quizQuestions: { id: 'id', quizId: 'quizId', correctIndices: 'correctIndices', points: 'points' },
  quizAnswers: { id: 'id' },
  quizzes: { id: 'id', passingScore: 'passingScore' },
  eq: vi.fn(),
  and: vi.fn(),
  asc: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({ auth: mockAuth }));

import { POST } from './route';

function params(quizId: string, attemptId: string) {
  return Promise.resolve({ quizId, attemptId });
}

describe('POST /api/quizzes/[quizId]/attempts/[attemptId]/submit', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue(null);
    const res = await POST(new Request('http://localhost/api/quizzes/quiz1/attempts/att1/submit', {
      method: 'POST',
      body: JSON.stringify({ answers: [] }),
    }), { params: params('quiz1', 'att1') });
    const data = await res.json();
    expect(res.status).toBe(401);
    expect(data.error).toBe('Not authenticated');
  });

  it('returns 404 when attempt not found', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user1' } });
    mockDb.select.mockReturnValue({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          then: vi.fn((fn: (rows: unknown[]) => unknown) => Promise.resolve(fn([]))),
        })),
      })),
    });
    const res = await POST(new Request('http://localhost/api/quizzes/quiz1/attempts/att1/submit', {
      method: 'POST',
      body: JSON.stringify({ answers: [] }),
    }), { params: params('quiz1', 'att1') });
    const data = await res.json();
    expect(res.status).toBe(404);
    expect(data.error).toBe('Attempt not found');
  });

  it('returns score when submission succeeds', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user1' } });
    mockDb.select.mockReturnValue({
      from: vi.fn((table: unknown) => {
        const isAttempts = table === { id: 'id', userId: 'userId', completedAt: 'completedAt' };
        return {
          where: vi.fn(() => ({
            then: vi.fn((fn: (rows: unknown[]) => unknown) =>
              Promise.resolve(fn(isAttempts ? [{ id: 'att1', userId: 'user1', quizId: 'quiz1', score: 0, completedAt: null }] : [{ id: 'quiz1', passingScore: 70 }]))
            ),
            orderBy: vi.fn(() => Promise.resolve([
              { id: 'q1', quizId: 'quiz1', points: 10, correctIndices: '[0]' },
            ])),
          })),
        };
      }),
    });

    const res = await POST(new Request('http://localhost/api/quizzes/quiz1/attempts/att1/submit', {
      method: 'POST',
      body: JSON.stringify({
        answers: [{ questionId: 'q1', selectedIndices: '[0]' }],
      }),
    }), { params: params('quiz1', 'att1') });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.score).toBeDefined();
    expect(data.percentage).toBeDefined();
  });
});
