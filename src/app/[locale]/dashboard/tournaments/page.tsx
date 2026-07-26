'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Trophy, Plus, Swords } from 'lucide-react';

export default function TournamentsPage() {
  const { data: session } = useSession();
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);

  async function loadTournaments() {
    const res = await globalThis.fetch('/api/tournaments');
    setTournaments((await res.json()).tournaments || []);
    setLoading(false);
  }

  useEffect(() => { loadTournaments(); }, []);

  async function handleCreate() {
    if (!name.trim()) return;
    setCreating(true);
    const res = await globalThis.fetch('/api/tournaments', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim() }),
    });
    if (res.ok) { setName(''); loadTournaments(); }
    setCreating(false);
  }

  async function toggleJoin(tId: string) {
    await globalThis.fetch(`/api/tournaments/${tId}/join`, { method: 'POST' });
    loadTournaments();
  }

  if (loading) return <section className="py-8"><Container size="sm"><div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div></Container></section>;

  return (
    <section className="py-8">
      <Container size="sm">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="h-8 w-8 text-amber-500" />
          <h1 className="text-3xl font-bold">Tournaments</h1>
        </div>
        {session && (
          <Card className="mb-6">
            <CardContent className="pt-6 flex gap-3">
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Tournament name" />
              <Button onClick={handleCreate} disabled={creating || !name.trim()} className="shrink-0 gap-2">
                <Plus className="h-4 w-4" /> Create
              </Button>
            </CardContent>
          </Card>
        )}
        <div className="space-y-3">
          {tournaments.map((t: any) => (
            <Card key={t.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Swords className="h-4 w-4 text-amber-500" />
                    <p className="font-medium">{t.name}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">{t.type}</Badge>
                    <Badge variant={t.status === 'ACTIVE' ? 'default' : 'secondary'} className="text-xs">{t.status}</Badge>
                    <span className="text-xs text-muted-foreground">{t.playerCount}/{t.maxPlayers || 16} players</span>
                  </div>
                </div>
                {session && t.status !== 'COMPLETED' && (
                  <Button size="sm" variant="outline" onClick={() => toggleJoin(t.id)}>
                    Join
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
          {tournaments.length === 0 && <p className="text-center text-muted-foreground py-12">No tournaments yet.</p>}
        </div>
      </Container>
    </section>
  );
}
