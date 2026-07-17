import { getTranslations } from 'next-intl/server';
import { db, courses, eq, asc } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Link } from '@/i18n/routing';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';

export default async function CoursesPage() {
  const t = await getTranslations('nav');
  const all = await db
    .select()
    .from(courses)
    .where(eq(courses.published, true))
    .orderBy(courses.createdAt);

  return (
    <>
      <section className="relative py-20 bg-gradient-to-br from-background via-emerald-50/30 to-background">
        <Container size="lg">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Courses</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our chess courses designed for every skill level.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {all.map((course) => (
              <Card key={course.id} className="group hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{course.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{course.level}</Badge>
                    <Button variant="ghost" size="sm" render={<Link href={`/courses/${course.id}`} />}>
                      View Course <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {all.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No courses available yet.
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
