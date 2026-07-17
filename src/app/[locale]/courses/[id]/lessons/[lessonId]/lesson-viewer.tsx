'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  content: string | null;
  videoUrl: string | null;
  type: string | null;
  duration: number | null;
}

export function LessonViewer({ lesson, courseId }: { lesson: Lesson; courseId: string }) {
  const [completed, setCompleted] = useState(false);

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
      {lesson.content && (
        <div className="prose prose-sm max-w-none mb-6" dangerouslySetInnerHTML={{ __html: lesson.content }} />
      )}
      <Button onClick={markComplete} className="gap-2">
        <CheckCircle className="h-4 w-4" /> Mark as Complete
      </Button>
    </div>
  );
}
