import type { PlanKey } from './types';

export const PLANS: Record<PlanKey, { priceUsd: number; priceIrt: number; name: string }> = {
  STANDARD: {
    priceUsd: 2900,
    priceIrt: parseInt(process.env.PLAN_STANDARD_IRT || '29000000', 10),
    name: 'Standard',
  },
  PREMIUM: {
    priceUsd: 4900,
    priceIrt: parseInt(process.env.PLAN_PREMIUM_IRT || '49000000', 10),
    name: 'Premium',
  },
  VIP: {
    priceUsd: 19900,
    priceIrt: parseInt(process.env.PLAN_VIP_IRT || '199000000', 10),
    name: 'VIP',
  },
};
