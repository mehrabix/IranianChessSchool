import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { auth } from '@/lib/auth';
import { db, users as usersTable, eq } from '@/lib/db';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [user] = await db.select({ stripeCustomerId: usersTable.stripeCustomerId }).from(usersTable).where(eq(usersTable.id, session.user.id)).limit(1);

    if (!user?.stripeCustomerId) {
      return NextResponse.json({ error: 'No Stripe customer found' }, { status: 400 });
    }

    const portalSession = await getStripe().billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${req.nextUrl.origin}/dashboard`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create portal' }, { status: 500 });
  }
}
