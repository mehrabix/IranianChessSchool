'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Link } from '@/i18n/routing';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  content: string | null;
  videoUrl: string | null;
  type: string | null;
  duration: number | null;
  moduleId: string | null;
  courseId: string | null;
}

export function LessonEditForm({ lesson, courseId }: { lesson: Lesson; courseId: string }) {
  const t = useTranslations('admin.courses');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const res = await fetch('/api/admin/lessons', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: lesson.id,
        title: form.get('title'),
        content: form.get('content'),
        videoUrl: form.get('videoUrl'),
        type: form.get('type'),
        duration: Number(form.get('duration')),
      }),
    });
    if (res.ok) router.push(`/admin/courses/${courseId}`);
  }

  async function handleDelete() {
    if (!confirm(t('deleteLesson'))) return;
    const res = await fetch('/api/admin/lessons', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: lesson.id }),
    });
    if (res.ok) router.push(`/admin/courses/${courseId}`);
  }

  return (
    <section className="relative py-16 bg-gradient-to-br from-background via-emerald-50/30 to-background">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" render={<Link href={`/admin/courses/${courseId}`} />}>
            <ArrowLeft className="h-4 w-4 me-1 rtl:rotate-180" /> {t('cancel')}
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{t('editLesson')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t('lessonTitle')}</Label>
                <Input id="title" name="title" defaultValue={lesson.title} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">{t('lessonType')}</Label>
                <Select name="type" defaultValue={lesson.type}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TEXT">Text</SelectItem>
                    <SelectItem value="VIDEO">Video</SelectItem>
                    <SelectItem value="QUIZ">Quiz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">{t('lessonContent')}</Label>
                <Textarea id="content" name="content" defaultValue={lesson.content ?? ''} className="min-h-[200px]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="videoUrl">{t('lessonVideoUrl')}</Label>
                <Input id="videoUrl" name="videoUrl" defaultValue={lesson.videoUrl ?? ''} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">{t('lessonDuration')}</Label>
                <Input id="duration" name="duration" type="number" defaultValue={lesson.duration ?? ''} />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" /> {t('save')}
                </Button>
                <Button type="button" variant="destructive" className="gap-2" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4" /> {t('deleteLesson')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}