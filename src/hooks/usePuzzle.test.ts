// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePuzzle } from './usePuzzle';

const mockPuzzle = {
  id: 'test-1',
  fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR b KQkq - 3 3',
  solution: JSON.stringify(['Qh4+', 'g3', 'Qf2#']),
  rating: 1200,
  themes: JSON.stringify(['mateIn2', 'pin']),
};

describe('usePuzzle', () => {
  it('initializes with correct FEN and playing status', () => {
    const { result } = renderHook(() => usePuzzle(mockPuzzle));
    expect(result.current.status).toBe('playing');
    expect(result.current.streak).toBe(0);
    expect(result.current.isRush).toBe(false);
  });

  it('resetPuzzle returns to initial state', () => {
    const { result } = renderHook(() => usePuzzle(mockPuzzle));
    act(() => result.current.resetPuzzle());
    expect(result.current.status).toBe('playing');
    expect(result.current.fen).toContain('r1bqkbnr');
  });

  it('skipPuzzle marks puzzle as correct', () => {
    const { result } = renderHook(() => usePuzzle(mockPuzzle));
    act(() => result.current.skipPuzzle());
    expect(result.current.status).toBe('correct');
  });

  it('formatTime formats seconds correctly', () => {
    const { result } = renderHook(() => usePuzzle(mockPuzzle));
    expect(result.current.formatTime(0)).toBe('0:00');
    expect(result.current.formatTime(65)).toBe('1:05');
    expect(result.current.formatTime(300)).toBe('5:00');
  });

  it('startRush sets rush mode', () => {
    const { result } = renderHook(() => usePuzzle(mockPuzzle));
    act(() => result.current.startRush());
    expect(result.current.isRush).toBe(true);
    expect(result.current.timeRemaining).toBe(300);
    expect(result.current.rushScore).toBe(0);
  });

  it('stopRush exits rush mode', () => {
    const { result } = renderHook(() => usePuzzle(mockPuzzle));
    act(() => result.current.startRush());
    act(() => result.current.stopRush());
    expect(result.current.isRush).toBe(false);
  });
});
