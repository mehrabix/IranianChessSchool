'use client';

import { useState } from 'react';
import { useEngine } from '@/hooks/useEngine';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { EngineEval, EngineLine } from '@/types/chess';

interface EngineEvalProps {
  fen: string;
  onBestMove?: (move: string) => void;
}

export function EngineEval({ fen, onBestMove }: EngineEvalProps) {
  const t = useTranslations('chess');
  const { evaluate, getTopLines, isReady, isThinking, error } = useEngine();
  const [evalResult, setEvalResult] = useState<EngineEval | null>(null);
  const [topLines, setTopLines] = useState<EngineLine[]>([]);

  async function handleEvaluate() {
    try {
      const result = await evaluate(fen);
      setEvalResult(result);
      if (result.bestMove && onBestMove) onBestMove(result.bestMove);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleTopLines() {
    try {
      const lines = await getTopLines(fen);
      setTopLines(lines);
    } catch (err) {
      console.error(err);
    }
  }

  if (error) return <p className="text-sm text-red-500">{t('engineError')}: {error}</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Brain className="h-4 w-4" />
          {t('engineAnalysis')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Button size="sm" onClick={handleEvaluate} disabled={!isReady || isThinking}>
            {isThinking ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
            {t('evaluate')}
          </Button>
          <Button size="sm" variant="outline" onClick={handleTopLines} disabled={!isReady || isThinking}>
            {t('topLines')}
          </Button>
        </div>
        {evalResult && (
          <div className="space-y-1 text-sm">
            <p><span className="text-muted-foreground">{t('score')}:</span> {evalResult.score > 0 ? '+' : ''}{evalResult.score.toFixed(2)}</p>
            <p><span className="text-muted-foreground">{t('depth')}:</span> {evalResult.depth}</p>
            <p><span className="text-muted-foreground">{t('best')}:</span> {evalResult.bestMove || t('notAvailable')}</p>
            <p className="text-muted-foreground truncate">
              <span className="text-muted-foreground">{t('principalVariation')}:</span> {evalResult.pv.join(' ')}
            </p>
          </div>
        )}
        {topLines.length > 0 && (
          <div className="space-y-1 border-t pt-2">
            <p className="text-xs font-medium text-muted-foreground">{t('topLines')}</p>
            {topLines.map((line, i) => (
              <p key={i} className="text-xs">
                {i + 1}. {line.score > 0 ? '+' : ''}{line.score.toFixed(2)} ({line.depth}) {line.pv.join(' ')}
              </p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
