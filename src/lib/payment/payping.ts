import type { PaymentProvider, CreateCheckoutInput, VerifyPaymentInput, WebhookInput } from './types';
import { PLANS } from './plans';

const API_BASE = 'https://api.payping.ir/v2';

export const paypingProvider: PaymentProvider = {
  type: 'PAYPING',

  async createCheckout(input: CreateCheckoutInput) {
    const token = process.env.PAYPING_TOKEN;
    if (!token) throw new Error('PAYPING_TOKEN not set');
    const amount = PLANS[input.plan].priceIrt * 10; // PayPing uses Rials
    const returnUrl = `${input.baseUrl}/api/payments/verify?provider=payping`;

    const res = await fetch(`${API_BASE}/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount,
        returnUrl,
        payerIdentity: input.email,
        description: `ICS ${PLANS[input.plan].name} subscription`,
        clientRefId: `ics-${input.userId}`,
      }),
    });

    const data = await res.json();
    if (data.code) {
      return { redirectUrl: `https://api.payping.ir/v2/pay/gotoipg/${data.code}`, transactionId: data.code };
    }
    throw new Error(`PayPing request failed: ${JSON.stringify(data)}`);
  },

  async verifyPayment(input: VerifyPaymentInput) {
    const token = process.env.PAYPING_TOKEN;
    if (!token) throw new Error('PAYPING_TOKEN not set');

    const res = await fetch(`${API_BASE}/pay/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount: input.amount,
        refId: input.authority,
      }),
    });

    const data = await res.json();
    if (data.refId) {
      return { success: true, refId: data.refId };
    }
    return { success: false };
  },

  async handleWebhook(_input: WebhookInput) {
    throw new Error('PayPing uses synchronous callback verification');
  },

  async cancelSubscription(_subscriptionId: string) {
    return true;
  },
};
