import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { auth } = await import('@/lib/auth');
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { getPaymentProvider } = await import('@/lib/payment');
    const provider = getPaymentProvider();

    // Only Stripe has a hosted portal
    if (!provider.getPortalUrl) {
      return NextResponse.json({
        url: '/dashboard/subscription',
        message: 'Manage your subscription from the subscription page',
      });
    }

    const { db, users, eq } = await import('@/lib/db');
    const [user] = await db
      .select({ stripeCustomerId: users.stripeCustomerId })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user?.stripeCustomerId) {
      return NextResponse.json({ error: 'No payment customer found' }, { status: 400 });
    }

    const url = await provider.getPortalUrl(user.stripeCustomerId, `${req.nextUrl.origin}/dashboard`);
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: 'Failed to create portal' }, { status: 500 });
  }
}
