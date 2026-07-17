import { create } from 'zustand';

interface ChessState {
  fen: string;
  pgn: string;
  moveHistory: string[];
  selectedSquare: string | null;
  setFen: (fen: string) => void;
  setPgn: (pgn: string) => void;
  addMove: (move: string) => void;
  setSelectedSquare: (square: string | null) => void;
  reset: () => void;
}

const initialState = {
  fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  pgn: '',
  moveHistory: [] as string[],
  selectedSquare: null as string | null,
};

export const useChessStore = create<ChessState>((set) => ({
  ...initialState,
  setFen: (fen) => set({ fen }),
  setPgn: (pgn) => set({ pgn }),
  addMove: (move) => set((state) => ({ moveHistory: [...state.moveHistory, move] })),
  setSelectedSquare: (square) => set({ selectedSquare: square }),
  reset: () => set(initialState),
}));
