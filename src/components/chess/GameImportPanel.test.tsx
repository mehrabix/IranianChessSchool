// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameImportPanel } from './GameImportPanel';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      importGames: 'Import Games',
      username: 'Username',
      importing: 'Importing...',
      noGamesFound: 'No games found.',
    };
    return map[key] || key;
  },
}));

describe('GameImportPanel', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders platform toggle buttons', () => {
    render(<GameImportPanel onGameImport={vi.fn()} />);
    expect(screen.getByText('Chess.com')).toBeTruthy();
    expect(screen.getByText('Lichess')).toBeTruthy();
  });

  it('renders username input', () => {
    render(<GameImportPanel onGameImport={vi.fn()} />);
    expect(screen.getByText('Username')).toBeTruthy();
  });

  it('disables import button when username is empty', () => {
    render(<GameImportPanel onGameImport={vi.fn()} />);
    const buttons = screen.getAllByText('Import Games');
    const button = buttons[buttons.length - 1].closest('button');
    expect(button?.disabled).toBe(true);
  });

  it('enables import button when username is entered', async () => {
    const user = userEvent.setup();
    render(<GameImportPanel onGameImport={vi.fn()} />);
    const input = screen.getByPlaceholderText('Chess.com username');
    await user.type(input, 'testuser');
    const buttons = screen.getAllByText('Import Games');
    const button = buttons[buttons.length - 1].closest('button');
    expect(button?.disabled).toBe(false);
  });

  it('fetches games on import', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ games: [{ pgn: '1. e4 e5 2. Nf3 Nc6' }] }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const onImport = vi.fn();
    const user = userEvent.setup();
    render(<GameImportPanel onGameImport={onImport} />);
    const input = screen.getByPlaceholderText('Chess.com username');
    await user.type(input, 'testuser');
    const buttons = screen.getAllByText('Import Games');
    const button = buttons[buttons.length - 1].closest('button');
    await user.click(button!);

    await vi.waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/chess/import/chesscom', expect.any(Object));
    });
  });

  it('switches platform to Lichess', async () => {
    const user = userEvent.setup();
    render(<GameImportPanel onGameImport={vi.fn()} />);
    await user.click(screen.getByText('Lichess'));
    expect(screen.getByPlaceholderText('Lichess username')).toBeTruthy();
  });
});