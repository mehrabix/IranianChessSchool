import { getTranslations } from 'next-intl/server';
import { auth } from '@/lib/auth';
import { db, courses, modules, lessons, progress, eq, asc, and } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Link } from '@/i18n/routing';
import { BookOpen, CheckCircle, Circle, Lock, ArrowLeft, Play, FileText } from 'lucide-react';
import { tKey } from '@/lib/t-key';

export default async function CourseDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const session = await auth();
  const course = await db.select().from(courses).where(eq(courses.id, id)).then(r => r[0]);
  const t = await getTranslations();
  if (!course) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">{t('courses.hero.courseNotFound')}</p></div>;

  const mods = await db
    .select()
    .from(modules)
    .where(eq(modules.courseId, id))
    .orderBy(asc(modules.order));

  const modsWithLessons = await Promise.all(
    mods.map(async (m) => {
      const ls = await db
        .select()
        .from(lessons)
        .where(eq(lessons.moduleId, m.id))
        .orderBy(asc(lessons.order));
      return { ...m, lessons: ls };
    })
  );

  let completedLessons = new Set<string>();
  if (session?.user?.id) {
    const userProgress = await db
      .select()
      .from(progress)
      .where(eq(progress.userId, session.user.id));
    completedLessons = new Set(userProgress.filter(p => p.completed).map(p => p.lessonId).filter((id): id is string => id !== null));
  }

  const getText = (v: string | null) => tKey(v, t);

  return (
    <section className="relative py-20 bg-gradient-to-br from-background via-emerald-50/30 to-background">
      <Container size="lg">
        <div className="mb-6">
          <Button variant="ghost" size="sm" render={<Link href="/courses" />}>
            <ArrowLeft className="h-4 w-4 me-1 rtl:rotate-180" /> {t('courses.detail.backToCourses')}
          </Button>
        </div>
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            <h1 className="text-3xl font-bold mb-2">{getText(course.title)}</h1>
            <p className="text-muted-foreground mb-6">{getText(course.description)}</p>
            <div className="space-y-4">
              {modsWithLessons.map((mod) => (
                <Card key={mod.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{getText(mod.title)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {mod.lessons.map((lesson) => {
                        const isCompleted = completedLessons.has(lesson.id);
                        return (
                          <div key={lesson.id} className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                              {isCompleted ? (
                                <CheckCircle className="h-5 w-5 text-emerald-500" />
                              ) : (
                                <FileText className="h-5 w-5 text-muted-foreground" />
                              )}
                              <div>
                                <Link href={`/courses/${course.id}/lessons/${lesson.id}`} className="font-medium hover:text-emerald-600 transition-colors">
                                  {getText(lesson.title)}
                                </Link>
                                <p className="text-xs text-muted-foreground">
                                  {lesson.type === 'VIDEO' ? t('courses.lesson.video') : lesson.type === 'QUIZ' ? t('courses.lesson.quiz') : t('courses.lesson.text')}
                                </p>
                                {lesson.duration && <p className="text-xs text-muted-foreground">{lesson.duration} {t('courses.minutes')}</p>}
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" render={<Link href={`/courses/${course.id}/lessons/${lesson.id}`} />}>
                              <Play className="h-3 w-3" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
