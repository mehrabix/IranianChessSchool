// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card><CardContent>Content</CardContent></Card>);
    expect(screen.getByText('Content')).toBeDefined();
  });

  it('renders CardHeader, CardTitle, CardDescription', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Desc</CardDescription>
        </CardHeader>
      </Card>
    );
    expect(screen.getByText('Title')).toBeDefined();
    expect(screen.getByText('Desc')).toBeDefined();
  });

  it('renders CardFooter', () => {
    render(<Card><CardFooter>Footer</CardFooter></Card>);
    expect(screen.getByText('Footer')).toBeDefined();
  });
});
