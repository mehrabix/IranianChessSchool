import type { EngineEval, EngineLine } from '@/types/chess';

type MessageHandler = (msg: string) => void;

export class ChessEngine {
  private worker: Worker | null = null;
  private messageHandlers: Map<string, MessageHandler[]> = new Map();
  private ready = false;
  private queue: string[] = [];

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const isWasm = typeof WebAssembly === 'object';
        this.worker = new Worker(
          isWasm ? new URL('stockfish.js/stockfish.wasm.js', import.meta.url) : new URL('stockfish.js/stockfish.js', import.meta.url)
        );

        this.worker.onmessage = (e: MessageEvent) => {
          const msg = e.data as string;
          if (msg === 'uciok') {
            this.ready = true;
            this.flushQueue();
            resolve();
          } else {
            this.messageHandlers.forEach((handlers, key) => {
              if (msg.startsWith(key)) handlers.forEach(h => h(msg));
            });
          }
        };

        this.worker.onerror = (err) => reject(err);
        this.worker.postMessage('uci');
      } catch (err) {
        reject(err);
      }
    });
  }

  private post(msg: string) {
    if (this.ready && this.worker) this.worker.postMessage(msg);
    else this.queue.push(msg);
  }

  private flushQueue() {
    for (const msg of this.queue) this.worker?.postMessage(msg);
    this.queue = [];
  }

  private on(pattern: string, handler: MessageHandler) {
    const handlers = this.messageHandlers.get(pattern) || [];
    handlers.push(handler);
    this.messageHandlers.set(pattern, handlers);
  }

  private off(pattern: string) {
    this.messageHandlers.delete(pattern);
  }

  evaluate(fen: string, depth: number = 20): Promise<EngineEval> {
    return new Promise((resolve, reject) => {
      const id = `eval-${Date.now()}`;
      let result: EngineEval | null = null;

      this.on('bestmove', (msg) => {
        const parts = msg.split(' ');
        const bestMove = parts[1];
        if (bestMove && result) {
          resolve({ ...result, bestMove });
        }
        this.off('bestmove');
      });

      this.on('info depth', (msg) => {
        const match = msg.match(/depth (\d+) .*score (cp|mate) (-?\d+).* pv (.+)/);
        if (match) {
          const depth = parseInt(match[1]);
          const scoreType = match[2];
          const scoreVal = parseInt(match[3]);
          const pv = match[4].split(' ');
          const score = scoreType === 'cp' ? scoreVal / 100 : (scoreVal > 0 ? 1000 : -1000);
          result = { fen, depth, score, bestMove: '', pv };
          if (depth >= 20) {
            this.worker?.postMessage('stop');
          }
        }
      });

      this.post(`position fen ${fen}`);
      this.post(`go depth ${depth}`);

      setTimeout(() => {
        this.worker?.postMessage('stop');
        if (!result) reject(new Error('Engine evaluation timed out'));
      }, 10000);
    });
  }

  getTopLines(fen: string, depth: number = 20, lines: number = 3): Promise<EngineLine[]> {
    return new Promise((resolve, reject) => {
      const results: EngineLine[] = [];

      this.on('info depth', (msg) => {
        const match = msg.match(/depth (\d+) .*score (cp|mate) (-?\d+).* pv (.+)/);
        if (match) {
          const d = parseInt(match[1]);
          const scoreType = match[2];
          const scoreVal = parseInt(match[3]);
          const pv = match[4].split(' ');
          const score = scoreType === 'cp' ? scoreVal / 100 : (scoreVal > 0 ? 1000 : -1000);

          const existing = results.find(r => r.pv[0] === pv[0]);
          if (existing) {
            if (d > existing.depth) existing.depth = d;
          } else if (results.length < lines) {
            results.push({ depth: d, score, pv });
          }
        }
      });

      this.on('bestmove', () => {
        resolve(results);
        this.off('bestmove');
        this.off('info depth');
      });

      this.post(`position fen ${fen}`);
      this.post(`go depth ${depth} lines ${lines}`);

      setTimeout(() => {
        this.worker?.postMessage('stop');
        resolve(results);
      }, 15000);
    });
  }

  isReady(): boolean {
    return this.ready;
  }

  destroy() {
    this.worker?.terminate();
    this.worker = null;
    this.ready = false;
  }
}
