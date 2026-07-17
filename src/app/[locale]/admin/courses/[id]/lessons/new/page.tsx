'use client';

import { useState, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function NewLessonPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  return <LessonForm courseId={id} />;
}

function LessonForm({ courseId }: { courseId: string }) {
  const searchParams = useSearchParams();
  const moduleId = searchParams.get('moduleId');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    await fetch('/api/admin/lessons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.get('title'),
        content: form.get('content'),
        videoUrl: form.get('videoUrl'),
        type: form.get('type'),
        duration: Number(form.get('duration')),
        moduleId: form.get('moduleId'),
        courseId: form.get('courseId'),
      }),
    });
    setLoading(false);
  }

  return (
    <section className="relative py-16 bg-gradient-to-br from-background via-emerald-50/30 to-background">
      <Container size="sm">
        <div className="mb-6">
          <Button variant="ghost" size="sm" render={<Link href={`/admin/courses/${courseId}`} />}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>New Lesson</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="moduleId" value={moduleId ?? ''} />
              <input type="hidden" name="courseId" value={courseId} />
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select name="type" defaultValue="TEXT">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TEXT">Text</SelectItem>
                    <SelectItem value="VIDEO">Video</SelectItem>
                    <SelectItem value="QUIZ">Quiz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea id="content" name="content" className="min-h-[200px]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="videoUrl">Video URL</Label>
                <Input id="videoUrl" name="videoUrl" placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input id="duration" name="duration" type="number" />
              </div>
              <Button type="submit" className="gap-2" disabled={loading}>
                <Sparkles className="h-4 w-4" /> Create Lesson
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}
