// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PuzzleViewer } from './PuzzleViewer';

vi.mock('@/hooks/usePuzzle', () => ({
  usePuzzle: () => ({
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR b KQkq - 3 3',
    status: 'playing',
    showHint: false,
    streak: 0,
    isRush: false,
    timeRemaining: 300,
    rushScore: 0,
    makeMove: vi.fn(),
    resetPuzzle: vi.fn(),
    skipPuzzle: vi.fn(),
    setShowHint: vi.fn(),
    startRush: vi.fn(),
    stopRush: vi.fn(),
    formatTime: (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`,
    isGameOver: false,
  }),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      reset: 'Reset',
      hint: 'Hint',
      skip: 'Skip',
      nextPuzzle: 'Next Puzzle',
      correct: 'Correct!',
      wrong: 'Incorrect',
      startRush: 'Start Rush',
      rushOver: "Time's up!",
      score: 'Score',
      streak: 'Streak',
      streakCount: '{count} solved in a row',
      noPuzzles: 'No puzzles available.',
    };
    return map[key] || key;
  },
}));

vi.mock('react-chessboard', () => ({
  Chessboard: (props: any) => <div data-testid="chessboard" />,
  ChessboardProvider: ({ children }: any) => <div>{children}</div>,
}));

describe('PuzzleViewer', () => {
  const puzzle = {
    id: 'test-1',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR b KQkq - 3 3',
    solution: JSON.stringify(['Qh4+', 'g3', 'Qf2#']),
    rating: 1200,
    themes: JSON.stringify(['mateIn2', 'pin']),
  };

  it('renders chessboard wrapper', () => {
    const { container } = render(<PuzzleViewer puzzle={puzzle} />);
    const wrapper = container.querySelector('.w-\\[400px\\]');
    expect(wrapper).toBeTruthy();
  });

  it('renders control buttons', () => {
    render(<PuzzleViewer puzzle={puzzle} />);
    expect(screen.getByText('Reset')).toBeTruthy();
    expect(screen.getByText('Hint')).toBeTruthy();
    expect(screen.getByText('Skip')).toBeTruthy();
  });

  it('renders puzzle rating badge', () => {
    render(<PuzzleViewer puzzle={puzzle} />);
    expect(screen.getByText('1200 ELO')).toBeTruthy();
  });

  it('renders themes', () => {
    render(<PuzzleViewer puzzle={puzzle} />);
    expect(screen.getByText('mateIn2')).toBeTruthy();
    expect(screen.getByText('pin')).toBeTruthy();
  });

  it('renders rush button when showRush is true', () => {
    render(<PuzzleViewer puzzle={puzzle} showRush={true} />);
    expect(screen.getByText('Start Rush')).toBeTruthy();
  });

  it('does not render rush button when showRush is false', () => {
    render(<PuzzleViewer puzzle={puzzle} showRush={false} />);
    expect(screen.queryByText('Start Rush')).toBeNull();
  });
});
