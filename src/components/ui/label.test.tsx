// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Label } from './label';

describe('Label', () => {
  it('renders children', () => {
    render(<Label>Username</Label>);
    expect(screen.getByText('Username')).toBeDefined();
  });
});
