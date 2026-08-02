import type { PaymentProvider, ProviderType } from './types';
import { stripeProvider } from './stripe';
import { zarinpalProvider } from './zarinpal';
import { zibalProvider } from './zibal';
import { nextpayProvider } from './nextpay';
import { idpayProvider } from './idpay';
import { paypingProvider } from './payping';

const providers: Partial<Record<ProviderType, PaymentProvider>> = {
  STRIPE: stripeProvider,
  ZARINPAL: zarinpalProvider,
  ZIBAL: zibalProvider,
  NEXTPAY: nextpayProvider,
  IDPAY: idpayProvider,
  PAYPING: paypingProvider,
};

export function getPaymentProvider(type?: ProviderType): PaymentProvider {
  const providerType = type || (process.env.PAYMENT_PROVIDER as ProviderType) || 'STRIPE';
  const provider = providers[providerType];
  if (!provider) {
    throw new Error(`Unknown payment provider: ${providerType}. Available: ${Object.keys(providers).join(', ')}`);
  }
  return provider;
}

export { PLANS } from './plans';
export type { ProviderType, PaymentProvider, PlanKey, CreateCheckoutInput, CreateCheckoutOutput, VerifyPaymentInput, VerifyPaymentOutput, WebhookInput, WebhookOutput } from './types';
