import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/ui/container';
import { AnimatedChessBoard } from '@/components/landing/AnimatedChessBoard';
import { auth } from '@/lib/auth';
import {
  ChessKnight, BookOpen, Users, Trophy, BarChart3, MessageCircle,
  Sparkles, Star, CheckCircle2, ArrowRight, Globe, Compass,
  TrendingUp,
} from 'lucide-react';

const features = [
  { icon: BookOpen, titleKey: 'structuredLessons', descKey: 'structuredLessonsDesc' },
  { icon: Users, titleKey: 'liveClasses', descKey: 'liveClassesDesc' },
  { icon: Trophy, titleKey: 'gameReviews', descKey: 'gameReviewsDesc' },
  { icon: BarChart3, titleKey: 'progressAnalytics', descKey: 'progressAnalyticsDesc' },
  { icon: MessageCircle, titleKey: 'community', descKey: 'communityDesc' },
  { icon: ChessKnight, titleKey: 'aiTools', descKey: 'aiToolsDesc' },
];

const levels = [
  { nameKey: 'beginner', rangeKey: 'beginnerRange', descKey: 'beginnerDesc' },
  { nameKey: 'improver', rangeKey: 'improverRange', descKey: 'improverDesc' },
  { nameKey: 'intermediate', rangeKey: 'intermediateRange', descKey: 'intermediateDesc' },
  { nameKey: 'advanced', rangeKey: 'advancedRange', descKey: 'advancedDesc' },
  { nameKey: 'clubPlayer', rangeKey: 'clubPlayerRange', descKey: 'clubPlayerDesc' },
];

const stats = [
  { value: '1200+', labelKey: 'students', icon: Users },
  { value: '500+', labelKey: 'hours', icon: BookOpen },
  { value: '2M+', labelKey: 'reach', icon: Globe },
  { value: '97%', labelKey: 'satisfaction', icon: Sparkles },
];

const students = [
  { nameKey: 'student1Name', gainKey: 'student1Gain', quoteKey: 'student1Quote', ratingKey: 'student1Rating' },
  { nameKey: 'student2Name', gainKey: 'student2Gain', quoteKey: 'student2Quote', ratingKey: 'student2Rating' },
  { nameKey: 'student3Name', gainKey: 'student3Gain', quoteKey: 'student3Quote', ratingKey: 'student3Rating' },
];

export default async function HomePage() {
  const t = await getTranslations('home');
  const session = await auth();
  const ctaHref = session?.user ? '/dashboard' : '/pricing';
  return (
    <>
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-background via-emerald-50/30 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-200/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <Container size="xl" className="relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-emerald-50/50 text-sm font-medium text-emerald-700">
                <Sparkles className="h-4 w-4" />
                {t('hero.badge')}
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                {t('hero.title1')}
                <span className="block text-emerald-600 mt-2">{t('hero.title2')}</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={ctaHref}>
                  <Button size="lg" className="w-full sm:w-auto gap-2 text-base h-12 px-8">
                    {t('hero.cta')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8">
                    {t('hero.learnMore')}
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> {t('hero.noCard')}</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> {t('hero.freeTrial')}</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> {t('hero.cancelAnytime')}</span>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-96 h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-amber-400/20 rounded-3xl rotate-6" />
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400/10 to-amber-400/10 rounded-3xl -rotate-3" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <AnimatedChessBoard />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20 border-y bg-card/50">
        <Container size="lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat) => (
              <div key={stat.labelKey} className="text-center space-y-2">
                <stat.icon className="h-5 w-5 mx-auto text-emerald-500" />
                <p className="text-3xl md:text-4xl font-bold tracking-tight">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{t(`stats.${stat.labelKey}`)}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container size="lg">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {t('features.heading')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('features.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.titleKey} className="group hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
                    <feature.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <CardTitle>{t(`features.${feature.titleKey}`)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{t(`features.${feature.descKey}`)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-28 bg-gradient-to-b from-emerald-50/30 to-background">
        <Container size="lg">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <Badge variant="secondary" className="px-4 py-1.5 text-sm">{t('levels.badge')}</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {t('levels.heading')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('levels.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            {levels.map((level, i) => (
              <div key={level.nameKey} className="relative group flex">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-6 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300 text-center space-y-3 flex-1 flex flex-col">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-sm font-bold text-emerald-700 shrink-0">
                    {i + 1}
                  </div>
                  <h3 className="font-semibold text-lg">{t(`levels.${level.nameKey}`)}</h3>
                  <p className="text-2xl font-bold text-emerald-600">{t(`levels.${level.rangeKey}`)}</p>
                  <p className="text-sm text-muted-foreground mt-auto">{t(`levels.${level.descKey}`)}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container size="lg">
          <div className="max-w-4xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                {t('testimonials.heading')}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t('testimonials.subtitle')}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {students.map((student) => (
                <Card key={student.nameKey} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed italic">
                      &ldquo;{t(`testimonials.${student.quoteKey}`)}&rdquo;
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div>
                        <p className="font-semibold text-sm">{t(`testimonials.${student.nameKey}`)}</p>
                        <p className="text-xs text-muted-foreground">{t(`testimonials.${student.ratingKey}`)}</p>
                      </div>
                      <Badge variant="secondary" className="text-emerald-600 bg-emerald-50">
                        {t(`testimonials.${student.gainKey}`)} {t('testimonials.points')}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-28 bg-muted/30">
        <Container size="lg">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {t('whoFor.heading')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('whoFor.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-b from-amber-400/20 to-amber-600/20 rounded-2xl blur opacity-50 group-hover:opacity-100 transition-opacity" />
              <Card className="relative text-center p-8 h-full">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-5">
                  <TrendingUp className="h-7 w-7 text-amber-600" />
                </div>
                <CardTitle className="mb-3">{t('whoFor.card1Title')}</CardTitle>
                <p className="text-sm text-muted-foreground leading-relaxed">{t('whoFor.card1Desc')}</p>
              </Card>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-b from-blue-400/20 to-blue-600/20 rounded-2xl blur opacity-50 group-hover:opacity-100 transition-opacity" />
              <Card className="relative text-center p-8 h-full">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-5">
                  <Compass className="h-7 w-7 text-blue-600" />
                </div>
                <CardTitle className="mb-3">{t('whoFor.card2Title')}</CardTitle>
                <p className="text-sm text-muted-foreground leading-relaxed">{t('whoFor.card2Desc')}</p>
              </Card>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-b from-purple-400/20 to-purple-600/20 rounded-2xl blur opacity-50 group-hover:opacity-100 transition-opacity" />
              <Card className="relative text-center p-8 h-full">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-5">
                  <Users className="h-7 w-7 text-purple-600" />
                </div>
                <CardTitle className="mb-3">{t('whoFor.card3Title')}</CardTitle>
                <p className="text-sm text-muted-foreground leading-relaxed">{t('whoFor.card3Desc')}</p>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-28 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(255,255,255,0.1)_0%,_transparent_50%)]" />
        <Container size="lg" className="relative z-10 text-center space-y-8 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            {t('cta.heading')}
          </h2>
          <p className="text-lg text-emerald-100/80 max-w-xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={ctaHref}>
              <Button size="lg" variant="secondary" className="w-full sm:w-auto h-12 px-8 text-base gap-2 bg-white text-emerald-900 hover:bg-white/90">
                {t('cta.cta')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Button>
            </Link>
            <Link href="/faq">
              <Button size="lg" variant="ghost" className="w-full sm:w-auto h-12 px-8 text-base text-white/80 hover:text-white hover:bg-white/10">
                {t('cta.viewFaq')}
              </Button>
            </Link>
          </div>
          <p className="text-sm text-emerald-100/60">{t('cta.finePrint')}</p>
        </Container>
      </section>
    </>
  );
}
