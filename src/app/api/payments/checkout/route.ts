import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { auth } = await import('@/lib/auth');
  const session = await auth();
  if (!session?.user?.id || !session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { plan, provider: providerType } = await req.json();
    const { getPaymentProvider } = await import('@/lib/payment');

    const provider = getPaymentProvider(providerType);
    const result = await provider.createCheckout({
      userId: session.user.id,
      email: session.user.email,
      plan,
      baseUrl: req.nextUrl.origin,
    });

    // For Iranian gateways, store the pending payment
    if (result.transactionId && provider.type !== 'STRIPE') {
      const { db, pendingPayments } = await import('@/lib/db');
      const crypto = await import('crypto');
      const { PLANS } = await import('@/lib/payment/plans');

      await db.insert(pendingPayments).values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        authority: result.transactionId,
        plan,
        amount: PLANS[plan as keyof typeof PLANS]?.priceIrt ?? 0,
        provider: provider.type,
        status: 'PENDING',
        createdAt: new Date(),
      });
    }

    return NextResponse.json({
      url: result.redirectUrl,
      transactionId: result.transactionId,
    });
  } catch (e) {
    console.error('Checkout error:', e);
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
  }
}
