import { describe, it, expect } from 'vitest';
import { isValidFen, getStartingPosition, getPiecesOnBoard } from './fen';

describe('fen utilities', () => {
  it('isValidFen returns true for starting position', () => {
    expect(isValidFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')).toBe(true);
  });

  it('isValidFen returns false for invalid fen', () => {
    expect(isValidFen('invalid')).toBe(false);
  });

  it('getStartingPosition returns starting FEN', () => {
    expect(getStartingPosition()).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  });

  it('getPiecesOnBoard returns piece map for starting position', () => {
    const pieces = getPiecesOnBoard(getStartingPosition());
    expect(pieces.e2).toBeDefined();
    expect(pieces.e8).toBeDefined();
  });
});
