'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';

export interface Puzzle {
  id: string;
  fen: string;
  solution: string;
  rating: number | null;
  themes: string | null;
}

export function usePuzzle(puzzle: Puzzle) {
  const [game, setGame] = useState(() => new Chess(puzzle.fen));
  const [solutionMoves] = useState(() => JSON.parse(puzzle.solution) as string[]);
  const [currentSolutionIndex, setCurrentSolutionIndex] = useState(0);
  const [status, setStatus] = useState<'playing' | 'correct' | 'wrong'>('playing');
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState(0);
  const [isRush, setIsRush] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [rushScore, setRushScore] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRush && timeRemaining > 0 && status === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current!);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRush, timeRemaining, status]);

  const makeMove = useCallback((from: string, to: string): boolean => {
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
          setStreak(prev => prev + 1);
          if (isRush) setRushScore(prev => prev + 1);
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
          setStreak(prev => prev + 1);
          if (isRush) setRushScore(prev => prev + 1);
          return true;
        }
      } else {
        setStatus('wrong');
        if (isRush) {
          setStreak(0);
        }
        return false;
      }
    } catch {
      return false;
    }
  }, [status, solutionMoves, currentSolutionIndex, game, isRush]);

  const resetPuzzle = useCallback(() => {
    const g = new Chess(puzzle.fen);
    setGame(g);
    setCurrentSolutionIndex(0);
    setStatus('playing');
    setShowHint(false);
  }, [puzzle.fen]);

  const skipPuzzle = useCallback(() => {
    const g = new Chess(puzzle.fen);
    for (const move of solutionMoves) {
      try { g.move(move); } catch { break; }
    }
    setGame(g);
    setStatus('correct');
    setCurrentSolutionIndex(solutionMoves.length);
  }, [puzzle.fen, solutionMoves]);

  const startRush = useCallback(() => {
    setIsRush(true);
    setTimeRemaining(300);
    setRushScore(0);
    setStreak(0);
    resetPuzzle();
  }, [resetPuzzle]);

  const stopRush = useCallback(() => {
    setIsRush(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }, []);

  return {
    game,
    fen: game.fen(),
    status,
    showHint,
    streak,
    isRush,
    timeRemaining,
    rushScore,
    makeMove,
    resetPuzzle,
    skipPuzzle,
    setShowHint,
    startRush,
    stopRush,
    formatTime,
    isGameOver: status !== 'playing',
  };
}
