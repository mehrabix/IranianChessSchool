import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
  }
  return _stripe;
}

export const PLANS = {
  STANDARD: { price: 2900, name: 'Standard', stripePriceId: process.env.STRIPE_STANDARD_PRICE_ID },
  PREMIUM: { price: 4900, name: 'Premium', stripePriceId: process.env.STRIPE_PREMIUM_PRICE_ID },
  VIP: { price: 19900, name: 'VIP', stripePriceId: process.env.STRIPE_VIP_PRICE_ID },
} as const;
