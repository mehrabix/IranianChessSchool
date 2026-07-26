import { getTranslations, getLocale } from 'next-intl/server';
import { auth } from '@/lib/auth';
import { db, progress, lessons, courses, eq, and } from '@/lib/db';
import { redirect } from '@/i18n/routing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, BookOpen, TrendingUp, Target } from 'lucide-react';

export default async function ProgressPage() {
  const t = await getTranslations('dashboard');
  const locale = await getLocale();
  const session = await auth();
  if (!session?.user) {
    redirect({ href: '/auth/signin', locale });
    return null;
  }

  const userProgress = await db
    .select()
    .from(progress)
    .where(eq(progress.userId, session.user!.id));

  const completedLessons = userProgress.filter(p => p.completed);
  const totalLessons = userProgress.length;
  const completionRate = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;
  const totalTimeSpent = userProgress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
  const avgScore = completedLessons.length > 0
    ? Math.round(completedLessons.reduce((sum, p) => sum + (p.score || 0), 0) / completedLessons.length)
    : 0;

  const allCourses = await db.select().from(courses).where(eq(courses.published, true));
  const courseProgressList = allCourses.map((course) => {
    const courseLessons = userProgress.filter(p => p.lessonId?.startsWith(course.id.slice(0, 8)));
    const completed = courseLessons.filter(p => p.completed).length;
    return { ...course, completed, total: courseLessons.length, percent: courseLessons.length > 0 ? Math.round((completed / courseLessons.length) * 100) : 0 };
  });

  return (
    <section className="py-8">
      <Container size="lg">
        <h1 className="text-3xl font-bold mb-2">{t('myProgress')}</h1>
        <p className="text-muted-foreground mb-8">{t('subtitle')}</p>

        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex-row items-center gap-3 space-y-0 py-4">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              <div>
                <CardTitle className="text-xs font-medium text-muted-foreground">{t('stats.completed')}</CardTitle>
                <p className="text-2xl font-bold">{completedLessons.length}</p>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex-row items-center gap-3 space-y-0 py-4">
              <BookOpen className="h-5 w-5 text-blue-500 shrink-0" />
              <div>
                <CardTitle className="text-xs font-medium text-muted-foreground">{t('totalLessons')}</CardTitle>
                <p className="text-2xl font-bold">{totalLessons}</p>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex-row items-center gap-3 space-y-0 py-4">
              <Clock className="h-5 w-5 text-amber-500 shrink-0" />
              <div>
                <CardTitle className="text-xs font-medium text-muted-foreground">{t('timeSpent')}</CardTitle>
                <p className="text-2xl font-bold">{Math.round(totalTimeSpent / 60)}m</p>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex-row items-center gap-3 space-y-0 py-4">
              <Target className="h-5 w-5 text-purple-500 shrink-0" />
              <div>
                <CardTitle className="text-xs font-medium text-muted-foreground">{t('avgScore')}</CardTitle>
                <p className="text-2xl font-bold">{avgScore}%</p>
              </div>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {t('courseProgress')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courseProgressList.map((course) => (
                <div key={course.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">{course.title}</p>
                      <p className="text-xs text-muted-foreground">{course.level}</p>
                    </div>
                    <Badge variant={course.completed === course.total && course.total > 0 ? 'default' : 'secondary'}>
                      {course.completed}/{course.total}
                    </Badge>
                  </div>
                  <Progress value={course.percent} className="h-2" />
                </div>
              ))}
              {courseProgressList.length === 0 && (
                <p className="text-sm text-muted-foreground">{t('noActivity')}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}