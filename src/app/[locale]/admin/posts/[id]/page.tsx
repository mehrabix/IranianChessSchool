'use client';

import { useState, useEffect, use } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function AdminPostEditPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  return <PostEditForm postId={id} />;
}

function PostEditForm({ postId }: { postId: string }) {
  const t = useTranslations('admin.posts');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [pgn, setPgn] = useState('');

  useEffect(() => {
    fetch(`/api/posts?id=${postId}`)
      .then(r => r.json())
      .then(data => {
        if (data.post) {
          setContent(data.post.content || '');
          setImage(data.post.image || '');
          setPgn(data.post.pgn || '');
        }
      });
  }, [postId]);

  async function handleDelete() {
    if (!confirm(t('deletePost'))) return;
    await fetch('/api/admin/posts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: postId }),
    });
    window.location.href = '/admin/posts';
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await fetch('/api/admin/posts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: postId, content, image, pgn }),
    });
  }

  return (
    <section className="relative py-16 bg-gradient-to-br from-background via-emerald-50/30 to-background">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/admin/posts" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> {t('cancel')}
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{t('editPost')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">{t('postContent')}</Label>
                <Textarea id="content" value={content} onChange={e => setContent(e.target.value)} className="min-h-[200px]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">{t('postImage')}</Label>
                <Input id="image" value={image} onChange={e => setImage(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pgn">{t('pgn')}</Label>
                <Textarea id="pgn" value={pgn} onChange={e => setPgn(e.target.value)} className="min-h-[100px] font-mono" />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" /> {t('save')}
                </Button>
                <Button type="button" variant="destructive" className="gap-2" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4" /> {t('deletePost')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}