import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockProvider = vi.hoisted(() => {
  const mock = {
    createCheckout: vi.fn(),
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

vi.mock('@/lib/db', () => ({
  db: {
    insert: vi.fn(() => ({ values: vi.fn(() => Promise.resolve()) })),
  },
  eq: vi.fn(),
  pendingPayments: { id: 'id' },
}));

import { POST } from './route';

function req(body: Record<string, unknown>, headers?: Record<string, string>) {
  return {
    json: () => Promise.resolve(body),
    nextUrl: { origin: 'http://localhost:3000' },
    headers: new Headers(headers ?? {}),
  } as unknown as Request;
}

describe('POST /api/payments/checkout', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue(null);
    const res = await POST(req({ plan: 'STANDARD' }));
    const data = await res.json();
    expect(res.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('returns 401 when session has no id or email', async () => {
    mockAuth.mockResolvedValue({ user: {} });
    const res = await POST(req({ plan: 'STANDARD' }));
    const data = await res.json();
    expect(res.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('creates checkout and returns redirect URL', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user1', email: 'test@test.com' } });
    mockProvider.createCheckout.mockResolvedValue({
      redirectUrl: 'https://stripe.com/checkout',
      transactionId: null,
    });

    const res = await POST(req({ plan: 'PREMIUM', provider: 'STRIPE' }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.url).toBe('https://stripe.com/checkout');
    expect(mockProvider.createCheckout).toHaveBeenCalledWith({
      userId: 'user1',
      email: 'test@test.com',
      plan: 'PREMIUM',
      baseUrl: 'http://localhost:3000',
    });
  });

  it('handles checkout errors gracefully', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user1', email: 'test@test.com' } });
    mockProvider.createCheckout.mockRejectedValue(new Error('Stripe error'));

    const res = await POST(req({ plan: 'STANDARD' }));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe('Failed to create checkout');
  });
});
