import { db, users, subscriptions, eq, desc } from '@/lib/db';

export type Plan = 'STANDARD' | 'PREMIUM' | 'VIP';

const PLAN_ACCESS: Record<Plan, string[]> = {
  STANDARD: ['courses:all', 'puzzles:limited', 'community:read'],
  PREMIUM: ['courses:all', 'puzzles:all', 'community:write', 'analysis:basic', 'groups:write'],
  VIP: ['courses:all', 'puzzles:all', 'community:write', 'analysis:advanced', 'groups:write', 'coaching:access'],
};

export async function getUserSubscription(userId: string): Promise<{
  status: string | null;
  plan: Plan | null;
}> {
  const [user] = await db
    .select({ subscriptionStatus: users.subscriptionStatus })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const status = user?.subscriptionStatus ?? null;

  if (status !== 'ACTIVE') {
    return { status, plan: null };
  }

  // Read plan from the subscriptions table
  const [sub] = await db
    .select({ plan: subscriptions.plan })
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .orderBy(desc(subscriptions.currentPeriodEnd))
    .limit(1);

  const plan = (sub?.plan as Plan) || 'STANDARD';
  return { status, plan };
}

export function canAccess(plan: Plan | null, feature: string): boolean {
  if (!plan) return false;
  return PLAN_ACCESS[plan]?.includes(feature) ?? false;
}

export async function requireSubscription(
  userId: string | undefined,
  feature: string
): Promise<{ allowed: boolean; plan: Plan | null }> {
  if (!userId) return { allowed: false, plan: null };
  const { plan } = await getUserSubscription(userId);
  return { allowed: canAccess(plan, feature), plan };
}

export function getPlanFeatures(plan: Plan): string[] {
  return PLAN_ACCESS[plan] || [];
}
