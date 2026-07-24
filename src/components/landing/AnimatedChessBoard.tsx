'use client';

import { useEffect, useState } from 'react';
import { ChessPieceIcon } from '@/components/chess/ChessPieceIcon';

interface Piece {
  type: string;
  row: number;
  col: number;
}

const initialPieces: Piece[] = [
  { type: 'r', row: 0, col: 0 }, { type: 'n', row: 0, col: 1 }, { type: 'b', row: 0, col: 2 }, { type: 'q', row: 0, col: 3 },
  { type: 'k', row: 0, col: 4 }, { type: 'b', row: 0, col: 5 }, { type: 'n', row: 0, col: 6 }, { type: 'r', row: 0, col: 7 },
  { type: 'p', row: 1, col: 0 }, { type: 'p', row: 1, col: 1 }, { type: 'p', row: 1, col: 2 }, { type: 'p', row: 1, col: 3 },
  { type: 'p', row: 1, col: 4 }, { type: 'p', row: 1, col: 5 }, { type: 'p', row: 1, col: 6 }, { type: 'p', row: 1, col: 7 },
  { type: 'P', row: 6, col: 0 }, { type: 'P', row: 6, col: 1 }, { type: 'P', row: 6, col: 2 }, { type: 'P', row: 6, col: 3 },
  { type: 'P', row: 6, col: 4 }, { type: 'P', row: 6, col: 5 }, { type: 'P', row: 6, col: 6 }, { type: 'P', row: 6, col: 7 },
  { type: 'R', row: 7, col: 0 }, { type: 'N', row: 7, col: 1 }, { type: 'B', row: 7, col: 2 }, { type: 'Q', row: 7, col: 3 },
  { type: 'K', row: 7, col: 4 }, { type: 'B', row: 7, col: 5 }, { type: 'N', row: 7, col: 6 }, { type: 'R', row: 7, col: 7 },
];

const moves = [
  { row: 6, col: 4, drow: 4, dcol: 4 },
  { row: 1, col: 3, drow: 3, dcol: 3 },
  { row: 7, col: 6, drow: 5, dcol: 5 },
  { row: 0, col: 1, drow: 2, dcol: 2 },
  { row: 6, col: 3, drow: 4, dcol: 3 },
  { row: 0, col: 6, drow: 2, dcol: 5 },
];

export function AnimatedChessBoard() {
  const [pieces, setPieces] = useState<Piece[]>(initialPieces);
  const [animatingPiece, setAnimatingPiece] = useState<{ type: string; fromRow: number; fromCol: number; toRow: number; toCol: number } | null>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const move = moves[step % moves.length];
      setAnimatingPiece({ type: 'n', fromRow: move.row, fromCol: move.col, toRow: move.drow, toCol: move.dcol });
      setTimeout(() => {
        setPieces(prev => prev.map(p =>
          p.row === move.row && p.col === move.col && p.type === 'n'
            ? { ...p, row: move.drow, col: move.dcol }
            : p
        ));
        setAnimatingPiece(null);
        setStep(s => s + 1);
      }, 600);
    }, 2500);

    return () => clearInterval(interval);
  }, [step]);

  return (
    <div className="grid grid-cols-8 gap-0.5 w-72 h-72">
      {Array.from({ length: 64 }).map((_, i) => {
        const row = Math.floor(i / 8);
        const col = i % 8;
        const isDark = (row + col) % 2 === 1;
        const piece = pieces.find(p => p.row === row && p.col === col);
        const isAnimating = animatingPiece?.toRow === row && animatingPiece?.toCol === col;

        return (
          <div
            key={i}
            className={`aspect-square flex items-center justify-center relative rounded-sm ${
              isDark ? 'bg-emerald-700/40' : 'bg-amber-100/50'
            }`}
          >
            {piece && (
              <div
                className={`transition-all duration-500 ${
                  isAnimating ? 'scale-110 -translate-y-1' : ''
                }`}
              >
                <ChessPieceIcon piece={piece.type} size={22} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}