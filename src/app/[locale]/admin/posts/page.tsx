import { getTranslations } from 'next-intl/server';
import { auth } from '@/lib/auth';
import { db, posts, desc } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Link } from '@/i18n/routing';
import { Plus, FileText, ArrowRight } from 'lucide-react';

export default async function AdminPostsPage() {
  const session = await auth();
  const t = await getTranslations('admin.posts');
  const ta = await getTranslations('admin');
  if (session?.user?.role !== 'ADMIN') {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">{ta('accessDenied')}</p></div>;
  }

  const all = await db.select().from(posts).orderBy(desc(posts.createdAt));

  return (
    <section className="relative py-16 bg-gradient-to-br from-background via-emerald-50/30 to-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('heading')}</h1>
            <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
          </div>
          <Button render={<Link href="/admin/posts/new" />}>
            <Plus className="h-4 w-4" /> {t('newPost')}
          </Button>
        </div>
        <div className="grid gap-4">
          {all.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{post.content?.slice(0, 60)}...</CardTitle>
                    <p className="text-xs text-muted-foreground">{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" render={<Link href={`/admin/posts/${post.id}`} />}>
                    {t('edit')} <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}