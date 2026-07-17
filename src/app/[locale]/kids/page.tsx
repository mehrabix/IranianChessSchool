import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Sparkles, Star, Gamepad2, Smile, Heart, Shield, Users, Trophy, BookOpen, ArrowRight, CheckCircle2 } from "lucide-react";

const features = [
  { icon: Gamepad2, titleKey: 'funGames', descKey: 'funGamesDesc' },
  { icon: Users, titleKey: 'groupClasses', descKey: 'groupClassesDesc' },
  { icon: Trophy, titleKey: 'achievements', descKey: 'achievementsDesc' },
  { icon: Smile, titleKey: 'kidFriendly', descKey: 'kidFriendlyDesc' },
  { icon: Shield, titleKey: 'safeEnvironment', descKey: 'safeEnvironmentDesc' },
  { icon: Star, titleKey: 'provenMethod', descKey: 'provenMethodDesc' },
];

const plans = [
  { nameKey: 'standard', priceKey: 'standardPrice', periodKey: 'standardPeriod', featureKeys: ['standardF1', 'standardF2', 'standardF3', 'standardF4', 'standardF5'], ctaKey: 'standardCta', popular: false },
  { nameKey: 'premium', priceKey: 'premiumPrice', periodKey: 'premiumPeriod', featureKeys: ['premiumF1', 'premiumF2', 'premiumF3', 'premiumF4', 'premiumF5'], ctaKey: 'premiumCta', popular: true },
];

export default async function KidsPage() {
  const t = await getTranslations('kids');
  return (
    <>
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-amber-50/50 via-background to-emerald-50/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-200/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-10 right-20 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <Container size="lg" className="relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge variant="secondary" className="px-4 py-1.5 text-sm gap-1.5"><Sparkles className="h-3.5 w-3.5" /> {t('hero.badge')}</Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
                {t('hero.heading')}<br />
                <span className="text-emerald-600">{t('hero.headingSpan')}</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-12 px-8 gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 shadow-lg shadow-emerald-500/20" render={<Link href="/pricing" />}>
                  {t('hero.cta')} <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8" render={<Link href="/faq" />}>
                  {t('hero.learnMore')}
                </Button>
              </div>
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> {t('hero.ages')}</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> {t('hero.allLevels')}</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> {t('hero.freeTrial')}</span>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-emerald-400/20 rounded-full animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-8 gap-1 w-64 h-64">
                    {Array.from({ length: 64 }).map((_, i) => {
                      const row = Math.floor(i / 8);
                      const col = i % 8;
                      const isDark = (row + col) % 2 === 1;
                      const isPiece = [0, 7].includes(row) && (col === 0 || col === 7);
                      return (
                        <div key={i} className={`aspect-square rounded-sm flex items-center justify-center text-lg ${
                          isDark ? 'bg-emerald-600/20' : 'bg-amber-100/40'
                        } ${isPiece ? 'text-xl' : ''}`}>
                          {isPiece && (row === 0 ? '♜♞♝♛♚♝♞♜'[col] : '♖♘♗♕♔♗♘♖'[col])}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container size="lg">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t('features.heading')}</h2>
            <p className="text-lg text-muted-foreground">{t('features.subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.titleKey} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
                    <f.icon className="h-6 w-6 text-amber-600" />
                  </div>
                  <CardTitle className="text-lg">{t(`features.${f.titleKey}`)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(`features.${f.descKey}`)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 bg-gradient-to-b from-amber-50/30 to-background">
        <Container size="lg">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t('plans.heading')}</h2>
            <p className="text-lg text-muted-foreground">{t('plans.subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {plans.map((plan) => (
              <Card key={plan.nameKey} className={`relative border-2 overflow-visible ${plan.popular ? 'border-emerald-500 shadow-xl shadow-emerald-500/10' : 'border-border shadow-sm'} transition-shadow`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-4 py-1">{t('plans.mostPopular')}</Badge>
                  </div>
                )}
                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-xl">{t(`plans.${plan.nameKey}`)}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{t(`plans.${plan.priceKey}`)}</span>
                    <span className="text-muted-foreground">{t(`plans.${plan.periodKey}`)}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.featureKeys.map((fk) => (
                      <li key={fk} className="flex items-center gap-3 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        {t(`plans.${fk}`)}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full h-11" variant={plan.popular ? "default" : "outline"} render={<Link href="/pricing" />}>
                    {t(`plans.${plan.ctaKey}`)}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white">
        <Container size="lg" className="text-center space-y-8 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t('cta.heading')}</h2>
          <p className="text-lg text-emerald-100/80">{t('cta.subtitle')}</p>
          <Button size="lg" variant="secondary" className="bg-white text-emerald-900 hover:bg-white/90 h-12 px-8 gap-2" render={<Link href="/pricing" />}>
            {t('cta.cta')} <ArrowRight className="h-4 w-4" />
          </Button>
        </Container>
      </section>
    </>
  );
}
