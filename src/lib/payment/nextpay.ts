import type { PaymentProvider, CreateCheckoutInput, VerifyPaymentInput, WebhookInput } from './types';
import { PLANS } from './plans';

const API_BASE = 'https://nextpay.org/nx/gateway';

export const nextpayProvider: PaymentProvider = {
  type: 'NEXTPAY',

  async createCheckout(input: CreateCheckoutInput) {
    const apiKey = process.env.NEXTPAY_API_KEY;
    if (!apiKey) throw new Error('NEXTPAY_API_KEY not set');
    const amount = PLANS[input.plan].priceIrt;
    const callbackUrl = `${input.baseUrl}/api/payments/verify?provider=nextpay`;

    const res = await fetch(`${API_BASE}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        amount,
        callback_uri: callbackUrl,
        order_id: `ics-${input.userId}-${Date.now()}`,
      }),
    });

    const data = await res.json();
    if (data.code === 0 && data.trans_id) {
      return {
        redirectUrl: `${API_BASE}/payment/${data.trans_id}`,
        transactionId: data.trans_id,
      };
    }
    throw new Error(`NextPay request failed: ${data.message || 'Unknown error'}`);
  },

  async verifyPayment(input: VerifyPaymentInput) {
    const apiKey = process.env.NEXTPAY_API_KEY;
    if (!apiKey) throw new Error('NEXTPAY_API_KEY not set');

    const res = await fetch(`${API_BASE}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        trans_id: input.authority,
        amount: input.amount,
      }),
    });

    const data = await res.json();
    if (data.code === 0) {
      return { success: true, refId: data.Shaparak_Ref_Id || input.authority };
    }
    return { success: false };
  },

  async handleWebhook(_input: WebhookInput) {
    throw new Error('NextPay uses synchronous callback verification');
  },

  async cancelSubscription(_subscriptionId: string) {
    return true;
  },
};
