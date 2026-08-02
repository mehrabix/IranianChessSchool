'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Zap, Target, BookOpen, Swords, MessageCircle, TrendingUp } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string | null;
  type: 'PUZZLES' | 'LESSONS' | 'GAMES' | 'POSTS';
  goal: number;
  xpReward: number;
  startsAt: number;
  endsAt: number;
  progress?: number;
  completed?: boolean;
}

const typeIcons: Record<string, typeof Target> = {
  PUZZLES: Target,
  LESSONS: BookOpen,
  GAMES: Swords,
  POSTS: MessageCircle,
};

const typeLabels: Record<string, string> = {
  PUZZLES: 'Puzzles',
  LESSONS: 'Lessons',
  GAMES: 'Games',
  POSTS: 'Posts',
};

export default function ChallengesPage() {
  const { data: session } = useSession();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState<Set<string>>(new Set());

  async function fetchChallenges() {
    setLoading(true);
    const res = await fetch('/api/challenges');
    const data = await res.json();
    if (session?.user?.id && data.challenges) {
      const progressRes = await fetch(`/api/challenges/progress?userId=${session.user.id}`);
      const pd = await progressRes.json();
      const pmap = new Map((pd.progress as { challengeId: string; progress: number; completed: boolean }[])?.map((p) => [p.challengeId, p]) || []);
      data.challenges = data.challenges.map((c: Challenge) => {
        const p = pmap.get(c.id);
        return p ? { ...c, progress: p.progress, completed: p.completed } : c;
      });
    }
    setChallenges(data.challenges || []);
    setLoading(false);
  }

  useEffect(() => { fetchChallenges(); }, []); {/* eslint-disable-line react-hooks/set-state-in-effect */}

  async function handleJoin(challengeId: string) {
    setJoining(prev => new Set(prev).add(challengeId));
    await fetch(`/api/challenges/${challengeId}`, { method: 'POST' });
    setJoining(prev => { const n = new Set(prev); n.delete(challengeId); return n; });
    fetchChallenges();
  }

  if (loading) return <section className="py-20"><Container size="md" className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></Container></section>;

  const daysLeft = (endsAt: number) => Math.max(0, Math.ceil((endsAt - Date.now()) / (1000 * 60 * 60 * 24)));

  return (
    <section className="py-8">
      <Container size="lg">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="h-6 w-6 text-emerald-600" />
          <h1 className="text-2xl font-bold">Weekly Challenges</h1>
        </div>
        <p className="text-muted-foreground mb-8">Complete challenges to earn bonus XP and badges.</p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {challenges.map((ch) => {
            const Icon = typeIcons[ch.type] || Target;
            const pct = ch.progress ? Math.round((ch.progress / ch.goal) * 100) : 0;
            return (
              <Card key={ch.id} className={`hover:shadow-md transition-shadow ${ch.completed ? 'border-emerald-500 bg-emerald-50/30' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{ch.title}</CardTitle>
                        <p className="text-xs text-muted-foreground">{typeLabels[ch.type] || ch.type}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="gap-1 shrink-0">
                      <Zap className="h-3 w-3 text-amber-500" />+{ch.xpReward} XP
                    </Badge>
                  </div>
                  {ch.description && <p className="text-sm text-muted-foreground mt-2">{ch.description}</p>}
                </CardHeader>
                <CardContent>
                  {ch.completed ? (
                    <div className="text-center py-3">
                      <Badge className="bg-emerald-600">Completed! +{ch.xpReward} XP earned</Badge>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>{ch.progress || 0} / {ch.goal}</span>
                        <span>{daysLeft(ch.endsAt)} days left</span>
                      </div>
                      <Progress value={pct} className="h-2 mb-3" />
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleJoin(ch.id)}
                        disabled={joining.has(ch.id)}
                      >
                        {joining.has(ch.id) ? <Loader2 className="h-3 w-3 animate-spin me-1" /> : <Zap className="h-3 w-3 me-1" />}
                        Log Progress
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
          {challenges.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No active challenges this week. Check back soon!</p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
