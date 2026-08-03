import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockProvider = vi.hoisted(() => {
  const mock = {
    getPortalUrl: vi.fn(),
    type: 'STRIPE' as const,
  };
  return mock;
});

vi.mock('@/lib/payment', () => ({
  getPaymentProvider: vi.fn(() => mockProvider),
}));

const { mockAuth } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
}));
vi.mock('@/lib/auth', () => ({ auth: mockAuth }));

const mockDb = vi.hoisted(() => {
  const createQuery = (rows: unknown[]) => ({
    where: () => createQuery(rows),
    limit: () => Promise.resolve(rows),
    returning: () => Promise.resolve(rows),
  });
  return {
    select: vi.fn(() => ({ from: vi.fn(() => createQuery([])) })),
    insert: vi.fn(() => ({ values: vi.fn(() => ({ returning: vi.fn(() => Promise.resolve([{ id: '1' }])) })) })),
  };
});

vi.mock('@/lib/db', () => ({
  db: mockDb,
  eq: vi.fn(),
  users: { id: 'id', stripeCustomerId: 'stripeCustomerId' },
}));

import { POST } from './route';

function req(body?: Record<string, unknown>) {
  return {
    json: () => Promise.resolve(body ?? {}),
    nextUrl: { origin: 'http://localhost:3000' },
  } as unknown as Request;
}

describe('POST /api/payments/portal', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue(null);
    const res = await POST(req());
    const data = await res.json();
    expect(res.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('returns 401 when session has no user id', async () => {
    mockAuth.mockResolvedValue({ user: {} });
    const res = await POST(req());
    const data = await res.json();
    expect(res.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('returns dashboard URL for non-stripe provider without portal', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user1' } });
    mockProvider.getPortalUrl = undefined as unknown as typeof mockProvider.getPortalUrl;

    const res = await POST(req());
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.url).toBe('/dashboard/subscription');
  });

  it('returns 400 when stripe customer not found', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user1' } });
    mockProvider.getPortalUrl = vi.fn();
    // mockDb returns empty rows by default

    const res = await POST(req());
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('No payment customer found');
  });

  it('returns portal URL for stripe provider with valid customer', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user1' } });
    mockProvider.getPortalUrl = vi.fn().mockResolvedValue('https://stripe.com/portal');

    // Override select to return a user with stripeCustomerId
    mockDb.select.mockReturnValue({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve([{ stripeCustomerId: 'cus_123' }])),
        })),
      })),
    });

    const res = await POST(req());
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.url).toBe('https://stripe.com/portal');
  });

  it('handles internal errors gracefully', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user1' } });
    mockProvider.getPortalUrl = vi.fn();
    mockDb.select.mockImplementation(() => { throw new Error('DB error'); });

    const res = await POST(req());
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe('Failed to create portal');
  });
});
