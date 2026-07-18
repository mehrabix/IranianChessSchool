'use client';

import { useState, useCallback } from 'react';
import { Chess } from 'chess.js';

export function useChessBoard(initialFen?: string) {
  const [game, setGame] = useState(() => new Chess(initialFen));

  const makeMove = useCallback((from: string, to: string): boolean => {
    try {
      const gameCopy = new Chess(game.fen());
      const result = gameCopy.move({ from, to, promotion: 'q' });
      if (result) {
        setGame(gameCopy);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [game]);

  const reset = useCallback(() => {
    setGame(new Chess());
  }, []);

  const loadFen = useCallback((fen: string) => {
    try {
      setGame(new Chess(fen));
    } catch {
      console.error('Invalid FEN:', fen);
    }
  }, []);

  const undo = useCallback(() => {
    const gameCopy = new Chess(game.fen());
    gameCopy.undo();
    setGame(gameCopy);
  }, [game]);

  return {
    game,
    fen: game.fen(),
    isCheck: game.isCheck(),
    isCheckmate: game.isCheckmate(),
    isDraw: game.isDraw(),
    isGameOver: game.isGameOver(),
    turn: game.turn(),
    moves: game.history({ verbose: true }),
    makeMove,
    reset,
    loadFen,
    undo,
  };
}
