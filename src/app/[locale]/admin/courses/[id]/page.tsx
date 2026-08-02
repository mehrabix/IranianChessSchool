import { getTranslations } from 'next-intl/server';
import { auth } from '@/lib/auth';
import { db, courses, modules, lessons, eq, asc } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Link } from '@/i18n/routing';
import { ArrowLeft, BookOpen, Plus, FileText, GripVertical } from 'lucide-react';
import { CourseSettingsCard } from './course-settings';
import { CourseMetaCard } from './course-meta';
import { ModuleManager } from './module-manager';

export default async function AdminCourseDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const session = await auth();
  const t = await getTranslations('admin.courses');
  const ta = await getTranslations('admin');
  if (session?.user?.role !== 'ADMIN') {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">{ta('accessDenied')}</p></div>;
  }

  const course = await db.select().from(courses).where(eq(courses.id, id)).then(r => r[0]);
  if (!course) notFound();

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

  return (
    <section className="relative py-16 bg-gradient-to-br from-background via-emerald-50/30 to-background">
      <Container size="lg">
        <div className="mb-6">
          <Button variant="ghost" size="sm" render={<Link href="/admin/courses" />}>
            <ArrowLeft className="h-4 w-4 me-1 rtl:rotate-180" /> {t('cancel')}
          </Button>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            <CourseSettingsCard course={course} />
            <ModuleManager courseId={course.id} modules={modsWithLessons} />
          </div>
          <div className="space-y-6">
            <CourseMetaCard course={course} />
          </div>
        </div>
      </Container>
    </section>
  );
}
