import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockProvider = vi.hoisted(() => {
  const wrap = {
    handleWebhook: vi.fn(),
    type: 'STRIPE' as const,
  };
  return {
    getPaymentProvider: vi.fn(() => wrap),
    provider: wrap,
  };
});

vi.mock('@/lib/payment', () => ({
  getPaymentProvider: mockProvider.getPaymentProvider,
}));

const mockDb = vi.hoisted(() => {
  const createQuery = (rows: unknown[]) => ({
    where: () => createQuery(rows),
    limit: () => Promise.resolve(rows),
    returning: () => Promise.resolve(rows),
    set: vi.fn().mockReturnThis(),
  });
  const update = vi.fn(() => ({
    set: vi.fn().mockReturnThis(),
    where: vi.fn(() => Promise.resolve()),
  }));
  return {
    update,
    select: vi.fn(() => ({ from: vi.fn(() => createQuery([])) })),
    insert: vi.fn(() => ({ values: vi.fn(() => Promise.resolve()) })),
  };
});

vi.mock('@/lib/db', () => ({
  db: mockDb,
  eq: vi.fn(),
  users: { id: 'id', subscriptionId: 'subscriptionId', subscriptionStatus: 'subscriptionStatus', stripeCustomerId: 'stripeCustomerId' },
  subscriptions: { id: 'id', providerSubscriptionId: 'providerSubscriptionId' },
}));

import { POST } from './route';

function req(body: string, headers?: Record<string, string>) {
  return {
    text: () => Promise.resolve(body),
    json: () => Promise.resolve(JSON.parse(body)),
    headers: new Headers(headers ?? {}),
    nextUrl: { origin: 'http://localhost:3000' },
  } as unknown as Request;
}

describe('POST /api/payments/webhook', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns 400 when no stripe-signature header', async () => {
    const res = await POST(req('{}'));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toBe('Only Stripe webhooks are supported here');
  });

  it('handles subscription.created webhook', async () => {
    mockProvider.provider.handleWebhook.mockResolvedValue({
      type: 'subscription.created',
      userId: 'user1',
      subscriptionId: 'sub_123',
      customerId: 'cus_123',
      plan: 'STANDARD',
    });

    const res = await POST(req('{}', { 'stripe-signature': 'sig_123' }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.received).toBe(true);
    expect(mockProvider.getPaymentProvider).toHaveBeenCalledWith('STRIPE');
  });

  it('handles subscription.cancelled webhook', async () => {
    mockProvider.provider.handleWebhook.mockResolvedValue({
      type: 'subscription.cancelled',
      subscriptionId: 'sub_123',
    });

    const res = await POST(req('{}', { 'stripe-signature': 'sig_123' }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.received).toBe(true);
  });

  it('handles webhook errors gracefully', async () => {
    mockProvider.provider.handleWebhook.mockRejectedValue(new Error('Invalid signature'));

    const res = await POST(req('{}', { 'stripe-signature': 'bad_sig' }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Webhook error');
  });

  it('handles unknown webhook event types gracefully', async () => {
    mockProvider.provider.handleWebhook.mockResolvedValue({
      type: 'unknown.event',
    });

    const res = await POST(req('{}', { 'stripe-signature': 'sig_123' }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.received).toBe(true);
  });
});
