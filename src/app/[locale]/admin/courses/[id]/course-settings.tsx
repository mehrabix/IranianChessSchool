'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string | null;
  level: string | null;
  image: string | null;
  published: boolean | null;
}

export function CourseSettingsCard({ course }: { course: Course }) {
  const t = useTranslations('admin.courses');
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description ?? '');
  const [level, setLevel] = useState(course.level);
  const [image, setImage] = useState(course.image ?? '');
  const [published, setPublished] = useState(course.published ?? false);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await fetch('/api/admin/courses', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: course.id, title, description, level, image, published }),
    });
    setSaving(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('editCourse')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">{t('courseTitle')}</Label>
          <Input id="title" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">{t('courseDescription')}</Label>
          <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="level">{t('courseLevel')}</Label>
          <Select value={level} onValueChange={(v) => v && setLevel(v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="BEGINNER">Beginner (0-500)</SelectItem>
              <SelectItem value="IMPROVER">Improver (500-800)</SelectItem>
              <SelectItem value="INTERMEDIATE">Intermediate (800-1200)</SelectItem>
              <SelectItem value="ADVANCED">Advanced (1200-1600)</SelectItem>
              <SelectItem value="CLUB">Club (1600-2000)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="image">{t('imageUrl')}</Label>
          <Input id="image" value={image} onChange={e => setImage(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <Switch id="published" checked={published} onCheckedChange={setPublished} />
          <Label htmlFor="published">{t('coursePublished')}</Label>
        </div>
        <Button onClick={handleSave} className="gap-2" disabled={saving}>
          <Save className="h-4 w-4" /> {t('save')}
        </Button>
      </CardContent>
    </Card>
  );
}