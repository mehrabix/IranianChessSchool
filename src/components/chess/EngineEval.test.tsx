// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { EngineEval } from './EngineEval';

const mockEvaluate = vi.fn();
const mockGetTopLines = vi.fn();
let mockError: string | null = null;

vi.mock('@/hooks/useEngine', () => ({
  useEngine: () => ({
    evaluate: mockEvaluate,
    getTopLines: mockGetTopLines,
    isReady: true,
    isThinking: false,
    error: mockError,
  }),
}));

describe('EngineEval', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockError = null;
  });

  it('renders engine analysis card', () => {
    const { container } = render(<EngineEval fen="start" />);
    expect(container.querySelector('button')).toBeTruthy();
  });

  it('renders error state', () => {
    mockError = 'Engine error';
    const { container } = render(<EngineEval fen="start" />);
    expect(container.textContent).toContain('Engine error');
  });
});