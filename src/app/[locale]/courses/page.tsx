import { getTranslations, getLocale } from 'next-intl/server';
import { db, courses, eq } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Link } from '@/i18n/routing';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import { tKey } from '@/lib/t-key';

function courseLevelLabel(level: string | null, locale: string) {
  if (!level) return '';
  const key = level.toLowerCase();
  if (locale === 'fa') {
    const fa: Record<string, string> = { beginner: 'مبتدی', improver: 'در حال پیشرفت', intermediate: 'متوسط', advanced: 'پیشرفته', club: 'باشگاهی' };
    return fa[key] || level;
  }
  const en: Record<string, string> = { beginner: 'Beginner', improver: 'Improver', intermediate: 'Intermediate', advanced: 'Advanced', club: 'Club Player' };
  return en[key] || level;
}

export default async function CoursesPage() {
  const tc = await getTranslations('courses');
  const t = await getTranslations();
  const locale = await getLocale();
  const all = await db
    .select()
    .from(courses)
    .where(eq(courses.published, true))
    .orderBy(courses.createdAt);

  const getText = (v: string | null) => tKey(v, t);

  return (
    <>
      <section className="relative py-20 bg-gradient-to-br from-background via-emerald-50/30 to-background">
        <Container size="lg">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">{tc('hero.heading')}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {tc('hero.subtitle')}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {all.map((course) => (
              <Card key={course.id} className="group hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>{getText(course.title)}</CardTitle>
                  <p className="text-sm text-muted-foreground">{getText(course.description)}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{courseLevelLabel(course.level, locale)}</Badge>
                    <Button variant="ghost" size="sm" render={<Link href={`/courses/${course.id}`} />}>
                      {tc('hero.viewCourse')} <ArrowRight className="h-3 w-3 ms-1 rtl:rotate-180" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {all.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                {tc('hero.noCourses')}
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
