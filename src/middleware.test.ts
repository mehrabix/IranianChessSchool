import { describe, it, expect, vi } from 'vitest';

vi.mock('next-intl/middleware', () => ({
  default: vi.fn(() => vi.fn()),
}));

describe('middleware', () => {
  it('exports default middleware and config', async () => {
    const mod = await import('@/middleware');
    expect(mod.default).toBeDefined();
    expect(mod.config).toBeDefined();
    expect(mod.config.matcher).toBeDefined();
    expect(Array.isArray(mod.config.matcher)).toBe(true);
  });
});
