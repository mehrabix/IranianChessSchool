'use client';

import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, Trophy, Medal, Star, Flame } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface LeaderboardUser {
  id: string;
  name: string | null;
  image: string | null;
  xp: number;
  level: number;
  rating: number;
}

export default function LeaderboardPage() {
  const t = useTranslations('dashboard');
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard').then(r => r.json()).then(d => {
      setUsers(d.users || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <section className="py-8"><Container size="sm"><div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div></Container></section>;
  }

  return (
    <section className="py-8">
      <Container size="sm">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="h-8 w-8 text-amber-500" />
          <div>
            <h1 className="text-3xl font-bold">{t('leaderboard')}</h1>
            <p className="text-muted-foreground text-sm">{t('topPlayersByXp')}</p>
          </div>
        </div>

        <div className="space-y-3">
          {users.map((user, i) => (
            <Card key={user.id} className={i < 3 ? 'border-amber-500/30' : ''}>
              <CardContent className="flex items-center gap-4 py-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm shrink-0"
                  style={{ background: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : 'var(--muted)' }}>
                  {i < 3 ? <Medal className="h-4 w-4 text-white" /> : i + 1}
                </div>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.image || ''} />
                  <AvatarFallback>{user.name?.[0] || '?'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{user.name || t('anonymous')}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Star className="h-3 w-3" /> {t('level')} {user.level}
                    {user.rating > 0 && <span>{t('rating')}: {user.rating}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{user.xp?.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{t('xpShort')}</p>
                </div>
              </CardContent>
            </Card>
          ))}
          {users.length === 0 && <p className="text-center text-muted-foreground py-12">{t('noPlayersYet')}</p>}
        </div>
      </Container>
    </section>
  );
}
