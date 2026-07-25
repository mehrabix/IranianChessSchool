// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useEngine } from './useEngine';

const mockEvaluate = vi.fn();
const mockGetTopLines = vi.fn();
const mockAnalyzeGame = vi.fn();
const mockFindBlunders = vi.fn();
const mockInit = vi.fn();
const mockDestroy = vi.fn();

vi.mock('@/lib/chess/engine', () => {
  const MockEngine = vi.fn(function () {
    return {
      init: mockInit,
      evaluate: mockEvaluate,
      getTopLines: mockGetTopLines,
      analyzeGame: mockAnalyzeGame,
      findBlunders: mockFindBlunders,
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

  it('analyzeGame returns game analysis', async () => {
    const mockResult = {
      moves: [{ san: 'e4', eval: 0.2, depth: 18, bestMove: 'd4', isBlunder: false }],
      totalAccuracy: 95.5,
    };
    mockAnalyzeGame.mockResolvedValue(mockResult);
    const { result } = renderHook(() => useEngine());
    await vi.waitFor(() => expect(result.current.isReady).toBe(true));
    const analysis = await result.current.analyzeGame('1. e4');
    expect(analysis).toEqual(mockResult);
    expect(mockAnalyzeGame).toHaveBeenCalled();
  });

  it('findBlunders returns blunder list', async () => {
    const mockResult = [{ move: 'e4', eval: -1.5, bestMove: 'd4', phase: 'opening' }];
    mockFindBlunders.mockResolvedValue(mockResult);
    const { result } = renderHook(() => useEngine());
    await vi.waitFor(() => expect(result.current.isReady).toBe(true));
    const blunders = await result.current.findBlunders('1. e4');
    expect(blunders).toEqual(mockResult);
    expect(mockFindBlunders).toHaveBeenCalled();
  });
});