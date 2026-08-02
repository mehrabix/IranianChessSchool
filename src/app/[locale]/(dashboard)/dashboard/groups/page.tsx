'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, Plus, LogIn } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function GroupsPage() {
  const t = useTranslations('dashboard');
  const { data: session } = useSession();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [joined, setJoined] = useState<Set<string>>(new Set());

  async function fetchGroups() {
    const res = await fetch('/api/groups');
    setGroups((await res.json()).groups || []);
    setLoading(false);
  }

  useEffect(() => { fetchGroups(); }, []);  {/* eslint-disable-line react-hooks/set-state-in-effect */}

  async function handleCreate() {
    if (!name.trim()) return;
    setCreating(true);
    const res = await fetch('/api/groups', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), description: desc }),
    });
    if (res.ok) { setName(''); setDesc(''); fetchGroups(); }
    setCreating(false);
  }

  async function toggleJoin(groupId: string) {
    const res = await fetch(`/api/groups/${groupId}/join`, { method: 'POST' });
    const data = await res.json();
    setJoined(prev => { const n = new Set(prev); data.joined ? n.add(groupId) : n.delete(groupId); return n; });
    fetchGroups();
  }

  if (loading) return <section className="py-8"><Container size="sm"><div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div></Container></section>;

  return (
    <section className="py-8">
      <Container size="sm">
        <h1 className="text-3xl font-bold mb-6">{t('groups')}</h1>
        {session && (
          <Card className="mb-6">
            <CardContent className="pt-6 space-y-3">
              <Input value={name} onChange={e => setName(e.target.value)} placeholder={t('groupNamePlaceholder')} />
              <Input value={desc} onChange={e => setDesc(e.target.value)} placeholder={t('descriptionOptionalPlaceholder')} />
              <Button onClick={handleCreate} disabled={creating || !name.trim()} className="gap-2">
                <Plus className="h-4 w-4" /> {t('createGroup')}
              </Button>
            </CardContent>
          </Card>
        )}
        <div className="space-y-3">
          {groups.map((g: any) => (
            <Card key={g.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium">{g.name}</p>
                  {g.description && <p className="text-xs text-muted-foreground">{g.description}</p>}
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">{g.category}</Badge>
                    <span className="text-xs text-muted-foreground">{g.memberCount || 0} {t('membersCount')}</span>
                  </div>
                </div>
                {session && (
                  <Button size="sm" variant={joined.has(g.id) ? 'default' : 'outline'} onClick={() => toggleJoin(g.id)}>
                    {joined.has(g.id) ? t('leave') : t('join')}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
          {groups.length === 0 && <p className="text-center text-muted-foreground py-12">{t('noGroups')}</p>}
        </div>
      </Container>
    </section>
  );
}
