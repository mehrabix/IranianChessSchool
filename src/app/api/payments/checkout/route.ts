import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { auth } = await import('@/lib/auth');
  const session = await auth();
  if (!session?.user?.id || !session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { plan } = await req.json();
    const { getStripe, PLANS } = await import('@/lib/stripe');
    const stripe = getStripe();
    const planConfig = PLANS[plan as keyof typeof PLANS];
    if (!planConfig) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: session.user.email,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: planConfig.name },
          unit_amount: planConfig.price,
          recurring: { interval: 'month' },
        },
        quantity: 1,
      }],
      subscription_data: { trial_period_days: 7 },
      success_url: `${req.nextUrl.origin}/dashboard?checkout=success`,
      cancel_url: `${req.nextUrl.origin}/pricing?checkout=canceled`,
      metadata: { userId: session.user.id, plan },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (e) {
    console.error('Stripe checkout error:', e);
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
  }
}
