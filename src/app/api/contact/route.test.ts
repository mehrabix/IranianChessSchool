import { describe, it, expect } from 'vitest';
import { POST } from './route';

describe('POST /api/contact', () => {
  it('returns 400 without required fields', async () => {
    const res = await POST(new Request('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test' }),
    }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Name, email, and message are required');
  });

  it('returns success with valid data', async () => {
    const res = await POST(new Request('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test', email: 'test@test.com', subject: 'Hello', message: 'Test message' }),
    }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });
});
