'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, Heart, MessageCircle, Globe, RefreshCw } from 'lucide-react';

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
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);
  const [commentsData, setCommentsData] = useState<Record<string, CommentData[]>>({});
  const [commentInput, setCommentInput] = useState<Record<string, string>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

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
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newPost.trim() }),
      });
      if (res.ok) {
        setNewPost('');
        await fetchPosts();
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
          <h1 className="text-3xl font-bold">Social Feed</h1>
          <Button variant="outline" size="sm" onClick={fetchPosts} className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
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
                    placeholder="Share your thoughts..."
                    className="min-h-[60px] resize-none"
                  />
                  <Button size="sm" onClick={handleCreatePost} disabled={posting || !newPost.trim()} className="gap-1.5">
                    {posting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                    Post
                  </Button>
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
                      <span className="font-medium text-sm">{post.userName || 'Anonymous'}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.createdAt * 1000).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{post.content}</p>
                    {post.pgn && (
                      <div className="mt-2 p-2 rounded bg-muted text-xs font-mono text-muted-foreground max-h-[120px] overflow-y-auto">
                        {post.pgn}
                      </div>
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
                              <span className="text-xs font-medium">{comment.userName || 'Anonymous'}</span>
                              <p className="text-xs">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                        {session && (
                          <div className="flex gap-2 pt-2">
                            <Input
                              value={commentInput[post.id] || ''}
                              onChange={e => setCommentInput(prev => ({ ...prev, [post.id]: e.target.value }))}
                              placeholder="Write a comment..."
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
            <p className="text-center text-muted-foreground py-12">No posts yet. Be the first to share!</p>
          )}
        </div>
      </Container>
    </section>
  );
}
