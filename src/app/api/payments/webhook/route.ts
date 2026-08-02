import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Only Stripe webhooks are supported here' }, { status: 400 });
  }

  try {
    const { getPaymentProvider } = await import('@/lib/payment');
    const provider = getPaymentProvider('STRIPE');

    const rawBody = await req.text();
    const result = await provider.handleWebhook({
      rawBody,
      headers: req.headers,
    });

    const { db, users, subscriptions, eq } = await import('@/lib/db');

    if (result.type === 'subscription.created') {
      if (result.userId) {
        await db.update(users)
          .set({
            subscriptionStatus: 'ACTIVE',
            subscriptionId: result.subscriptionId,
            stripeCustomerId: result.customerId,
            paymentProvider: 'STRIPE' as const,
          })
          .where(eq(users.id, result.userId));

        const crypto = await import('crypto');
        const now = new Date();
        const periodEnd = new Date(now);
        periodEnd.setMonth(periodEnd.getMonth() + 1);

        await db.insert(subscriptions).values({
          id: crypto.randomUUID(),
          userId: result.userId,
          plan: (result.plan as 'STANDARD' | 'PREMIUM' | 'VIP') || 'STANDARD',
          status: 'ACTIVE' as const,
          providerSubscriptionId: result.subscriptionId,
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          cancelAtPeriodEnd: false,
        });
      }
    } else if (result.type === 'subscription.cancelled') {
      const subId = result.subscriptionId || '';

      const [user] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.subscriptionId, subId))
        .limit(1);

      if (user) {
        await db.update(users)
          .set({ subscriptionStatus: 'CANCELED' as const })
          .where(eq(users.id, user.id));

        await db.update(subscriptions)
          .set({ status: 'CANCELED' as const })
          .where(eq(subscriptions.providerSubscriptionId, subId));
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error('Webhook error:', e);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }
}
