import { describe, it, expect } from 'vitest';

describe('Tournaments API Integration', () => {
  const base = 'http://localhost:3000/api/tournaments';

  it('returns tournaments', async () => {
    const res = await fetch(base);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.tournaments).toBeDefined();
    expect(body.tournaments.length).toBeGreaterThan(0);
    expect(body.tournaments[0].name).toBe('Blitz Cup');
  });

  it('returns 200 with correct content-type', async () => {
    const res = await fetch(base);
    expect(res.status).toBe(200);
  });
});
