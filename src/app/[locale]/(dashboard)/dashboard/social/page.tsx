'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, Heart, MessageCircle, Globe, RefreshCw, Pencil, Trash2, Image as ImageIcon, X } from 'lucide-react';

function awardXp(action: string) {
  fetch('/api/xp/award', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action }),
  }).catch(() => {});
}

interface Post {
  id: string;
  content: string;
  image: string | null;
  pgn: string | null;
  likes: number;
  comments: number;
  createdAt: number;
  userId: string;
  userName: string | null;
  userImage: string | null;
}

interface CommentData {
  id: string;
  content: string;
  createdAt: number;
  userId: string;
  userName: string | null;
  userImage: string | null;
}

export default function SocialPage() {
  const t = useTranslations('dashboard');
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);
  const [commentsData, setCommentsData] = useState<Record<string, CommentData[]>>({});
  const [commentInput, setCommentInput] = useState<Record<string, string>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/posts?limit=50');
      const data = await res.json();
      setPosts(data.posts || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  async function handleCreatePost() {
    if (!newPost.trim()) return;
    setPosting(true);
    try {
      let imageUrl = null;
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imageUrl = uploadData.url;
        }
      }

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newPost.trim(), image: imageUrl }),
      });
      if (res.ok) {
        setNewPost('');
        setImageFile(null);
        setImagePreview(null);
        await fetchPosts();
        awardXp('CREATE_POST');
      }
    } finally {
      setPosting(false);
    }
  }

  async function handleLike(postId: string) {
    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
      const data = await res.json();
      setLikedPosts(prev => {
        const next = new Set(prev);
        data.liked ? next.add(postId) : next.delete(postId);
        return next;
      });
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + (data.liked ? 1 : -1) } : p));
      if (data.liked) awardXp('RECEIVE_LIKE');
    } catch {}
  }

  async function handleComment(postId: string) {
    const content = commentInput[postId]?.trim();
    if (!content) return;
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        setCommentInput(prev => ({ ...prev, [postId]: '' }));
        await fetchComments(postId);
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments + 1 } : p));
        awardXp('ADD_COMMENT');
      }
    } catch {}
  }

  async function fetchComments(postId: string) {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`);
      const data = await res.json();
      setCommentsData(prev => ({ ...prev, [postId]: data.comments }));
      setShowComments(prev => ({ ...prev, [postId]: true }));
    } catch {}
  }

  function toggleComments(postId: string) {
    if (showComments[postId]) {
      setShowComments(prev => ({ ...prev, [postId]: false }));
    } else {
      fetchComments(postId);
    }
  }

  function startEditing(post: Post) {
    setEditingPost(post.id);
    setEditContent(post.content);
  }

  function cancelEditing() {
    setEditingPost(null);
    setEditContent('');
  }

  async function handleSaveEdit(postId: string) {
    if (!editContent.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent.trim() }),
      });
      if (res.ok) {
        setEditingPost(null);
        setEditContent('');
        await fetchPosts();
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(postId: string) {
    if (!confirm(t('confirmDelete'))) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts(prev => prev.filter(p => p.id !== postId));
      }
    } finally {
      setDeleting(false);
    }
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function clearImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  if (loading) {
    return (
      <section className="py-8">
        <Container size="sm">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-8">
      <Container size="sm">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">{t('socialFeed')}</h1>
          <Button variant="outline" size="sm" onClick={fetchPosts} className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" /> {t('refresh')}
          </Button>
        </div>

        {session && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={session.user?.image || ''} />
                  <AvatarFallback>{session.user?.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <Textarea
                    value={newPost}
                    onChange={e => setNewPost(e.target.value)}
                    placeholder={t('shareThoughts')}
                    className="min-h-[60px] resize-none"
                  />
                  {imagePreview && (
                    <div className="relative inline-block">
                      <img src={imagePreview} alt={t('imagePreview')} className="max-h-[200px] rounded border" />
                      <button
                        onClick={clearImage}
                        className="absolute -top-2 -right-2 rounded-full bg-destructive text-destructive-foreground p-0.5"
                        aria-label={t('removeImage')}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={handleCreatePost} disabled={posting || !newPost.trim()} className="gap-1.5">
                      {posting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                      {t('post')}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-1.5"
                    >
                      <ImageIcon className="h-4 w-4" />
                      {t('photo')}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {posts.map(post => (
            <Card key={post.id}>
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={post.userImage || ''} />
                    <AvatarFallback>{post.userName?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{post.userName || t('anonymous')}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.createdAt * 1000).toLocaleDateString()}
                      </span>
                    </div>

                    {editingPost === post.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editContent}
                          onChange={e => setEditContent(e.target.value)}
                          className="min-h-[60px] resize-none"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleSaveEdit(post.id)} disabled={saving || !editContent.trim()} className="gap-1.5">
                            {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                            {t('save')}
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEditing}>
                            {t('cancel')}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm whitespace-pre-wrap">{post.content}</p>
                        {post.image && (
                          <img src={post.image} alt={t('postImage')} className="mt-2 max-h-[300px] rounded border" />
                        )}
                        {post.pgn && (
                          <div className="mt-2 p-2 rounded bg-muted text-xs font-mono text-muted-foreground max-h-[120px] overflow-y-auto">
                            {post.pgn}
                          </div>
                        )}
                      </>
                    )}

                    <div className="flex items-center gap-4 mt-3">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1 text-xs transition-colors ${likedPosts.has(post.id) ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
                      >
                        <Heart className={`h-3.5 w-3.5 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                        {post.likes}
                      </button>
                      <button onClick={() => toggleComments(post.id)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                        <MessageCircle className="h-3.5 w-3.5" />
                        {post.comments}
                      </button>

                      {session?.user?.id === post.userId && editingPost !== post.id && (
                        <div className="flex items-center gap-1 ml-auto">
                          <button
                            onClick={() => startEditing(post)}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                            aria-label={t('edit')}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            {t('edit')}
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            disabled={deleting}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                            aria-label={t('delete')}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            {t('delete')}
                          </button>
                        </div>
                      )}
                    </div>

                    {showComments[post.id] && (
                      <div className="mt-3 space-y-2 border-t pt-3">
                        {(commentsData[post.id] || []).map(comment => (
                          <div key={comment.id} className="flex gap-2">
                            <Avatar className="h-6 w-6 shrink-0">
                              <AvatarImage src={comment.userImage || ''} />
                              <AvatarFallback className="text-[10px]">{comment.userName?.[0] || 'U'}</AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="text-xs font-medium">{comment.userName || t('anonymous')}</span>
                              <p className="text-xs">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                        {session && (
                          <div className="flex gap-2 pt-2">
                            <Input
                              value={commentInput[post.id] || ''}
                              onChange={e => setCommentInput(prev => ({ ...prev, [post.id]: e.target.value }))}
                              placeholder={t('writeComment')}
                              className="h-8 text-xs"
                              onKeyDown={e => e.key === 'Enter' && handleComment(post.id)}
                            />
                            <Button size="sm" className="h-8 text-xs" onClick={() => handleComment(post.id)}>
                              <Send className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {posts.length === 0 && (
            <p className="text-center text-muted-foreground py-12">{t('noPosts')}</p>
          )}
        </div>
      </Container>
    </section>
  );
}
