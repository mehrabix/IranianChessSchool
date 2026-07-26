import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChessEngine } from './engine';

let evalCount = 0;

function handlePostMessage(mock: any, msg: string) {
  if (msg === 'uci') {
    setTimeout(() => {
      if (mock.onmessage) mock.onmessage({ data: 'uciok' });
    }, 5);
  } else if (msg.startsWith('position fen')) {
    // no response needed, position is set
  } else if (msg.startsWith('go depth')) {
    const isMultiEval = msg.includes('depth 18');
    evalCount++;
    setTimeout(() => {
      if (mock.onmessage) {
        const score = evalCount <= 2 ? 20 : -30;
        mock.onmessage({ data: `info depth 1 score cp ${score} pv e2e4 e7e5` });
        setTimeout(() => {
          if (mock.onmessage) mock.onmessage({ data: 'bestmove e2e4' });
        }, 5);
      }
    }, 5);
  } else if (msg === 'stop') {
    // no response needed
  }
}

function createMockWorker() {
  const mock: any = {
    onmessage: null,
    onerror: null,
    postMessage: vi.fn(),
    terminate: vi.fn(),
  };

  mock.postMessage.mockImplementation((msg: string) => {
    handlePostMessage(mock, msg);
  });

  return mock;
}

describe('ChessEngine', () => {
  beforeEach(() => {
    evalCount = 0;
    vi.stubGlobal('Worker', vi.fn(function () { return createMockWorker(); }));
    vi.stubGlobal('WebAssembly', { validate: function () { return true; } });
    vi.stubGlobal('location', { origin: 'http://localhost:3000' });
  });

  it('initializes successfully', async () => {
    const engine = new ChessEngine();
    await engine.init();
    expect(engine.isReady()).toBe(true);
  });

  it('evaluate returns result for starting position', async () => {
    const engine = new ChessEngine();
    await engine.init();
    const result = await engine.evaluate('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 1);
    expect(result).toBeDefined();
    expect(result.fen).toContain('rnbqkbnr');
  });

  it('getTopLines returns array of lines', async () => {
    const engine = new ChessEngine();
    await engine.init();
    const lines = await engine.getTopLines('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 1, 2);
    expect(Array.isArray(lines)).toBe(true);
  });

  it('destroy terminates worker', () => {
    const engine = new ChessEngine();
    engine.destroy();
    expect(engine.isReady()).toBe(false);
  });

  it('analyzeGame returns analysis for valid PGN', async () => {
    const engine = new ChessEngine();
    await engine.init();
    // Short PGN with 2 moves
    const pgn = '1. e4 e5';
    const result = await engine.analyzeGame(pgn, 1);
    expect(result.moves).toHaveLength(2);
    expect(result.totalAccuracy).toBeGreaterThan(0);
    expect(typeof result.totalAccuracy).toBe('number');
  });

  it('analyzeGame returns empty analysis for empty PGN', async () => {
    const engine = new ChessEngine();
    await engine.init();
    const result = await engine.analyzeGame('', 1);
    expect(result.moves).toHaveLength(0);
    expect(result.totalAccuracy).toBe(0);
  });

  it('findBlunders returns blunders from game', async () => {
    const engine = new ChessEngine();
    await engine.init();
    const pgn = '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6';
    const blunders = await engine.findBlunders(pgn, 1);
    expect(Array.isArray(blunders)).toBe(true);
    for (const blunder of blunders) {
      expect(blunder).toHaveProperty('move');
      expect(blunder).toHaveProperty('eval');
      expect(blunder).toHaveProperty('bestMove');
      expect(blunder).toHaveProperty('phase');
    }
  });
});