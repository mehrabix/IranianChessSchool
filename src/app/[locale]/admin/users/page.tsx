import { getTranslations } from 'next-intl/server';
import { auth } from '@/lib/auth';
import { db, users as usersTable, desc } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Link } from '@/i18n/routing';
import { ArrowLeft, Shield, Ban, UserCheck } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export default async function AdminUsersPage() {
  const session = await auth();
  const t = await getTranslations('admin');

  if (session?.user?.role !== 'ADMIN') {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">{t('accessDenied')}</p></div>;
  }

  const users = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt));

  return (
    <section className="py-8">
      <Container size="lg">
        <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />{t('nav.dashboard')}
        </Link>
        <h1 className="text-2xl font-bold mb-8">{t('nav.users') || 'Users'}</h1>

        <div className="space-y-3">
          {users.map((user) => (
            <Card key={user.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium">{user.name || 'Unknown'}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{user.role}</Badge>
                    {user.subscriptionStatus === 'ACTIVE' && <Badge className="bg-emerald-600">Active</Badge>}
                    {user.subscriptionStatus === 'BANNED' && <Badge className="bg-red-600">Banned</Badge>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <form action="/api/admin/users" method="POST">
                    <input type="hidden" name="userId" value={user.id} />
                    <input type="hidden" name="role" value={user.role === 'ADMIN' ? 'STUDENT' : 'ADMIN'} />
                    <Button type="submit" variant="outline" size="sm" className="gap-1">
                      <Shield className="h-3.5 w-3.5" /> {user.role === 'ADMIN' ? 'Demote' : 'Make Admin'}
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
