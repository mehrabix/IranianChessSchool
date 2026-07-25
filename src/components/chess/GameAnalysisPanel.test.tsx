// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameAnalysisPanel } from './GameAnalysisPanel';

const mockAnalyzeGame = vi.fn();
const mockFindBlunders = vi.fn();
let mockError: string | null = null;

vi.mock('@/hooks/useEngine', () => ({
  useEngine: () => ({
    evaluate: vi.fn(),
    getTopLines: vi.fn(),
    analyzeGame: mockAnalyzeGame,
    findBlunders: mockFindBlunders,
    isReady: true,
    isThinking: false,
    error: mockError,
  }),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      gameAnalysis: 'Game Analysis',
      analyzeGame: 'Analyze Game',
      analyzing: 'Analyzing...',
      engineError: 'Engine error',
      accuracy: 'Accuracy',
      blundersFound: 'Blunders',
      bestMove: 'Best',
      noBlunders: 'No blunders found! Solid game.',
      moveByMove: 'Move by Move',
    };
    return map[key] || key;
  },
}));

describe('GameAnalysisPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockError = null;
  });

  it('renders analyze button', () => {
    render(<GameAnalysisPanel pgn="1. e4" />);
    expect(screen.getByText('Analyze Game')).toBeTruthy();
  });

  it('renders error state', () => {
    mockError = 'Engine failed';
    render(<GameAnalysisPanel pgn="1. e4" />);
    expect(screen.getByText(/Engine error/)).toBeTruthy();
  });

  it('disables button when no PGN', () => {
    render(<GameAnalysisPanel pgn="" />);
    const button = screen.getByText('Analyze Game').closest('button');
    expect(button?.disabled).toBe(true);
  });

  it('shows accuracy after analysis', async () => {
    mockAnalyzeGame.mockResolvedValue({
      moves: [
        { san: 'e4', eval: 0.2, depth: 1, bestMove: 'e4', isBlunder: false },
      ],
      totalAccuracy: 95.5,
    });
    mockFindBlunders.mockResolvedValue([]);

    render(<GameAnalysisPanel pgn="1. e4" />);
    const button = screen.getByText('Analyze Game');
    button.click();

    await vi.waitFor(() => {
      expect(screen.getByText('95.5%')).toBeTruthy();
    });
  });

  it('shows blunders when found', async () => {
    mockAnalyzeGame.mockResolvedValue({
      moves: [
        { san: 'e4', eval: -1.5, depth: 1, bestMove: 'd4', isBlunder: true },
      ],
      totalAccuracy: 45.2,
    });
    mockFindBlunders.mockResolvedValue([
      { move: 'e4', eval: -1.5, bestMove: 'd4', phase: 'opening' },
    ]);

    render(<GameAnalysisPanel pgn="1. e4" />);
    const button = screen.getByText('Analyze Game');
    button.click();

    await vi.waitFor(() => {
      expect(screen.getByText('Best: d4')).toBeTruthy();
      expect(screen.getAllByText('-1.50').length).toBeGreaterThanOrEqual(1);
    });
  });

  it('shows no blunders message', async () => {
    mockAnalyzeGame.mockResolvedValue({
      moves: [{ san: 'e4', eval: 0.2, depth: 1, bestMove: 'e4', isBlunder: false }],
      totalAccuracy: 98.0,
    });
    mockFindBlunders.mockResolvedValue([]);

    render(<GameAnalysisPanel pgn="1. e4" />);
    const button = screen.getByText('Analyze Game');
    button.click();

    await vi.waitFor(() => {
      expect(screen.getByText(/No blunders found/)).toBeTruthy();
    });
  });
});
