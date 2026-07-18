import { describe, it, expect } from 'vitest';
import { isValidPgn, getSanFromMove, movesToPgn, pgnToMoves } from './pgn';
import { Chess } from 'chess.js';

describe('pgn utilities', () => {
  it('pgnToMoves converts PGN to moves array', () => {
    const pgn = '1. e4 e5 2. Nf3 Nc6';
    const moves = pgnToMoves(pgn);
    expect(moves).toEqual(['e4', 'e5', 'Nf3', 'Nc6']);
  });

  it('movesToPgn converts moves to PGN', () => {
    const pgn = movesToPgn(['e4', 'e5', 'Nf3']);
    expect(pgn).toContain('1. e4');
    expect(pgn).toContain('e5');
  });

  it('getSanFromMove returns SAN notation', () => {
    const chess = new Chess();
    const san = getSanFromMove(chess, 'e2', 'e4');
    expect(san).toBe('e4');
  });

  it('getSanFromMove returns null for illegal move', () => {
    const chess = new Chess();
    const san = getSanFromMove(chess, 'e2', 'e5');
    expect(san).toBeNull();
  });

  it('isValidPgn returns true for valid PGN', () => {
    expect(isValidPgn('1. e4 e5')).toBe(true);
  });

  it('isValidPgn returns false for invalid PGN', () => {
    expect(isValidPgn('invalid')).toBe(false);
  });
});
