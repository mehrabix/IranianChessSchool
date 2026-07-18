// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Separator } from './separator';

describe('Separator', () => {
  it('renders', () => {
    const { container } = render(<Separator />);
    expect(container.querySelector('[data-slot="separator"]')).toBeDefined();
  });
});
