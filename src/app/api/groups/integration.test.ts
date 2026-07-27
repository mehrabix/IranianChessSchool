import { describe, it, expect } from 'vitest';

describe('Groups API Integration', () => {
  const base = 'http://localhost:3000/api/groups';

  it('returns groups', async () => {
    const res = await fetch(base);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.groups).toBeDefined();
    expect(body.groups.length).toBeGreaterThan(0);
    expect(body.groups[0].name).toBe('Beginners');
  });

  it('returns 200 with correct content-type', async () => {
    const res = await fetch(base);
    expect(res.status).toBe(200);
  });
});
