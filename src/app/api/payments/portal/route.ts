import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { auth } = await import('@/lib/auth');
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { db, users, eq } = await import('@/lib/db');
    const [user] = await db.select({ stripeCustomerId: users.stripeCustomerId }).from(users).where(eq(users.id, session.user.id)).limit(1);

    if (!user?.stripeCustomerId) {
      return NextResponse.json({ error: 'No Stripe customer found' }, { status: 400 });
    }

    const { getStripe } = await import('@/lib/stripe');
    const portalSession = await getStripe().billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${req.nextUrl.origin}/dashboard`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch {
    return NextResponse.json({ error: 'Failed to create portal' }, { status: 500 });
  }
}
