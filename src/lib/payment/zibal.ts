import type { PaymentProvider, CreateCheckoutInput, VerifyPaymentInput, WebhookInput } from './types';
import { PLANS } from './plans';

const API_BASE = 'https://api.zibal.ir/v1';

export const zibalProvider: PaymentProvider = {
  type: 'ZIBAL',

  async createCheckout(input: CreateCheckoutInput) {
    const merchant = process.env.ZIBAL_MERCHANT_KEY;
    if (!merchant) throw new Error('ZIBAL_MERCHANT_KEY not set');
    const amount = PLANS[input.plan].priceIrt;
    const callbackUrl = `${input.baseUrl}/api/payments/verify?provider=zibal`;

    const res = await fetch(`${API_BASE}/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchant,
        amount,
        callbackUrl,
        description: `ICS ${PLANS[input.plan].name} subscription`,
      }),
    });

    const data = await res.json();
    if (data.result === 100 && data.trackId) {
      return {
        redirectUrl: `https://gateway.zibal.ir/start/${data.trackId}`,
        transactionId: String(data.trackId),
      };
    }
    throw new Error(`Zibal request failed: ${data.message}`);
  },

  async verifyPayment(input: VerifyPaymentInput) {
    const merchant = process.env.ZIBAL_MERCHANT_KEY;
    if (!merchant) throw new Error('ZIBAL_MERCHANT_KEY not set');

    const res = await fetch(`${API_BASE}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchant,
        trackId: parseInt(input.authority, 10),
      }),
    });

    const data = await res.json();
    if (data.result === 100) {
      return { success: true, refId: String(data.refNumber) };
    }
    return { success: false };
  },

  async handleWebhook(_input: WebhookInput) {
    throw new Error('Zibal uses synchronous callback verification');
  },

  async cancelSubscription(_subscriptionId: string) {
    return true;
  },
};
