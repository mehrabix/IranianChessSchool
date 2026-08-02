'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Sparkles, CheckCircle2, ArrowRight, Star, Zap, Crown } from "lucide-react";
import { CheckoutButton } from "@/components/shared/CheckoutButton";

const plans = [
  {
    nameKey: 'standard', priceMonthly: '$29', priceAnnual: '$24', periodAnnual: '/mo',
    descKey: 'standardDesc', icon: Star,
    featureKeys: ['standardF1', 'standardF2', 'standardF3', 'standardF4', 'standardF5', 'standardF6'],
    ctaKey: 'standardCta', popular: false,
  },
  {
    nameKey: 'premium', priceMonthly: '$49', priceAnnual: '$41', periodAnnual: '/mo',
    descKey: 'premiumDesc', icon: Zap,
    featureKeys: ['premiumF1', 'premiumF2', 'premiumF3', 'premiumF4', 'premiumF5', 'premiumF6'],
    ctaKey: 'premiumCta', popular: true,
  },
  {
    nameKey: 'vip', priceMonthly: '$199', priceAnnual: '$166', periodAnnual: '/mo',
    descKey: 'vipDesc', icon: Crown,
    featureKeys: ['vipF1', 'vipF2', 'vipF3', 'vipF4', 'vipF5', 'vipF6'],
    ctaKey: 'vipCta', popular: false,
  },
];

const compareRows = [
  { nameKey: 'basicLessons', freeKey: 'check', stdKey: 'check', premKey: 'check', vipKey: 'check' },
  { nameKey: 'allCourses', freeKey: 'cross', stdKey: 'check', premKey: 'check', vipKey: 'check' },
  { nameKey: 'puzzleAccess', freeKey: 'limited', stdKey: 'check', premKey: 'check', vipKey: 'check' },
  { nameKey: 'communityAccess', freeKey: 'readOnly', stdKey: 'check', premKey: 'check', vipKey: 'check' },
  { nameKey: 'gameAnalysis', freeKey: 'cross', stdKey: 'basic', premKey: 'advanced', vipKey: 'advanced' },
  { nameKey: 'groupClasses', freeKey: 'cross', stdKey: 'cross', premKey: 'weekly', vipKey: 'weekly' },
  { nameKey: 'gameReviews', freeKey: 'cross', stdKey: 'cross', premKey: 'monthly', vipKey: 'weekly' },
  { nameKey: 'oneOnOne', freeKey: 'cross', stdKey: 'cross', premKey: 'monthly', vipKey: 'weekly4x' },
];

export default function PricingPage() {
  const t = useTranslations('pricing');
  const [annual, setAnnual] = useState(false);

  return (
    <>
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-background via-emerald-50/30 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-200/20 via-transparent to-transparent pointer-events-none" />
        <Container size="lg" className="relative text-center space-y-6">
          <Badge variant="secondary" className="px-4 py-1.5 text-sm gap-1.5"><Sparkles className="h-3.5 w-3.5" /> {t('hero.badge')}</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{t('hero.heading')}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('hero.subtitle')}</p>

          <div className="inline-flex items-center gap-3 p-1 bg-muted rounded-full">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!annual ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {t('plans.periodLabel') || 'Monthly'}
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${annual ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {t('plans.annualLabel') || 'Annual'}
              <span className="ms-1.5 text-emerald-600 text-xs font-bold">{t('plans.annualDiscount') || 'Save 17%'}</span>
            </button>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container size="lg">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card key={plan.nameKey} className={`relative flex flex-col border-2 overflow-visible ${plan.popular ? 'border-emerald-500 shadow-xl shadow-emerald-500/10' : 'border-border shadow-sm'} transition-shadow`}>
                {plan.popular && (
                  <div className="absolute -top-3 start-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-4 py-1">{t('plans.mostPopular')}</Badge>
                  </div>
                )}
                <CardHeader className="text-center pt-8 pb-0">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                    <plan.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <CardTitle className="text-xl">{t(`plans.${plan.nameKey}`)}</CardTitle>
                  <CardDescription className="mt-1">{t(`plans.${plan.descKey}`)}</CardDescription>
                  <div className="mt-6">
                    <span className="text-4xl font-bold">{annual ? plan.priceAnnual : plan.priceMonthly}</span>
                    <span className="text-muted-foreground">{annual ? plan.periodAnnual : t(`plans.${plan.nameKey}Period`) || '/mo'}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-6 pt-8">
                  <ul className="space-y-3">
                    {plan.featureKeys.map((fk) => (
                      <li key={fk} className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        {t(`plans.${fk}`)}
                      </li>
                    ))}
                  </ul>
                  <CheckoutButton plan={plan.nameKey.toUpperCase()} variant={plan.popular ? "default" : "outline"}>
                    {t(`plans.${plan.ctaKey}`)} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </CheckoutButton>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              {t('plans.finePrint')}
            </p>
          </div>
        </Container>
      </section>

      <section className="py-20 bg-gradient-to-b from-emerald-50/30 to-background">
        <Container size="lg">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t('compare.heading')}</h2>
            <p className="text-lg text-muted-foreground">{t('compare.subtitle')}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full max-w-3xl mx-auto text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-start py-4 px-4 font-semibold">{t('compare.feature')}</th>
                  <th className="text-center py-4 px-4 font-semibold">{t('compare.free')}</th>
                  <th className="text-center py-4 px-4 font-semibold">{t('compare.standard')}</th>
                  <th className="text-center py-4 px-4 font-semibold text-emerald-600">{t('compare.premium')}</th>
                  <th className="text-center py-4 px-4 font-semibold">{t('compare.vip')}</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row) => (
                  <tr key={row.nameKey} className="border-b last:border-0">
                    <td className="py-3 px-4">{t(`compare.${row.nameKey}`)}</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">{t(`compare.${row.freeKey}`)}</td>
                    <td className="text-center py-3 px-4">{t(`compare.${row.stdKey}`)}</td>
                    <td className="text-center py-3 px-4 text-emerald-600 font-medium">{t(`compare.${row.premKey}`)}</td>
                    <td className="text-center py-3 px-4">{t(`compare.${row.vipKey}`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <section className="py-20 bg-muted/30">
        <Container size="md">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3 max-w-2xl mx-auto">
            {[
              { q: t('faq.pricingQ1') || 'How does the free trial work?', a: t('faq.pricingA1') || 'All plans include a 7-day free trial. No credit card required. Cancel anytime during the trial at no cost.' },
              { q: t('faq.pricingQ2') || 'Can I switch plans later?', a: t('faq.pricingA2') || 'Yes! You can upgrade or downgrade at any time. If you upgrade, you will be charged the prorated difference. Downgrades take effect at the end of your billing period.' },
              { q: t('faq.pricingQ3') || 'What payment methods do you accept?', a: t('faq.pricingA3') || 'We accept all major credit cards via Stripe, and Iranian payment gateways (Zarinpal, Zibal, NextPay, IDPay, PayPing).' },
              { q: t('faq.pricingQ4') || 'Is there a money-back guarantee?', a: t('faq.pricingA4') || 'Yes! If you are not satisfied within the first 14 days, we will issue a full refund. No questions asked.' },
            ].map((item, i) => (
              <details key={i} className="group rounded-xl border bg-card">
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer select-none">
                  <span className="font-medium text-sm">{item.q}</span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white">
        <Container size="lg" className="text-center space-y-8 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t('cta.heading')}</h2>
          <p className="text-lg text-emerald-100/80">{t('cta.subtitle')}</p>
          <Link href="/auth/register">
            <Button size="lg" variant="secondary" className="bg-white text-emerald-900 hover:bg-white/90 h-12 px-8 gap-2">
              {t('cta.cta')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Button>
          </Link>
        </Container>
      </section>
    </>
  );
}

function ChevronDown(props: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
