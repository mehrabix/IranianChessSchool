import { Chess } from 'chess.js';

export function isValidFen(fen: string): boolean {
  try {
    new Chess(fen);
    return true;
  } catch {
    return false;
  }
}

export function getStartingPosition(): string {
  return new Chess().fen();
}

export function getPiecesOnBoard(fen: string): Record<string, string> {
  const chess = new Chess(fen);
  const board = chess.board();
  const pieces: Record<string, string> = {};
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const square = board[rank][file];
      if (square) {
        const squareName = String.fromCharCode(97 + file) + (8 - rank);
        pieces[squareName] = square.color === 'w' ? square.type.toUpperCase() : square.type.toLowerCase();
      }
    }
  }
  return pieces;
}
