import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { ChessKnight, Target, Users, Award, BookOpen, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

const coaches = [
  { nameKey: 'coach1Name', titleKey: 'coach1Title', bioKey: 'coach1Bio', image: "/coaches/dina.jpg", fide: "https://ratings.fide.com/profile/12500540" },
  { nameKey: 'coach2Name', titleKey: 'coach2Title', bioKey: 'coach2Bio', image: "/coaches/alexandra.jpg", fide: "https://ratings.fide.com/profile/13500010" },
];

const values = [
  { icon: Target, titleKey: 'structuredLearning', descKey: 'structuredLearningDesc' },
  { icon: Users, titleKey: 'personalAttention', descKey: 'personalAttentionDesc' },
  { icon: Award, titleKey: 'provenResults', descKey: 'provenResultsDesc' },
  { icon: BookOpen, titleKey: 'lifetimeAccess', descKey: 'lifetimeAccessDesc' },
];

export default async function AboutPage() {
  const t = await getTranslations('about');
  return (
    <>
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-background via-emerald-50/30 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-200/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-10 right-20 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />
        <Container size="lg" className="relative text-center space-y-6">
          <Badge variant="secondary" className="px-4 py-1.5 text-sm gap-1.5"><Sparkles className="h-3.5 w-3.5" /> {t('hero.badge')}</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{t('hero.heading')}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>
        </Container>
      </section>

      <section className="py-20">
        <Container size="lg">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t('values.heading')}</h2>
            <p className="text-lg text-muted-foreground">{t('values.subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <Card key={v.titleKey} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
                    <v.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <CardTitle className="text-lg">{t(`values.${v.titleKey}`)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(`values.${v.descKey}`)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 bg-gradient-to-b from-emerald-50/30 to-background">
        <Container size="lg">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t('coaches.heading')}</h2>
            <p className="text-lg text-muted-foreground">{t('coaches.subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {coaches.map((coach) => (
              <Card key={coach.nameKey} className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="aspect-[3/2] bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
                  <ChessKnight className="h-20 w-20 text-emerald-300" />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{t(`coaches.${coach.nameKey}`)}</CardTitle>
                  <Badge variant="secondary" className="w-fit">{t(`coaches.${coach.titleKey}`)}</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(`coaches.${coach.bioKey}`)}</p>
                  <Button variant="outline" size="sm" render={<a href={coach.fide} target="_blank" rel="noopener noreferrer" />}>
                    {t('coaches.fideProfile')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white">
        <Container size="lg" className="text-center space-y-8 max-w-3xl mx-auto">
          <CheckCircle2 className="h-12 w-12 mx-auto text-emerald-300" />
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t('cta.heading')}</h2>
          <p className="text-lg text-emerald-100/80">{t('cta.subtitle')}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" className="bg-white text-emerald-900 hover:bg-white/90 h-12 px-8 gap-2" render={<Link href="/pricing" />}>
              {t('cta.cta')} <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 h-12 px-8" render={<Link href="/contact" />}>
              {t('cta.contactUs')}
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
