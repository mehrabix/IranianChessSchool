'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function NewPostPage() {
  const t = useTranslations('admin.posts');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    await fetch('/api/admin/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: form.get('content'),
        image: form.get('image'),
        pgn: form.get('pgn'),
      }),
    });
    router.push('/admin/posts');
  }

  return (
    <section className="relative py-16 bg-gradient-to-br from-background via-emerald-50/30 to-background">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/admin/posts" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t('cancel')}
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{t('newPost')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">{t('postContent')}</Label>
                <Textarea id="content" name="content" className="min-h-[200px]" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">{t('postImage')}</Label>
                <Input id="image" name="image" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pgn">{t('pgn')}</Label>
                <Textarea id="pgn" name="pgn" className="min-h-[100px] font-mono" />
              </div>
              <Button type="submit" className="gap-2">
                <Sparkles className="h-4 w-4" /> {t('createPost')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}