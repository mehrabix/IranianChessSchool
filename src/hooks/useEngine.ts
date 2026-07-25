'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChessEngine } from '@/lib/chess/engine';
import type { EngineEval, EngineLine, GameAnalysis, Blunder } from '@/types/chess';

export function useEngine() {
  const engineRef = useRef<ChessEngine | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const engine = new ChessEngine();
    engine.init()
      .then(() => {
        engineRef.current = engine;
        setIsReady(true);
      })
      .catch((err) => setError(err.message || 'Failed to initialize engine'));

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  const evaluate = useCallback(async (fen: string, depth?: number): Promise<EngineEval> => {
    const engine = engineRef.current;
    if (!engine) throw new Error('Engine not initialized');
    setIsThinking(true);
    try {
      const result = await engine.evaluate(fen, depth);
      return result;
    } finally {
      setIsThinking(false);
    }
  }, []);

  const getTopLines = useCallback(async (fen: string, depth?: number, lines?: number): Promise<EngineLine[]> => {
    const engine = engineRef.current;
    if (!engine) throw new Error('Engine not initialized');
    setIsThinking(true);
    try {
      const result = await engine.getTopLines(fen, depth, lines);
      return result;
    } finally {
      setIsThinking(false);
    }
  }, []);

  const analyzeGame = useCallback(async (pgn: string, depth?: number): Promise<GameAnalysis> => {
    const engine = engineRef.current;
    if (!engine) throw new Error('Engine not initialized');
    setIsThinking(true);
    try {
      return await engine.analyzeGame(pgn, depth);
    } finally {
      setIsThinking(false);
    }
  }, []);

  const findBlunders = useCallback(async (pgn: string, depth?: number): Promise<Blunder[]> => {
    const engine = engineRef.current;
    if (!engine) throw new Error('Engine not initialized');
    setIsThinking(true);
    try {
      return await engine.findBlunders(pgn, depth);
    } finally {
      setIsThinking(false);
    }
  }, []);

  return { evaluate, getTopLines, analyzeGame, findBlunders, isReady, isThinking, error };
}
