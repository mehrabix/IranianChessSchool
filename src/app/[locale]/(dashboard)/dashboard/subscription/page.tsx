import { getTranslations } from 'next-intl/server';
import { auth } from '@/lib/auth';
import { redirect } from '@/i18n/routing';
import { db, users, subscriptions, eq, desc } from '@/lib/db';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default async function SubscriptionPage() {
  const session = await auth();
  if (!session?.user?.id) redirect({ href: '/auth/signin', locale: 'en' });
  const userId = session!.user!.id;
  const t = await getTranslations('dashboard');

  const [user] = await db
    .select({
      subscriptionStatus: users.subscriptionStatus,
      paymentProvider: users.paymentProvider,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .orderBy(desc(subscriptions.currentPeriodEnd))
    .limit(1);

  const isActive = user?.subscriptionStatus === 'ACTIVE';
  const provider = user?.paymentProvider || 'STRIPE';

  return (
    <section className="py-8">
      <div className="mx-auto max-w-2xl px-4">
        <Link href="/dashboard" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {t('backToDashboard')}
        </Link>

        <h1 className="mb-2 text-2xl font-bold">Subscription</h1>
        <p className="mb-8 text-muted-foreground">Manage your subscription and billing</p>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className={`text-lg font-semibold ${isActive ? 'text-emerald-600' : 'text-destructive'}`}>
                  {isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="text-lg font-semibold">{sub?.plan || '—'}</p>
              </div>
            </div>

            {sub && (
              <>
                <hr />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Period</p>
                    <p className="text-sm">
                      {sub.currentPeriodStart
                        ? new Date(sub.currentPeriodStart).toLocaleDateString()
                        : '—'}{' '}
                      —{' '}
                      {sub.currentPeriodEnd
                        ? new Date(sub.currentPeriodEnd).toLocaleDateString()
                        : '—'}
                    </p>
                  </div>
                </div>
              </>
            )}

            <hr />

            <div className="flex flex-wrap gap-3">
              {provider === 'STRIPE' ? (
                <form action="/api/payments/portal" method="POST">
                  <Button type="submit" variant="outline" className="gap-2">
                    Manage in Stripe <ExternalLink className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Payment provider: {provider}. Use the provider&apos;s portal to manage your payment method.
                </p>
              )}

              <Link href="/pricing">
                <Button variant="outline">
                  {isActive ? 'Change Plan' : 'View Plans'}
                </Button>
              </Link>
            </div>

            {sub?.cancelAtPeriodEnd && (
              <p className="mt-2 text-sm text-amber-600">
                Your subscription will be cancelled at the end of the current period.
              </p>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}
