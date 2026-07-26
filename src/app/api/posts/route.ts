import { NextRequest, NextResponse } from 'next/server';
import { db, posts, users as usersTable, eq, desc, sql } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get('limit')) || 20, 50);
  const cursor = searchParams.get('cursor');

  try {
    const all = await db
      .select({
        id: posts.id,
        content: posts.content,
        image: posts.image,
        pgn: posts.pgn,
        likes: posts.likes,
        comments: posts.comments,
        createdAt: posts.createdAt,
        userId: posts.userId,
        userName: usersTable.name,
        userImage: usersTable.image,
      })
      .from(posts)
      .leftJoin(usersTable, eq(posts.userId, usersTable.id))
      .orderBy(desc(posts.createdAt))
      .limit(limit);

    return NextResponse.json({ posts: all });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { content, image, pgn } = await req.json();
    if (!content?.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const [post] = await db.insert(posts).values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      content: content.trim(),
      image: image || null,
      pgn: pgn || null,
    }).returning();

    return NextResponse.json({ post }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
