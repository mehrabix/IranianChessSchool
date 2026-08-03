import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockDb = vi.hoisted(() => ({
  select: vi.fn(() => ({
    from: vi.fn(() => ({
      where: vi.fn(() => ({
        orderBy: vi.fn(() => Promise.resolve([
          { id: 'q1', quizId: 'quiz1', questionText: 'Best opening move?', options: '["e4","d4","Nf3","c4"]', correctIndices: '[0]', type: 'SINGLE', order: 0, points: 10 },
        ])),
      })),
    })),
  })),
  insert: vi.fn(() => ({ values: vi.fn(() => Promise.resolve()) })),
}));

const mockAuth = vi.hoisted(() => vi.fn());

vi.mock('@/lib/db', () => ({
  db: mockDb,
  quizQuestions: { id: 'id', quizId: 'quizId', questionText: 'questionText', options: 'options', correctIndices: 'correctIndices', type: 'type', order: 'order', explanation: 'explanation', points: 'points' },
  eq: vi.fn(),
  asc: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({ auth: mockAuth }));

import { GET, POST } from './route';

function params(quizId: string) {
  return Promise.resolve({ quizId });
}

describe('GET /api/quizzes/[quizId]/questions', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns questions for a quiz', async () => {
    const res = await GET(new Request('http://localhost/api/quizzes/quiz1/questions'), { params: params('quiz1') });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.questions).toHaveLength(1);
    expect(data.questions[0].questionText).toBe('Best opening move?');
  });
});

describe('POST /api/quizzes/[quizId]/questions', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue(null);
    const res = await POST(new Request('http://localhost/api/quizzes/quiz1/questions', {
      method: 'POST',
      body: JSON.stringify({ questionText: 'Q?', options: ['a', 'b'], correctIndices: [0], type: 'SINGLE' }),
    }), { params: params('quiz1') });
    const data = await res.json();
    expect(res.status).toBe(401);
    expect(data.error).toBe('Not authenticated');
  });

  it('creates a question when authenticated', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user1' } });
    const res = await POST(new Request('http://localhost/api/quizzes/quiz1/questions', {
      method: 'POST',
      body: JSON.stringify({ questionText: 'Q?', options: ['a', 'b'], correctIndices: [0], type: 'SINGLE' }),
    }), { params: params('quiz1') });
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.id).toBeDefined();
  });
});
