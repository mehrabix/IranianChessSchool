// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';

describe('Avatar', () => {
  it('renders fallback', () => {
    render(
      <Avatar>
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText('U')).toBeDefined();
  });
});
