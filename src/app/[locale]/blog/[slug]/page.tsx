import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/ui/container';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

const postSlugs: Record<string, { titleKey: string; dateKey: string; readTimeKey: string; categoryKey: string; contentKeys: string[] }> = {
  'why-structured-learning': {
    titleKey: 'post1Title', dateKey: 'post1Date', readTimeKey: 'post1ReadTime', categoryKey: 'post1Category',
    contentKeys: ['post1Excerpt'],
  },
  'top-5-beginner-mistakes': {
    titleKey: 'post2Title', dateKey: 'post2Date', readTimeKey: 'post2ReadTime', categoryKey: 'post2Category',
    contentKeys: ['post2Excerpt'],
  },
  'how-to-review-your-games': {
    titleKey: 'post3Title', dateKey: 'post3Date', readTimeKey: 'post3ReadTime', categoryKey: 'post3Category',
    contentKeys: ['post3Excerpt'],
  },
  'opening-principles': {
    titleKey: 'post4Title', dateKey: 'post4Date', readTimeKey: 'post4ReadTime', categoryKey: 'post4Category',
    contentKeys: ['post4Excerpt'],
  },
  'tactics-training-guide': {
    titleKey: 'post5Title', dateKey: 'post5Date', readTimeKey: 'post5ReadTime', categoryKey: 'post5Category',
    contentKeys: ['post5Excerpt'],
  },
  'endgame-fundamentals': {
    titleKey: 'post6Title', dateKey: 'post6Date', readTimeKey: 'post6ReadTime', categoryKey: 'post6Category',
    contentKeys: ['post6Excerpt'],
  },
};

const slugs = Object.keys(postSlugs);

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug } = await params;
  const post = postSlugs[slug];
  if (!post) notFound();

  const t = await getTranslations('blog');

  return (
    <section className="py-12">
      <Container size="md">
        <div className="mb-8">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            {t('posts.readMore').replace('Read more', 'Back to Blog')}
          </Link>
        </div>

        <article className="prose prose-slate dark:prose-invert max-w-none">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary">{t(`posts.${post.categoryKey}`)}</Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" /> {t(`posts.${post.dateKey}`)}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" /> {t(`posts.${post.readTimeKey}`)}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            {t(`posts.${post.titleKey}`)}
          </h1>

          <div className="space-y-4 text-muted-foreground leading-relaxed">
            {post.contentKeys.map((key) => (
              <p key={key} className="text-lg">{t(`posts.${key}`)}</p>
            ))}
            <p>
              {t('previewPlaceholder')}
            </p>
          </div>
        </article>
      </Container>
    </section>
  );
}