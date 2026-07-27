import { describe, it, expect } from 'vitest';

describe('Lessons API Integration', () => {
  const base = 'http://localhost:3000/api/lessons';

  it('returns a lesson with module and course', async () => {
    const res = await fetch(`${base}?id=l1`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.lesson).toBeDefined();
    expect(body.lesson.title).toBe('Forks');
    expect(body.module.title).toBe('Tactics');
    expect(body.course.title).toBe('Beginner');
  });

  it('returns 404 for non-existent lesson', async () => {
    const res = await fetch(`${base}?id=nonexistent`);
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe('Lesson not found');
  });
});
