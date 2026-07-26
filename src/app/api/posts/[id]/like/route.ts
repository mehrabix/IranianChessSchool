import { NextRequest, NextResponse } from 'next/server';
import { db, posts, likes, eq, and, sql } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: postId } = await params;

  try {
    const existing = await db
      .select()
      .from(likes)
      .where(and(eq(likes.postId, postId), eq(likes.userId, session.user.id)))
      .limit(1);

    if (existing.length > 0) {
      await db.delete(likes).where(eq(likes.id, existing[0].id));
      await db.update(posts).set({ likes: sql`${posts.likes} - 1` }).where(eq(posts.id, postId));
      return NextResponse.json({ liked: false });
    } else {
      await db.insert(likes).values({ id: crypto.randomUUID(), postId, userId: session.user.id });
      await db.update(posts).set({ likes: sql`${posts.likes} + 1` }).where(eq(posts.id, postId));
      return NextResponse.json({ liked: true });
    }
  } catch (e) {
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 });
  }
}
