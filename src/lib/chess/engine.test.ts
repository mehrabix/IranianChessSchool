import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChessEngine } from './engine';

function handlePostMessage(mock, msg) {
  if (msg === 'uci') {
    setTimeout(function () {
      if (mock.onmessage) mock.onmessage({ data: 'uciok' });
    }, 10);
  } else if (typeof msg === 'string' && msg.startsWith('go depth')) {
    setTimeout(function () {
      if (mock.onmessage) {
        mock.onmessage({ data: 'info depth 1 score cp 20 pv e2e4 e7e5' });
        setTimeout(function () {
          if (mock.onmessage) mock.onmessage({ data: 'bestmove e2e4' });
        }, 5);
      }
    }, 5);
  }
}

function createMockWorker() {
  var mock = {
    onmessage: null,
    onerror: null,
    postMessage: vi.fn(),
    terminate: vi.fn(),
  };

  mock.postMessage.mockImplementation(function (msg) {
    handlePostMessage(mock, msg);
  });

  return mock;
}

describe('ChessEngine', () => {
  beforeEach(() => {
    vi.stubGlobal('Worker', vi.fn(function () { return createMockWorker(); }));
    vi.stubGlobal('WebAssembly', { validate: function () { return true; } });
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
});