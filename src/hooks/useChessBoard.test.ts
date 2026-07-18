// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChessBoard } from './useChessBoard';

describe('useChessBoard', () => {
  it('initializes with starting position', () => {
    const { result } = renderHook(() => useChessBoard());
    expect(result.current.fen).toContain('rnbqkbnr/pppppppp/8');
    expect(result.current.turn).toBe('w');
  });

  it('initializes with custom FEN', () => {
    const fen = '4k3/8/8/8/8/8/8/4K3 w - - 0 1';
    const { result } = renderHook(() => useChessBoard(fen));
    expect(result.current.fen).toContain('4k3');
  });

  it('makeMove returns true for legal move', () => {
    const { result } = renderHook(() => useChessBoard());
    let moved: boolean;
    act(() => { moved = result.current.makeMove('e2', 'e4'); });
    expect(moved!).toBe(true);
    expect(result.current.fen).toContain('4P3');
  });

  it('makeMove returns false for illegal move', () => {
    const { result } = renderHook(() => useChessBoard());
    let moved: boolean;
    act(() => { moved = result.current.makeMove('e2', 'e5'); });
    expect(moved!).toBe(false);
  });

  it('reset works after move', () => {
    const { result } = renderHook(() => useChessBoard());
    act(() => { result.current.makeMove('e2', 'e4'); });
    act(() => { result.current.reset(); });
    expect(result.current.fen).toContain('rnbqkbnr/pppppppp/8');
  });

  it('undo works after move', () => {
    const { result } = renderHook(() => useChessBoard());
    act(() => { result.current.makeMove('e2', 'e4'); });
    act(() => { result.current.undo(); });
    expect(result.current.fen).toContain('rnbqkbnr/pppppppp/8');
  });

  it('loadFen loads a custom position', () => {
    const { result } = renderHook(() => useChessBoard());
    const fen = '4k3/8/8/8/8/8/8/4K3 w - - 0 1';
    act(() => { result.current.loadFen(fen); });
    expect(result.current.fen).toContain('4k3');
  });

  it('returns game state properties', () => {
    const { result } = renderHook(() => useChessBoard());
    expect(result.current.isCheck).toBe(false);
    expect(result.current.isCheckmate).toBe(false);
    expect(result.current.isDraw).toBe(false);
    expect(result.current.isGameOver).toBe(false);
    expect(result.current.turn).toBe('w');
  });
});
