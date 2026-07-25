'use client';

import { usePuzzle, type Puzzle } from '@/hooks/usePuzzle';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import { RotateCcw, Lightbulb, SkipForward, Check, X, Timer, Trophy, Flame, Zap } from 'lucide-react';

const Chessboard = dynamic(() => import('react-chessboard').then(m => m.Chessboard), { ssr: false });
const ChessboardProvider = dynamic(() => import('react-chessboard').then(m => m.ChessboardProvider), { ssr: false });

interface PuzzleViewerProps {
  puzzle: Puzzle;
  onNext?: () => void;
  showRush?: boolean;
}

export function PuzzleViewer({ puzzle, onNext, showRush = false }: PuzzleViewerProps) {
  const t = useTranslations('puzzles');
  const {
    fen, status, showHint, streak, isRush, timeRemaining, rushScore,
    makeMove, resetPuzzle, skipPuzzle, setShowHint, startRush, stopRush,
    formatTime, isGameOver,
  } = usePuzzle(puzzle);

  const isTimeUp = isRush && timeRemaining === 0;

  return (
    <div className="flex flex-col items-center gap-4">
      {isRush && (
        <div className="flex items-center gap-4 w-full justify-between">
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-primary" />
            <span className={`font-mono text-lg font-bold ${timeRemaining <= 30 ? 'text-red-500' : ''}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium">{t('score')}: {rushScore}</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium">{t('streak')}: {streak}</span>
          </div>
        </div>
      )}

      {streak > 0 && !isRush && (
        <div className="flex items-center gap-2 text-orange-500">
          <Flame className="h-4 w-4" />
          <span className="text-sm font-medium">{t('streakCount', { count: streak })}</span>
        </div>
      )}

      <div className="relative w-[400px]">
        <ChessboardProvider
          options={{
            position: fen,
            onPieceDrop: ({ sourceSquare, targetSquare }) => {
              if (!sourceSquare || !targetSquare) return false;
              return makeMove(sourceSquare, targetSquare);
            },
            boardStyle: { borderRadius: '8px' },
            allowDragging: status === 'playing' && !isTimeUp,
            animationDurationInMs: 200,
            showAnimations: true,
          }}
        >
          <Chessboard />
        </ChessboardProvider>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="outline">{puzzle.rating ? `${puzzle.rating} ELO` : ''}</Badge>
        {puzzle.themes && JSON.parse(puzzle.themes).map((theme: string) => (
          <Badge key={theme} variant="secondary" className="text-xs">{theme}</Badge>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={resetPuzzle} className="gap-1.5">
          <RotateCcw className="h-3 w-3" /> {t('reset')}
        </Button>
        <Button variant="outline" size="sm" onClick={() => setShowHint(true)} disabled={status !== 'playing'} className="gap-1.5">
          <Lightbulb className="h-3 w-3" /> {t('hint')}
        </Button>
        <Button variant="outline" size="sm" onClick={skipPuzzle} disabled={status !== 'playing'} className="gap-1.5">
          <SkipForward className="h-3 w-3" /> {t('skip')}
        </Button>
        {onNext && (
          <Button variant="default" size="sm" onClick={onNext} className="gap-1.5">
            {t('nextPuzzle')}
          </Button>
        )}
        {showRush && !isRush && (
          <Button variant="default" size="sm" onClick={startRush} className="gap-1.5">
            <Zap className="h-3 w-3" /> {t('startRush')}
          </Button>
        )}
        {isRush && (
          <Button variant="destructive" size="sm" onClick={stopRush} className="gap-1.5">
            {t('rushOver')}
          </Button>
        )}
      </div>

      {showHint && status === 'playing' && (
        <p className="text-sm text-muted-foreground">
          {t('hint')}: {JSON.parse(puzzle.solution)[0]}
        </p>
      )}

      {status === 'correct' && (
        <div className="flex items-center gap-2 text-emerald-600 font-medium">
          <Check className="h-5 w-5" /> {t('correct')}
        </div>
      )}
      {status === 'wrong' && (
        <div className="flex items-center gap-2 text-red-600 font-medium">
          <X className="h-5 w-5" /> {t('wrong')}
        </div>
      )}

      {isTimeUp && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center text-lg">{t('rushOver')}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <p className="text-3xl font-bold text-primary">{rushScore}</p>
            <p className="text-sm text-muted-foreground">{t('puzzlesSolved')}</p>
            <Button onClick={startRush} className="gap-1.5">
              <Zap className="h-3 w-3" /> {t('startRush')}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
