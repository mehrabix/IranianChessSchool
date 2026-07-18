// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DirectionProvider } from './DirectionProvider';

vi.mock('@/i18n/routing', () => ({
  rtlLocales: ['fa'],
}));

describe('DirectionProvider', () => {
  it('renders children', () => {
    render(<DirectionProvider><div>Child</div></DirectionProvider>);
    expect(screen.getByText('Child')).toBeDefined();
  });
});
