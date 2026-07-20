'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizResultProps {
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
}

export function QuizResult({ score, totalPoints, percentage, passed }: QuizResultProps) {
  const t = useTranslations('courses.quiz');
  return (
    <Card className={`border-2 ${passed ? 'border-green-500' : 'border-red-500'}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {passed ? <CheckCircle className="h-6 w-6 text-green-500" /> : <XCircle className="h-6 w-6 text-red-500" />}
          {passed ? t('passed') : t('notPassed')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>{t('score')}: {score} / {totalPoints}</p>
        <p>{t('percentage')}: {percentage}%</p>
        {passed ? (
          <p className="text-green-600">{t('congratulations')}</p>
        ) : (
          <p className="text-red-600">{t('tryAgain', { percent: 100 - percentage })}</p>
        )}
      </CardContent>
    </Card>
  );
}
