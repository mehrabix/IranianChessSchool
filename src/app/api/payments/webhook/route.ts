import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db, users, eq, sql } from '@/lib/db';

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;
        if (userId && plan) {
          await db.update(users).set({
            subscriptionStatus: 'ACTIVE',
            subscriptionId: session.subscription as string,
            stripeCustomerId: session.customer as string,
          }).where(eq(users.id, userId));
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        await db.update(users).set({
          subscriptionStatus: 'CANCELED',
        }).where(eq(users.subscriptionId, sub.id));
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error('Webhook error:', e);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }
}
