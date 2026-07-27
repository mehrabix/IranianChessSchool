'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WikiChessPiece } from '@/components/chess/ChessPieceIcon';

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
  { type: 'P', fromRow: 6, fromCol: 4, toRow: 4, toCol: 4 },
  { type: 'p', fromRow: 1, fromCol: 3, toRow: 3, toCol: 3 },
  { type: 'N', fromRow: 7, fromCol: 6, toRow: 5, toCol: 5 },
  { type: 'n', fromRow: 0, fromCol: 1, toRow: 2, toCol: 2 },
  { type: 'B', fromRow: 7, fromCol: 5, toRow: 4, toCol: 2 },
  { type: 'b', fromRow: 0, fromCol: 5, toRow: 3, toCol: 2 },
];

export function AnimatedChessBoard() {
  const [pieces, setPieces] = useState<Piece[]>(initialPieces);
  const [step, setStep] = useState(0);
  const [moveKey, setMoveKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const move = moves[step % moves.length];
      setMoveKey(k => k + 1);
      setTimeout(() => {
        setPieces(prev =>
          prev.map(p =>
            p.row === move.fromRow && p.col === move.fromCol && p.type === move.type
              ? { ...p, row: move.toRow, col: move.toCol }
              : p
          )
        );
        setStep(s => s + 1);
      }, 800);
    }, 2500);

    return () => clearInterval(interval);
  }, [step]);

  const currentMove = moves[step % moves.length];

  return (
    <motion.div
      className="grid grid-cols-8 gap-0 w-72 h-72 rounded-xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.9, rotateX: 5 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {Array.from({ length: 64 }).map((_, i) => {
        const row = Math.floor(i / 8);
        const col = i % 8;
        const isDark = (row + col) % 2 === 1;
        const piece = pieces.find(p => p.row === row && p.col === col);
        const isOrigin = piece && piece.row === currentMove.fromRow && piece.col === currentMove.fromCol;
        const isTarget = currentMove.toRow === row && currentMove.toCol === col;

        return (
          <motion.div
            key={i}
            className={`aspect-square flex items-center justify-center relative ${
              isDark ? 'bg-emerald-700/30' : 'bg-amber-50/60'
            }`}
            whileHover={{ scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <AnimatePresence mode="popLayout">
              {piece && (
                <motion.div
                  key={`${piece.type}-${row}-${col}-${moveKey}`}
                  layoutId={isOrigin ? `${piece.type}-${currentMove.fromRow}-${currentMove.fromCol}` : undefined}
                  initial={isOrigin ? { zIndex: 10 } : { scale: 0, rotate: -15 }}
                  animate={
                    isOrigin
                      ? { x: (currentMove.toCol - currentMove.fromCol) * 36, y: (currentMove.toRow - currentMove.fromRow) * 36, zIndex: 10 }
                      : { scale: 1, rotate: 0 }
                  }
                  exit={{ scale: 0, opacity: 0 }}
                  transition={
                    isOrigin
                      ? { type: 'spring', stiffness: 120, damping: 12, duration: 0.7 }
                      : { type: 'spring', stiffness: 300, damping: 20, delay: i * 0.01 }
                  }
                  whileHover={{ scale: 1.15, filter: 'brightness(1.1) drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}
                  style={{ cursor: 'pointer' }}
                >
                  <WikiChessPiece piece={piece.type} size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
