// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { QuizQuestion } from './QuizQuestion';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

const baseQuestion = {
  id: 'qq1',
  questionText: 'What is 2+2?',
  options: JSON.stringify(['3', '4', '5']),
  type: 'SINGLE',
  order: 0,
};

describe('QuizQuestion', () => {
  it('renders question text', () => {
    const { container } = render(<QuizQuestion
      question={baseQuestion}
      selectedIndices={[]}
      onSelect={function () {}}
    />);
    expect(container.textContent).toContain('What is 2+2?');
  });

  it('renders all options', () => {
    const { container } = render(<QuizQuestion
      question={baseQuestion}
      selectedIndices={[]}
      onSelect={function () {}}
    />);
    expect(container.textContent).toContain('3');
    expect(container.textContent).toContain('4');
    expect(container.textContent).toContain('5');
  });

  it('shows selected state', () => {
    const { container } = render(<QuizQuestion
      question={baseQuestion}
      selectedIndices={[1]}
      onSelect={function () {}}
    />);
    const option = container.querySelector('input[type="radio"]:checked');
    expect(option).toBeTruthy();
  });

  it('shows explanation in result mode', () => {
    const { container } = render(<QuizQuestion
      question={baseQuestion}
      selectedIndices={[1]}
      onSelect={function () {}}
      showResult
      isCorrect
      correctIndices={[1]}
      explanation="Because math"
    />);
    expect(container.textContent).toContain('Because math');
  });
});
