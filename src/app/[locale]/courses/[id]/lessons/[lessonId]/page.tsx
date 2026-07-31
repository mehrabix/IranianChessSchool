import { getTranslations } from 'next-intl/server';
import { auth } from '@/lib/auth';
import { db, lessons, modules, courses, progress, eq, asc, and } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Link } from '@/i18n/routing';
import { ArrowLeft, ArrowRight, CheckCircle, Play, FileText } from 'lucide-react';
import { LessonViewer } from './lesson-viewer';

export default async function LessonPage(props: { params: Promise<{ id: string; lessonId: string }> }) {
  const { id: courseId, lessonId } = await props.params;
  const session = await auth();
  const t = await getTranslations('courses');

  const lesson = await db.select().from(lessons).where(eq(lessons.id, lessonId)).then(r => r[0]);
  if (!lesson) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">{t('lessonNotFound')}</p></div>;

  const mod = lesson.moduleId ? await db.select().from(modules).where(eq(modules.id, lesson.moduleId)).then(r => r[0]) : null;
  const course = await db.select().from(courses).where(eq(courses.id, courseId)).then(r => r[0]);

  const allLessons = lesson.moduleId ? await db
    .select()
    .from(lessons)
    .where(eq(lessons.moduleId, lesson.moduleId))
    .orderBy(asc(lessons.order)) : [];

  const currentIdx = allLessons.findIndex(l => l.id === lessonId);
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  return (
    <section className="relative py-20 bg-gradient-to-br from-background via-emerald-50/30 to-background">
      <Container size="lg">
        <div className="mb-6">
          <Button variant="ghost" size="sm" render={<Link href={`/courses/${courseId}`} />}>
            <ArrowLeft className="h-4 w-4 mr-1" /> {t('backToCourse')}
          </Button>
        </div>
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-1">{mod?.title}</p>
              <h1 className="text-2xl font-bold">{lesson.title}</h1>
            </div>
            <LessonViewer lesson={lesson} courseId={courseId} />
            <div className="flex items-center justify-between mt-8">
              {prevLesson ? (
                <Button variant="outline" render={<Link href={`/courses/${courseId}/lessons/${prevLesson.id}`} />}>
                  <ArrowLeft className="h-4 w-4 mr-1" /> {prevLesson.title}
                </Button>
              ) : <div />}
              {nextLesson ? (
                <Button render={<Link href={`/courses/${courseId}/lessons/${nextLesson.id}`} />}>
                  {nextLesson.title} <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              ) : <div />}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
