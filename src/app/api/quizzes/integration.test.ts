import { describe, it, expect } from 'vitest';

describe('Quizzes API Integration', () => {
  const base = 'http://localhost:3000/api/quizzes';

  it('returns quizzes for a lesson', async () => {
    const res = await fetch(`${base}?lessonId=l1`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.quizzes).toBeDefined();
    expect(body.quizzes.length).toBeGreaterThan(0);
    expect(body.quizzes[0].title).toBe('Piece Movement');
  });

  it('returns 404 for non-existent lessonId', async () => {
    const res = await fetch(`${base}?lessonId=nonexistent`);
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe('Quizzes not found');
  });
});
