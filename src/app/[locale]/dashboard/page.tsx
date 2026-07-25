import { getTranslations, getLocale } from 'next-intl/server';
import { auth } from '@/lib/auth';
import { db, courses, modules, lessons, progress, users as usersTable, eq, and } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Link } from '@/i18n/routing';
import { BookOpen, CheckCircle, TrendingUp, ArrowRight, Zap, Star, Clock, Award, Brain, Target } from 'lucide-react';

async function getUserProgress(userId: string) {
  return db
    .select()
    .from(progress)
    .where(eq(progress.userId, userId));
}

async function getUser(userId: string) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId));
  return user;
}

async function getCourseProgress(courseId: string, userId: string) {
  const allLessons = await db
    .select({ id: lessons.id })
    .from(lessons)
    .where(eq(lessons.courseId, courseId));

  const completedLessons = await db
    .select({ id: progress.lessonId })
    .from(progress)
    .where(and(eq(progress.userId, userId), eq(progress.completed, true)));

  const completedIds = new Set(completedLessons.map(l => l.id));
  const total = allLessons.length;
  const done = allLessons.filter(l => completedIds.has(l.id)).length;
  return { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
}

function getWeekDays() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days;
}

function getActivityMap(activities: { completedAt: Date | null }[]) {
  const map: Record<string, number> = {};
  for (const a of activities) {
    if (!a.completedAt) continue;
    const key = a.completedAt.toISOString().slice(0, 10);
    map[key] = (map[key] || 0) + 1;
  }
  return map;
}

export default async function DashboardPage() {
  const t = await getTranslations('dashboard');
  const session = await auth();
  if (!session?.user) redirect('/auth/signin');

  const userP = await getUserProgress(session.user.id);
  const user = await getUser(session.user.id);

  const completedCount = userP.filter(p => p.completed).length;
  const totalAttempts = userP.reduce((sum, p) => sum + (p.attempts || 0), 0);

  const enrolledCourses = await db
    .select()
    .from(courses)
    .where(eq(courses.published, true));

  const courseProgressList = await Promise.all(
    enrolledCourses.map(async (course) => {
      const cp = await getCourseProgress(course.id, session.user.id);
      return { ...course, ...cp };
    })
  );

  const weekDays = getWeekDays();
  const activityMap = getActivityMap(userP.filter(p => p.completedAt).map(p => ({ completedAt: p.completedAt ? new Date(p.completedAt) : null })));

  const recentActivity = userP
    .filter(p => p.completedAt)
    .sort((a, b) => (b.completedAt?.getTime() ?? 0) - (a.completedAt?.getTime() ?? 0))
    .slice(0, 10);

  return (
    <section className="relative py-20 bg-gradient-to-br from-background via-emerald-50/30 to-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{user?.name ? t('welcomeName', { name: user.name }) : t('welcome')}</h1>
            <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-amber-500" />
              <span className="font-medium">{user?.xp ?? 0} {t('stats.xp')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="h-4 w-4 text-purple-500" />
              <span className="font-medium">{t('stats.level', { level: user?.level ?? 1 })}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex-row items-center gap-3 space-y-0 py-4">
              <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <CardTitle className="text-xs font-medium text-muted-foreground">{t('stats.completed')}</CardTitle>
                <p className="text-2xl font-bold">{completedCount}</p>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex-row items-center gap-3 space-y-0 py-4">
              <BookOpen className="h-5 w-5 text-blue-600 shrink-0" />
              <div>
                <CardTitle className="text-xs font-medium text-muted-foreground">{t('stats.courses')}</CardTitle>
                <p className="text-2xl font-bold">{enrolledCourses.length}</p>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex-row items-center gap-3 space-y-0 py-4">
              <TrendingUp className="h-5 w-5 text-orange-600 shrink-0" />
              <div>
                <CardTitle className="text-xs font-medium text-muted-foreground">{t('stats.attempts')}</CardTitle>
                <p className="text-2xl font-bold">{totalAttempts}</p>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex-row items-center gap-3 space-y-0 py-4">
              <Star className="h-5 w-5 text-yellow-500 shrink-0" />
              <div>
                <CardTitle className="text-xs font-medium text-muted-foreground">{t('stats.streak')}</CardTitle>
                <p className="text-2xl font-bold">{recentActivity.filter((_, i) => i < 7).length}d</p>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <Link href="/dashboard/analysis" className="block">
              <CardHeader className="flex-row items-center gap-3 space-y-0 py-4">
                <Brain className="h-5 w-5 text-blue-600 shrink-0" />
                <div>
                  <CardTitle className="text-xs font-medium text-muted-foreground">{t('analysis')}</CardTitle>
                  <p className="text-sm font-medium">{t('importExport')}</p>
                </div>
              </CardHeader>
            </Link>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <Link href="/dashboard/puzzles" className="block">
              <CardHeader className="flex-row items-center gap-3 space-y-0 py-4">
                <Target className="h-5 w-5 text-purple-600 shrink-0" />
                <div>
                  <CardTitle className="text-xs font-medium text-muted-foreground">{t('dailyPuzzle') || 'Daily Puzzle'}</CardTitle>
                  <p className="text-sm font-medium">{t('puzzleRush') || 'Puzzle Rush'}</p>
                </div>
              </CardHeader>
            </Link>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <Link href="/courses" className="block">
              <CardHeader className="flex-row items-center gap-3 space-y-0 py-4">
                <BookOpen className="h-5 w-5 text-emerald-600 shrink-0" />
                <div>
                  <CardTitle className="text-xs font-medium text-muted-foreground">{t('myCourses')}</CardTitle>
                  <p className="text-sm font-medium">{t('continue')}</p>
                </div>
              </CardHeader>
            </Link>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <Link href="/pricing" className="block">
              <CardHeader className="flex-row items-center gap-3 space-y-0 py-4">
                <Zap className="h-5 w-5 text-amber-600 shrink-0" />
                <div>
                  <CardTitle className="text-xs font-medium text-muted-foreground">{t('stats.level', { level: user?.level ?? 1 })}</CardTitle>
                  <p className="text-sm font-medium">{user?.xp ?? 0} {t('stats.xp')}</p>
                </div>
              </CardHeader>
            </Link>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                {t('myCourses')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courseProgressList.map((course) => (
                  <div key={course.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium">{course.title}</p>
                        <p className="text-xs text-muted-foreground">{course.level} &middot; {course.done}/{course.total} {t('lessons')}</p>
                      </div>
                      <Button variant="ghost" size="sm" render={<Link href={`/courses/${course.id}`} />}>
                        {t('continue')} <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                    <Progress value={course.percent} className="h-2" />
                    <p className="text-xs text-right text-muted-foreground mt-1">{course.percent}%</p>
                  </div>
                ))}
                  {courseProgressList.length === 0 && (
                  <p className="text-sm text-muted-foreground">{t('noCourses')}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {t('thisWeek')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-1 h-24 mb-4">
                {weekDays.map((day) => {
                  const key = day.toISOString().slice(0, 10);
                  const count = activityMap[key] ?? 0;
                  const maxVal = Math.max(...Object.values(activityMap), 1);
                  const height = Math.max(8, (count / maxVal) * 100);
                  return (
                    <div key={key} className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full rounded-sm bg-emerald-200 transition-all" style={{ height: `${height}%`, minHeight: 8 }} />
                      <span className="text-[10px] text-muted-foreground">{day.toLocaleDateString('en', { weekday: 'short' })}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground text-center">
                {t('activitiesThisWeek', { count: Object.values(activityMap).reduce((a, b) => a + b, 0) })}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {t('recentActivity')}
              </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.slice(0, 10).map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    {p.completed ? (
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-muted shrink-0" />
                    )}
                    <span>Lesson {p.lessonId?.slice(0, 8) ?? 'unknown'}...</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {p.score && <span>Score: {p.score}</span>}
                    {p.completedAt && (
                      <span className="text-xs">{new Date(p.completedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              ))}
              {recentActivity.length === 0 && (
                <p className="text-sm text-muted-foreground">{t('noActivity')}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
