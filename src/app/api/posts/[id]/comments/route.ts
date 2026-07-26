import { NextRequest, NextResponse } from 'next/server';
import { db, posts, comments, users as usersTable, eq, desc, sql } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: postId } = await params;
  try {
    const all = await db
      .select({
        id: comments.id,
        content: comments.content,
        createdAt: comments.createdAt,
        userId: comments.userId,
        userName: usersTable.name,
        userImage: usersTable.image,
      })
      .from(comments)
      .leftJoin(usersTable, eq(comments.userId, usersTable.id))
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt))
      .limit(50);

    return NextResponse.json({ comments: all });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: postId } = await params;
  try {
    const { content } = await req.json();
    if (!content?.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    await db.insert(comments).values({ id: crypto.randomUUID(), postId, userId: session.user.id, content: content.trim() });
    await db.update(posts).set({ comments: sql`${posts.comments} + 1` }).where(eq(posts.id, postId));

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}
