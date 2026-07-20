'use client';

import { useTranslations } from 'next-intl';

interface Question {
  id: string;
  questionText: string;
  options: string;
  type: string;
  order: number;
}

interface QuizQuestionProps {
  question: Question;
  selectedIndices: number[];
  onSelect: (indices: number[]) => void;
  showResult?: boolean;
  isCorrect?: boolean;
  correctIndices?: number[];
  explanation?: string;
}

export function QuizQuestion({ question, selectedIndices, onSelect, showResult, isCorrect, correctIndices, explanation }: QuizQuestionProps) {
  const t = useTranslations('courses.quiz');
  const options: string[] = JSON.parse(question.options);

  function toggleIndex(idx: number) {
    if (question.type === 'SINGLE' || question.type === 'TRUE_FALSE') {
      onSelect([idx]);
    } else {
      const newSelected = selectedIndices.includes(idx)
        ? selectedIndices.filter(i => i !== idx)
        : [...selectedIndices, idx];
      onSelect(newSelected);
    }
  }

  return (
    <div className="space-y-3 p-4 border rounded-lg">
      <p className="font-medium">{question.order + 1}. {question.questionText}</p>
      <div className="space-y-2">
        {options.map((option, idx) => {
          let className = 'flex items-center gap-2 p-2 rounded border cursor-pointer hover:bg-muted';
          if (showResult && correctIndices) {
            const isSelectedCorrect = correctIndices.includes(idx);
            const wasSelected = selectedIndices.includes(idx);
            if (isSelectedCorrect) className += ' bg-green-50 border-green-300';
            else if (wasSelected && !isSelectedCorrect) className += ' bg-red-50 border-red-300';
          } else if (selectedIndices.includes(idx)) {
            className += ' bg-primary/10 border-primary';
          }
          return (
            <div key={idx} className={className} onClick={() => !showResult && toggleIndex(idx)}>
              <input
                type={question.type === 'SINGLE' || question.type === 'TRUE_FALSE' ? 'radio' : 'checkbox'}
                checked={selectedIndices.includes(idx)}
                readOnly
                className="pointer-events-none"
              />
              <span>{option}</span>
            </div>
          );
        })}
      </div>
      {showResult && explanation && (
        <p className="text-sm text-muted-foreground mt-2 p-2 bg-muted rounded">
          {isCorrect ? t('correct') : t('incorrect')} {explanation}
        </p>
      )}
    </div>
  );
}
