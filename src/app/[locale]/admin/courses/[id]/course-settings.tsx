'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
        <CardTitle>Course Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="level">Level</Label>
          <Select value={level} onValueChange={(v) => v && setLevel(v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="BEGINNER">Beginner</SelectItem>
              <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
              <SelectItem value="ADVANCED">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="image">Image URL</Label>
          <Input id="image" value={image} onChange={e => setImage(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <Switch id="published" checked={published} onCheckedChange={setPublished} />
          <Label htmlFor="published">Published</Label>
        </div>
        <Button onClick={handleSave} className="gap-2" disabled={saving}>
          <Save className="h-4 w-4" /> Save
        </Button>
      </CardContent>
    </Card>
  );
}
