'use client';

import dynamic from 'next/dynamic';
import type { Chess } from 'chess.js';
import { Button } from '@/components/ui/button';
import { RotateCcw, Undo2 } from 'lucide-react';

const Chessboard = dynamic(() => import('react-chessboard').then(m => m.Chessboard), { ssr: false });
const ChessboardProvider = dynamic(() => import('react-chessboard').then(m => m.ChessboardProvider), { ssr: false });

interface ChessBoardProps {
  game: Chess;
  onMove: (from: string, to: string) => boolean;
  onReset?: () => void;
  onUndo?: () => void;
  showControls?: boolean;
  boardWidth?: number;
}

export function ChessBoard({ game, onMove, onReset, onUndo, showControls = true, boardWidth }: ChessBoardProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={boardWidth ? { width: boardWidth } : undefined}>
        <ChessboardProvider
          options={{
            position: game.fen(),
            onPieceDrop: ({ sourceSquare, targetSquare }) => {
              if (!sourceSquare || !targetSquare) return false;
              return onMove(sourceSquare, targetSquare);
            },
            boardStyle: {
              borderRadius: '8px',
            },
            allowDragging: true,
            animationDurationInMs: 200,
            showAnimations: true,
          }}
        >
          <Chessboard />
        </ChessboardProvider>
      </div>
      {showControls && (onReset || onUndo) && (
        <div className="flex gap-2">
          {onUndo && (
            <Button variant="outline" size="sm" onClick={onUndo} className="gap-1.5">
              <Undo2 className="h-4 w-4" />
              Undo
            </Button>
          )}
          {onReset && (
            <Button variant="outline" size="sm" onClick={onReset} className="gap-1.5">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
