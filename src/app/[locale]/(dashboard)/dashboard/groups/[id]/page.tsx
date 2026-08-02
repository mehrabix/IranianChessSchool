import { getTranslations, getLocale } from 'next-intl/server';
import { auth } from '@/lib/auth';
import { redirect, Link } from '@/i18n/routing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Users, LogIn, LogOut } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function getGroup(id: string) {
  const res = await fetch(`${BASE}/api/groups?id=${encodeURIComponent(id)}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function GroupDetailPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id, locale } = await params;
  const t = await getTranslations('dashboard');
  const session = await auth();
  const data = await getGroup(id);

  if (!data?.group) {
    redirect({ href: '/dashboard', locale });
    return null;
  }

  const group = data.group;
  const members = group.members || [];
  const isMember = session?.user?.id ? members.some((m: { userId: string }) => m.userId === session.user!.id) : false;

  return (
    <section className="py-8">
      <Container size="lg">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          {t('backToDashboard')}
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{group.name}</h1>
              <p className="text-muted-foreground">{group.description}</p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="secondary">{group.category}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{group.memberCount} {t('members')}</span>
              </div>
            </div>

            {/* Join/Leave toggle */}
            <div>
              <JoinLeaveButton groupId={id} isMember={isMember} joinLabel={t('joinGroup')} leaveLabel={t('leaveGroup')} />
            </div>

            {/* Members list */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('members')} ({members.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {members.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t('noMembers')}</p>
                ) : (
                  <div className="space-y-3">
                    {members.map((member: { id: string; userId: string; role: string; userName: string | null; userImage: string | null; joinedAt: string | null }) => (
                      <div key={member.id} className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.userImage || ''} alt={member.userName || ''} />
                          <AvatarFallback>{(member.userName || '?')[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{member.userName || t('unknownMember')}</p>
                          <p className="text-xs text-muted-foreground">
                            {member.role} · {t('joinedDate')} {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
}

function JoinLeaveButton({ groupId, isMember, joinLabel, leaveLabel }: { groupId: string; isMember: boolean; joinLabel: string; leaveLabel: string }) {
  return (
    <form action={`/api/groups/${groupId}/join`} method="POST">
      <Button type="submit" variant={isMember ? 'outline' : 'default'}>
        {isMember ? (
          <>
            <LogOut className="h-4 w-4 mr-2" />
            {leaveLabel}
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4 mr-2" />
            {joinLabel}
          </>
        )}
      </Button>
    </form>
  );
}
