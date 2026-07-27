import { db, users as usersTable, eq } from '@/lib/db';

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
    .select({ subscriptionStatus: usersTable.subscriptionStatus })
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);

  const status = user?.subscriptionStatus ?? null;
  const plan = status === 'ACTIVE' ? (process.env.STRIPE_DEFAULT_PLAN as Plan) || 'STANDARD' : null;

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
