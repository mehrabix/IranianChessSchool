import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Sparkles, ArrowRight, Calendar, Clock, ChevronRight } from "lucide-react";

const posts = [
  { slug: "why-structured-learning", titleKey: 'post1Title', excerptKey: 'post1Excerpt', dateKey: 'post1Date', readTimeKey: 'post1ReadTime', categoryKey: 'post1Category', image: '/images/blog/structured-learning.jpg' },
  { slug: "top-5-beginner-mistakes", titleKey: 'post2Title', excerptKey: 'post2Excerpt', dateKey: 'post2Date', readTimeKey: 'post2ReadTime', categoryKey: 'post2Category', image: '/images/blog/beginner-mistakes.jpg' },
  { slug: "how-to-review-your-games", titleKey: 'post3Title', excerptKey: 'post3Excerpt', dateKey: 'post3Date', readTimeKey: 'post3ReadTime', categoryKey: 'post3Category', image: '/images/blog/game-review.jpg' },
  { slug: "opening-principles", titleKey: 'post4Title', excerptKey: 'post4Excerpt', dateKey: 'post4Date', readTimeKey: 'post4ReadTime', categoryKey: 'post4Category', image: '/images/blog/openings.jpg' },
  { slug: "tactics-training-guide", titleKey: 'post5Title', excerptKey: 'post5Excerpt', dateKey: 'post5Date', readTimeKey: 'post5ReadTime', categoryKey: 'post5Category', image: '/images/blog/tactics.jpg' },
  { slug: "endgame-fundamentals", titleKey: 'post6Title', excerptKey: 'post6Excerpt', dateKey: 'post6Date', readTimeKey: 'post6ReadTime', categoryKey: 'post6Category', image: '/images/blog/endgames.jpg' },
];

const categories = ['All', 'Learning', 'Beginners', 'Analysis', 'Openings', 'Tactics', 'Endgames'];

export default async function BlogPage() {
  const t = await getTranslations('blog');
  return (
    <>
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-background via-emerald-50/30 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-200/20 via-transparent to-transparent pointer-events-none" />
        <Container size="lg" className="relative text-center space-y-6">
          <Badge variant="secondary" className="px-4 py-1.5 text-sm gap-1.5"><Sparkles className="h-3.5 w-3.5" /> {t('hero.badge')}</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{t('hero.heading')}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('hero.subtitle')}</p>
        </Container>
      </section>

      <section className="py-20">
        <Container size="md">
          <div className="space-y-8">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                  <div className="grid md:grid-cols-[240px_1fr]">
                    <div className="aspect-[4/3] md:aspect-auto bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                      <CardTitle className="text-lg text-emerald-800 text-center px-4">{t(`posts.${post.titleKey}`).substring(0, 40)}...</CardTitle>
                    </div>
                    <div>
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="secondary" className="text-xs">{t(`posts.${post.categoryKey}`)}</Badge>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="h-3 w-3" /> {t(`posts.${post.dateKey}`)}</span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> {t(`posts.${post.readTimeKey}`)}</span>
                        </div>
                        <CardTitle className="text-xl group-hover:text-emerald-600 transition-colors">{t(`posts.${post.titleKey}`)}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground leading-relaxed">{t(`posts.${post.excerptKey}`)}</p>
                        <div className="mt-4 flex items-center gap-1 text-sm font-medium text-emerald-600 group-hover:gap-2 transition-all">
                          {t('posts.readMore')} <ChevronRight className="h-3 w-3" />
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
