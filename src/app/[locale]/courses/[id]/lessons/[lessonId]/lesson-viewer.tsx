'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, BookOpen } from 'lucide-react';
import { ChessBoard } from '@/components/chess/ChessBoard';
import { useChessBoard } from '@/hooks/useChessBoard';
import { QuizViewer } from '@/components/quiz/QuizViewer';

interface Lesson {
  id: string;
  title: string;
  content: string | null;
  videoUrl: string | null;
  type: string | null;
  duration: number | null;
}

export function LessonViewer({ lesson, courseId }: { lesson: Lesson; courseId: string }) {
  const t = useTranslations('courses');
  const [completed, setCompleted] = useState(false);
  const { game, fen, makeMove, reset, undo } = useChessBoard();

  useEffect(() => {
    fetch(`/api/progress?lessonId=${lesson.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.progress?.completed) setCompleted(true);
      });
  }, [lesson.id]);

  async function markComplete() {
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId: lesson.id, completed: true }),
    });
    setCompleted(true);
  }

  return (
    <div>
      {lesson.type === 'VIDEO' && lesson.videoUrl && (
        <div className="aspect-video rounded-lg overflow-hidden bg-black mb-6">
          <iframe
            src={lesson.videoUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-[1fr_400px] mb-6">
        <div>
          {lesson.content && (
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: lesson.content }} />
          )}
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4" />
                {t('lesson.practiceBoard')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChessBoard
                game={game}
                onMove={makeMove}
                onReset={reset}
                onUndo={undo}
                boardWidth={360}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      {lesson.type === 'QUIZ' && (
        <div className="mt-6">
          <QuizViewer lessonId={lesson.id} />
        </div>
      )}
      <Button onClick={markComplete} className="gap-2" disabled={completed}>
        <CheckCircle className="h-4 w-4" /> {completed ? t('lesson.completed') : t('lesson.markComplete')}
      </Button>
    </div>
  );
}
