'use client';

import { useState, useEffect } from 'react';
import { PuzzleViewer } from '@/components/chess/PuzzleViewer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import { Loader2, Calendar, Zap } from 'lucide-react';
import type { Puzzle } from '@/hooks/usePuzzle';

export default function PuzzlesPage() {
  const t = useTranslations('puzzles');
  const tDash = useTranslations('dashboard');
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDailyPuzzle() {
      try {
        const res = await fetch('/api/puzzles/daily');
        if (!res.ok) throw new Error('Failed to load daily puzzle');
        const data = await res.json();
        setPuzzle(data.puzzle);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load puzzle');
      } finally {
        setLoading(false);
      }
    }
    fetchDailyPuzzle();
  }, []);

  if (loading) {
    return (
      <section className="py-8">
        <Container size="lg">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </Container>
      </section>
    );
  }

  if (error || !puzzle) {
    return (
      <section className="py-8">
        <Container size="lg">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">{error || t('noPuzzles')}</p>
            </CardContent>
          </Card>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-8">
      <Container size="lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{t('dailyPuzzle')}</h1>
            <p className="text-muted-foreground">{t('subtitle')}</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="max-w-[500px] mx-auto">
          <PuzzleViewer puzzle={puzzle} showRush={true} />
        </div>
      </Container>
    </section>
  );
}
