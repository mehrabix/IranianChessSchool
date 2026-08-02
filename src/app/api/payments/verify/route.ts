import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authority = req.nextUrl.searchParams.get('Authority') || req.nextUrl.searchParams.get('authority');
  const status = req.nextUrl.searchParams.get('Status') || req.nextUrl.searchParams.get('status');
  const providerParam = req.nextUrl.searchParams.get('provider');

  if (!authority) {
    return NextResponse.redirect(new URL('/pricing?payment=failed', req.url));
  }

  try {
    const { getPaymentProvider } = await import('@/lib/payment');
    const provider = getPaymentProvider(providerParam as never);

    if (provider.type === 'STRIPE') {
      return NextResponse.redirect(new URL('/dashboard?checkout=success', req.url));
    }

    const { db, pendingPayments, users, subscriptions, eq } = await import('@/lib/db');

    const [pending] = await db
      .select()
      .from(pendingPayments)
      .where(eq(pendingPayments.authority, authority))
      .limit(1);

    if (!pending || !pending.userId || pending.status !== 'PENDING') {
      return NextResponse.redirect(new URL('/pricing?payment=expired', req.url));
    }

    const userId = pending.userId;

    if (status && status !== 'OK') {
      await db.update(pendingPayments)
        .set({ status: 'FAILED' as const })
        .where(eq(pendingPayments.id, pending.id));
      return NextResponse.redirect(new URL('/pricing?payment=cancelled', req.url));
    }

    const result = await provider.verifyPayment({ authority, amount: pending.amount });

    if (result.success) {
      await db.update(users)
        .set({
          subscriptionStatus: 'ACTIVE',
          subscriptionId: result.refId,
          paymentProvider: provider.type,
        })
        .where(eq(users.id, userId));

      const crypto = await import('crypto');
      const now = new Date();
      const periodEnd = new Date(now);
      periodEnd.setMonth(periodEnd.getMonth() + 1);

      await db.insert(subscriptions).values({
        id: crypto.randomUUID(),
        userId,
        plan: (pending.plan as 'STANDARD' | 'PREMIUM' | 'VIP') || 'STANDARD',
        status: 'ACTIVE' as const,
        providerSubscriptionId: result.refId,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false,
      });

      await db.update(pendingPayments)
        .set({ status: 'VERIFIED' as const, refId: result.refId })
        .where(eq(pendingPayments.id, pending.id));

      return NextResponse.redirect(new URL('/dashboard?payment=success', req.url));
    }

    await db.update(pendingPayments)
      .set({ status: 'FAILED' as const })
      .where(eq(pendingPayments.id, pending.id));
    return NextResponse.redirect(new URL('/pricing?payment=failed', req.url));
  } catch (e) {
    console.error('Verify error:', e);
    return NextResponse.redirect(new URL('/pricing?payment=error', req.url));
  }
}
