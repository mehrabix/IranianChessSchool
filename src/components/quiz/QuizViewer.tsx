'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuizQuestion } from './QuizQuestion';
import { QuizResult } from './QuizResult';
import { Loader2 } from 'lucide-react';

interface Question {
  id: string;
  questionText: string;
  options: string;
  correctIndices: string;
  type: string;
  order: number;
  explanation: string | null;
  points: number | null;
}

interface QuizData {
  id: string;
  title: string;
  description: string | null;
  passingScore: number | null;
  maxAttempts: number | null;
  timeLimit: number | null;
}

export function QuizViewer({ lessonId }: { lessonId: string }) {
  const t = useTranslations('courses.quiz');
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; totalPoints: number; percentage: number; passed: boolean } | null>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetch(`/api/quizzes?lessonId=${lessonId}`)
      .then(r => r.json())
      .then(data => {
        if (data.quizzes?.length > 0) {
          setQuiz(data.quizzes[0]);
          return fetch(`/api/quizzes/${data.quizzes[0].id}`).then(r => r.json());
        }
        return null;
      })
      .then(data => {
        if (data) {
          setQuestions(data.questions);
        }
        setLoading(false);
      });
  }, [lessonId]);

  async function startAttempt() {
    if (!quiz) return;
    const res = await fetch(`/api/quizzes/${quiz.id}/attempts`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      setAttemptId(data.attemptId);
    }
  }

  async function submitAttempt() {
    if (!quiz || !attemptId) return;
    setSubmitting(true);
    const answersPayload = Object.entries(answers).map(([questionId, selectedIndices]) => ({
      questionId,
      selectedIndices: JSON.stringify(selectedIndices),
    }));
    const res = await fetch(`/api/quizzes/${quiz.id}/attempts/${attemptId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: answersPayload }),
    });
    if (res.ok) {
      const data = await res.json();
      setResult(data);
      setShowResults(true);
    }
    setSubmitting(false);
  }

  function handleSelect(questionId: string, indices: number[]) {
    setAnswers(prev => ({ ...prev, [questionId]: indices }));
  }

  if (loading) return <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> {t('loading')}</div>;
  if (!quiz) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
        {quiz.description && <p className="text-sm text-muted-foreground">{quiz.description}</p>}
      </CardHeader>
      <CardContent className="space-y-4">
        {!attemptId && !showResults && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {questions.length} {t('questions')} &middot; {quiz.passingScore || 70}% {t('toPass')}
              {quiz.maxAttempts ? ` &middot; ${t('maxAttempts', { count: quiz.maxAttempts })}` : ''}
            </p>
            <Button onClick={startAttempt}>{t('startQuiz')}</Button>
          </div>
        )}
        {attemptId && !showResults && (
          <div className="space-y-4">
            {questions.map(q => (
              <QuizQuestion
                key={q.id}
                question={q}
                selectedIndices={answers[q.id] || []}
                onSelect={(indices) => handleSelect(q.id, indices)}
              />
            ))}
            <Button onClick={submitAttempt} disabled={submitting} className="w-full">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              {t('submitAnswers')}
            </Button>
          </div>
        )}
        {showResults && result && (
          <div className="space-y-4">
            <QuizResult {...result} />
            {questions.map(q => (
              <QuizQuestion
                key={q.id}
                question={q}
                selectedIndices={answers[q.id] || []}
                onSelect={() => {}}
                showResult
                isCorrect={result.passed}
                correctIndices={JSON.parse(q.correctIndices)}
                explanation={q.explanation || undefined}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
