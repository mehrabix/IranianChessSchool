import { getTranslations, getLocale } from 'next-intl/server';
import { auth } from '@/lib/auth';
import { redirect, Link } from '@/i18n/routing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Users, Trophy, LogIn, LogOut } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function getTournament(id: string) {
  const res = await fetch(`${BASE}/api/tournaments?id=${encodeURIComponent(id)}`, { cache: 'no-store' });
  if (!res.ok) return null;
  const data = await res.json();
  return data.tournament || null;
}

export default async function TournamentDetailPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id, locale } = await params;
  const t = await getTranslations('dashboard');
  const session = await auth();
  const tournament = await getTournament(id);

  if (!tournament) {
    redirect({ href: '/dashboard', locale });
    return null;
  }

  const players = tournament.players || [];
  const isMember = session?.user?.id ? players.some((p: { userId: string }) => p.userId === session.user!.id) : false;

  const statusColor = tournament.status === 'ACTIVE' ? 'bg-emerald-500' : tournament.status === 'COMPLETED' ? 'bg-gray-500' : 'bg-amber-500';

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
              <h1 className="text-3xl font-bold mb-2">{tournament.name}</h1>
              <p className="text-muted-foreground">{tournament.description}</p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="secondary">{tournament.type}</Badge>
              <div className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-white ${statusColor}`}>
                {tournament.status}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{tournament.playerCount} / {tournament.maxPlayers} {t('players')}</span>
              </div>
            </div>

            {/* Join/Leave toggle */}
            <div>
              <form action={`/api/tournaments/${id}/join`} method="POST">
                <Button type="submit" variant={isMember ? 'outline' : 'default'}>
                  {isMember ? (
                    <>
                      <LogOut className="h-4 w-4 mr-2" />
                      {t('leaveTournament')}
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4 mr-2" />
                      {t('joinTournament')}
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Players list */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Trophy className="h-4 w-4" />
                  {t('players')} ({players.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {players.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t('noPlayers')}</p>
                ) : (
                  <div className="space-y-3">
                    {players.map((player: { id: string; userId: string; userName?: string | null; userImage?: string | null; score: number; joinedAt: string | null }) => (
                      <div key={player.id} className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={player.userImage || ''} alt={player.userName || player.userId} />
                          <AvatarFallback>{(player.userName || player.userId || '?')[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{player.userName || player.userId}</p>
                          <p className="text-xs text-muted-foreground">
                            {t('score')}: {player.score} · {t('joined')} {player.joinedAt ? new Date(player.joinedAt).toLocaleDateString() : ''}
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
