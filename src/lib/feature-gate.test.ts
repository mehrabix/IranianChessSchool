import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockDb = vi.hoisted(() => {
  const createQuery = (rows: any[]) => ({
    where: () => createQuery(rows),
    limit: () => createQuery(rows),
    orderBy: () => createQuery(rows),
    then: (fn: any) => Promise.resolve(fn(rows)),
  });
  return {
    select: vi.fn(() => ({ from: vi.fn(() => createQuery([])) })),
    createQuery,
  };
});

vi.mock('@/lib/db', () => ({
  db: mockDb,
  eq: vi.fn((a: any, b: any) => ({ left: a, right: b })),
  desc: vi.fn((col: any) => col),
  users: { id: 'id', subscriptionStatus: 'subscriptionStatus' },
  subscriptions: { userId: 'userId', plan: 'plan', currentPeriodEnd: 'currentPeriodEnd' },
}));

import { canAccess, getPlanFeatures, getUserSubscription, requireSubscription } from './feature-gate';

describe('canAccess', () => {
  it('returns false for null plan', () => {
    expect(canAccess(null, 'courses:all')).toBe(false);
  });

  it('returns true for matching feature', () => {
    expect(canAccess('STANDARD', 'courses:all')).toBe(true);
  });

  it('returns false for unmatched feature', () => {
    expect(canAccess('STANDARD', 'analysis:basic')).toBe(false);
  });

  it('returns false for unknown feature', () => {
    expect(canAccess('PREMIUM', 'nonexistent')).toBe(false);
  });

  it('VIP has full access', () => {
    expect(canAccess('VIP', 'coaching:access')).toBe(true);
    expect(canAccess('VIP', 'analysis:advanced')).toBe(true);
  });
});

describe('getPlanFeatures', () => {
  it('returns features for STANDARD', () => {
    const features = getPlanFeatures('STANDARD');
    expect(features).toContain('courses:all');
    expect(features).not.toContain('analysis:advanced');
  });

  it('returns features for PREMIUM', () => {
    const features = getPlanFeatures('PREMIUM');
    expect(features).toContain('analysis:basic');
    expect(features).not.toContain('coaching:access');
  });
});

describe('getUserSubscription', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns null plan when no subscription', async () => {
    const { createQuery } = mockDb;
    mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery([{ subscriptionStatus: null }])) });
    const result = await getUserSubscription('user-1');
    expect(result.plan).toBeNull();
    expect(result.status).toBeNull();
  });

  it('returns null plan for CANCELED status', async () => {
    const { createQuery } = mockDb;
    mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery([{ subscriptionStatus: 'CANCELED' }])) });
    const result = await getUserSubscription('user-1');
    expect(result.plan).toBeNull();
  });

  it('returns plan for ACTIVE status', async () => {
    const { createQuery } = mockDb;
    // First query returns user status, second returns subscription plan
    let callCount = 0;
    mockDb.select.mockReturnValue({
      from: vi.fn(() => {
        callCount++;
        if (callCount === 1) return createQuery([{ subscriptionStatus: 'ACTIVE' }]);
        return createQuery([{ plan: 'STANDARD' }]);
      }),
    });
    const result = await getUserSubscription('user-1');
    expect(result.status).toBe('ACTIVE');
    expect(result.plan).toBe('STANDARD');
  });
});

describe('requireSubscription', () => {
  it('returns not allowed for undefined userId', async () => {
    const result = await requireSubscription(undefined, 'courses:all');
    expect(result.allowed).toBe(false);
  });

  it('returns not allowed when user has no subscription', async () => {
    const { createQuery } = mockDb;
    mockDb.select.mockReturnValue({ from: vi.fn(() => createQuery([{ subscriptionStatus: null }])) });
    const result = await requireSubscription('user-1', 'analysis:basic');
    expect(result.allowed).toBe(false);
  });

  it('returns not allowed when feature requires higher plan', async () => {
    const { createQuery } = mockDb;
    let callCount = 0;
    mockDb.select.mockReturnValue({
      from: vi.fn(() => {
        callCount++;
        if (callCount === 1) return createQuery([{ subscriptionStatus: 'ACTIVE' }]);
        return createQuery([{ plan: 'STANDARD' }]);
      }),
    });
    const result = await requireSubscription('user-1', 'coaching:access');
    expect(result.allowed).toBe(false);
  });

  it('returns allowed when feature matches plan', async () => {
    const { createQuery } = mockDb;
    let callCount = 0;
    mockDb.select.mockReturnValue({
      from: vi.fn(() => {
        callCount++;
        if (callCount === 1) return createQuery([{ subscriptionStatus: 'ACTIVE' }]);
        return createQuery([{ plan: 'PREMIUM' }]);
      }),
    });
    const result = await requireSubscription('user-1', 'analysis:basic');
    expect(result.allowed).toBe(true);
  });
});
