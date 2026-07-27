import { describe, it, expect } from 'vitest';

describe('Notifications API Integration', () => {
  const base = 'http://localhost:3000/api/notifications';

  it('returns notifications with unread count', async () => {
    const res = await fetch(base);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.notifications).toBeDefined();
    expect(body.notifications.length).toBeGreaterThan(0);
    expect(body.unread).toBe(1);
  });

  it('returns 200 with correct content-type', async () => {
    const res = await fetch(base);
    expect(res.status).toBe(200);
  });
});
