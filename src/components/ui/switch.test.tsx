// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Switch } from './switch';

describe('Switch', () => {
  it('renders', () => {
    const { container } = render(<Switch />);
    expect(container.querySelector('[data-slot="switch"]')).toBeDefined();
  });
});
