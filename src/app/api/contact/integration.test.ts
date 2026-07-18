import { describe, it, expect } from 'vitest';

describe('Contact API Integration', () => {
  const url = 'http://localhost:3000/api/contact';

  it('submits contact form successfully', async () => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test', email: 'test@test.com', subject: 'Hello', message: 'Test message' }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  it('returns 400 for missing fields', async () => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test' }),
    });
    expect(res.status).toBe(400);
  });
});
