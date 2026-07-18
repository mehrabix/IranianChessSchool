import { describe, it, expect } from 'vitest';

describe('Courses API Integration', () => {
  const base = 'http://localhost:3000/api/courses';

  it('fetches all published courses', async () => {
    const res = await fetch(base);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.courses).toHaveLength(2);
    expect(body.courses[0].title).toBe('Course 1');
  });

  it('fetches a single course by id', async () => {
    const res = await fetch(`${base}?id=1`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.course.id).toBe('1');
    expect(body.course.title).toBe('Test Course');
  });

  it('returns 404 for non-existent course', async () => {
    const res = await fetch(`${base}?id=nonexistent`);
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe('Course not found');
  });
});
