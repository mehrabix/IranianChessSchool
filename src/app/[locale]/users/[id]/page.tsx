import { getTranslations } from 'next-intl/server';
import { db, users as usersTable, posts, follows, achievements, progress, eq, desc, and, or, sql } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { ArrowLeft, Star, Zap, Award, Trophy } from 'lucide-react';

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations('dashboard');

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
  if (!user) notFound();

  const userPosts = await db
    .select({ id: posts.id, content: posts.content, likes: posts.likes, comments: posts.comments, createdAt: posts.createdAt })
    .from(posts)
    .where(eq(posts.userId, id))
    .orderBy(desc(posts.createdAt))
    .limit(20);

  const followerCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(follows)
    .where(eq(follows.followingId, id));
  const followingCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(follows)
    .where(eq(follows.followerId, id));

  const userAchievements = await db
    .select()
    .from(achievements)
    .where(eq(achievements.userId, id))
    .orderBy(desc(achievements.unlockedAt))
    .limit(10);

  const completedProgress = await db
    .select({ count: sql<number>`count(*)` })
    .from(progress)
    .where(and(eq(progress.userId, id), eq(progress.completed, true)));

  return (
    <section className="py-8">
      <Container size="md">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" /> {t('backToDashboard')}
        </Link>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.image || ''} />
                <AvatarFallback className="text-2xl">{user.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{user.name || t('anonymous')}</h1>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="flex items-center gap-4 mt-3">
                  <Badge variant="outline" className="gap-1">
                    <Star className="h-3 w-3" /> {user.xp || 0} XP
                  </Badge>
                  <Badge variant="outline">Level {user.level || 1}</Badge>
                  <Badge variant="secondary">{user.role || t('roleStudent')}</Badge>
                </div>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span>{followerCount[0]?.count || 0} {t('followers')}</span>
                  <span>{followingCount[0]?.count || 0} {t('following')}</span>
                  <span>{completedProgress[0]?.count || 0} {t('lessons')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="h-4 w-4" /> {t('recentPosts')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userPosts.map(post => (
                  <div key={post.id} className="text-sm border-b pb-2 last:border-0">
                    <p>{post.content}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{post.likes ?? 0} {t('likes')}</span>
                      <span>{post.comments ?? 0} {t('comments')}</span>
                      <span>{post.createdAt ? new Date(Number(post.createdAt) * 1000).toLocaleDateString() : ''}</span>
                    </div>
                  </div>
                ))}
                {userPosts.length === 0 && (
                  <p className="text-sm text-muted-foreground">{t('noPostsYet')}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Trophy className="h-4 w-4" /> {t('achievements')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {userAchievements.map(ach => (
                  <div key={ach.id} className="flex items-center gap-2 text-sm p-2 rounded border">
                    <Award className="h-4 w-4 text-amber-500" />
                    <div>
                      <p className="font-medium">{ach.title}</p>
                      <p className="text-xs text-muted-foreground">{ach.description}</p>
                    </div>
                  </div>
                ))}
                {userAchievements.length === 0 && (
                  <p className="text-sm text-muted-foreground">{t('noAchievements')}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}
