'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function NewCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch('/api/admin/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.get('title'),
        description: form.get('description'),
        level: form.get('level'),
        image: form.get('image'),
      }),
    });
    if (res.ok) {
      router.push('/admin/courses');
    }
    setLoading(false);
  }

  return (
    <section className="relative py-16 bg-gradient-to-br from-background via-emerald-50/30 to-background">
      <Container size="sm">
        <div className="mb-6">
          <Button variant="ghost" size="sm" render={<Link href="/admin/courses" />}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>New Course</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select name="level" defaultValue="BEGINNER">
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
                <Input id="image" name="image" placeholder="https://..." />
              </div>
              <Button type="submit" className="gap-2" disabled={loading}>
                <Sparkles className="h-4 w-4" /> Create Course
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}
