// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Toaster } from './sonner';

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

describe('Toaster', () => {
  it('renders', () => {
    const { container } = render(<Toaster />);
    expect(container.querySelector('.toaster')).toBeDefined();
  });
});
