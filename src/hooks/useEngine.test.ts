// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useEngine } from './useEngine';

const mockEvaluate = vi.fn();
const mockGetTopLines = vi.fn();
const mockInit = vi.fn();
const mockDestroy = vi.fn();

vi.mock('@/lib/chess/engine', () => {
  const MockEngine = vi.fn(function () {
    return {
      init: mockInit,
      evaluate: mockEvaluate,
      getTopLines: mockGetTopLines,
      destroy: mockDestroy,
      isReady: function () { return true; },
    };
  });
  return { ChessEngine: MockEngine };
});

describe('useEngine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInit.mockResolvedValue(undefined);
  });

  it('initializes engine on mount', async () => {
    const { result } = renderHook(() => useEngine());
    await vi.waitFor(() => expect(result.current.isReady).toBe(true));
    expect(mockInit).toHaveBeenCalledTimes(1);
  });

  it('evaluate returns result', async () => {
    const mockResult = { fen: 'start', depth: 20, score: 0.2, bestMove: 'e2e4', pv: ['e2e4', 'e7e5'] };
    mockEvaluate.mockResolvedValue(mockResult);
    const { result } = renderHook(() => useEngine());
    await vi.waitFor(() => expect(result.current.isReady).toBe(true));
    const evalResult = await result.current.evaluate('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    expect(evalResult).toEqual(mockResult);
    expect(mockEvaluate).toHaveBeenCalled();
  });

  it('getTopLines returns lines', async () => {
    const mockLines = [{ depth: 20, score: 0.2, pv: ['e2e4', 'e7e5'] }];
    mockGetTopLines.mockResolvedValue(mockLines);
    const { result } = renderHook(() => useEngine());
    await vi.waitFor(() => expect(result.current.isReady).toBe(true));
    const lines = await result.current.getTopLines('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    expect(lines).toEqual(mockLines);
    expect(mockGetTopLines).toHaveBeenCalled();
  });

  it('throws when engine not initialized', async () => {
    mockInit.mockRejectedValue(new Error('init failed'));
    const { result } = renderHook(() => useEngine());
    await vi.waitFor(() => expect(result.current.error).toBe('init failed'));
  });
});