import type { PaymentProvider, CreateCheckoutInput, VerifyPaymentInput, WebhookInput } from './types';
import { PLANS } from './plans';

const SANDBOX = process.env.ZARINPAL_SANDBOX === 'true';
const API_BASE = SANDBOX
  ? 'https://sandbox.zarinpal.com/pg/v4/payment'
  : 'https://api.zarinpal.com/pg/v4/payment';
const START_PAY = SANDBOX
  ? 'https://sandbox.zarinpal.com/pg/StartPay'
  : 'https://www.zarinpal.com/pg/StartPay';

export const zarinpalProvider: PaymentProvider = {
  type: 'ZARINPAL',

  async createCheckout(input: CreateCheckoutInput) {
    const merchantId = process.env.ZARINPAL_MERCHANT_ID;
    if (!merchantId) throw new Error('ZARINPAL_MERCHANT_ID not set');

    const planConfig = PLANS[input.plan];
    const amount = planConfig.priceIrt;
    const callbackUrl = `${input.baseUrl}/api/payments/verify?provider=zarinpal`;

    const res = await fetch(`${API_BASE}/request.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        merchant_id: merchantId,
        amount,
        callback_url: callbackUrl,
        description: `ICS ${planConfig.name} subscription`,
        metadata: { userId: input.userId, plan: input.plan },
      }),
    });

    const data = await res.json();

    if (data.data?.code === 100 && data.data?.authority) {
      return {
        redirectUrl: `${START_PAY}/${data.data.authority}`,
        transactionId: data.data.authority,
      };
    }

    const errorMsg = data.errors
      ? Object.values(data.errors).flat().join(', ')
      : 'Unknown error';
    throw new Error(`Zarinpal request failed: ${errorMsg}`);
  },

  async verifyPayment(input: VerifyPaymentInput) {
    const merchantId = process.env.ZARINPAL_MERCHANT_ID;
    if (!merchantId) throw new Error('ZARINPAL_MERCHANT_ID not set');

    const res = await fetch(`${API_BASE}/verify.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        merchant_id: merchantId,
        amount: input.amount,
        authority: input.authority,
      }),
    });

    const data = await res.json();

    if (data.data?.code === 100 || data.data?.code === 101) {
      return {
        success: true,
        refId: String(data.data.ref_id),
      };
    }

    return { success: false };
  },

  async handleWebhook(_input: WebhookInput) {
    throw new Error('Zarinpal uses synchronous callback verification, not webhooks');
  },

  async cancelSubscription(_subscriptionId: string) {
    return true;
  },
};
