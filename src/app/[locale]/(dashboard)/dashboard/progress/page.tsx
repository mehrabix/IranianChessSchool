import { getTranslations, getLocale } from 'next-intl/server';
import { auth } from '@/lib/auth';
import { db, progress, lessons, courses, eq, and } from '@/lib/db';
import { redirect } from '@/i18n/routing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, BookOpen, TrendingUp, Target, Zap } from 'lucide-react';
import { tKey } from '@/lib/t-key';

function getWeekDays(locale: string) {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const isFa = locale === 'fa';
  const startOffset = isFa ? ((dayOfWeek + 1) % 7) : (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - startOffset);
  weekStart.setHours(0, 0, 0, 0);

  const result: { label: string; date: Date }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    result.push({ label: new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(d), date: d });
  }
  return result;
}

function dayKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default async function ProgressPage() {
  const t = await getTranslations('dashboard');
  const tAll = await getTranslations();
  const locale = await getLocale();
  const getText = (v: string | null) => tKey(v, tAll);
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

  // Weekly activity heatmap data
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const weekDays = getWeekDays(locale);
  const activityByDay = new Map<string, number>();
  for (const p of userProgress) {
    if (!p.completedAt) continue;
    const d = new Date(p.completedAt);
    if (d >= weekStart) {
      const key = dayKey(d);
      activityByDay.set(key, (activityByDay.get(key) || 0) + 1);
    }
  }
  const maxActivity = Math.max(1, ...activityByDay.values());
  const thisWeekCount = [...activityByDay.values()].reduce((s, v) => s + v, 0);

  // XP this week (estimating 10 XP per completed lesson)
  const thisWeekXp = thisWeekCount * 10;

  return (
    <section className="py-8">
      <Container size="lg">
        <h1 className="text-3xl font-bold mb-2">{t('myProgress')}</h1>
        <p className="text-muted-foreground mb-8">{t('subtitle')}</p>

        {/* Stats row */}
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

        {/* Weekly stats row */}
        <div className="mb-8 p-4 rounded-lg border bg-muted/30 flex items-center gap-3">
          <Zap className="h-5 w-5 text-amber-500 shrink-0" />
          <p className="text-sm font-medium">
            {t('thisWeekSummary', { lessons: thisWeekCount, xp: thisWeekXp })}
          </p>
        </div>

        {/* Charts row */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Completion pie chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{t('completionRate')}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <div
                aria-label={`Completion rate: ${completionRate}%`}
                data-testid="completion-pie"
                className="w-28 h-28 rounded-full shrink-0"
                style={{ background: `conic-gradient(#10b981 ${completionRate * 3.6}deg, #e5e7eb 0)` }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-background flex items-center justify-center">
                    <span className="text-xl font-bold">{completionRate}%</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
                  <span>{t('completedWithCount', { count: completedLessons.length })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-gray-200 inline-block" />
                  <span>{t('remainingWithCount', { count: totalLessons - completedLessons.length })}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly activity heatmap */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{t('weeklyActivity')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-1.5 justify-between" data-testid="activity-heatmap">
                {weekDays.map(({ label, date }) => {
                  const key = dayKey(date);
                  const count = activityByDay.get(key) || 0;
                  const intensity = count / maxActivity;
                  const bg =
                    count === 0
                      ? 'bg-gray-100 dark:bg-gray-800'
                      : intensity <= 0.33
                        ? 'bg-emerald-200 dark:bg-emerald-900'
                        : intensity <= 0.66
                          ? 'bg-emerald-400 dark:bg-emerald-600'
                          : 'bg-emerald-600 dark:bg-emerald-400';
                  return (
                    <div key={key} className="flex flex-col items-center gap-1">
                      <div className={`w-10 h-10 rounded-md ${bg}`} title={t('lessonsCount', { count })} />
                      <span className="text-xs text-muted-foreground">{label}</span>
                      <span className="text-xs font-medium">{count}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
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
                      <p className="font-medium">{getText(course.title)}</p>
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