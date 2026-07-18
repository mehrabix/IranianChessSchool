import { describe, it, expect } from 'vitest';

describe('Auth Register API Integration', () => {
  const url = 'http://localhost:3000/api/auth/register';

  it('registers a new user', async () => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'New User', email: 'new@test.com', password: 'password123' }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.email).toBe('new@test.com');
  });

  it('returns 409 for existing email', async () => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Existing', email: 'existing@test.com', password: 'password123' }),
    });
    expect(res.status).toBe(409);
  });

  it('returns 400 for missing fields', async () => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });
});
