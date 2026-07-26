'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { Loader2, BookOpen } from 'lucide-react';

interface OpeningMove {
  san: string;
  white: number;
  black: number;
  draws: number;
  total: number;
}

async function fetchOpeningExplorer(fen: string): Promise<OpeningMove[]> {
  const params = new URLSearchParams({ fen, variant: 'standard' });
  const res = await fetch(`https://lichess.org/api/opening?${params.toString()}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to fetch opening explorer');
  const data = await res.json();
  return (data.moves || []).map((m: { san: string; white: number; black: number; draws: number }) => ({
    san: m.san,
    white: m.white,
    black: m.black,
    draws: m.draws,
    total: m.white + m.black + m.draws,
  }));
}

interface OpeningExplorerProps {
  fen: string;
  onMoveClick?: (san: string) => void;
}

export function OpeningExplorer({ fen, onMoveClick }: OpeningExplorerProps) {
  const [moves, setMoves] = useState<OpeningMove[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const t = useTranslations('dashboard');

  async function handleLoad() {
    setLoading(true);
    setError('');
    try {
      const data = await fetchOpeningExplorer(fen);
      setMoves(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('openingLoadError'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <BookOpen className="h-4 w-4" />
          {t('openingExplorer')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button size="sm" onClick={handleLoad} disabled={loading}>
          {loading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
          {loading ? t('loading') : t('loadStats')}
        </Button>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {moves.length > 0 && (
          <div className="space-y-1 max-h-60 overflow-y-auto">
            <div className="grid grid-cols-5 gap-2 text-xs font-medium text-muted-foreground pb-1 border-b">
              <span>{t('openingMoveColumn')}</span>
              <span className="text-right">{t('openingWhiteColumn')}</span>
              <span className="text-right">{t('openingBlackColumn')}</span>
              <span className="text-right">{t('openingDrawColumn')}</span>
              <span className="text-right">{t('openingTotalColumn')}</span>
            </div>
            {moves.slice(0, 20).map((move) => (
              <button
                key={move.san}
                className="grid grid-cols-5 gap-2 text-xs w-full text-left py-1 px-1 rounded hover:bg-muted transition-colors cursor-pointer"
                onClick={() => onMoveClick?.(move.san)}
              >
                <span className="font-mono">{move.san}</span>
                <span className="text-right">{((move.white / move.total) * 100).toFixed(0)}%</span>
                <span className="text-right">{((move.black / move.total) * 100).toFixed(0)}%</span>
                <span className="text-right">{((move.draws / move.total) * 100).toFixed(0)}%</span>
                <span className="text-right">{move.total}</span>
              </button>
            ))}
          </div>
        )}
        {!loading && moves.length === 0 && !error && (
          <p className="text-xs text-muted-foreground">{t('openingInstructions')}</p>
        )}
      </CardContent>
    </Card>
  );
}