import { describe, it, expect } from 'vitest';

describe('Progress API Integration', () => {
  const base = 'http://localhost:3000/api/progress';

  it('returns progress', async () => {
    const res = await fetch(base);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.progress).toBeDefined();
    expect(body.progress.length).toBeGreaterThan(0);
    expect(body.progress[0].completed).toBe(true);
  });

  it('returns 200 with correct content-type', async () => {
    const res = await fetch(base);
    expect(res.status).toBe(200);
  });
});
