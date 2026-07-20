// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: vi.fn() }),
}));

describe('ThemeToggle', () => {
  it('renders theme toggle button', () => {
    const { container } = render(<ThemeToggle />);
    expect(container.querySelector('button')).toBeTruthy();
  });
});
