// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Container } from './container';

describe('Container', () => {
  it('renders children', () => {
    render(<Container>Content</Container>);
    expect(screen.getByText('Content')).toBeDefined();
  });

  it('applies size class', () => {
    const { container } = render(<Container size="sm">Small</Container>);
    expect(container.querySelector('.max-w-3xl')).toBeDefined();
  });
});
