import Stripe from 'stripe';
import type { PaymentProvider, CreateCheckoutInput, VerifyPaymentInput, WebhookInput } from './types';
import { PLANS } from './plans';

let _stripe: Stripe | null = null;
function getStripeClient(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
  }
  return _stripe;
}

export const stripeProvider: PaymentProvider = {
  type: 'STRIPE',

  async createCheckout(input: CreateCheckoutInput) {
    const stripe = getStripeClient();
    const planConfig = PLANS[input.plan];
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: input.email,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: planConfig.name },
          unit_amount: planConfig.priceUsd,
          recurring: { interval: 'month' },
        },
        quantity: 1,
      }],
      subscription_data: { trial_period_days: 7 },
      success_url: `${input.baseUrl}/dashboard?checkout=success`,
      cancel_url: `${input.baseUrl}/pricing?checkout=canceled`,
      metadata: { userId: input.userId, plan: input.plan },
    });
    return { redirectUrl: session.url! };
  },

  async verifyPayment(_input: VerifyPaymentInput) {
    throw new Error('Stripe uses webhook verification, not synchronous verify');
  },

  async handleWebhook(input: WebhookInput) {
    const stripe = getStripeClient();
    const sig = input.headers.get('stripe-signature')!;
    const event = stripe.webhooks.constructEvent(
      input.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      return {
        type: 'subscription.created',
        userId: session.metadata?.userId || '',
        plan: session.metadata?.plan,
        subscriptionId: session.subscription as string,
        customerId: session.customer as string,
        provider: 'STRIPE',
      };
    }

    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object as Stripe.Subscription;
      return {
        type: 'subscription.cancelled',
        userId: '',
        subscriptionId: sub.id,
        provider: 'STRIPE',
      };
    }

    throw new Error(`Unhandled event type: ${event.type}`);
  },

  async cancelSubscription(subscriptionId: string) {
    const stripe = getStripeClient();
    await stripe.subscriptions.cancel(subscriptionId);
    return true;
  },

  async getPortalUrl(customerId: string, returnUrl: string) {
    const stripe = getStripeClient();
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    return session.url;
  },
};
