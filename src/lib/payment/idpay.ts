import type { PaymentProvider, CreateCheckoutInput, VerifyPaymentInput, WebhookInput } from './types';
import { PLANS } from './plans';

const API_BASE = 'https://api.idpay.ir/v1.1';

export const idpayProvider: PaymentProvider = {
  type: 'IDPAY',

  async createCheckout(input: CreateCheckoutInput) {
    const apiKey = process.env.IDPAY_API_KEY;
    if (!apiKey) throw new Error('IDPAY_API_KEY not set');
    const amount = PLANS[input.plan].priceIrt * 10; // IDPay uses Rials
    const callback = `${input.baseUrl}/api/payments/verify?provider=idpay`;

    const res = await fetch(`${API_BASE}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        'X-SANDBOX': process.env.IDPAY_SANDBOX === 'true' ? '1' : '0',
      },
      body: JSON.stringify({
        order_id: `ics-${input.userId}-${Date.now()}`,
        amount,
        name: PLANS[input.plan].name,
        callback,
      }),
    });

    const data = await res.json();
    if (data.id && data.link) {
      return { redirectUrl: data.link, transactionId: data.id };
    }
    throw new Error(`IDPay request failed: ${data.error_message || 'Unknown error'}`);
  },

  async verifyPayment(input: VerifyPaymentInput) {
    const apiKey = process.env.IDPAY_API_KEY;
    if (!apiKey) throw new Error('IDPAY_API_KEY not set');

    const res = await fetch(`${API_BASE}/payment/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        'X-SANDBOX': process.env.IDPAY_SANDBOX === 'true' ? '1' : '0',
      },
      body: JSON.stringify({
        id: input.authority,
        order_id: `ics-verify-${Date.now()}`,
      }),
    });

    const data = await res.json();
    if (data.status === 100 || data.status === 101) {
      return { success: true, refId: data.track_id || input.authority };
    }
    return { success: false };
  },

  async handleWebhook(_input: WebhookInput) {
    throw new Error('IDPay uses synchronous callback verification');
  },

  async cancelSubscription(_subscriptionId: string) {
    return true;
  },
};
