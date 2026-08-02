export type ProviderType = 'STRIPE' | 'ZARINPAL' | 'ZIBAL' | 'NEXTPAY' | 'IDPAY' | 'PAYPING';

export type PlanKey = 'STANDARD' | 'PREMIUM' | 'VIP';

export interface CreateCheckoutInput {
  userId: string;
  email: string;
  plan: PlanKey;
  baseUrl: string;
}

export interface CreateCheckoutOutput {
  redirectUrl: string;
  transactionId?: string;
}

export interface VerifyPaymentInput {
  authority: string;
  amount: number;
}

export interface VerifyPaymentOutput {
  success: boolean;
  refId?: string;
}

export interface WebhookInput {
  rawBody: string;
  headers: Headers;
}

export interface WebhookOutput {
  type: 'subscription.created' | 'subscription.cancelled' | 'payment.verified';
  userId: string;
  plan?: string;
  subscriptionId?: string;
  customerId?: string;
  provider: ProviderType;
}

export interface PaymentProvider {
  readonly type: ProviderType;
  createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutOutput>;
  verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentOutput>;
  handleWebhook(input: WebhookInput): Promise<WebhookOutput>;
  cancelSubscription(subscriptionId: string): Promise<boolean>;
  getPortalUrl?(customerId: string, returnUrl: string): Promise<string>;
}
