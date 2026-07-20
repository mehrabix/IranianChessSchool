import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { auth } from '@/lib/auth';
import { db, courses, eq, desc } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Plus, BookOpen, ArrowRight, Sparkles } from 'lucide-react';

export default async function AdminCoursesPage() {
  const session = await auth();
  const t = await getTranslations('admin.courses');
  const ta = await getTranslations('admin');
  const isAdmin = session?.user?.role === 'ADMIN';

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">{ta('accessDenied')}</p>
      </div>
    );
  }

  const all = await db.select().from(courses).orderBy(desc(courses.createdAt));

  return (
    <>
      <section className="relative py-16 bg-gradient-to-br from-background via-emerald-50/30 to-background">
        <Container size="lg">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t('heading')}</h1>
              <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
            </div>
            <Button className="gap-2" render={<Link href="/admin/courses/new" />}>
              <Plus className="h-4 w-4" /> {t('newCourse')}
            </Button>
          </div>
          <div className="grid gap-4">
            {all.map((course) => (
              <Card key={course.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{course.level}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={course.published ? 'default' : 'secondary'}>
                      {course.published ? t('coursePublished') : t('draft')}
                    </Badge>
                    <Button variant="ghost" size="sm" render={<Link href={`/admin/courses/${course.id}`} />}>
                      {t('edit')} <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
            {all.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                {t('noCourses')}
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
