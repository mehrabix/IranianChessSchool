import { getTranslations } from 'next-intl/server';
import { auth } from '@/lib/auth';
import { db, courses, progress, eq } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/i18n/routing';
import { BookOpen, CheckCircle, TrendingUp, ArrowRight, Circle } from 'lucide-react';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/signin');

  const userProgress = await db
    .select()
    .from(progress)
    .where(eq(progress.userId, session.user.id));

  const completedCount = userProgress.filter(p => p.completed).length;
  const totalAttempts = userProgress.reduce((sum, p) => sum + (p.attempts || 0), 0);

  const enrolledCourses = await db
    .select()
    .from(courses)
    .where(eq(courses.published, true));

  return (
    <section className="relative py-20 bg-gradient-to-br from-background via-emerald-50/30 to-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <div>
                <CardTitle className="text-sm font-medium">Completed Lessons</CardTitle>
                <p className="text-2xl font-bold">{userProgress.filter(p => p.completed).length}</p>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <BookOpen className="h-5 w-5 text-emerald-600" />
              <div>
                <CardTitle className="text-sm font-medium">Available Courses</CardTitle>
                <p className="text-2xl font-bold">{enrolledCourses.length}</p>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              <div>
                <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
                <p className="text-2xl font-bold">{totalAttempts}</p>
              </div>
            </CardHeader>
          </Card>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {enrolledCourses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{course.title}</p>
                      <p className="text-sm text-muted-foreground">{course.level}</p>
                    </div>
                    <Button variant="ghost" size="sm" render={<Link href={`/courses/${course.id}`} />}>
                      View <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                ))}
                {enrolledCourses.length === 0 && (
                  <p className="text-sm text-muted-foreground">No courses available yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userProgress.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center gap-3 text-sm">
                    {p.completed ? (
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span>Lesson {p.lessonId?.slice(0, 8) ?? 'unknown'}...</span>
                    {p.score && <span className="text-muted-foreground">Score: {p.score}</span>}
                  </div>
                ))}
                {userProgress.length === 0 && (
                  <p className="text-sm text-muted-foreground">No activity yet. Start a course!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
