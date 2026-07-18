import { describe, it, expect, beforeEach } from 'vitest';
import { useChessStore } from '@/store/chessStore';

const initialFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

describe('useChessStore', () => {
  beforeEach(() => {
    useChessStore.setState({
      fen: initialFen,
      pgn: '',
      moveHistory: [],
      selectedSquare: null,
    });
  });

  it('starts with initial position', () => {
    const state = useChessStore.getState();
    expect(state.fen).toBe(initialFen);
    expect(state.pgn).toBe('');
    expect(state.moveHistory).toEqual([]);
    expect(state.selectedSquare).toBeNull();
  });

  it('sets FEN', () => {
    const newFen = '4k3/8/8/8/8/8/8/4K3 w - - 0 1';
    useChessStore.getState().setFen(newFen);
    expect(useChessStore.getState().fen).toBe(newFen);
  });

  it('sets PGN', () => {
    useChessStore.getState().setPgn('1. e4 e5');
    expect(useChessStore.getState().pgn).toBe('1. e4 e5');
  });

  it('adds moves to history', () => {
    useChessStore.getState().addMove('e4');
    expect(useChessStore.getState().moveHistory).toEqual(['e4']);
    useChessStore.getState().addMove('e5');
    expect(useChessStore.getState().moveHistory).toEqual(['e4', 'e5']);
  });

  it('sets selected square', () => {
    useChessStore.getState().setSelectedSquare('e2');
    expect(useChessStore.getState().selectedSquare).toBe('e2');
    useChessStore.getState().setSelectedSquare(null);
    expect(useChessStore.getState().selectedSquare).toBeNull();
  });

  it('resets to initial state', () => {
    useChessStore.getState().setFen('8/8/8/8/8/8/8/8 w - - 0 1');
    useChessStore.getState().setPgn('1. e4');
    useChessStore.getState().addMove('e4');
    useChessStore.getState().setSelectedSquare('e2');
    useChessStore.getState().reset();
    const state = useChessStore.getState();
    expect(state.fen).toBe(initialFen);
    expect(state.pgn).toBe('');
    expect(state.moveHistory).toEqual([]);
    expect(state.selectedSquare).toBeNull();
  });
});
