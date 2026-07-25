import { describe, it, expect } from 'vitest';

const url = 'http://localhost:3000/api/chess/analyze';

describe('Analyze API Integration', () => {
  it('returns analysis for valid PGN', async () => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pgn: '1. e4 e5 2. Nf3 Nc6' }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.moves).toHaveLength(4);
    expect(typeof body.totalAccuracy).toBe('number');
  });

  it('returns 400 for missing PGN', async () => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('PGN is required');
  });

  it('returns 400 for invalid PGN', async () => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pgn: 'invalid pgn data' }),
    });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Invalid PGN');
  });

  it('returns 400 for empty PGN', async () => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pgn: '' }),
    });
    expect(res.status).toBe(400);
  });
});
