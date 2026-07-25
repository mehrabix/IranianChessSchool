'use client';

import { useState, useCallback } from 'react';
import { useEngine } from '@/hooks/useEngine';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import { Brain, Loader2, AlertTriangle, Target, ChevronDown, ChevronUp } from 'lucide-react';
import type { GameAnalysis, Blunder } from '@/types/chess';

interface GameAnalysisPanelProps {
  pgn: string;
  onMoveClick?: (moveIndex: number) => void;
}

export function GameAnalysisPanel({ pgn, onMoveClick }: GameAnalysisPanelProps) {
  const t = useTranslations('dashboard');
  const { analyzeGame, findBlunders, isReady, isThinking, error } = useEngine();
  const [analysis, setAnalysis] = useState<GameAnalysis | null>(null);
  const [blunders, setBlunders] = useState<Blunder[]>([]);
  const [showBlunders, setShowBlunders] = useState(true);

  const handleAnalyze = useCallback(async () => {
    if (!pgn.trim()) return;
    try {
      const [result, blunderList] = await Promise.all([
        analyzeGame(pgn),
        findBlunders(pgn),
      ]);
      setAnalysis(result);
      setBlunders(blunderList);
    } catch (err) {
      console.error(err);
    }
  }, [pgn, analyzeGame, findBlunders]);

  const accuracyColor = (acc: number) => {
    if (acc >= 90) return 'text-emerald-600';
    if (acc >= 75) return 'text-amber-600';
    return 'text-red-600';
  };

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-red-500">{t('engineError') || 'Engine error'}: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Brain className="h-4 w-4" />
          {t('gameAnalysis') || 'Game Analysis'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          size="sm"
          className="w-full gap-2"
          onClick={handleAnalyze}
          disabled={!isReady || isThinking || !pgn.trim()}
        >
          {isThinking ? <Loader2 className="h-3 w-3 animate-spin" /> : <Brain className="h-3 w-3" />}
          {isThinking ? (t('analyzing') || 'Analyzing...') : (t('analyzeGame') || 'Analyze Game')}
        </Button>

        {analysis && (
          <>
            <div className="flex items-center justify-between border rounded-lg p-3">
              <span className="text-sm text-muted-foreground">{t('accuracy') || 'Accuracy'}</span>
              <span className={`text-lg font-bold ${accuracyColor(analysis.totalAccuracy)}`}>
                {analysis.totalAccuracy.toFixed(1)}%
              </span>
            </div>

            {blunders.length > 0 && (
              <div className="border rounded-lg">
                <button
                  onClick={() => setShowBlunders(!showBlunders)}
                  className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    {t('blundersFound') || 'Blunders'} ({blunders.length})
                  </span>
                  {showBlunders ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {showBlunders && (
                  <div className="px-3 pb-2 space-y-1.5">
                    {blunders.map((blunder, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-xs p-2 bg-red-50 dark:bg-red-950/30 rounded"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium">{blunder.move}</span>
                          <Badge variant="outline" className="text-[10px] capitalize">{blunder.phase}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            {t('bestMove') || 'Best'}: {blunder.bestMove || 'N/A'}
                          </span>
                          <span className="text-red-600 font-medium">
                            {blunder.eval > 0 ? '+' : ''}{blunder.eval.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {blunders.length === 0 && (
              <div className="flex items-center gap-2 text-emerald-600 text-sm p-2">
                <Target className="h-4 w-4" />
                {t('noBlunders') || 'No blunders found! Solid game.'}
              </div>
            )}

            <div className="border rounded-lg">
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b">
                {t('moveByMove') || 'Move by Move'}
              </div>
              <div className="max-h-[200px] overflow-y-auto p-2 space-y-0.5">
                {analysis.moves.map((m, i) => {
                  const row = Math.floor(i / 2);
                  const isWhite = i % 2 === 0;
                  return (
                    <button
                      key={i}
                      onClick={() => onMoveClick?.(i)}
                      className={`flex items-center gap-1.5 w-full text-xs p-1 rounded hover:bg-accent transition-colors ${m.isBlunder ? 'bg-red-50 dark:bg-red-950/20' : ''}`}
                    >
                      {isWhite && (
                        <span className="text-muted-foreground w-6 text-right">{row + 1}.</span>
                      )}
                      {!isWhite && <span className="w-6" />}
                      <span className="font-mono">{m.san}</span>
                      <span className="text-muted-foreground ml-auto">
                        {m.eval > 0 ? '+' : ''}{m.eval.toFixed(2)}
                      </span>
                      {m.isBlunder && (
                        <AlertTriangle className="h-3 w-3 text-red-500 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
