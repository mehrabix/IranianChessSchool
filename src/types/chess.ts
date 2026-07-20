export interface EngineEval {
  fen: string;
  depth: number;
  score: number;
  bestMove: string;
  pv: string[];
}

export interface EngineLine {
  depth: number;
  score: number;
  pv: string[];
}

export interface GameAnalysis {
  moves: {
    san: string;
    eval: number;
    depth: number;
    bestMove: string;
    isBlunder: boolean;
  }[];
  totalAccuracy: number;
}

export interface Blunder {
  move: string;
  eval: number;
  bestMove: string;
  phase: string;
}
