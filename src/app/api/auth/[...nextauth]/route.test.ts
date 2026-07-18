import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/auth', () => ({
  handlers: { GET: vi.fn(), POST: vi.fn() },
}));

describe('NextAuth route', () => {
  it('exports GET and POST handlers', async () => {
    const mod = await import('@/app/api/auth/[...nextauth]/route');
    expect(mod.GET).toBeDefined();
    expect(mod.POST).toBeDefined();
  });
});
