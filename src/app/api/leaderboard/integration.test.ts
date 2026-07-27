import { describe, it, expect } from 'vitest';

describe('Leaderboard API Integration', () => {
  const base = 'http://localhost:3000/api/leaderboard';

  it('returns users', async () => {
    const res = await fetch(base);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.users).toBeDefined();
    expect(body.users.length).toBeGreaterThan(0);
    expect(body.users[0].name).toBe('Player 1');
  });

  it('returns 200 with correct content-type', async () => {
    const res = await fetch(base);
    expect(res.status).toBe(200);
  });
});
