// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import AnalysisPage from './page';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      analysis: 'Analysis Board',
      moves: 'Moves',
      importExport: 'Import / Export',
      importPgn: 'Import PGN',
      import: 'Import',
      exportPgn: 'Export PGN',
      pgnCopied: 'PGN copied to clipboard!',
      invalidPgn: 'Invalid PGN',
      makeFirstMove: 'Make a move to start',
    };
    return map[key] || key;
  },
}));

vi.mock('react-chessboard', () => ({
  Chessboard: () => <div data-testid="chessboard">Chessboard</div>,
  ChessboardProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="chessboard-provider">{children}</div>,
}));

vi.mock('@/hooks/useEngine', () => ({
  useEngine: () => ({
    evaluate: vi.fn(),
    getTopLines: vi.fn(),
    isReady: true,
    isThinking: false,
    error: null,
  }),
}));

describe('AnalysisPage', () => {
  it('renders analysis page heading', () => {
    const { container } = render(<AnalysisPage />);
    expect(container.textContent).toContain('Analysis Board');
  });

  it('renders import/export section', () => {
    const { container } = render(<AnalysisPage />);
    expect(container.textContent).toContain('Import / Export');
  });

  it('renders moves section', () => {
    const { container } = render(<AnalysisPage />);
    expect(container.textContent).toContain('Make a move to start');
  });
});
