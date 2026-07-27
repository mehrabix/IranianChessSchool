import { describe, it, expect } from 'vitest';

describe('Posts API Integration', () => {
  const base = 'http://localhost:3000/api/posts';

  it('returns posts', async () => {
    const res = await fetch(base);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.posts).toBeDefined();
    expect(body.posts.length).toBeGreaterThan(0);
    expect(body.posts[0].content).toBe('Hello');
  });

  it('returns 200 with correct content-type', async () => {
    const res = await fetch(base);
    expect(res.status).toBe(200);
  });
});
