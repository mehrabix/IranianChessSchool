// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OpeningExplorer } from './OpeningExplorer';

const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  vi.resetAllMocks();
});

describe('OpeningExplorer', () => {
  it('renders load stats button', () => {
    render(<OpeningExplorer fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" />);
    expect(screen.getByText('Load Stats')).toBeDefined();
    expect(screen.getByText('Opening Explorer')).toBeDefined();
  });

  it('loads and displays opening moves', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        moves: [
          { san: 'e4', white: 1000, black: 500, draws: 300 },
          { san: 'd4', white: 800, black: 600, draws: 400 },
        ],
      }),
    });

    render(<OpeningExplorer fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" />);
    fireEvent.click(screen.getByText('Load Stats'));

    expect(await screen.findByText('e4')).toBeDefined();
    expect(screen.getByText('d4')).toBeDefined();
  });

  it('displays error on fetch failure', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });

    render(<OpeningExplorer fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" />);
    fireEvent.click(screen.getByText('Load Stats'));

    expect(await screen.findByText(/Failed to fetch/)).toBeDefined();
  });

  it('calls onMoveClick when a move is clicked', async () => {
    const onMoveClick = vi.fn();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        moves: [{ san: 'e4', white: 1000, black: 500, draws: 300 }],
      }),
    });

    render(<OpeningExplorer fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" onMoveClick={onMoveClick} />);
    fireEvent.click(screen.getByText('Load Stats'));
    fireEvent.click(await screen.findByText('e4'));

    expect(onMoveClick).toHaveBeenCalledWith('e4');
  });
});