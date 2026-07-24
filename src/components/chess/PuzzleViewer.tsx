'use client';

import { useState, useCallback } from 'react';
import { Chess } from 'chess.js';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import { RotateCcw, Lightbulb, SkipForward, Check, X } from 'lucide-react';

const Chessboard = dynamic(() => import('react-chessboard').then(m => m.Chessboard), { ssr: false });
const ChessboardProvider = dynamic(() => import('react-chessboard').then(m => m.ChessboardProvider), { ssr: false });

interface Puzzle {
  id: string;
  fen: string;
  solution: string;
  rating: number | null;
  themes: string | null;
}

interface PuzzleViewerProps {
  puzzle: Puzzle;
  onNext?: () => void;
}

export function PuzzleViewer({ puzzle, onNext }: PuzzleViewerProps) {
  const t = useTranslations('puzzles');
  const [game, setGame] = useState(() => {
    const g = new Chess(puzzle.fen);
    return g;
  });
  const [solutionMoves] = useState(() => JSON.parse(puzzle.solution) as string[]);
  const [currentSolutionIndex, setCurrentSolutionIndex] = useState(0);
  const [status, setStatus] = useState<'playing' | 'correct' | 'wrong'>('playing');
  const [showHint, setShowHint] = useState(false);
  const [boardWidth] = useState(400);

  function makeMove(from: string, to: string): boolean {
    if (status !== 'playing') return false;
    const expectedMove = solutionMoves[currentSolutionIndex];
    const g = new Chess(game.fen());
    try {
      const move = g.move({ from, to, promotion: 'q' });
      if (move.san === expectedMove) {
        setGame(g);
        const nextIndex = currentSolutionIndex + 1;

        if (nextIndex >= solutionMoves.length) {
          setStatus('correct');
          setCurrentSolutionIndex(nextIndex);
          return true;
        }

        const opponentMove = solutionMoves[nextIndex];
        try {
          const g2 = new Chess(g.fen());
          g2.move(opponentMove);
          setGame(g2);
          setCurrentSolutionIndex(nextIndex + 1);
          setShowHint(false);
          return true;
        } catch {
          setStatus('correct');
          return true;
        }
      } else {
        setStatus('wrong');
        return false;
      }
    } catch {
      return false;
    }
  }

  function resetPuzzle() {
    const g = new Chess(puzzle.fen);
    setGame(g);
    setCurrentSolutionIndex(0);
    setStatus('playing');
    setShowHint(false);
  }

  function skipPuzzle() {
    const g = new Chess(puzzle.fen);
    for (const move of solutionMoves) {
      try { g.move(move); } catch { break; }
    }
    setGame(g);
    setStatus('correct');
    setCurrentSolutionIndex(solutionMoves.length);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: boardWidth }}>
        <ChessboardProvider
          options={{
            position: game.fen(),
            onPieceDrop: ({ sourceSquare, targetSquare }) => {
              if (!sourceSquare || !targetSquare) return false;
              return makeMove(sourceSquare, targetSquare);
            },
            boardStyle: { borderRadius: '8px' },
            allowDragging: status === 'playing',
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
      </div>
      {showHint && status === 'playing' && (
        <p className="text-sm text-muted-foreground">
          {t('hint')}: {solutionMoves[currentSolutionIndex]}
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
    </div>
  );
}
