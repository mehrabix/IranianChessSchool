import { Chess } from 'chess.js';

export function pgnToMoves(pgn: string): string[] {
  try {
    const chess = new Chess();
    chess.loadPgn(pgn);
    return chess.history({ verbose: false });
  } catch {
    return [];
  }
}

export function movesToPgn(moves: string[]): string {
  const chess = new Chess();
  for (const move of moves) {
    try {
      chess.move(move);
    } catch {
      break;
    }
  }
  return chess.pgn();
}

export function getSanFromMove(chess: Chess, from: string, to: string): string | null {
  try {
    const move = chess.move({ from, to, promotion: 'q' });
    return move.san;
  } catch {
    return null;
  }
}

export function isValidPgn(pgn: string): boolean {
  try {
    const chess = new Chess();
    chess.loadPgn(pgn);
    return chess.isGameOver() || chess.moveNumber() > 1;
  } catch {
    return false;
  }
}
