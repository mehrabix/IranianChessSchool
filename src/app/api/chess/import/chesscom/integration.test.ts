import { describe, it, expect } from 'vitest';

const url = 'http://localhost:3000/api/chess/import/chesscom';

describe('Chess.com Import API Integration', () => {
  it('returns games for valid username', async () => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'testuser' }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.games).toHaveLength(1);
  });

  it('returns 400 for missing username', async () => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Username is required');
  });
});