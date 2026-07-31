// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Chess } from 'chess.js';
import { ChessBoard } from './ChessBoard';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('react-chessboard', () => ({
  Chessboard: function MockChessboard() { return null; },
  ChessboardProvider: function MockProvider({ children }: { children: React.ReactNode }) { return <div data-testid="chessboard-provider">{children}</div>; },
}));

describe('ChessBoard', () => {
  it('renders controls when showControls is true', () => {
    const game = new Chess();
    const { container } = render(<ChessBoard game={game} onMove={function () { return true; }} onReset={function () {}} onUndo={function () {}} />);
    expect(container.querySelector('button')).toBeTruthy();
  });

  it('hides controls when showControls is false', () => {
    const game = new Chess();
    const { container } = render(<ChessBoard game={game} onMove={function () { return true; }} showControls={false} />);
    expect(container.querySelector('button')).toBeNull();
  });
});