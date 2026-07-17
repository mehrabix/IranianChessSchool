import { getTranslations } from 'next-intl/server';
import { auth } from '@/lib/auth';
import { db, courses, users, progress, eq, desc, sql } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Link } from '@/i18n/routing';
import { BookOpen, Users, TrendingUp, Settings, ArrowRight, FileText } from 'lucide-react';

export default async function AdminDashboardPage() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Access denied.</p></div>;
  }

  const courseCount = await db.select({ count: sql<number>`count(*)` }).from(courses).then(r => Number(r[0].count));
  const userCount = await db.select({ count: sql<number>`count(*)` }).from(users).then(r => Number(r[0].count));

  return (
    <section className="relative py-16 bg-gradient-to-br from-background via-emerald-50/30 to-background">
      <Container size="lg">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <BookOpen className="h-5 w-5 text-emerald-600" />
              <div>
                <CardTitle className="text-lg">Courses</CardTitle>
                <p className="text-2xl font-bold">{courseCount}</p>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <Users className="h-5 w-5 text-emerald-600" />
              <div>
                <CardTitle className="text-lg">Users</CardTitle>
                <p className="text-2xl font-bold">{userCount}</p>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              <div>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full gap-2" render={<Link href="/admin/courses" />}>
                <BookOpen className="h-4 w-4" /> Manage Courses
              </Button>
              <Button className="w-full gap-2" variant="outline" render={<Link href="/admin/posts" />}>
                <FileText className="h-4 w-4" /> Manage Posts
              </Button>
            </CardContent>
          </Card>
        </div>
    </Container>
  </section>
  );
}
